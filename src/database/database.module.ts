import { Module } from '@nestjs/common';
import {config} from 'dotenv';
import * as pg from 'pg';
import { CloudinaryService } from './cloudinary.service';

config({
  path: ['.production.env', '.development.env'],
});

const sql = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: sql,
};

@Module({
  providers: [dbProvider, CloudinaryService],
  exports: [dbProvider, CloudinaryService],
})
export class DatabaseModule {}
