import { MonpayClient } from '../src/monpay/client';

const monpay = new MonpayClient({
  endpoint: 'https://api.monpay.mn',
  username: 'your-username',
  accountId: 'your-account-id',
  callbackUrl: 'https://your-callback.url',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

async function main() {
  const result = await monpay.generateQr({
    amount: 1000,
    branchId: 'branch-1',
    products: [
      {
        name: 'Product 1',
        quantity: 1,
        price: 1000
      }
    ],
    title: 'Test QR',
    subTitle: 'Test subtitle',
    referenceNumber: 'ref-123',
    expireTime: 3600
  });
  console.log(result);
}

main().catch(console.error); 