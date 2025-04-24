import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { AuthorsModule } from 'src/authors/authors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    AuthorsModule
  ],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
