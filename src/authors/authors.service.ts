import { Injectable } from '@nestjs/common';
// import { CreateAuthorInput } from './dto/create-author.input';
// import { UpdateAuthorInput } from './dto/update-author.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorRepository: Repository<Author>) 
  {}

  // create(input: CreateAuthorInput): Promise<Author> {
  //   const author = this.authorRepository.create(input);
  //   return this.authorRepository.save(author);
  // }

  findAll(): Promise<Author[]> {
    return this.authorRepository.find({ relations: ['posts'] });
  }

  findOne(id: number): Promise<Author | null> {
    return this.authorRepository.findOne({
      where: {id},
      relations: ['posts'],
    });
  }

  // async update(input: UpdateAuthorInput): Promise<Author | null> {
  //   await this.authorRepository.update(input.id, input);
  //   return this.findOne(input.id);
  // }

  async remove(id: number): Promise<Boolean> {
    await this.authorRepository.delete(id);
    return true;
  }
}
