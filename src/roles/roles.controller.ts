import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './roles.model';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingInterceptor } from 'src/interceptors/logginInterceptor';

@ApiTags('Роли')
@UseInterceptors(CacheInterceptor, LoggingInterceptor)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) 
    {}

    @ApiOperation({summary: 'Создание роли'})
    @ApiResponse({status: 201, type: Role})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/create')
    async create(@Body() dto: CreateRoleDto) {
        return await this.rolesService.createRole(dto);
    }

    @Get('/get')
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiBearerAuth('cookieAuth')
    @ApiOperation({summary: 'Получение всех ролей'})
    @ApiResponse({status: 200, type: [Role]})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
    async getAll() {
        return await this.rolesService.getAll();
    }

    @Get('/get/id/:id')
    @ApiOperation({summary: 'Получение роли по айди'})
    @ApiResponse({status: 200, type: Role})
    @ApiResponse({status: 404, description: 'Роль не найдена'})
    async getById(@Param('id') id: number) {
        return await this.rolesService.getById(id);
    }

    @Get('/get/:value')
    @ApiOperation({summary: 'Получение роли по значению'})
    @ApiResponse({status: 200, type: Role})
    @ApiResponse({status: 404, description: 'Значение роли не найдено'})
    async getByValue(@Param('value') value: string) {
        return await this.rolesService.getByValue(value);
    }

    @Put('/update/:id')
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Изменение роли'})
    @ApiResponse({status: 200, type: Role})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
    @ApiResponse({status: 404, description: 'ID роли не найдено'})
    async update(@Param('id') id: number, @Body() dto: UpdateRoleDto) {
        return await this.rolesService.updateRole(id, dto);
    }

    @Delete('/delete/:value')
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Удаление роли(по значению)'})
    @ApiResponse({status: 200, description: 'Роль удалена'})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
    @ApiResponse({status: 404, description: 'Значение роли не найдено'})
    async delete(@Param('value') value: string) {
        return await this.rolesService.deleteByValue(value);
    }
}
