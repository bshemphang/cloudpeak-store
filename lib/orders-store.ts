import { promises as fs } from 'fs';
import path from 'path';
import { getSupabase, isSupabaseConfigured } from './supabase';
import type { Order } from '../types/order';
import { withRetry } from './retry';
import { logger } from './logger';

const ORDERS_PATH = path.join(process.cwd(), 'data', 'orders.json');

function handleSupabaseError(error: any): never {
  throw new Error(
    `Supabase error [code: ${error.code || 'unknown'}]: ${error.message || 'No message'}. Details: ${error.details || 'None'}. Hint: ${error.hint || 'None'}`
  );
}

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
    try {
      await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
      await fs.writeFile(ORDERS_PATH, '[]', 'utf-8');
    } catch (e) {
      console.error('Failed to write fallback orders database file:', e);
    }
    return [];
  }
}

async function writeFileOrders(orders: Order[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
    await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save orders update to file:', e);
  }
}

async function getAllOrdersSupabase(): Promise<Order[]> {
  const supabase = getSupabase()!;
  const data = await withRetry(async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) handleSupabaseError(error);
    return data;
  });
  return (data as OrderRow[]).map(rowToOrder);
}

async function getOrderByIdSupabase(id: string): Promise<Order | null> {
  const supabase = getSupabase()!;
  const data = await withRetry(async () => {
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
    if (error) handleSupabaseError(error);
    return data;
  });
  return data ? rowToOrder(data as OrderRow) : null;
}

async function saveOrderSupabase(order: Order): Promise<void> {
  const supabase = getSupabase()!;
  await withRetry(async () => {
    const { error } = await supabase.from('orders').insert(orderToRow(order));
    if (error) handleSupabaseError(error);
  });
}

async function updateOrderStatusSupabase(
  id: string,
  status: Order['status'],
  payment?: any
): Promise<Order | null> {
  const supabase = getSupabase()!;
  const updateData: any = { status };

  if (payment) {
    const { data: current, error: fetchErr } = await supabase
      .from('orders')
      .select('customer')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr) handleSupabaseError(fetchErr);

    if (current && current.customer) {
      const existingPayment = current.customer.payment || {};
      updateData.customer = {
        ...current.customer,
        payment: {
          ...existingPayment,
          ...payment,
        },
      };
    }
  }

  const data = await withRetry(async () => {
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) handleSupabaseError(error);
    return data;
  });
  return data ? rowToOrder(data as OrderRow) : null;
}

async function getOrdersByEmailSupabase(email: string): Promise<Order[]> {
  const supabase = getSupabase()!;
  const data = await withRetry(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer->>email', email)
      .order('created_at', { ascending: false });
    if (error) handleSupabaseError(error);
    return data;
  });
  return (data as OrderRow[]).map(rowToOrder);
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      return await getOrdersByEmailSupabase(email);
    } catch (err) {
      logger.warn(`Supabase error: getOrdersByEmail failed for ${email}. Falling back to local file storage.`, err);
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
      logger.warn('Supabase error: getAllOrders failed. Falling back to local file storage.', err);
    }
  }
  return readFileOrders();
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    try {
      return await getOrderByIdSupabase(id);
    } catch (err) {
      logger.warn(`Supabase error: getOrderById failed for ${id}. Falling back to local file storage.`, err);
    }
  }
  const orders = await readFileOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function saveOrder(order: Order): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await saveOrderSupabase(order);
      logger.info(`Order saved to Supabase: ${order.id}`);
      return;
    } catch (err) {
      logger.error(`Supabase error: saveOrder failed for order: ${order.id}. Throwing error to avoid silent data loss.`, err);
      throw err;
    }
  }
  const orders = await readFileOrders();
  orders.unshift(order);
  await writeFileOrders(orders);
  logger.info(`Order saved to local file: ${order.id}`);
}

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
  payment?: any
): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    try {
      const order = await updateOrderStatusSupabase(id, status, payment);
      if (order) {
        logger.info(`Order status updated in Supabase: ${id} -> ${status}`);
      }
      return order;
    } catch (err) {
      logger.error(`Supabase error: updateOrderStatus failed for order: ${id}. Throwing error to avoid silent data loss.`, err);
      throw err;
    }
  }
  const orders = await readFileOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const existingPayment = orders[index].customer.payment || {};
  orders[index] = {
    ...orders[index],
    status,
    customer: {
      ...orders[index].customer,
      payment: payment ? { ...existingPayment, ...payment } : orders[index].customer.payment,
    },
  };

  await writeFileOrders(orders);
  logger.info(`Order status updated in local file: ${id} -> ${status}`);
  return orders[index];
}
