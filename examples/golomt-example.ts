import { GolomtClient } from '../src/golomt/client';

const golomt = new GolomtClient({
  endpoint: 'https://api.golomt.mn',
  secret: 'your-secret',
  bearerToken: 'your-bearer-token'
});

async function main() {
  const result = await golomt.createInvoice({
    amount: 1000,
    transactionId: 'transaction-123',
    returnType: 'POST',
    callback: 'https://your-callback.url',
    getToken: true,
    socialDeeplink: false
  });
  console.log(result);
}

main().catch(console.error); 