
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, IsString, Max, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @ApiPropertyOptional({example: 'рыба фуга', description: 'Новое название товара'})
  @IsOptional()
  @IsString({message: 'должно быть строкой!'})
  readonly title?: string;

  @ApiPropertyOptional({example: '2134', description: 'Новая цена товара'})
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Цена должна быть положительным числом!' })
  readonly price?: number;

  @ApiPropertyOptional({example: 'Распродажа', description: 'Название специального предложения'})
  @IsOptional()
  @IsString({message: 'должно быть строкой!'})
  readonly specialOffer?: string;

  @ApiPropertyOptional({example: '13', description: 'Новое значение скидки'})
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Скидка должна быть числом!' })
  @Min(1, { message: 'Скидка должна быть положительным числом!' })
  @Max(100, { message: 'Значение должно быть целочисленным от 1 до 100'})
  readonly discount?: number;
}