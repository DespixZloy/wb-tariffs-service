export interface WBTariff {
  nmId: number;
  price: number;
  discount: number;
}

export interface DBTariff {
  id?: number;
  date: string;
  nm_id: number;
  price: number;
  discount: number;
  final_price: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface GoogleSheetsConfig {
  credentials: any;
  sheetIds: string[];
}