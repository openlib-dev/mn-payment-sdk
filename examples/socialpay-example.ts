import { SocialPayClient } from '../src/socialpay/client';

const socialpay = new SocialPayClient({
  endpoint: 'https://api.socialpay.mn'
});

async function main() {
  const result = await socialpay.createInvoiceQr({
    amount: '1000',
    invoice: 'order-123',
    terminal: 'your-terminal',
    checksum: 'your-checksum'
  });
  console.log(result);
}

main().catch(console.error); 