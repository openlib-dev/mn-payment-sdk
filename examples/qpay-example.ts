import { QpayClient } from '../src/qpay/client';

const qpay = new QpayClient({
  endpoint: 'https://api.qpay.mn',
  username: 'your-username',
  password: 'your-password',
  callback: 'https://your-callback.url',
  invoiceCode: 'your-invoice-code',
  merchantId: 'your-merchant-id'
});

async function main() {
  const invoice = await qpay.createInvoice({
    senderCode: 'sender',
    senderBranchCode: 'branch',
    receiverCode: 'receiver',
    description: 'Test payment',
    amount: 1000,
    callbackParam: { orderId: '123' }
  });
  console.log(invoice);
}

main().catch(console.error); 