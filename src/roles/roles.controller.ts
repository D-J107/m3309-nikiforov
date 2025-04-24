import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

    @ApiOperation({summary: 'Получение всех ролей'})
    @ApiResponse({status: 200, type: [Role]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/get')
    async getAll() {
        return await this.rolesService.getAll();
    }

    @ApiOperation({summary: 'Получение роли по айди'})
    @ApiResponse({status: 200, type: Role})
    @Get('/get/id/:id')
    async getById(@Param('id') id: number) {
        return await this.rolesService.getById(id);
    }

    @ApiOperation({summary: 'Получение роли по значению'})
    @ApiResponse({status: 200, type: Role})
    @Get('/get/:value')
    async getByValue(@Param('value') value: string) {
        return await this.rolesService.getByValue(value);
    }

    @ApiOperation({summary: 'Изменение роли'})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put('/update/:id')
    async update(@Param('id') id: number, @Body() dto: UpdateRoleDto) {
        return await this.rolesService.updateRole(id, dto);
    }

    @ApiOperation({summary: 'Удаление роли(по значению)'})
    @ApiResponse({status: 200, description: 'Роль удалена'})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete('/delete/:value')
    async delete(@Param('value') value: string) {
        return await this.rolesService.deleteByValue(value);
    }

    
    
}
