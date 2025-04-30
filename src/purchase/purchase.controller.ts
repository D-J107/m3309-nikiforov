import { Controller, Post, Get, Param, Body, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchase } from './purchase.model';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingInterceptor } from 'src/interceptors/logginInterceptor';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Покупки')
@UseInterceptors(CacheInterceptor, LoggingInterceptor)
@Controller('purchases')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Post()
    @ApiOperation({ summary: 'Создать покупку' })
    @ApiResponse({status: 201, description: 'Покупка успешно создана', type: Purchase})
    async createPurchase(@Body() dto: CreatePurchaseDto): Promise<Purchase> {
        return this.purchaseService.createPurchase(dto);
    }

    @Get()
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Получить все покупки' })
    @ApiResponse({status: 200, description: 'Получены все покупки', type: [Purchase]})
    @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
    @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
    async getAllPurchases(): Promise<Purchase[]> {
        return this.purchaseService.getAllPurchases();
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Получить покупки пользователя(по айди)' })
    @ApiResponse({status: 200, description: 'Список покупок пользователя', type: [Purchase]})
    @ApiResponse({status: 404, description: 'Пользователь не найден'})
    async getPurchasesByUser(@Param('userId') userId: number): Promise<Purchase[]> {
        return this.purchaseService.getPurchasesByUser(userId);
    }
}
