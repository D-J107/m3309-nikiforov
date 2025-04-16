import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './roles.model';
import { Repository } from 'typeorm';
import { OnModuleInit } from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService implements OnModuleInit {
    constructor(
        @InjectRepository(Role) private roleRepository: Repository<Role>)
    {}

    async createRole(dto: CreateRoleDto) {
        return await this.roleRepository.save(dto);
    }

    async getAll() {
        return await this.roleRepository.find();
    }

    async getById(id: number) {
        return await this.roleRepository.findOneBy({id});
    }

    async getByValue(value: string) {
        return await this.roleRepository.findOneBy({value});
    }

    async updateRole(id: number, dto: UpdateRoleDto) {
        let user = this.roleRepository.findOneBy({id});
        if (!user) {
            throw new NotFoundException(`Роль с айди ${id} не найдена!`);
        }
        await this.roleRepository.update(id, dto);
        return await this.roleRepository.findOneBy({id});
    }

    async deleteByValue(value: string) {
        const role = await this.roleRepository.findOne({
            where: {value},
            relations: ['users'],
        });

        if (!role) {
            throw new NotFoundException(`Роль с значением ${value} не найдена!`);
        }

        // удаляем отношение
        await this.roleRepository
            .createQueryBuilder()
            .relation(Role, "users")
            .of(role)
            .remove(role.users);

        await this.roleRepository.delete({value});
    }

    






    async onModuleInit() {
        this.ensureRoleExists("USER", "Обычный пользователь");
        this.ensureRoleExists("ADMIN", "Администратор");
    }

    async ensureRoleExists(value: string, description: string): Promise<Role> {
        this.roleRepository
            .createQueryBuilder()
            .insert()
            .into(Role)
            .values({ value, description })
            .onConflict('("value") DO NOTHING') // avoid duplicate insert
            .execute();
        const role = await this.roleRepository.findOneBy({ value });
        if (!role) {
            throw new Error(`Role "${value}" was not found after insert!`);
        }
        return role;
    }
}
