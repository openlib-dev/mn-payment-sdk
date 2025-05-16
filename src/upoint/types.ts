export interface UpointConfig {
  endpoint: string;
  token: string;
}

export interface UpointCheckInfoRequest {
  card_number: string; // Card number registered in loyalty system
  mobile?: string; // User's phone number (optional)
  pin_code: string; // User's PIN code
}

export interface UpointCheckInfoResponse {
  card_status: number; // Status 1: Active card (No phone number) 2: New card (Phone number required) 3: Invalid card 4: Wrong card
  created_at: string; // User registration date
  ua_id: string; // User's unique ID
  card_number: string; // User's card number
  mobile: string; // User's phone number
  balance: number; // User's point balance
  result: number; // Error code
  message: string; // Error message
}

export interface UpointQrCheckInfoResponse {
  ua_id: string;
  mobile: string;
  message: string;
  balance: number;
  card_status: number;
  created_at: string;
  card_number: string;
  result: number;
}

export interface UpointBankRequest {
  bank_code: string; // Bank code
  non_cash_amount: number; // Non-cash payment amount
}

export interface UpointBankResponse {
  bank_code: string; // Bank code
  point: string; // Points given for this transaction
  non_cash_amount: string; // Non-cash payment amount
}

export interface UpointManufacturerRequest {
  manufacturer_code: string; // Manufacturer code
  manufacturer_amount: number; // Total amount of manufacturer's goods
}

export interface UpointManufacturerResponse {
  manufacturer_code: string; // Manufacturer code
  manufacturer_amount: string; // Total amount of manufacturer's goods
  point: string; // Total points from manufacturer
}

export interface UpointItemRequest {
  code: string; // Barcode or organization's internal code
  name: string; // Item name
  unit: string; // Unit of measurement
  quantity: number; // Quantity
  price: number; // Unit price
  total_price: number; // Total price
}

export interface UpointItemResponse {
  barcode: string; // Barcode or organization's internal code
  point: string; // Points given for this product
  qty: number; // Quantity
  unit_point: string; // Unit point
}

export interface UpointTransactionRequest {
  card_number: string; // U-Point card number
  inter_number?: string; // Unitel contract number
  mobile?: string; // User's phone number (required when new card is issued)
  date: string; // Bill date (YYYY/MM/DD HH:mm:ss)
  bill_number: string; // Bill number
  spend_amount: number; // Points to spend (can be 0)
  bonus_amount: number; // Points to generate (can be 0)
  total_amount: number; // Total amount (can be 0)
  cash_amount?: number; // Cash payment amount (can be 0)
  terminal_id?: string; // POS device unique ID
  bank?: UpointBankRequest[]; // Non-cash payment information (optional)
  manufacturer?: UpointManufacturerRequest[]; // Manufacturer and importer rewards (optional)
  items?: UpointItemRequest[]; // Rewarded product information list (optional)
}

export interface UpointTransactionResponse {
  receipt_id: string; // U-Point transaction ID
  date: string; // Bill date (YYYY/MM/DD HH:mm:ss)
  card_number: string; // U-Point card number
  point_balance: number; // User's point balance
  total_point: number; // Points generated from transaction
  merchant_point: number; // Points calculated from price
  manufacturer_items_point: number; // Points from manufacturer and importer
  spend_point: number; // Spent points amount
  bill_number: string; // Bill number
  bank: UpointBankResponse[]; // Points from banks for non-cash transactions
  items: UpointItemResponse[]; // List of sold product information
  manufacturer_point: number; // Reward points from manufacturer and importer
  manufacturer: UpointManufacturerResponse[]; // Manufacturer
  result: number; // Error code
  message: string; // Error message
  bank_point: number; // Points from bank
}

export interface UpointReturnTransactionRequest {
  receipt_id: string; // U-Point transaction ID
  refund_spend_amount: number; // Amount to refund from previously spent points
  refund_bonus_amount: number; // Amount to refund from previously added points
  refund_cash_amount?: number; // Amount received in cash for points that cannot be refunded
  terminal_id?: string; // POS device unique ID
  bank?: UpointBankRequest[]; // Bank information for non-cash transactions
  manufacturer?: UpointManufacturerRequest[]; // Manufacturer and importer rewards
  items?: UpointItemRequest[]; // List of sold product information
}

