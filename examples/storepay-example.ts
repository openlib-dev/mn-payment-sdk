import { StorepayClient } from '../src/storepay/client';

const storepay = new StorepayClient({
  appUsername: 'your-app-username',
  appPassword: 'your-app-password',
  username: 'your-username',
  password: 'your-password',
  authUrl: 'https://api.storepay.mn/auth',
  baseUrl: 'https://api.storepay.mn',
  storeId: 'your-store-id',
  callbackUrl: 'https://your-callback.url'
});

async function main() {
  const loan = await storepay.loan({
    mobileNumber: '99999999',
    description: 'Test loan',
    amount: 1000
  });
  console.log(loan);
}

main().catch(console.error); 