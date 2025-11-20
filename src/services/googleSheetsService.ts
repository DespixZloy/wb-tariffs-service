import { google } from 'googleapis';
import { config } from '../config';
import { DBTariff } from '../types';

export class GoogleSheetsService {
  private sheets: any;
  private sheetIds: string[];

  constructor() {
    this.sheetIds = config.googleSheets.sheetIds;
    this.initializeSheets();
  }

  private initializeSheets() {
    try {
      const credentials = config.googleSheets.credentials;
      
      if (!credentials || Object.keys(credentials).length === 0) {
        console.log('Учетные данные Google Sheets не предоставлены, пропускаем инициализацию');
        this.sheets = null;
        return;
      }

      const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      console.log('Сервис Google Sheets инициализирован');
    } catch (error) {
      console.error('Ошибка инициализации сервиса Google Sheets:', error);
      this.sheets = null;
    }
  }

  async updateSheets(tariffs: DBTariff[]): Promise<void> {
    if (!this.sheets) {
      console.log('Google Sheets не настроен, пропускаем обновление');
      return;
    }

    if (this.sheetIds.length === 0) {
      console.log('ID Google таблиц не настроены, пропускаем обновление');
      return;
    }

    const data = this.prepareDataForSheets(tariffs);
    console.log(`Подготовлены данные для ${this.sheetIds.length} Google таблиц`);

    for (const sheetId of this.sheetIds) {
      try {
        await this.updateSheet(sheetId, data);
        console.log(`Успешно обновлена таблица: ${sheetId}`);
      } catch (error: any) {
        console.error(`Ошибка обновления таблицы ${sheetId}:`, error.message);
      }
    }
  }

  private prepareDataForSheets(tariffs: DBTariff[]): any[][] {
    const headers = ['Дата', 'ID номенклатуры', 'Цена', 'Скидка %', 'Итоговая цена'];
    const rows = tariffs.map(tariff => [
      tariff.date,
      tariff.nm_id.toString(),
      tariff.price.toString(),
      `${tariff.discount}%`,
      tariff.final_price.toString()
    ]);

    return [headers, ...rows];
  }

  private async updateSheet(sheetId: string, data: any[][]): Promise<void> {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'stocks_coefs!A1:E' + (data.length + 10),
      valueInputOption: 'RAW',
      requestBody: {
        values: data
      }
    });
  }
}