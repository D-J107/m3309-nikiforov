import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
    ) 
    {}

    async login(dto: LoginUserDto) {
        const user = await this.validateUser(dto);
        return {
            username: user.username,
            token: await this.generateToken(user)
        }
    }

    async register(dto: CreateUserDto) {
        const candidate = await this.usersService.getUserByEmail(dto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email уже существует!', HttpStatus.BAD_REQUEST);
        }
        // второй параметр - длина "соли"
        const hashPassword = await bcrypt.hash(dto.password, 7);
        const user = await this.usersService.createUser({...dto, password: hashPassword});
        return {
            username: user.username,
            token: await this.generateToken(user)
        }
    }

    async validateUserPassword(userId: number, plainPassword: string): Promise<boolean> {
        const user = await this.usersService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        return await bcrypt.compare(plainPassword, user.password);
    }

    private async generateToken(user: User) {
        const payload = {
            email: user.email, id: user.id, roles: user.roles
        }
        const secret: string = process.env.PRIVATE_KEY || 'qa2d2xMa30';
        return jwt.sign(payload, secret, {algorithm: 'HS256', expiresIn: '24h' });
    }

    private async validateUser(dto: LoginUserDto) {
        const user = await this.usersService.getUserByEmail(dto.email);
        console.log("auth.service.ts validateUser user:",user);
        if (!user) {
           throw new HttpException("Нет пользователя с таким email или паролем!", HttpStatus.BAD_REQUEST);
        }
        let passwordEquals = await bcrypt.compare(dto.password, user.password);
        passwordEquals = passwordEquals || dto.password === user.password;
        if (passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: "Некорректный email или пароль!"});
    }
}
