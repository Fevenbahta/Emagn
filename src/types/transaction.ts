// export interface Transaction {
//   id: string;
//   title: string;
//   created: string;
//   amount: string;
//   role: string;
//   status: string;
//   // Optional: include other fields if your API returns them
//   item_name?: string;
//   item_description?: string;
//   currency?: string;
//   inspection_period?: string;
//   seller_email?: string;
//   buyer_email?: string;
//   attributes?: { attribute_id: string; value: string }[];
// }

// export interface Transaction {
//   id: string;
//   title: string;
//   role: string;
//   status: string;
//   currency: string;
//   price: string;
//   inspection_period: string;
//   item_catagory_id: string;
//   item_name: string;
//   item_description: string;
//   shipping_method: string;
//   seller_email: string;
//   seller_phone: string;
//   buyer_email: string;
//   buyer_phone: string;
//   created_at: string;
//   updated_at: string;
//   attributes: Array<{
//     id: string;
//     attribute_id: string;
//     value: string;
//   }>;
// }


// types/transaction.ts
export interface Transaction {
  id: string;
  title: string;
  role: 'Buyer' | 'Seller' | 'Broker';
  currency: string;
  inspection_period: string;
  item_catagory_id: string;
  item_name: string;
  item_description: string;
  price: string;
  shipping_method: string;
  seller_email: string;
  seller_phone: string;
  buyer_email: string;
  buyer_phone: string;
  status: 'open' | 'pending' | 'shipped' | 'action-required' | 'closed';
  created_at?: string;
  updated_at?: string;
}

export interface TransactionAttribute {
  attribute_id: string;
  value: string;
}

export interface TransactionWithAttributes extends Transaction {
  attributes?: TransactionAttribute[];
}

export interface CreateTransactionPayload {
  title: string;
  role: 'Buyer' | 'Seller' | 'Broker';
  currency: string;
  inspection_period: string;
  item_catagory_id: string;
  item_name: string;
  item_description: string;
  price: string;
  shipping_method: string;
  seller_email: string;
  seller_phone: string;
  buyer_email: string;
  buyer_phone: string;
  attributes?: TransactionAttribute[];
}

export interface UpdateTransactionPayload {
  title?: string;
  status?: string;
  shipping_method?: string;
  // Add other fields as needed
}