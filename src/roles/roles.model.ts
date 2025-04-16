import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.model";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'ADMIN', description: 'Значение роли'})
    @Column({unique: true, nullable: false})
    value: string;

    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    @Column({nullable: false})
    description: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}