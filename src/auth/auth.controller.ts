import { Body, Controller, HttpCode, HttpStatus, NotFoundException, Post, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';


@ApiTags('Авторизация')
@ApiCookieAuth('cookieAuth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService)
    {}

    @Post('/register')
    @ApiOperation({summary: 'Регистрация нового пользователя'})
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Пользователь успешно зарегистрирован'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email уже занят'})
    async register(@Body() dto: CreateUserDto, @Res() res: Response) {
        const {username, token} = await this.authService.register(dto);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day,
        });

        return res.status(HttpStatus.CREATED).json({username});
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('/login')
    @ApiOperation({summary: 'Вход пользователя'})
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Успешный вход, JWT токен установлен в cookie'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Неверный email или пароль'})
    async login(@Body() dto: LoginUserDto, @Res() res: Response) {
        const {username, token} = await this.authService.login(dto);
        console.log("auth.controller.ts username:",username);
        console.log("auth.controller.ts token:",token);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day,
        });

        return res.status(HttpStatus.CREATED).json({username});
        // return {username};
    }

    @Post('/validate-password')
    @ApiOperation({summary: 'Проверка пароля пользователя'})
    @ApiResponse({ status: HttpStatus.OK, description: 'Верный пароль'})
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Неверный пароль'})
    async validatePassword(@Body() body: { userId: number; password: string }) {
        const isValid = await this.authService.validateUserPassword(body.userId, body.password);
        if (!isValid) {
            throw new UnauthorizedException('Неверный пароль');
        }

        return { message: 'Пароль верный' };
    }

    @Post('/logout')
    @ApiOperation({summary: 'Выход из системы (очистка cookie)'})
    @ApiResponse({ status: HttpStatus.OK, description: 'Куки очищены, пользователь вышел'})
    async logout(@Res() res: Response) {
        res.clearCookie('token')
        .status(200)
        .send({ message: 'Logged out' });
    }
}
