import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({example: 'Иван Иванов', description: 'Имя пользователя'})
    @IsOptional()
    @IsString({message: 'должно быть строкой!'})
    @Length(2, 30, {message: 'длина имени должна быть не меньше 2 и не больше 30 символов!'})
    readonly username?: string;

    @ApiProperty({example: 'Иван Иванов', description: 'Имя пользователя'})
    @IsString({message: 'должно быть строкой!'})
    @Length(5, 12, {message: 'длина пароля должна быть не меньше 5 и не больше 12 символов!'})
    readonly password: string;
    
    @ApiProperty({example: 'Иван Иванов', description: 'Имя пользователя'})
    @IsString({message: 'должно быть строкой!'})
    @IsEmail({}, {message: 'Некорректный email!'})
    readonly email: string;

    @ApiProperty({example: '1000', description: 'На сколько человек пополняет баланс средств на сайте'})
    @IsNumber()
    readonly deposit?: number;
}