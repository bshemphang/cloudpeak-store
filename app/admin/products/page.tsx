'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLogin from '../../../components/admin/AdminLogin';
import AdminShell from '../../../components/admin/AdminShell';
import ProductForm from '../../../components/admin/ProductForm';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import { getProductPrimaryImage } from '../../../lib/product-utils';
import type { Product, ProductInput } from '../../../types/product';

const emptyForm: ProductInput = {
  name: '',
  price: 0,
  category: 'Men',
  isNew: false,
  inStock: true,
  images: [],
  colors: [{ name: 'Default', hex: '#0A1628', images: [''] }],
  description: '',
  details: '',
  sizes: ['S', 'M', 'L', 'XL'],
  buyLink: '',
  sizePrices: {},
};

function formFromProduct(p: Product): ProductInput {
  return {
    name: p.name,
    price: p.price,
    category: p.category,
    isNew: p.isNew,
    inStock: p.inStock,
    images: p.images,
    colors: p.colors.map((c) => ({
      ...c,
      images: c.images.length ? c.images : [''],
    })),
    description: p.description,
    details: p.details,
    sizes: p.sizes,
    buyLink: p.buyLink ?? '',
    sizePrices: p.sizePrices ?? {},
    slug: p.slug,
  };
}

export default function AdminProductsPage() {
  const { password, setPassword, authenticated, loading, error, login, getPassword, logout } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [storageMode, setStorageMode] = useState<'supabase' | 'file'>('file');
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.products) setProducts(data.products);
  }, []);

  const fetchStatus = useCallback(async (pwd: string) => {
    const res = await fetch('/api/admin/status', { headers: { 'x-admin-password': pwd } });
    if (res.ok) {
      const data = await res.json();
      setStorageMode(data.storageMode);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchProducts();
      fetchStatus(getPassword());
    }
  }, [authenticated, fetchProducts, fetchStatus, getPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(password);
    if (ok) fetchStatus(password);
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
      colors: form.colors.map((c) => ({
        name: c.name.trim(),
        hex: c.hex,
        images: c.images.map((s) => s.trim()).filter(Boolean),
      })).filter((c) => c.name && c.images.length > 0),
      images: [],
      sizes: form.sizes.filter(Boolean),
      price: Number(form.price),
    };

    if (!payload.colors.length) {
      setFormError('Add at least one color with images.');
      setSaving(false);
      return;
    }

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
    if (editingSlug === slug) resetForm();
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (!authenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        title="Cloudpeak Admin"
      />
    );
  }

  return (
    <AdminShell
      title="Upload Design"
      subtitle={`${products.length} designs in your catalogue`}
      storageMode={storageMode}
      onLogout={logout}
      actions={
        !showForm ? (
          <button
            type="button"
            onClick={() => { setShowForm(true); setForm(emptyForm); setEditingSlug(null); }}
            className="bg-midnightNavy text-summitGold px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight rounded-lg transition-colors"
          >
            + Upload Design
          </button>
        ) : null
      }
    >
      {storageMode === 'file' && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-900">
          <strong>Vercel tip:</strong> Connect Supabase so products persist on cloudpeak.in.
          Run <code className="bg-amber-100 px-1 rounded">supabase/schema.sql</code> and add{' '}
          <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> +{' '}
          <code className="bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel env vars.
        </div>
      )}

      <div className={`grid gap-8 ${showForm ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
        {showForm && (
          <ProductForm
            form={form}
            setForm={setForm}
            onSubmit={handleSave}
            onCancel={resetForm}
            saving={saving}
            error={formError}
            isEditing={!!editingSlug}
          />
        )}

        <div className="space-y-4">
          {!showForm && (
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search designs..."
              className="field-input max-w-sm"
            />
          )}

          {filtered.length === 0 ? (
            <div className="bg-storeWhite rounded-2xl border border-borderGray p-12 text-center">
              <p className="text-midnightNavy/50 font-bold uppercase tracking-widest text-sm">
                {search ? 'No designs match your search.' : "No designs uploaded yet. Click '+ Upload Design' to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className={`bg-storeWhite rounded-2xl border overflow-hidden transition-shadow hover:shadow-md ${
                    editingSlug === product.slug ? 'border-summitGold ring-2 ring-summitGold/20' : 'border-borderGray'
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-cardGray">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getProductPrimaryImage(product)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-summitGold text-midnightNavy text-[9px] font-black uppercase px-2 py-0.5">
                        NEW
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {product.colors.slice(0, 4).map((c) => (
                        <span
                          key={c.name}
                          title={c.name}
                          className="w-4 h-4 rounded-full border border-white/80 shadow-sm"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-midnightNavy truncate">{product.name}</p>
                    <p className="text-xs text-midnightNavy/50 mt-1">
                      {product.category} · ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-midnightNavy/40 mt-1">
                      {product.colors.length} color{product.colors.length !== 1 ? 's' : ''} ·{' '}
                      {product.colors.reduce((n, c) => n + c.images.length, 0)} images
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest bg-midnightNavy text-summitGold rounded-lg hover:bg-midnightNavyLight transition-colors"
                      >
                        Edit
                      </button>
                      <Link
                        href={`/shop/${product.slug}`}
                        target="_blank"
                        className="flex-1 py-2 text-center text-[10px] font-black uppercase tracking-widest border border-borderGray text-midnightNavy rounded-lg hover:border-summitGold transition-colors"
                      >
                        Preview
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.slug)}
                        className="px-3 py-2 text-[10px] font-bold uppercase text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
