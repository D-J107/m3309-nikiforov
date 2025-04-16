import { ApiProperty } from "@nestjs/swagger";
import { Purchase } from "src/purchase/purchase.model";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("items")
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'Язь', description: 'Название рыбы'})
    @Column({unique: false, nullable: false})
    title: string;

    @ApiProperty({example: '500', description: 'Значение цены за килограмм'})
    @Column({unique: false, nullable: false})
    price: number;

    @ApiProperty({example: 'fish_image.webp', description: 'файл изображения'})
    @Column({unique: false, nullable: false})
    imagePath: string; // Store the filename or URL of the .webp image

    @ApiProperty({example: 'Распродажа!', description: 'Специальное предложение или акция для товара'})
    @Column({unique: false, nullable: true})
    specialOffer?: string;
    
    @ApiProperty({example: '17%', description: 'Скидочный процент'})
    @Column({unique: false, nullable: true})
    discount?: number;

    @OneToOne(() => Purchase)
    @JoinColumn({ name: 'purchase_id'})
    purchase?: Purchase;
}