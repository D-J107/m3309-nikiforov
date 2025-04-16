import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePurchaseDto {
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 2, description: 'ID товара' })
    @IsNumber()
    @IsNotEmpty()
    itemId: number;
}