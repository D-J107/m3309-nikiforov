export declare class UsersService {
    private users;
    registerUser(userData: {
        username: string;
        password: string;
        email: string;
    }): {
        statusCode: number;
        message: string;
    };
    loginUser(loginData: {
        email: string;
        password: string;
    }): {
        statusCode: number;
        message: string;
        user?: undefined;
    } | {
        statusCode: number;
        message: string;
        user: {
            username: string;
            email: string;
        };
    };
}
