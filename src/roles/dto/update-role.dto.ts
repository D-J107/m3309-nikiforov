import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class UpdateRoleDto {
    @ApiProperty({example: 'MANAGER', description: 'новое значение роли'})
    @IsString({message: 'Должно быть строкой!'})
    value: string;

    @ApiProperty({example: 'Управляющий персоналом магазина', description: 'Описание роли'})
    @IsString({message: 'Должно быть строкой!'})
    description: string
}