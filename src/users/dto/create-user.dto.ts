import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({example: 'Иван Иванов', description: 'Имя пользователя'})
    @IsString({message: 'должно быть строкой!'})
    @Length(2, 30, {message: 'длина имени должна быть не меньше 2 и не больше 30!'})
    readonly username: string;

    @ApiProperty({example: 'Иван Иванов', description: 'Имя пользователя'})
    @IsString({message: 'должно быть строкой!'})
    @Length(5, 12, {message: 'длина пароля должна быть не меньше 5 и не больше 12!'})
    readonly password: string;
    
    @ApiProperty({example: 'Иван Иванов', description: 'Имя пользователя'})
    @IsString({message: 'должно быть строкой!'})
    @IsEmail({}, {message: 'Некорректный email!'})
    readonly email: string;
}