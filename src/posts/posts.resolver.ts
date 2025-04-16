// import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
// import { CreatePostInput } from './dto/create-post.input';
// import { UpdatePostInput } from './dto/update-post.input';

// @Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  // @Mutation(() => Post)
  // createPost(@Args('input') input: CreatePostInput) {
  //   return this.postsService.create(input);
  // }

  // @Query(() => [Post], { name: 'posts' })
  findAllPosts() {
    return this.postsService.findAll();
  }

  // @Query(() => Post, { name: 'post' })
  // findPost(@Args('id', { type: () => Int }) id: number) {
  //   return this.postsService.findOne(id);
  // }

  // @Mutation(() => Post)
  // updatePost(@Args('input') input: UpdatePostInput) {
  //   return this.postsService.update(input);
  // }

  // @Mutation(() => Boolean)
  // deletePost(@Args('id', { type: () => Int }) id: number) {
  //   return this.postsService.remove(id);
  // }
}
