
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsString, IsUrl } from 'class-validator';

export class UploadItemDto {
  @ApiProperty({ example: 'Щука', description: 'Название нового товара' })
  @IsString({message: 'должно быть строкой!'})
  @IsNotEmpty({ message: 'Название не должно быть пустым!' })
  readonly title: string;

  @ApiProperty({ example: 760, description: 'Цена нового товара' })
  @IsNumber({}, { message: 'Цена должна быть числом!' })
  @Min(1, { message: 'Цена должна быть положительным числом!' })
  readonly price: number;

  @ApiProperty({ example: 'https://cdn.example.com/fish.webp', description: 'URL изображения товара' })
  @IsString()
  @IsNotEmpty()
  readonly imageUrl: string
}