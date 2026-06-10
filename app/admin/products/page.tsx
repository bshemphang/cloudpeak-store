'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLogin from '../../../components/admin/AdminLogin';
import AdminNav from '../../../components/admin/AdminNav';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import { PRODUCT_CATEGORIES, type Product, type ProductInput } from '../../../types/product';

const emptyForm: ProductInput = {
  name: '',
  price: 0,
  category: 'Streetwear',
  isNew: false,
  inStock: true,
  images: [''],
  description: '',
  details: '',
  sizes: ['S', 'M', 'L', 'XL'],
  buyLink: '',
};

function formFromProduct(p: Product): ProductInput {
  return {
    name: p.name,
    price: p.price,
    category: p.category,
    isNew: p.isNew,
    inStock: p.inStock,
    images: p.images.length ? p.images : [''],
    description: p.description,
    details: p.details,
    sizes: p.sizes,
    buyLink: p.buyLink ?? '',
    slug: p.slug,
  };
}

export default function AdminProductsPage() {
  const { password, setPassword, authenticated, loading, error, login, getPassword } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.products) setProducts(data.products);
  }, []);

  useEffect(() => {
    if (authenticated) fetchProducts();
  }, [authenticated, fetchProducts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(password);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingSlug(null);
    setFormError('');
    setShowForm(false);
  };

  const startEdit = (product: Product) => {
    setForm(formFromProduct(product));
    setEditingSlug(product.slug);
    setShowForm(true);
    setFormError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    const pwd = getPassword();
    const payload: ProductInput = {
      ...form,
      images: form.images.map((s) => s.trim()).filter(Boolean),
      sizes: typeof form.sizes === 'string'
        ? (form.sizes as unknown as string).split(',').map((s) => s.trim()).filter(Boolean)
        : form.sizes,
      price: Number(form.price),
    };

    try {
      const url = editingSlug ? `/api/products/${editingSlug}` : '/api/products';
      const method = editingSlug ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pwd },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? 'Failed to save product');
        return;
      }
      await fetchProducts();
      resetForm();
    } catch {
      setFormError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const pwd = getPassword();
    await fetch(`/api/products/${slug}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': pwd },
    });
    fetchProducts();
  };

  if (!authenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        title="Products Admin"
      />
    );
  }

  return (
    <div className="bg-cardGray min-h-screen pb-16">
      <header className="bg-midnightNavy text-storeWhite px-4 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-summitGold uppercase tracking-wide">
              Product Manager
            </h1>
            <p className="text-storeWhite/50 text-sm mt-1">{products.length} products · No code changes needed</p>
          </div>
          <div className="flex items-center gap-4">
            <AdminNav />
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-summitGold/70 hover:text-summitGold">
              Store →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {!showForm ? (
          <button
            type="button"
            onClick={() => { setShowForm(true); setForm(emptyForm); setEditingSlug(null); }}
            className="bg-midnightNavy text-summitGold px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors"
          >
            + Add New Product
          </button>
        ) : (
          <form onSubmit={handleSave} className="bg-storeWhite border border-borderGray p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-midnightNavy uppercase tracking-wide">
                {editingSlug ? 'Edit Product' : 'New Product'}
              </h2>
              <button type="button" onClick={resetForm} className="text-xs font-bold uppercase text-midnightNavy/50 hover:text-midnightNavy">
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Product Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field-input" />
              </div>
              <div>
                <label className="field-label">Price (₹) *</label>
                <input required type="number" min={0} value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="field-input" />
              </div>
              <div>
                <label className="field-label">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="field-input">
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Buy Link (optional)</label>
                <input value={form.buyLink ?? ''} onChange={(e) => setForm({ ...form, buyLink: e.target.value })} className="field-input" placeholder="https://supplier-link.com/..." />
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Image URLs * (one per line)</label>
                <textarea
                  required
                  rows={3}
                  value={form.images.join('\n')}
                  onChange={(e) => setForm({ ...form, images: e.target.value.split('\n') })}
                  className="field-input resize-none"
                  placeholder="https://images.unsplash.com/photo-...&#10;https://second-image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Sizes * (comma separated)</label>
                <input
                  required
                  value={Array.isArray(form.sizes) ? form.sizes.join(', ') : form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value.split(',').map((s) => s.trim()) })}
                  className="field-input"
                  placeholder="S, M, L, XL or UK 7, UK 8, UK 9"
                />
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Short Description *</label>
                <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="field-input resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Details (one line per bullet)</label>
                <textarea rows={4} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="field-input resize-none" placeholder="100% cotton&#10;Machine wash cold&#10;Oversized fit" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-bold text-midnightNavy cursor-pointer">
                  <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="accent-summitGold" />
                  Mark as NEW
                </label>
                <label className="flex items-center gap-2 text-sm font-bold text-midnightNavy cursor-pointer">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="accent-summitGold" />
                  In Stock
                </label>
              </div>
            </div>

            {formError && <p className="text-sm text-red-600 font-medium">{formError}</p>}

            <button type="submit" disabled={saving} className="bg-midnightNavy text-summitGold px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight disabled:opacity-50">
              {saving ? 'Saving...' : editingSlug ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        )}

        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="bg-storeWhite border border-borderGray p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0]} alt="" className="w-16 h-20 object-cover bg-cardGray shrink-0" />
              <div className="flex-grow min-w-0">
                <p className="font-bold text-midnightNavy truncate">{product.name}</p>
                <p className="text-xs text-midnightNavy/50 mt-0.5">
                  {product.category} · ₹{product.price.toLocaleString('en-IN')} · {product.sizes.join(', ')}
                </p>
                <Link href={`/shop/${product.slug}`} target="_blank" className="text-xs text-summitGoldDark font-bold hover:underline mt-1 inline-block">
                  View on store →
                </Link>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(product)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-midnightNavy text-midnightNavy hover:bg-midnightNavy hover:text-summitGold transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(product.slug)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
