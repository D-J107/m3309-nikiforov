import { Body, Controller, HttpStatus, NotFoundException, Post, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService)
    {}

    @Post('/register')
    async register(@Body() dto: CreateUserDto, @Res() res: Response) {
        const {username, token} = await this.authService.register(dto);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(HttpStatus.CREATED).json({ username });
    }

    @Post('/login')
    async login(@Body() dto: LoginUserDto, @Res() res: Response) {
        const {username, token} = await this.authService.login(dto);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        // теперь не возвращаем токен в ответе как было раньше а храним его в куки
        // и возвращаем ток юзернейм
        return res.status(HttpStatus.OK).json({ username });
    }

    @Post('/validate-password')
    async validatePassword(@Body() body: { userId: number; password: string }) {
        const isValid = await this.authService.validateUserPassword(body.userId, body.password);
        if (!isValid) {
            throw new UnauthorizedException('Неверный пароль');
        }

        return { message: 'Пароль верный' };
    }

    @Post('/logout')
    async logout(@Res() res: Response) {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0)
        });
        return res.status(HttpStatus.OK).json({ message: 'Logged out'});
    }
}
