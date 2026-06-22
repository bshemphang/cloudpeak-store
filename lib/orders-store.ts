import { promises as fs } from 'fs';
import path from 'path';
import { getSupabase, isSupabaseConfigured } from './supabase';
import type { Order } from '../types/order';

const ORDERS_PATH = path.join(process.cwd(), 'data', 'orders.json');

type OrderRow = {
  id: string;
  created_at: string;
  status: Order['status'];
  customer: Order['customer'];
  items: Order['items'];
  subtotal: number;
  prebook_amount: number;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    customer: row.customer,
    items: row.items,
    subtotal: Number(row.subtotal),
    prebookAmount: Number(row.prebook_amount),
  };
}

function orderToRow(order: Order): OrderRow {
  return {
    id: order.id,
    created_at: order.createdAt,
    status: order.status,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    prebook_amount: order.prebookAmount,
  };
}

async function readFileOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_PATH, 'utf-8');
    return JSON.parse(raw) as Order[];
  } catch {
    await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
    await fs.writeFile(ORDERS_PATH, '[]', 'utf-8');
    return [];
  }
}

async function writeFileOrders(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8');
}

async function getAllOrdersSupabase(): Promise<Order[]> {
  const supabase = getSupabase()!;
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as OrderRow[]).map(rowToOrder);
}

async function getOrderByIdSupabase(id: string): Promise<Order | null> {
  const supabase = getSupabase()!;
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToOrder(data as OrderRow) : null;
}

async function saveOrderSupabase(order: Order): Promise<void> {
  const supabase = getSupabase()!;
  const { error } = await supabase.from('orders').insert(orderToRow(order));
  if (error) throw new Error(error.message);
}

async function updateOrderStatusSupabase(id: string, status: Order['status']): Promise<Order | null> {
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToOrder(data as OrderRow) : null;
}

async function getOrdersByEmailSupabase(email: string): Promise<Order[]> {
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer->>email', email)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as OrderRow[]).map(rowToOrder);
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      return await getOrdersByEmailSupabase(email);
    } catch (err) {
      console.warn('Supabase error: getOrdersByEmail failed. Falling back to local file storage.', err);
    }
  }
  const orders = await readFileOrders();
  return orders.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase());
}

export async function getAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      return await getAllOrdersSupabase();
    } catch (err) {
      console.warn('Supabase error: getAllOrders failed. Falling back to local file storage.', err);
    }
  }
  return readFileOrders();
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    try {
      return await getOrderByIdSupabase(id);
    } catch (err) {
      console.warn('Supabase error: getOrderById failed. Falling back to local file storage.', err);
    }
  }
  const orders = await readFileOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function saveOrder(order: Order): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await saveOrderSupabase(order);
      return;
    } catch (err) {
      console.warn('Supabase error: saveOrder failed. Falling back to local file storage.', err);
    }
  }
  const orders = await readFileOrders();
  orders.unshift(order);
  await writeFileOrders(orders);
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    try {
      return await updateOrderStatusSupabase(id, status);
    } catch (err) {
      console.warn('Supabase error: updateOrderStatus failed. Falling back to local file storage.', err);
    }
  }
  const orders = await readFileOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], status };
  await writeFileOrders(orders);
  return orders[index];
}
