import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items.model';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryService } from 'src/database/cloudinary.service';
import { DatabaseModule } from 'src/database/database.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [ItemsService],
  controllers: [ItemsController],
  imports: [
    CacheModule.register({
      ttl: 60,
      max: 100, // макс число предметов в кэше
    }),
    TypeOrmModule.forFeature([Item]),
    AuthModule,
    DatabaseModule
  ],
  exports: [ItemsService]
})
export class ItemsModule {}
