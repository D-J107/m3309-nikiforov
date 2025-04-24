import { Controller, Post, Get, Param, Body, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchase } from './purchase.model';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingInterceptor } from 'src/interceptors/logginInterceptor';

@ApiTags('Покупки')
@UseInterceptors(CacheInterceptor, LoggingInterceptor)
@Controller('purchases')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @ApiOperation({ summary: 'Создать покупку' })
    @Post()
    async createPurchase(@Body() dto: CreatePurchaseDto): Promise<Purchase> {
        return this.purchaseService.createPurchase(dto);
    }

    @ApiOperation({ summary: 'Получить все покупки' })
    @Get()
    async getAllPurchases(): Promise<Purchase[]> {
        return this.purchaseService.getAllPurchases();
    }

    @ApiOperation({ summary: 'Получить покупки пользователя(по айди)' })
    @Get(':userId')
    async getPurchasesByUser(@Param('userId') userId: number): Promise<Purchase[]> {
        return this.purchaseService.getPurchasesByUser(userId);
    }
}
