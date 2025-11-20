import { db } from '../db';
import { DBTariff, WBTariff } from '../types';

export class DBService {
  async saveTariffs(tariffs: WBTariff[]): Promise<void> {
    if (tariffs.length === 0) {
      console.log('Нет тарифов для сохранения');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    console.log(`Сохранение ${tariffs.length} тарифов за дату: ${today}`);

    try {
      for (const tariff of tariffs) {
        const dbTariff: Omit<DBTariff, 'id' | 'created_at' | 'updated_at'> = {
          date: today,
          nm_id: tariff.nmId,
          price: tariff.price,
          discount: tariff.discount,
          final_price: tariff.price * (1 - tariff.discount / 100)
        };

        await db('wb_tariffs')
          .insert(dbTariff)
          .onConflict(['date', 'nm_id'])
          .merge({
            price: dbTariff.price,
            discount: dbTariff.discount,
            final_price: dbTariff.final_price,
            updated_at: new Date()
          });
      }
      
      console.log('Тарифы успешно сохранены в базу данных');
    } catch (error) {
      console.error('Ошибка сохранения тарифов в базу данных:', error);
      throw error;
    }
  }

  async getTodayTariffs(): Promise<DBTariff[]> {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Получение тарифов за дату: ${today}`);
    
    try {
      const tariffs = await db('wb_tariffs')
        .where('date', today)
        .orderBy('final_price', 'asc');
      
      console.log(`Получено ${tariffs.length} тарифов из базы данных`);
      return tariffs;
    } catch (error) {
      console.error('Ошибка получения тарифов из базы данных:', error);
      throw error;
    }
  }

  async cleanupOldData(days: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    console.log(`Очистка данных старше: ${cutoffDateStr}`);
    
    try {
      const result = await db('wb_tariffs')
        .where('date', '<', cutoffDateStr)
        .delete();
      
      console.log(`Очищено ${result} старых записей`);
    } catch (error) {
      console.error('Ошибка очистки старых данных:', error);
      throw error;
    }
  }
}