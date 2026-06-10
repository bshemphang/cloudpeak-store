import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, adminAuthErrorMessage } from '../../../../lib/admin-auth';
import { deleteProduct, getProductBySlug, updateProduct } from '../../../../lib/products-store';
import type { ProductInput } from '../../../../types/product';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  const { slug } = await params;
  try {
    const body = (await request.json()) as ProductInput;
    const product = await updateProduct(slug, body);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update product.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  const { slug } = await params;
  try {
    const deleted = await deleteProduct(slug);
    if (!deleted) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}
