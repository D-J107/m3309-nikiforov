import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { AppController } from './app.controller';
import { Item } from './items/items.model';
import { PurchaseModule } from './purchase/purchase.module';
import { Purchase } from './purchase/purchase.model';
import { DatabaseModule } from './database/database.module';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AuthorsModule } from './authors/authors.module';
import { Post } from './posts/post.entity';
import { Author } from './authors/author.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ComplexityPlugin } from './customTypes/GqlComplexityPlugin';

@Module({
  controllers: [AppController],
  providers: [
    AppService, 
    ComplexityPlugin
  ],
  imports: [
    CacheModule.register({ttl: 60, isGlobal: true}),
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      ssl: true,
      entities: [User, Role, Item, Purchase, Post, Author],
      synchronize: false,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: false,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ItemsModule,
    PurchaseModule,
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: (process.env.GRAPHQL_PLAYGROUND === 'true'),
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    PostsModule,
    AuthorsModule,
  ]
})
export class AppModule {}