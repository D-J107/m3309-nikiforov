"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const session = require("express-session");
const hbs = require("hbs");
const fs = require("fs");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const isRunningInProduction = process.env.NODE_ENV === 'production';
    const isCookieUsage = isRunningInProduction ? true : false;
    app.use(session({
        secret: '3dmaio39q3i2mesp0ek-copax',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: isCookieUsage }
    }));
    app.enableCors({
        origin: [
            "http://localhost:3000",
            "https://m3309-nikiforov.onrender.com"
        ],
        credentials: true
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    const partialDir = (0, path_1.join)(__dirname, "..", "views", "partials");
    fs.readdirSync(partialDir).forEach((file) => {
        const partialName = file.split('.')[0];
        const partialContent = fs.readFileSync((0, path_1.join)(partialDir, file), 'utf-8');
        hbs.registerPartial(partialName, partialContent);
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map