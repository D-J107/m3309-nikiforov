import { ApiProperty } from "@nestjs/swagger";

export class ItemDto {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public title: string;

    @ApiProperty()
    public price: number;

    @ApiProperty()
    public specialOffer?: string;
    
    @ApiProperty()
    public discount?: number;
}