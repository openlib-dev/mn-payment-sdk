import { EbarimtClient } from '../src/ebarimt/client';
import { EbarimtBillType } from '../src/ebarimt/constants';

const ebarimt = new EbarimtClient({
  endpoint: 'https://api.ebarimt.mn'
});

async function main() {
  const result = await ebarimt.getNewEbarimt({
    customerNo: 'customer-123',
    branchNo: '001',
    billIdSuffix: 'suffix-123',
    billType: EbarimtBillType.Organization,
    districtCode: '34',
    stocks: [
      {
        code: 'item-1',
        name: 'Item 1',
        measureUnit: 'unit',
        qty: 1,
        unitPrice: 1000,
        cityTax: 50,
        vat: 150,
        barCode: '123456789'
      }
    ]
  });
  console.log(result);
}

main().catch(console.error); 