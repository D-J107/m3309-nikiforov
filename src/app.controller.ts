import { Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Render, Req, UseGuards, } from '@nestjs/common';

import {Request} from 'express';
import { ItemsService } from './items/items.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles-auth.decorator';
import { UsersService } from './users/users.service';



@Controller()
export class AppController {
  constructor(
    private itemsService: ItemsService, 
    private usersService: UsersService
  ) {}

  @Get()
  @Render('catalogue')
  async root(@Req() req : Request) {
    const items = await this.itemsService.getAll();
    return { user: req.user, items }; // кидаем в HBS
  }

  @Get('/catalogue')
  @Render('catalogue')
  root2(@Req() req : Request) {
    return this.root(req);
  }

  @Get('/personal_account')
  @Render('personal_account')
  @UseGuards(JwtAuthGuard)
  async personal_account(@Req() req : Request) {
    if (!req.userId) {
      throw new HttpException("Произошла ошибка сервера!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const user = await this.usersService.getUserById(req.userId);
    return { user: req.user, username: user?.username, balance: user?.balance };
  }

  @Get('/payment')
  @Render('payment')
  payment(@Req() req : Request) {
    return { user: req.user };
  }

  @Get('/payment/:id')
  @Render('paymentItem')
  async paymentForItem(@Param('id') id: number, @Req() req: Request) {
    const item = await this.itemsService.getById(id);
    if (!item) {
      throw new NotFoundException(`Предмет с айди ${id} не найден!`);
    }
    return {user: req.user, item};
  }

  @Get('/delivery')
  @Render('delivery')
  delivery(@Req() req : Request) {
    return { user: req.user };
  }

  @Get('/contacts')
  @Render('contacts')
  contacts(@Req() req : Request) {
    return { user: req.user };
  }

  @Get('/vacancy')
  @Render('vacancy')
  vacancy(@Req() req : Request) {
    return { user: req.user };
  }

  @Get('/reviews')
  @Render('reviews')
  reviews(@Req() req : Request) {
    return { user: req.user };
  }

  @Get('/business_partners')
  @Render('business_partners')
  business_partners(@Req() req : Request) {
    return { user: req.user };
  }

  @Get('/todo')
  @Render('todo')
  todo_list(@Req() req : Request) {
    return { user: req.user };
  }

  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get('/administration')
  @Render('administration')
  administration(@Req() req : Request) {
    return { user: req.user };
  }
}
