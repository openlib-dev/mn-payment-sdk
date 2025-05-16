import { HipayClient } from '../src/hipay/client';

const hipay = new HipayClient({
  endpoint: 'https://api.hipay.mn',
  token: 'your-token',
  entityId: 'your-entity-id'
});

async function main() {
  const result = await hipay.checkout(1000);
  console.log(result);
}

main().catch(console.error); 