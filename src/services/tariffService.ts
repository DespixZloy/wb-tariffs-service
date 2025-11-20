import { WBService } from './wbService';
import { DBService } from './dbService';
import { GoogleSheetsService } from './googleSheetsService';
import { config } from '../config';

export class TariffService {
  private wbService: WBService;
  private dbService: DBService;
  private googleSheetsService: GoogleSheetsService;

  constructor() {
    this.wbService = new WBService();
    this.dbService = new DBService();
    this.googleSheetsService = new GoogleSheetsService();
  }

  async updateTariffs(): Promise<void> {
    try {
      console.log('=== Начало процесса обновления тарифов ===');
      
      const tariffs = await this.wbService.getTariffs();
      await this.dbService.saveTariffs(tariffs);
      const todayTariffs = await this.dbService.getTodayTariffs();
      await this.googleSheetsService.updateSheets(todayTariffs);
      
      console.log('=== Процесс обновления тарифов завершен ===\n');
      
    } catch (error) {
      console.error('Ошибка в updateTariffs:', error);
      throw error;
    }
  }

  async cleanupOldData(): Promise<void> {
    try {
      console.log('Начало очистки старых данных...');
      await this.dbService.cleanupOldData(config.app.cleanupIntervalDays);
      console.log('Очистка старых данных завершена\n');
    } catch (error) {
      console.error('Ошибка в cleanupOldData:', error);
    }
  }
}