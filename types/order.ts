export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
};

export type CustomerDetails = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
};

export type OrderStatus = 'pending_prebook' | 'prebook_paid' | 'confirmed' | 'cancelled';

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  prebookAmount: number;
};

export type CreateOrderPayload = {
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
};
