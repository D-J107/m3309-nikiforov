import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './purchase.model';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService],
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    UsersModule,
    ItemsModule
  ]
})
export class PurchaseModule {}
