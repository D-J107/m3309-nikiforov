
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, IsString, Max, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({example: 'рыба фуга', description: 'Новое название товара'})
  @IsOptional()
  @IsString({message: 'должно быть строкой!'})
  readonly title?: string;

  @ApiProperty({example: '2134', description: 'Новая цена товара'})
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Цена должна быть положительным числом!' })
  readonly price?: number;

  @ApiProperty({example: 'Распродажа', description: 'Название специального предложения'})
  @IsOptional()
  @IsString({message: 'должно быть строкой!'})
  readonly specialOffer?: string;

  @ApiProperty({example: '13', description: 'Новое значение скидки'})
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Скидка должна быть числом!' })
  @Min(1, { message: 'Скидка должна быть положительным числом!' })
  @Max(100, { message: 'Значение должно быть целочисленным от 1 до 100'})
  readonly discount?: number;
}