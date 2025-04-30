import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "src/users/users.model";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("roles")
export class Role {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор роли' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'ADMIN', description: 'Значение роли'})
    @Column({unique: true, nullable: false})
    value: string;

    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    @Column({nullable: false})
    description: string;

    @ApiPropertyOptional({
        type: () => [User],
        description: 'Пользователи, имеющие данную роль',
        isArray: true,
    })
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}