import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRoleDto {
    @ApiProperty({example: 'ADMIN', description: 'Уникальное значение роли'})
    @IsString({message: 'должно быть строкой!'})
    readonly value: string;
    
    @ApiProperty({example: 'Администратор системы', description: 'Описание роли'})
    @IsString({message: 'должно быть строкой!'})
    readonly description: string;
}