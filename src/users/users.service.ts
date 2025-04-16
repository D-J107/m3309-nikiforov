import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { OnModuleInit } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { MissingEnvironmentVariableError } from 'src/customTypes/environmentError';


@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private readonly rolesService: RolesService)
    {}



    async createUser(dto: CreateUserDto) {
        let userRole = await this.rolesService.ensureRoleExists("USER", "Обычный пользователь");
        const USER_TEST_BALANCE = 3000;
        let newUser = this.usersRepository.create({
            ...dto,
            balance: USER_TEST_BALANCE,
            roles: [userRole]
        });
        newUser = await this.usersRepository.save(newUser);
        return newUser;
    }

    async getAllUsers() {
        const users = await this.usersRepository.find();
        return users;
    }

    async getUserById(id: number) {
        return await this.usersRepository.findOne({
            where: {id: id},
            relations: ['roles'],
        });
    }

    async getUserByEmail(email: string) {
        return this.usersRepository.findOne({
            where: {email: email},
            relations: ["roles"],
        });
    }

    async updateUser(id: number, dto: UpdateUserDto) {
        const user = await this.usersRepository.findOneBy({id});
        if (!user) {
            throw new NotFoundException(`Пользователь с айди ${id} не найден!`);
        }
        await this.usersRepository.update(id, {
            username: (dto.username || user.username),
            email: dto.email,
            password: dto.password, 
            balance: user.balance + (dto.deposit || 0)
        });
        return await this.usersRepository.findOneBy({id});
    }

    async addRoleToUser(id: number, value: string) {
        const user = await this.usersRepository.findOne({
            where: {id},
            relations: ["roles"],
        });
        if (!user) {
            throw new NotFoundException(`Пользователь с айди ${id} не найден!`);
        }
        const role = await this.rolesService.getByValue(value);
        if (!role) {
            throw new NotFoundException(`Роль с значением ${value} не найдена!`);
        }

        if (user.roles.some(r => r.id === role.id)) {
            throw new BadRequestException(`Пользователь ${id} уже имеет роль "${value}"!`);
        }

        user.roles.push(role);
        await this.usersRepository.save(user);

        return user;
    }

    async deleteByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: {email},
            relations: ["roles"],
        });
        if (!user) {
            throw new NotFoundException(`Пользователь с таким email ${email} не найден!`);
        }

        // удаляем отношение в промежуточной таблице user_roles
        await this.usersRepository
            .createQueryBuilder()
            .relation(User, "roles")
            .of(user)
            .remove(user.roles);

        await this.usersRepository.delete({email});
    }






    async onModuleInit() {
        const existingAdmin = await this.usersRepository.findOneBy({
            username: process.env.ADMIN_NAME
        });
        if (!existingAdmin) {
            let adminRole = await this.rolesService.ensureRoleExists("ADMIN", "Администратор");

            if (!process.env.ADMIN_PWD) {
                throw new MissingEnvironmentVariableError('ADMIN_PWD');
            }
            const usualPassword: string = process.env.ADMIN_PWD;
            const encryptedPassword = await bcrypt.hash(usualPassword, 7)
            const adminUser = this.usersRepository.create({
                username: process.env.ADMIN_NAME,
                password: encryptedPassword,
                email: process.env.ADMIN_MAIL,
                roles: [adminRole]
            });

            await this.usersRepository.save(adminUser);
        }
    }
}
