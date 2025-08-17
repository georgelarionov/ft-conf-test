# Быстрое развертывание на Vercel

## Шаг 1: Подготовка

1. Убедитесь, что у вас есть аккаунт на [Vercel](https://vercel.com)
2. Скопируйте `env.production.example` в `.env.production` и заполните значения

## Шаг 2: Развертывание через CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

При первом запуске ответьте на вопросы:
- Set up and deploy? **Y**
- Which scope? **Выберите вашу организацию**
- Link to existing project? **N** (для нового проекта)
- Project name? **frontend-main** (или ваше название)
- In which directory is your code located? **./** (текущая директория)
- Want to override the settings? **N**

## Шаг 3: Настройка переменных окружения

После первого деплоя добавьте переменные окружения:

```bash
# Добавление переменных через CLI
vercel env add NEXT_PUBLIC_API_MAIN_ENDPOINT production
vercel env add NEXT_PUBLIC_LIVE production
vercel env add NEXT_PUBLIC_LOCAL_DEBUG production
vercel env add NEXT_PUBLIC_IS_PROXY production
vercel env add NEXT_PUBLIC_DEBUG_SHOPIFY_ID production
vercel env add NEXT_PUBLIC_DEBUG_DESIGNER_ID production
vercel env add NEXT_PUBLIC_CUSTOMER_LOGIN_REDIRECT_URL production
```

Или через веб-интерфейс:
1. Перейдите в Dashboard → Settings → Environment Variables
2. Добавьте все переменные из `.env.production`

## Шаг 4: Пересборка с переменными

```bash
vercel --prod --force
```

## Полезные команды

```bash
# Просмотр логов
vercel logs

# Просмотр деплоев
vercel ls

# Откат к предыдущей версии
vercel rollback

# Удаление деплоя
vercel rm [deployment-url]
```

## Настройка домена

1. В Vercel Dashboard перейдите в Settings → Domains
2. Добавьте ваш домен
3. Следуйте инструкциям для настройки DNS

## Проверка после деплоя

- [ ] Главная страница загружается
- [ ] 3D модели отображаются корректно
- [ ] API запросы работают
- [ ] Авторизация функционирует
- [ ] Изображения и текстуры загружаются

## Troubleshooting

### Ошибка 500 на продакшене
- Проверьте логи: `vercel logs`
- Убедитесь, что все переменные окружения установлены

### Модели не загружаются
- Проверьте пути к файлам
- Убедитесь, что размер файлов не превышает лимиты Vercel (100MB)

### API не работает
- Проверьте CORS настройки
- Убедитесь, что API endpoint доступен
