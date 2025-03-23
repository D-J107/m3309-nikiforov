import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as session from 'express-session';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );



  const isRunningInProduction = process.env.NODE_ENV === 'production';
  const isCookieUsage = isRunningInProduction ? true : false;
  app.use(session({
    secret: '3dmaio39q3i2mesp0ek-copax',
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

  const port = process.env.PORT || 3000;
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


