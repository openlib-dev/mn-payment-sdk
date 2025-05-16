import { MongolchatClient } from '../src/mongolchat/client';

const mongolchat = new MongolchatClient({
  endpoint: 'https://api.mongolchat.mn',
  apiKey: 'your-api-key',
  workerKey: 'your-worker-key',
  appSecret: 'your-app-secret',
  branchNo: 'your-branch-no'
});

async function main() {
  const qr = await mongolchat.generateQR({
    amount: 1000,
    branchId: 'branch-1',
    products: [],
    title: 'Test',
    subTitle: 'Test subtitle',
    noat: '',
    nhat: '',
    ttd: '',
    referenceNumber: 'ref-123',
    expireTime: '2024-12-31T23:59:59Z'
  });
  console.log(qr);
}

main().catch(console.error); 