import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Purchase } from "src/purchase/purchase.model";
import { Role } from "src/roles/roles.model";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор пользователя' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'Иван Петров', description: 'Имя пользователя'})
    @Column({nullable: false})
    username: string;

    @ApiProperty({example: 'ewq312', description: 'Пароль'})
    @Column({nullable: false})
    password: string;

    @ApiProperty({example: 'usr1@mail.com', description: 'Почтовый адрес'})
    @Column({unique: true, nullable: false})
    email: string;

    @ApiProperty({example: '123', description: 'Количество денег на счету пользователя'})
    @Column({unique: false, nullable: false, default: 3000})
    balance: number;

    @ApiPropertyOptional({
        type: () => [Role],
        description: 'Роли пользователя',
        isArray: true
    })
    @ManyToMany(() => Role, (role) => role.users, { cascade: true})
    @JoinTable({
        name: "user_roles",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        }
    })
    roles: Role[];

    @ApiPropertyOptional({
        type: () => [Purchase],
        description: 'Покупки, совершенные пользователем',
        isArray: true
    })
    @OneToMany(() => Purchase, (purchase) => purchase.user)
    purchases: Purchase[];
};