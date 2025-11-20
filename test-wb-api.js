const axios = require('axios');
require('dotenv').config();

const WB_API_TOKEN = process.env.WB_API_TOKEN;
const today = new Date().toISOString().split('T')[0];

async function testWBAPI() {
  console.log('=== Тестирование WB API ===');
  console.log('Токен:', WB_API_TOKEN ? '✅ присутствует' : '❌ отсутствует');
  console.log('Дата запроса:', today);
  console.log('URL: https://common-api.wildberries.ru/api/v1/tariffs/box');
  
  try {
    const response = await axios.get('https://common-api.wildberries.ru/api/v1/tariffs/box', {
      headers: {
        'Authorization': `Bearer ${WB_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      params: {
        date: today
      },
      timeout: 10000
    });

    console.log('\n✅ Запрос успешен!');
    console.log('Статус:', response.status);
    console.log('Данные:', JSON.stringify(response.data, null, 2));
    console.log('Количество тарифов:', response.data.data?.length || 0);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\nПример тарифа:');
      console.log(response.data.data[0]);
    }
    
  } catch (error) {
    console.log('\n❌ Ошибка запроса:');
    console.log('Сообщение:', error.message);
    
    if (error.response) {
      console.log('Статус:', error.response.status);
      console.log('Данные ошибки:', error.response.data);
    }
  }
}

testWBAPI();