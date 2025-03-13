import { Injectable } from '@nestjs/common';

type User = {
    username: string;
    password: string;
    email: string;
};

@Injectable()
export class UsersService {
    private users: User[] = [];

    registerUser(userData: {username: string; password: string; email: string}) {
        const {username, password, email} = userData;
        const existingUser = this.users.find(user => user.email === email);

        if (existingUser) {
            return {statusCode: 419, message: "User account already registered!"};
        }

        this.users.push({username, password, email});
        
        return {statusCode: 201, message: "User registered successfully!"};
    }

    loginUser(loginData: {email: string; password: string}) {
        const {email, password} = loginData;
        const user = this.users.find(user => user.email === email && user.password === password);
        
        if (!user) {
            return {statusCode: 401, message: "User account does not exist!"};
        }

        return {
            statusCode: 201,
            message: "Login successfull!",
            user: {
                username: user.username,
                email: user.email
            }};
    }
}
