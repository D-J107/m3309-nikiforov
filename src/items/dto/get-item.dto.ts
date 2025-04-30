import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ItemDto {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор товара' })
    id: number;
  
    @ApiProperty({ example: 'Кета', description: 'Название товара' })
    title: string;
  
    @ApiProperty({ example: 850, description: 'Цена товара (в рублях)' })
    price: number;
  
    @ApiPropertyOptional({ example: 'Распродажа до 23 апреля', description: 'Текст специального предложения' })
    specialOffer?: string;
  
    @ApiPropertyOptional({ example: 15, description: 'Процент скидки (1–100)' })
    discount?: number;
  }