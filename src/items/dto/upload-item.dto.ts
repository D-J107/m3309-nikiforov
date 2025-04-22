
import { IsNotEmpty, IsNumber, Min, IsString, IsUrl } from 'class-validator';

export class UploadItemDto {
  @IsString({message: 'должно быть строкой!'})
  @IsNotEmpty({ message: 'Название не должно быть пустым!' })
  readonly title: string;

  @IsNumber({}, { message: 'Цена должна быть числом!' })
  @Min(1, { message: 'Цена должна быть положительным числом!' })
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  readonly imageUrl: string
}