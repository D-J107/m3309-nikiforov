import {config} from 'dotenv';
config({ path: `.${process.env.NODE_ENV || 'development'}.env` });

import {Item} from "./src/items/items.model"
import { Purchase } from "./src/purchase/purchase.model";
import { Role } from "./src/roles/roles.model";
import {User} from "./src/users/users.model"
import {Post} from "./src/posts/post.entity";
import {Author} from "./src/authors/author.entity";
import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: true,
    synchronize: false,
    dropSchema: false,
    logging: false,
    logger: "file",
    entities: [User, Role, Purchase, Item, Post, Author],
    migrations: ['./src/migrations/**/*.ts'],
    migrationsTableName: "migrations",
})