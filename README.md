# MN Payment SDK

Энэхүү SDK нь Монгол улсын төлбөрийн системүүдтэй ажиллахад зориулагдсан.

## Суулгах

```bash
npm install mn-payment-sdk
```

## Ашиглах

### QPay

```typescript
import { QpayClient } from 'mn-payment-sdk';

const qpay = new QpayClient({
  endpoint: 'https://api.qpay.mn',
  username: 'your-username',
  password: 'your-password',
  callback: 'https://your-callback.url',
  invoiceCode: 'your-invoice-code',
  merchantId: 'your-merchant-id'
});

const invoice = await qpay.createInvoice({
  senderCode: 'sender',
  senderBranchCode: 'branch',
  receiverCode: 'receiver',
  description: 'Test payment',
  amount: 1000,
  callbackParam: { orderId: '123' }
});
```

### TdbCg

```typescript
import { TdbCgClient } from 'mn-payment-sdk';

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

const result = await tdb.createInvoice({
  amount: 1000,
  currency: 'MNT',
  description: 'Test payment',
  callbackUrl: 'https://your-callback.url',
  successUrl: 'https://your-success.url',
  failureUrl: 'https://your-failure.url'
});
```

### Tokipay

```typescript
import { TokipayClient } from 'mn-payment-sdk';

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

const result = await tokipay.paymentQr({
  orderId: 'order-123',
  amount: 1000,
  notes: 'Test payment'
});
```

### Upoint

```typescript
import { UpointClient } from 'mn-payment-sdk';

const upoint = new UpointClient({
  endpoint: 'https://api.upoint.mn',
  token: 'your-token'
});

const qr = await upoint.generateQr();
```
