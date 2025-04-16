import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { CreatePostInput } from './dto/create-post.input';
// import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { Author } from 'src/authors/author.entity';
import { AuthorsService } from 'src/authors/authors.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private authorsService: AuthorsService,
  ) {}

  // async create(input: CreatePostInput): Promise<Post> {
  //   const author = await this.authorsService.findOne(input.authorId);
  //   if (!author) {
  //     throw new BadRequestException('Author must be created before creating a post!');
  //   }
  //   const post = this.postRepository.create({
  //     title: input.title,
  //     content: input.content,
  //     author
  //   });

  //   return this.postRepository.save(post);
  // }

  findAll(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['author'] });
  }

  findOne(id: number): Promise<Post | null> {
    return this.postRepository.findOne({
      where: {id: id},
      relations: ['author'],
    });
  }

  // async update(input: UpdatePostInput) {
  //   const {id, ...rest} = input;
  //   const post = await this.postRepository.preload({
  //     id,
  //     ...rest,
  //   });
  //   if (!post) {
  //     throw new BadRequestException(`Post with given id ${input.id} not found!`);
  //   }

  //   if (input.authorId) {
  //     const author = await this.authorsService.findOne(input.authorId);
  //     if (!author) {
  //       throw new BadRequestException(`Invalid author id ${input.authorId}`);
  //     }
  //     post.author = author;
  //   }

  //   return this.postRepository.save(post);
  // }

  async remove(id: number): Promise<Boolean> {
    await this.postRepository.delete(id);
    return true;
  }
}
