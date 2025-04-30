import { Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Render, Req, UseGuards, UseInterceptors, } from '@nestjs/common';

import {Request} from 'express';
import { ItemsService } from './items/items.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles-auth.decorator';
import { UsersService } from './users/users.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingInterceptor } from './interceptors/logginInterceptor';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Общее')
@UseInterceptors(CacheInterceptor, LoggingInterceptor)
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
  @ApiBearerAuth('cookieAuth')
  @ApiOperation({ summary: 'Личный кабинет пользователя'})
  @ApiResponse({ status: 200, description: 'Страница личного кабинета пользователя'})
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован'})
  async personal_account(@Req() req : Request) {
    if (!req.userId) {
      throw new HttpException("Произошла ошибка сервера!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const user = await this.usersService.getUserById(req.userId);
    console.log("app.controller.ts user:",user);
    return { user: req.user, username: user?.username, balance: user?.balance };
  }

  @Get('/payment')
  @Render('payment')
  payment(@Req() req : Request) {
    return { user: req.user };
  }

  @Get('/payment/:id')
  @Render('paymentItem')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('cookieAuth')
  @ApiOperation({ summary: 'Оплата конкретного товара'})
  @ApiResponse({ status: 200, description: 'Страница оплаты товара пользователем'})
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован'})
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

  @Get('/administration')
  @Render('administration')
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiBearerAuth('cookieAuth')
  @ApiOperation({ summary: 'Администрирование'})
  @ApiResponse({ status: 200, description: 'Страница администратора для управления сайтом'})
  @ApiResponse({status: 401, description: 'Пользователь не авторизован'})
  @ApiResponse({status: 403, description: 'Пользователь не является администратором'})
  administration(@Req() req : Request) {
    return { user: req.user };
  }
}