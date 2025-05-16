import { PassClient } from '../src/pass/client';

const pass = new PassClient({
  endpoint: 'https://api.pass.mn',
  ecommerceToken: 'your-ecommerce-token',
  callback: 'https://your-callback.url'
});

async function main() {
  const result = await pass.createOrder(1000, { orderId: 'order-123' });
  console.log(result);
}

main().catch(console.error); 