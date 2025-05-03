<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="./public/images/logo.png" width="120" alt="Nest Logo" /></a>
</p>

link ----> https://m3309-nikiforov.onrender.com <----- link
(возможно что рендер будет долго прогружаться ибо проект учебный и там выбран Free-Plan поэтому там малые мощности)

Университетский проект по backend'у 

Приложение магазина на NestJS, демонстрирующее знания современных серверных технологий. Проект включает:

- **Интеграция с Express** и пользовательские middleware  
- **Аутентификация на основе JWT** (токен хранится в cookie сессии) и ролевой доступ через Guards  
- **TypeORM** для подключения к удалённой базе PostgreSQL (хостинг на Neon.tech)  
- **Хранение изображений** в стиле S3 с использованием бесплатного плана Cloudinary  
- **Кэширование**: ETag-заголовки для фронтенда и NestJS `CacheModule` для бэкенда  
- **Server-Sent Events (SSE)** для обновлений в реальном времени на фронтенде  
- Полная поддержка **CRUD** через HTTP (`CREATE`, `GET`, `POST`, `DELETE`, `PATCH`)  
- **Swagger** документация для всех контроллеров, DTO и сущностей  
- **Handlebars** движок для отдачи статических страниц или шаблонных писем  
- Небольшая **GraphQL** поддержка через схему  
- **Механизм миграций**: генерация (`npm run migration:generate`) и применение (`npm run migration:push`)

---

## Начало работы


### 1. Клонирование и установка
```bash
git clone https://github.com/your-username/nest-university-project.git
cd nest-university-project
npm install
```

### 2. Переменные окружения

Создайте файл `.env` в корне проекта:

```dotenv
# Сервер
PORT=3000

# База данных (Neon.tech)
DB_HOST=your-neon-host.neon.tech
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600s

# Cloudinary (S3-хранение)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Запуск локально
```bash
# Режим разработки (с авто-перезагрузкой)
npm run start:dev

# Сборка и запуск в продакшене
npm run build
node dist/index
```

---

## Основные модули и технологии

### NestJS и Express
- Модульная архитектура NestJS поверх Express  
- Пользовательские middleware для логирования запросов и обработки ошибок

### Аутентификация и авторизация
- **JWT в cookie сессии** для безопасной аутентификации  
- **Guards** для проверки ролей (например, Admin / User)

### База данных и миграции
- **TypeORM**: сущности и репозитории  
- Удалённая PostgreSQL база на Neon.tech  
- Генерация миграций:
  ```bash
  npm run migration:generate -- -n SomeNewChange
  ```
- Применение миграций:
  ```bash
  npm run migration:push
  ```

### Хранение файлов и интерцепторы
- **Cloudinary** для хранения пользовательских изображений  
- `@UseInterceptors(FileInterceptor('file'))` для обработки загрузок  

### Стратегии кэширования
- **ETag**-заголовки для эффективного кэширования на клиенте  
- `CacheModule` от NestJS для кэширования на сервере

### Обновления в реальном времени
- **Server-Sent Events (SSE)** для трансляции событий клиентам  

### API документация и шаблоны
- **Swagger** доступен по `/api/docs`  
- **Handlebars** для серверной генерации страниц и писем  

---

## Примеры использования

### Аутентификация
1. **Логин** (`POST /auth/login`) → установка JWT в cookie  
2. Cookie автоматически прикрепляется к запросам  
3. Guards проверяют доступ по ролям (`@Roles('admin')` на защищённых роутингах)



### Swagger
Откройте `http://localhost:3000/api/docs` для просмотра и тестирования API.

---
