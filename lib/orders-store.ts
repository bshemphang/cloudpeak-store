import { promises as fs } from 'fs';
import path from 'path';
import type { Order } from '../types/order';

const ORDERS_PATH = path.join(process.cwd(), 'data', 'orders.json');

async function ensureDataFile(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_PATH, 'utf-8');
    return JSON.parse(raw) as Order[];
  } catch {
    await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
    await fs.writeFile(ORDERS_PATH, '[]', 'utf-8');
    return [];
  }
}

export async function getAllOrders(): Promise<Order[]> {
  return ensureDataFile();
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getAllOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await ensureDataFile();
  orders.unshift(order);
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8');
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const orders = await ensureDataFile();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], status };
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8');
  return orders[index];
}
