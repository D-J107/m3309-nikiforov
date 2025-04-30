import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
    @ApiPropertyOptional({example: 'Сигма Жопов', description: 'Новое имя пользователя'})
    @IsOptional()
    @IsString({message: 'должно быть строкой!'})
    @Length(2, 30, {message: 'длина имени должна быть не меньше 2 и не больше 30 символов!'})
    readonly username?: string;

    @ApiProperty({example: 'New%Pwd', description: 'Новый пароль пользователя'})
    @IsString({message: 'должно быть строкой!'})
    @Length(5, 12, {message: 'длина пароля должна быть не меньше 5 и не больше 12 символов!'})
    readonly password: string;
    
    @ApiProperty({example: 'new@mail.com', description: 'Новый email пользователя'})
    @IsString({message: 'должно быть строкой!'})
    @IsEmail({}, {message: 'Некорректный email!'})
    readonly email: string;

    @ApiPropertyOptional({example: '1000', description: 'Сумма пополнения баланса'})
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, {message: 'Должно быть числом!'})
    readonly deposit?: number;
}