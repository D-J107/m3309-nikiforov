import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { Purchase } from './purchase.model';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Purchase)
        private readonly purchaseRepository: Repository<Purchase>,
        private readonly usersService: UsersService,
        private readonly itemService: ItemsService,
    ) {}

    async createPurchase(dto: CreatePurchaseDto): Promise<Purchase> {
        let user = await this.usersService.getUserById(dto.userId);
        if (!user) {
          throw new NotFoundException(`Пользователь с айди ${dto.userId} не найден!`);
        }

        let item = await this.itemService.getById(dto.itemId);
        if (!item) {
          throw new NotFoundException(`Предмет с айди ${dto.itemId} отсутствует в базе данных!`);
        }

        if (user.balance < item.price) {
          throw new BadRequestException("У вас недостаточно средств для этой покупки!");
        }

        const purchase = this.purchaseRepository.create({
          user,
          item,
          purchaseDate: new Date(),
        })

        const savedPurchase = await this.purchaseRepository.save(purchase);
        // после того как сохранил в таблицу покупок, нужно удалить из таблицы Предметов
        // поскольку он больше не доступен всем пользователям на обозрение
        item.purchase = purchase;
        this.itemService.purchaseItem(dto.itemId, savedPurchase);
        
        const updatedUserDto: UpdateUserDto = {
          username: user.username,
          password: user.password,
          email: user.email, 
          deposit: (-1)*item.price
        };
        this.usersService.updateUser(user.id, updatedUserDto)

        return savedPurchase;
    }

    async getPurchasesByUser(userId: number): Promise<Purchase[]> {
        return await this.purchaseRepository.find({
            where: { user: { id: userId } },
        });
    }

    async getAllPurchases(): Promise<Purchase[]> {
        return await this.purchaseRepository.find();
    }
}
