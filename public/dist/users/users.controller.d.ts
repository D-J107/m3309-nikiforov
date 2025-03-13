import { UsersService } from './users.service';
import { Response } from 'express';
import { SessionRequest } from 'src/types/sessionRequest';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(userData: {
        username: string;
        password: string;
        email: string;
    }): {
        statusCode: number;
        message: string;
    };
    login(loginData: {
        email: string;
        password: string;
    }, req: SessionRequest): {
        success: boolean;
        user: {
            username: string;
            email: string;
        } | undefined;
    };
    logout(req: SessionRequest, res: Response): void;
    checkSession(req: SessionRequest): {
        isLoggedIn: boolean;
        user: {
            username: string;
            email: string;
        };
    } | {
        isLoggedIn: boolean;
        user?: undefined;
    };
}
