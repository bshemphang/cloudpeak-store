import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, adminAuthErrorMessage } from '../../../lib/admin-auth';
import { createProduct, getAllProducts } from '../../../lib/products-store';
import type { ProductInput } from '../../../types/product';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProductInput;
    if (!body.name?.trim()) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    if (!body.price || body.price < 0) return NextResponse.json({ error: 'Valid price is required.' }, { status: 400 });
    if (!body.images?.length) return NextResponse.json({ error: 'At least one image URL is required.' }, { status: 400 });

    const product = await createProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create product.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
