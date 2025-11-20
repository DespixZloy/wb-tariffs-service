import axios from 'axios';
import { config } from '../config';
import { WBTariff } from '../types';

interface WBAPIResponse {
  response: {
    data: {
      dtNextBox: string;
      dtTillMax: string;
      warehouseList: WarehouseTariff[];
    };
  };
}

interface WarehouseTariff {
  boxDeliveryBase: string;
  boxDeliveryCoefExpr: string;
  boxDeliveryLiter: string;
  boxDeliveryMarketplaceBase: string;
  boxDeliveryMarketplaceCoefExpr: string;
  boxDeliveryMarketplaceLiter: string;
  boxStorageBase: string;
  boxStorageCoefExpr: string;
  boxStorageLiter: string;
  geoName: string;
  warehouseName: string;
}

export class WBService {
  private readonly apiToken: string;
  private readonly baseURL: string;

  constructor() {
    this.apiToken = config.wb.token;
    this.baseURL = config.wb.tariffsUrl;
  }

  async getTariffs(date?: string): Promise<WBTariff[]> {
    try {
      const queryDate = date || new Date().toISOString().split('T')[0];
      
      console.log(`Получение тарифов из WB API за дату: ${queryDate}`);
      
      const response = await axios.get<WBAPIResponse>(this.baseURL, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          date: queryDate
        },
        timeout: 10000
      });

      const warehouseList = response.data.response.data.warehouseList || [];
      const tariffs = this.transformTariffs(warehouseList);
      
      console.log(`Успешно получено ${warehouseList.length} тарифов складов`);
      console.log(`Преобразовано в ${tariffs.length} записей тарифов`);
      
      return tariffs;
    } catch (error: any) {
      console.error('Ошибка получения тарифов WB:', error.message);
      if (error.response) {
        console.error('Статус ответа:', error.response.status);
        console.error('Данные ответа:', error.response.data);
      }
      throw error;
    }
  }

  private transformTariffs(warehouseList: WarehouseTariff[]): WBTariff[] {
    const tariffs: WBTariff[] = [];
    let idCounter = 1;

    for (const warehouse of warehouseList) {
      const parseNumber = (str: string): number => {
        if (!str || str === '-' || str.trim() === '') return 0;
        return parseFloat(str.replace(',', '.'));
      };

      if (warehouse.boxDeliveryBase && warehouse.boxDeliveryBase !== '-') {
        tariffs.push({
          nmId: idCounter++,
          price: parseNumber(warehouse.boxDeliveryBase),
          discount: parseNumber(warehouse.boxDeliveryCoefExpr)
        });
      }

      if (warehouse.boxDeliveryMarketplaceBase && warehouse.boxDeliveryMarketplaceBase !== '-') {
        tariffs.push({
          nmId: idCounter++,
          price: parseNumber(warehouse.boxDeliveryMarketplaceBase),
          discount: parseNumber(warehouse.boxDeliveryMarketplaceCoefExpr)
        });
      }

      if (warehouse.boxStorageBase && warehouse.boxStorageBase !== '-') {
        tariffs.push({
          nmId: idCounter++,
          price: parseNumber(warehouse.boxStorageBase),
          discount: parseNumber(warehouse.boxStorageCoefExpr)
        });
      }
    }

    return tariffs;
  }
}