# WB Tariffs Service

Сервис для регулярного получения тарифов Wildberries и сохранения в PostgreSQL.

## Функциональность

Ежечасное получение тарифов с WB API

Сохранение в PostgreSQL с привязкой к дате

Обновление данных за текущий день

Готовность к интеграции с Google Sheets (Но нужно заполнить GOOGLE_SHEETS_CREDENTIALS={} и GOOGLE_SHEETS_IDS=[] в .env)

Сортировка данных по итоговой цене

## Запуск Docker 

docker compose up