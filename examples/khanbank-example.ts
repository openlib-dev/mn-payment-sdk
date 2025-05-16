import { KhanClient } from '../src/khanbank/client';

const Khan = new KhanClient({
  endpoint: 'https://api.Khan.mn',
  username: 'your-username',
  password: 'your-password',
  language: 'en'
});

async function main() {
  const order = await Khan.registerOrder({
    orderNumber: 'order-123',
    amount: 1000,
    successCallback: 'https://your-success.url',
    failCallback: 'https://your-fail.url'
  });
  console.log(order);
}

main().catch(console.error); 