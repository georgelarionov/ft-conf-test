# Руководство по развертыванию на Vercel

## Предварительные требования

- Аккаунт на [Vercel](https://vercel.com)
- Git репозиторий (GitHub, GitLab или Bitbucket)
- Yarn package manager

## Шаги развертывания

### 1. Подготовка переменных окружения

1. Скопируйте файл `env.production.example` в `.env.production`
2. Заполните все необходимые значения:
   - `NEXT_PUBLIC_DEBUG_SHOPIFY_ID` - ID для тестового пользователя Shopify
   - `NEXT_PUBLIC_DEBUG_DESIGNER_ID` - ID для тестового дизайнера
   - `NEXT_PUBLIC_CUSTOMER_LOGIN_REDIRECT_URL` - URL для редиректа после логина

### 2. Локальная проверка production сборки

```bash
# Установка зависимостей
yarn install

# Сборка для production
yarn build

# Запуск production версии локально
yarn start
```

Проверьте на http://localhost:3000:
- [ ] Загрузка главной страницы
- [ ] Работа 3D моделей
- [ ] Загрузка текстур
- [ ] API запросы

### 3. Развертывание на Vercel

#### Через Vercel CLI (рекомендуется для первого деплоя)

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Деплой
vercel --prod
```

#### Через веб-интерфейс

1. Перейдите на [vercel.com/new](https://vercel.com/new)
2. Импортируйте репозиторий
3. Настройте проект:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `yarn build`
   - **Output Directory**: `.next`

### 4. Настройка переменных окружения в Vercel

В настройках проекта на Vercel добавьте все переменные из `.env.production`:

1. Перейдите в Settings → Environment Variables
2. Добавьте каждую переменную:
   - `NEXT_PUBLIC_API_MAIN_ENDPOINT`
   - `NEXT_PUBLIC_LIVE`
   - `NEXT_PUBLIC_LOCAL_DEBUG`
   - `NEXT_PUBLIC_IS_PROXY`
   - И другие...

### 5. Настройка домена (опционально)

1. В настройках проекта перейдите в Domains
2. Добавьте ваш домен
3. Следуйте инструкциям для настройки DNS

## Оптимизация для production

### Статические ресурсы

Большие файлы (3D модели, текстуры) уже оптимизированы через настройки в `vercel.json`:
- Кеширование на 1 год для `/models/*` и `/textures/*`
- Сжатие автоматически включено

### Рекомендации по улучшению производительности

1. **Оптимизация моделей**:
   ```bash
   # Установите gltf-pipeline
   npm install -g gltf-pipeline
   
   # Оптимизируйте GLTF файлы
   gltf-pipeline -i input.gltf -o output.gltf -d
   ```

2. **Оптимизация изображений**:
   - Используйте WebP формат где возможно
   - Применяйте lazy loading для изображений

3. **Мониторинг**:
   - Включите Vercel Analytics в настройках проекта
   - Настройте Web Vitals для отслеживания производительности

## Устранение проблем

### Ошибка сборки

1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все зависимости установлены
3. Проверьте совместимость версий Node.js

### Проблемы с API

1. Проверьте CORS настройки на сервере
2. Убедитесь, что API endpoint доступен
3. Проверьте переменные окружения

### 3D модели не загружаются

1. Проверьте пути к файлам
2. Убедитесь, что MIME типы правильные
3. Проверьте размер файлов (лимит Vercel)

## CI/CD

После первого успешного деплоя, все последующие коммиты в main ветку будут автоматически развертываться.

### Preview деплои

Каждый Pull Request автоматически получает preview URL для тестирования.

## Полезные команды

```bash
# Проверка production сборки
yarn build

# Анализ размера бандла
yarn build && yarn analyze

# Очистка кеша
rm -rf .next node_modules && yarn install

# Проверка TypeScript
yarn tsc --noEmit
```

## Контакты поддержки

- Документация Vercel: https://vercel.com/docs
- Документация Next.js: https://nextjs.org/docs
