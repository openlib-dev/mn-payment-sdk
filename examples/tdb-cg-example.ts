import { TdbCgClient } from '../src/tdb-cg/client';

const tdb = new TdbCgClient({
  endpoint: 'https://api.tdb.mn',
  loginId: 'your-login-id',
  clientSecret: 'your-client-secret',
  password: 'your-password',
  certPass: 'your-cert-pass',
  certPathPfx: 'path/to/cert.pfx',
  certPathCer: 'path/to/cert.cer',
  anyBic: 'your-any-bic',
  roleId: 'your-role-id'
});

async function main() {
  const result = await tdb.createInvoice({
    amount: 1000,
    currency: 'MNT',
    description: 'Test payment',
    callbackUrl: 'https://your-callback.url',
    successUrl: 'https://your-success.url',
    failureUrl: 'https://your-failure.url'
  });
  console.log(result);
}

main().catch(console.error); 