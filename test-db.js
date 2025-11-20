const { Client } = require('pg');
require('dotenv').config();

console.log('Проверка подключения к PostgreSQL...');
console.log('Хост:', process.env.DB_HOST);
console.log('Порт:', process.env.DB_PORT);
console.log('База:', process.env.DB_NAME);
console.log('Пользователь:', process.env.DB_USER);

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Успешное подключение к PostgreSQL!');
    
    // Проверяем версию
    const versionResult = await client.query('SELECT version()');
    console.log('Версия PostgreSQL:', versionResult.rows[0].version.split(',')[0]);
    
    // Проверяем список таблиц
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Таблицы в базе:', tablesResult.rows.map(row => row.table_name));
    
    await client.end();
    console.log('✅ Тест завершен успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка подключения:');
    console.error('Сообщение:', error.message);
    
    if (error.code === '28P01') {
      console.error('❌ Неправильный логин/пароль');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ PostgreSQL не запущен');
    } else {
      console.error('Код ошибки:', error.code);
    }
  }
}

testConnection();