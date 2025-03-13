import { Body, Controller, Get, HttpException, HttpStatus, Post, Render, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { SessionRequest } from 'src/types/sessionRequest';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register') 
    register(@Body() userData: {username: string; password: string; email: string}) {
        const result = this.usersService.registerUser(userData);
        if (result.statusCode === 201) {
            return result;
        } else if (result.statusCode === 419) {
            throw new HttpException(result.message, HttpStatus.CONFLICT);
        } else {
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    login(@Body() loginData: {email: string; password: string},
            @Req() req: SessionRequest) {

        const result = this.usersService.loginUser(loginData);
        if (result.statusCode === 201) {
            req.session.user = result.user; // сохраняем юзера в сессии
            return {success: true, user: result.user};
        } else if (result.statusCode === 401) {
            throw new HttpException(result.message, HttpStatus.UNAUTHORIZED);
        } else {
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }  

    @Post('logout')
    logout(@Req() req: SessionRequest, @Res() res: Response) {
        req.session.destroy(() => {
            res.json({ success: true });
        });
    }

    @Post('check-session')
    checkSession(@Req() req: SessionRequest) {
        if (req.session.user) {
            return { isLoggedIn: true, user: req.session.user };
        } else {
            return { isLoggedIn: false };
        }
    }
}
