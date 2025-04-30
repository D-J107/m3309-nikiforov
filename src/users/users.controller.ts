import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { UserJwtPayload } from 'src/customTypes/userJwtPayload';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingInterceptor } from 'src/interceptors/logginInterceptor';

@ApiTags('Пользователи')
@UseInterceptors(CacheInterceptor, LoggingInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/create') 
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('cookieAuth')
    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 201, description: 'Новый пользователь успешно создан', type: User})
    async create(@Body() userDto: CreateUserDto) {
        return await this.usersService.createUser(userDto);
    }

    @Get('/get')
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiBearerAuth('cookieAuth')
    @ApiOperation({summary: 'Получение всех пользователей'})
    @ApiResponse({status: 200, description: 'Список пользователей',type: [User]})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
    async getAll() {
        return await this.usersService.getAllUsers();
    }

    @Get('/get/id/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('cookieAuth')
    @ApiOperation({summary: 'Получение пользователя(по айди)'})
    @ApiResponse({status: 200, description: 'Получен пользователь по его id', type: User})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    async getById(@Param('id') id: number) {
        return await this.usersService.getUserById(id);
    }

    @Get('/get/:email') 
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('cookieAuth')
    @ApiOperation({summary: 'Получение пользователя(по email)'})
    @ApiResponse({status: 200, description: 'Получен пользователь по его email', type: User})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    async getByEmail(@Param('email') email: string) {
        return await this.usersService.getUserByEmail(email);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('cookieAuth')
    @ApiOperation({summary: 'Получить профиль текущего пользователя'})
    @ApiResponse({status: 200, description: 'Данные пользователя'})
    @ApiResponse({ status: 401, description: 'Пользователь не авторизован'})
    getProfile(@Req() req: Request) {
        const user = req.user as UserJwtPayload;
        return {
            id: user.id,
            email: user.email,
            username: user.username, // if available
            balance: user.balance,   // if available
            roles: user.roles,
        };
    }

    @ApiOperation({summary: 'Изменение пользователя'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(JwtAuthGuard)
    @Put('/update/:id') 
    async update(@Param('id') id : number, @Body() dto: UpdateUserDto) {
        return await this.usersService.updateUser(id, dto);
    }

    @ApiOperation({summary: 'Добавление новой роли к пользователю'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(JwtAuthGuard)
    @Put('/add-role') 
    async addRole(
                @Body('id') id: number,
                @Body('value') value: string
    ) {
        return await this.usersService.addRoleToUser(id, value);
    }

    @ApiOperation({summary: 'Удаление пользователя(по email)'})
    @ApiResponse({status: 200, description: 'Пользователь удалён'})
    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:email')
    async delete(@Param('email') email: string) {
        return await this.usersService.deleteByEmail(email);
    }
}