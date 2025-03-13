import { Controller, Get, Render, Req } from '@nestjs/common';
import { SessionRequest } from './types/sessionRequest';


@Controller()
export class AppController {

  @Get('/')
  @Render('index')
  home(@Req() req: SessionRequest) {
    return { username: req.session.user ? req.session.user.username : null }; 
  }

  @Get('/personal_account')
  @Render('personal_account')
  personalAccount(@Req() req: SessionRequest) {
    return { username: req.session.user ? req.session.user.username : null };
  }

  @Get('/business_partners')
  @Render('business_partners')
  businessPartners(@Req() req: SessionRequest) {
    return { username: req.session.user ? req.session.user.username : null };
  }

  @Get('/contacts')
  @Render('contacts')
  contacts(@Req() req: SessionRequest) {
    return { username: req.session.user ? req.session.user.username : null };
  }

  @Get('/delivery')
  @Render('delivery')
  delivery(@Req() req: SessionRequest) {
    return { username: req.session.user ? req.session.user.username : null };
  }

  @Get('/payment')
  @Render('payment')
  payment(@Req() req: SessionRequest) {
    return { username: req.session.user ? req.session.user.username : null };
  }

  @Get('/reviews')
  @Render('reviews')
  reviews(@Req() req: SessionRequest) {
    return { username: req.session.user ? req.session.user.username : null };
  }

  @Get('/vacancy')
  @Render('vacancy')
  vacancy(@Req() req: SessionRequest) {
    return { username: req.session.user ? req.session.user.username : null };
  }
}
