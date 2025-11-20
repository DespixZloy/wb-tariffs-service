import * as cron from 'node-cron';
import { config } from './config';
import { TariffService } from './services/tariffService';
import { db } from './db';

class Application {
  private tariffService: TariffService;

  constructor() {
    this.tariffService = new TariffService();
  }

  async start(): Promise<void> {
    try {
      console.log('Запуск сервиса тарифов WB...');
      
      await db.raw('SELECT 1');
      console.log('Подключение к базе данных установлено');

      try {
        await db.migrate.latest();
        console.log('Миграции базы данных применены');
      } catch (migrationError) {
        console.error('Ошибка миграции базы данных:', migrationError);
      }

      console.log('Выполнение первоначального обновления тарифов...');
      await this.tariffService.updateTariffs();

      cron.schedule('0 * * * *', async () => {
        console.log('Запуск планового обновления тарифов...');
        await this.tariffService.updateTariffs();
      });
      console.log('Плановое обновление тарифов: каждый час в 0 минут');

      cron.schedule('0 2 * * *', async () => {
        console.log('Запуск очистки старых данных...');
        await this.tariffService.cleanupOldData();
      });
      console.log('Очистка старых данных: ежедневно в 2:00');

      console.log('Сервис тарифов WB успешно запущен!');
      console.log(`Интервал обновления: каждые ${config.app.updateIntervalHours} час(ов)`);
      console.log(`Интервал очистки: ${config.app.cleanupIntervalDays} дней`);

    } catch (error) {
      console.error('Ошибка запуска приложения:', error);
      process.exit(1);
    }
  }
}

process.on('SIGINT', async () => {
  console.log('\nПолучен SIGINT. Graceful shutdown...');
  await db.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nПолучен SIGTERM. Graceful shutdown...');
  await db.destroy();
  process.exit(0);
});

const app = new Application();
app.start().catch(console.error);