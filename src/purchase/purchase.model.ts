import { ApiProperty } from "@nestjs/swagger";
import { Item } from "src/items/items.model";
import { User } from "src/users/users.model";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('purchases')
export class Purchase {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор покупки'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ type: () => User, description: 'Пользователь, совершивший покупку' })
    @ManyToOne(() => User, (user) => user.purchases, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id'})
    user: User;

    @ApiProperty({ type: () => Item, description: 'Приобретённый предмет' })
    @OneToOne(() => Item)
    @JoinColumn({ name: 'item_id'})
    item: Item;

    @ApiProperty({  example: new Date().toISOString(),
                    description: 'Дата покупки предметов пользователем',
                    type: String, 
                    format: 'date-time'
    })
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    purchaseDate: Date;
}

