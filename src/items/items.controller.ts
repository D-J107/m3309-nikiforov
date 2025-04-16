import { Body, Controller, Delete, Get, Param, Post, Put, Sse, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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

@ApiTags('Товары')
@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService)
    {}

    private itemUpdates = new Subject<MessageEvent>();
    @Sse('updates')
    sse(): Observable<MessageEvent> {
        return this.itemUpdates.asObservable().pipe(map((event) => event));
    }

    @ApiOperation({summary: 'Создание предмета'})
    @ApiResponse({status: 201, type: Item})
    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadFile(
                @UploadedFile() file: Express.Multer.File,
                @Body() body: any
            ) {
        const {title, price, specialOffer, discount} = body;
        if (!title.trim()) {
            return { error: 'Название не должно быть пустым!' };
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

    @ApiOperation({summary: 'Получение всех предметов'})
    @ApiResponse({status: 200, type: [Item]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/get')
    async getAll() {
        return await this.itemsService.getAll();
    }

    @ApiOperation({summary: 'Получение предмета по айди'})
    @ApiResponse({status: 200, type: Item})
    @Get('/get/id/:id')
    async getById(@Param('id') id: number) {
        return await this.itemsService.getById(id);
    }

    @ApiOperation({summary: 'Получение предмета по названию'})
    @ApiResponse({status: 200, type: Item})
    @Get('/get/:title')
    async getByName(@Param('title') title: string) {
        return await this.itemsService.getByTitle(title);
    }

    @ApiOperation({summary: 'Изменение предмета'})
    @ApiResponse({status: 200, type: Item})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put('/update/:id')
    @UseInterceptors(FileInterceptor('image'))
    async update(
            @UploadedFile() newFile: Express.Multer.File,
            @Param('id') id: number,
            @Body() dto: UpdateItemDto
        ) {
        // console.log("ItemsController update dto:", dto)
        let {newItem, previousTitle} = await this.itemsService.updateItem(id, dto, newFile);
        this.itemUpdates.next({data: {type: "updated", item: newItem, previousTitle: previousTitle}});
        return newItem;
    }

    @ApiOperation({summary: 'Удаление предмета'})
    @ApiResponse({status: 200, description: 'Предмет удален'})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete('/delete/:id')
    async deleteById(@Param('id') id: number, @Body('reason') reason: string) {
        const deleted = await this.itemsService.deleteById(id);
        const title = deleted.title;
        this.itemUpdates.next({data: { type: 'deleted', title, reason}});
    }

    @ApiOperation({summary: 'Удаление предмета (по названию)'})
    @ApiResponse({status: 200, description: 'Предмет удален'})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete('/delete/title/:title')
    async deleteByTitle(@Param('title') title: string, @Body('reason') reason: string) {
        await this.itemsService.deleteByTitle(title);
        console.log("Items Controller delete/title reason:", reason); // undefined
        this.itemUpdates.next({data: { type: 'deleted', title, reason}})
    }


    
}
