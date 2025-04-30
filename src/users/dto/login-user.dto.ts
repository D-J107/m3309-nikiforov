import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
    @ApiProperty({example: 'petya@mail.com', description: 'Электронная почта'})
    @IsString({message: 'должно быть строкой!'})
    @IsEmail({}, {message: 'Некорректный email!'})
    readonly email: string;
    
    @ApiProperty({example: 'Password321', description: 'Пароль пользователя'})
    @IsString({message: 'должно быть строкой!'})
    @Length(5, 12, {message: 'длина пароля должна быть не меньше 5 и не больше 12!'})
    readonly password: string;
}