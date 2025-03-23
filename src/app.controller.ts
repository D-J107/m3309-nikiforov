import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { SessionRequest } from './types/sessionRequest';
import { AppService } from './app.service';
import { Response } from 'express';


@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @Render('catalogue')
  root() {}

  @Get('/catalogue')
  @Render('catalogue')
  catalogue() {}

  @Get('/personal_account')
  @Render('personal_account')
  personal_account() {}

  @Get('/payment')
  @Render('payment')
  payment() {}

  @Get('/delivery')
  @Render('delivery')
  delivery() {}

  @Get('/contacts')
  @Render('contacts')
  contacts() {}

  @Get('/vacancy')
  @Render('vacancy')
  vacancy() {}

  @Get('/reviews')
  @Render('reviews')
  reviews() {}

  @Get('/business_partners')
  @Render('business_partners')
  business_partners() {}

  @Get('/todo')
  @Render('todo')
  todo_list() {}

}
