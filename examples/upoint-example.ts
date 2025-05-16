import { UpointClient } from '../src/upoint/client';

const upoint = new UpointClient({
  endpoint: 'https://api.upoint.mn',
  token: 'your-token'
});

async function main() {
  const qr = await upoint.generateQr();
  console.log(qr);
}

main().catch(console.error); 