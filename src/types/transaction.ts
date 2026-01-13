export interface Transaction {
  id: string;
  title: string;
  created: string;
  amount: string;
  role: string;
  status: string;
  // Optional: include other fields if your API returns them
  item_name?: string;
  item_description?: string;
  currency?: string;
  inspection_period?: string;
  seller_email?: string;
  buyer_email?: string;
  attributes?: { attribute_id: string; value: string }[];
}
