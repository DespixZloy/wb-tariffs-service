import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  wb: {
    token: process.env.WB_API_TOKEN!,
    tariffsUrl: process.env.WB_TARIFFS_URL!
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  googleSheets: {
    credentials: process.env.GOOGLE_SHEETS_CREDENTIALS ? 
      JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS) : {},
    sheetIds: process.env.GOOGLE_SHEETS_IDS ? 
      JSON.parse(process.env.GOOGLE_SHEETS_IDS) : []
  },
  app: {
    updateIntervalHours: parseInt(process.env.UPDATE_INTERVAL_HOURS || '1'),
    cleanupIntervalDays: parseInt(process.env.CLEANUP_INTERVAL_DAYS || '30')
  }
};