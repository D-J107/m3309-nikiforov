import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Sse, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ItemsService } from './items.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Item } from './items.model';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateItemDto } from './dto/update-item.dto';
import { Observable, Subject } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingInterceptor } from 'src/interceptors/logginInterceptor';

@ApiTags('Товары')
@UseInterceptors(CacheInterceptor, LoggingInterceptor)
@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService)
    {}

    private itemUpdates = new Subject<MessageEvent>();
    @Sse('updates')
    sse(): Observable<MessageEvent> {
        return this.itemUpdates.asObservable().pipe(map((event) => event));
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({summary: 'Создание предмета'})
    @ApiResponse({status: 201, type: Item})
    @ApiResponse({status: 400, description: 'Не указано название предмета'})
    async uploadFile(
                @UploadedFile() file: Express.Multer.File,
                @Body() body: any
            ) {
        const {title, price, specialOffer, discount} = body;
        if (!title.trim()) {
            throw new BadRequestException('Название не должно быть пустым!');
        }
        const imageUrl = await this.itemsService.saveFile(file);
        const newItem = await this.itemsService.save(
            title,
            price,
            imageUrl,
            specialOffer ?? null,
            discount ?? null
        );
        this.itemUpdates.next({data: {type: 'created', item: newItem}});
        return newItem;
    }

    @Get('/get')
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Получение всех предметов'})
    @ApiResponse({status: 200, type: [Item]})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
    async getAll() {
        return await this.itemsService.getAll();
    }

    @Get('/get/id/:id')
    @ApiOperation({summary: 'Получение предмета по айди'})
    @ApiResponse({status: 200, type: Item})
    @ApiResponse({status: 404, description: 'Нет предмета с таким ID'})
    async getById(@Param('id') id: number) {
        return await this.itemsService.getById(id);
    }

    @Get('/get/:title')
    @ApiOperation({summary: 'Получение предмета по названию'})
    @ApiResponse({status: 200, type: Item})
    @ApiResponse({status: 404, description: 'Нет предмета с таким названием'})
    async getByName(@Param('title') title: string) {
        return await this.itemsService.getByTitle(title);
    }

    @Put('/update/:id')
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({summary: 'Изменение предмета'})
    @ApiResponse({status: 200, type: Item})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
    @ApiResponse({status: 404, description: 'Нет предмета с таким ID'})
    async update(
            @UploadedFile() newFile: Express.Multer.File,
            @Param('id') id: number,
            @Body() dto: UpdateItemDto
        ) {
        let {newItem, previousTitle} = await this.itemsService.updateItem(id, dto, newFile);
        this.itemUpdates.next({data: {type: "updated", item: newItem, previousTitle: previousTitle}});
        return newItem;
    }

    @Delete('/delete/:id')
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Удаление предмета'})
    @ApiResponse({status: 200, description: 'Предмет удален'})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
    @ApiResponse({status: 404, description: 'Нет предмета с таким ID'})
    async deleteById(@Param('id') id: number, @Body('reason') reason: string) {
        const deleted = await this.itemsService.deleteById(id);
        const title = deleted.title;
        this.itemUpdates.next({data: { type: 'deleted', title, reason}});
    }

    @Delete('/delete/title/:title')
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Удаление предмета (по названию)'})
    @ApiResponse({status: 200, description: 'Предмет удален'})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
    @ApiResponse({status: 404, description: 'Нет предмета с таким Названием'})
    async deleteByTitle(@Param('title') title: string, @Body('reason') reason: string) {
        await this.itemsService.deleteByTitle(title);
        this.itemUpdates.next({data: { type: 'deleted', title, reason}})
    }


    
}