export interface UpointReturnTransactionResponse {
  invoice_uuid: string; // Invoice UUID
  receipt_id: string; // U-Point transaction ID
  return_receipt_id: number; // Return receipt ID
  manufacturer_amount: number; // Total amount of manufacturer's goods
  refund_spend_point: number; // Amount to refund from previously spent points
  refund_bonus_point: number; // Amount to refund from previously added points
  result: number; // Error code
  message: string; // Error message
  bill_number: string; // Bill number
  point_balance: number; // User's U-point balance
  item_amount: number; // Points from returned receipt's items
  bank_amount: number; // Points from returned receipt's bank
  bank: UpointBankResponse[]; // Bank information for non-cash transactions
  manufacturer: UpointManufacturerResponse[]; // Manufacturer and importer rewards
  items: UpointItemResponse[]; // List of sold product information
}

export interface UpointTransactionQrRequest {
  qr_string: string; // QR text
  date: string; // Bill date (YYYY/MM/DD HH:mm:ss)
  bill_number: string; // Bill number
  spend_amount: number; // Points to spend (can be 0)
  bonus_amount: number; // Points to generate (can be 0)
  total_amount: number; // Total amount (can be 0)
  cash_amount?: number; // Cash payment amount (can be 0)
  terminal_id?: string; // POS device unique ID
  bonus_point?: number;
  percent?: number;
  bank?: UpointBankRequest[]; // Non-cash payment information (optional)
  manufacturer?: UpointManufacturerRequest[]; // Manufacturer and importer rewards (optional)
  items?: UpointItemRequest[]; // Rewarded product information list (optional)
}

export interface UpointTransactionQrResponse {
  receipt_id: string; // U-Point transaction ID
  date: string; // Bill date (YYYY/MM/DD HH:mm:ss)
  card_number: string; // U-Point card number
  point_balance: number; // User's point balance
  total_point: number; // Points generated from transaction
  merchant_point: number; // Points calculated from price
  manufacturer_items_point: number; // Points from manufacturer and importer
  spend_point: number; // Spent points amount
  bill_number: string; // Bill number
  bank: UpointBankResponse[]; // Points from banks for non-cash transactions
  items: UpointItemResponse[]; // List of sold product information
  manufacturer_point: number; // Reward points from manufacturer and importer
  manufacturer: UpointManufacturerResponse[]; // Manufacturer
  result: number; // Error code
  message: string; // Error message
  bank_point: number; // Points from bank
}

export interface UpointCheckTransactionRequest {
  bill_number: string; // Organization's transaction number for card service
  terminal_id?: string; // POS device unique ID
}

export interface UpointCheckTransactionResponse {
  receipt_id: string; // U-Point transaction ID
  date: string; // Bill date (YYYY/MM/DD HH:mm:ss)
  card_number: string; // U-Point card number
  point_balance: number; // User's point balance
  total_point: number; // Points generated from transaction
  merchant_point: number; // Points calculated from price
  manufacturer_items_point: number; // Points from manufacturer and importer
  spend_point: number; // Spent points amount
  bill_number: string; // Bill number
  bank: UpointBankResponse[]; // Points from banks for non-cash transactions
  items: UpointItemResponse[]; // List of sold product information
  manufacturer_point: number; // Reward points from manufacturer and importer
  manufacturer: UpointManufacturerResponse[]; // Manufacturer
  result: number; // Error code
  message: string; // Error message
  bank_point: number; // Points from bank
}

export interface UpointProductRequest {
  username: string; // Manufacturer
  password: string; // Password
}

export interface UpointProductResponse {
  barcode: string; // Barcode or organization's internal code
}

export interface UpointCancelTransactionRequest {
  bill_number: string; // Bill number
  cash_amount?: number; // Cash payment amount (can be 0)
}

export interface UpointCancelTransactionResponse {
  receipt_id: string; // U-Point transaction ID
  return_receipt_id: number; // Return receipt ID
  bank: UpointBankResponse[]; // Bank information for non-cash transactions
  manufacturer: UpointManufacturerResponse[]; // Manufacturer and importer rewards
  items: UpointItemResponse[]; // List of sold product information
  manufacturer_point: number; // Total amount of manufacturer's goods
  refund_spend_point: number; // Amount to refund from previously spent points
  refund_bonus_amount: number; // Amount to refund from previously added points
  result: number; // Error code
  message: string; // Error message
  bill_number: string; // Bill number
  point_balance: number; // User's U-point balance
  item_amount: number; // Points from returned receipt's items
  bank_amount: number; // Points from returned receipt's bank
}

export interface UpointQrResponse {
  code: string;
  is_new: string;
  qr_string: string;
}

export interface UpointQrCheckResponse {
  status: string;
  card_number: string;
} 