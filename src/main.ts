import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as session from 'express-session';
import * as hbs from 'hbs';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipe';
import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';
import { PreconditionFailedException } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );

  console.log("main.ts env pg_db:",process.env.POSTGRES_DB);

  const config = new DocumentBuilder()
    .setTitle('Фиш маркет')
    .setDescription('Документация Rest Api')
    .setVersion('1.0.0')
    .addTag('Nikiforov m3309')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document);


  const isRunningInProduction = process.env.NODE_ENV === 'production';
  const isCookieUsage = isRunningInProduction ? true : false;
  if (!process.env.SESSION_SECRET) {
    throw new PreconditionFailedException("You forgot to set SESSION_REQUEST variable in environment!");
  }
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: isCookieUsage}
  }));

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://m3309-nikiforov.onrender.com"
    ],
    credentials: true
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, "..", "views/layouts"));
  hbs.registerPartials(join(__dirname, "..", "views/partials"));

  hbs.registerHelper('isAdmin', function (roles) {
    let isAdmin = false;
    for (let i = 0; i < roles.length; i++ ){
      if (roles[i].value === "ADMIN" && roles[i].description === "Администратор") {
        isAdmin = true;
        break;
      }
    }
    return isAdmin;
  });
  hbs.registerHelper('concat', function(...args: any[]) {
    args.pop(); // ПО умолчанию аргументы имеют некий Handlebars options object, убираем
    return args.join('');
  });
  hbs.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });

  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe());

  // Middleware для извлечения токена из куки
  app.use(cookieParser());
  app.use((req: Request, res: Response, next: express.NextFunction) => {
    let user: any = null;
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);
    if (token) {
      try {
        user = jwt.verify(token, process.env.PRIVATE_KEY || 'qa2d2xMa30', {algorithms: ['HS256'] });
      } catch (error) {
        console.error('Invalid token:', error.message);
      }
    }
    req.user = user;
    if (user) {
      req.userId = user.id;
    }
    next();
  })

  
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();


// ВАЖНО
// Рендер пытается найти представления views/ в папке dist
// поэтому нужно в момент build'a рендера скопировать файлы из 
// views/ в dist/
// это делается такой командой в билде Рендера:
// npm install && npm run build && cp -r views dist/
// ну или можно заменить build в package.json'e на такой:
// "build": "nest build && cp -r views dist/", 


// Для генерации ER-диаграммы нужно ввести следующие команды:
// npm run generate:erd
// npm run generate:erd:svg