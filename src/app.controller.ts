import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Render} from '@nestjs/common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {message: "My mobal data"};
  }
}
