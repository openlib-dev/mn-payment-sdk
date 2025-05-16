import { TokipayClient } from '../src/tokipay/client';

const tokipay = new TokipayClient({
  endpoint: 'https://api.tokipay.mn',
  apiKey: 'your-api-key',
  imApiKey: 'your-im-api-key',
  authorization: 'your-authorization',
  merchantId: 'your-merchant-id',
  successUrl: 'https://your-success.url',
  failureUrl: 'https://your-failure.url',
  appSchemaIos: 'your-app-schema-ios'
});

async function main() {
  const result = await tokipay.paymentQr({
    orderId: 'order-123',
    amount: 1000,
    notes: 'Test payment'
  });
  console.log(result);
}

main().catch(console.error); 