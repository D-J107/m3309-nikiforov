import { ApiProperty } from "@nestjs/swagger";
import { Item } from "src/items/items.model";
import { User } from "src/users/users.model";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('purchases')
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.purchases, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id'})
    user: User;

    @OneToOne(() => Item)
    @JoinColumn({ name: 'item_id'})
    item: Item;

    @ApiProperty({example: '01.04.2025', description: 'Дата покупки предметов пользователем'})
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    purchaseDate: Date;
}

