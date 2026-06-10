'use client';

import { PRODUCT_CATEGORIES, type ProductInput } from '../../types/product';
import ColorVariantEditor from './ColorVariantEditor';

type ProductFormProps = {
  form: ProductInput;
  setForm: (form: ProductInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
  isEditing: boolean;
};

export default function ProductForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  saving,
  error,
  isEditing,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-storeWhite rounded-2xl border border-borderGray shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-borderGray bg-midnightNavy/5 flex items-center justify-between">
        <h2 className="font-display text-xl text-midnightNavy uppercase tracking-wide">
          {isEditing ? 'Edit Product' : 'New Product'}
        </h2>
        <button type="button" onClick={onCancel} className="text-xs font-bold uppercase text-midnightNavy/40 hover:text-midnightNavy">
          Cancel
        </button>
      </div>

      <div className="p-6 space-y-8 max-h-[calc(100vh-12rem)] overflow-y-auto">
        <section className="space-y-4">
          <h3 className="admin-section-title">Basics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="field-label">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field-input"
                placeholder="Cloudpeak Graphic Tee"
              />
            </div>
            <div>
              <label className="field-label">Price (₹) *</label>
              <input
                required
                type="number"
                min={0}
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="field-input"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Supplier Buy Link (optional)</label>
              <input
                value={form.buyLink ?? ''}
                onChange={(e) => setForm({ ...form, buyLink: e.target.value })}
                className="field-input"
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <section>
          <ColorVariantEditor
            colors={form.colors}
            onChange={(colors) => setForm({ ...form, colors })}
          />
        </section>

        <section className="space-y-4">
          <h3 className="admin-section-title">Sizes</h3>
          <input
            required
            value={form.sizes.join(', ')}
            onChange={(e) =>
              setForm({ ...form, sizes: e.target.value.split(',').map((s) => s.trim()) })
            }
            className="field-input"
            placeholder="S, M, L, XL  or  UK 7, UK 8, UK 9"
          />
        </section>

        <section className="space-y-4">
          <h3 className="admin-section-title">Description</h3>
          <textarea
            required
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="field-input resize-none"
            placeholder="Short product description for the store page"
          />
          <textarea
            rows={4}
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="field-input resize-none"
            placeholder="Details — one per line&#10;100% cotton&#10;Machine wash cold"
          />
        </section>

        <section className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
              className="w-4 h-4 accent-summitGold"
            />
            <span className="text-sm font-bold text-midnightNavy">Show NEW badge</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="w-4 h-4 accent-summitGold"
            />
            <span className="text-sm font-bold text-midnightNavy">In stock</span>
          </label>
        </section>

        {error && (
          <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </p>
        )}
      </div>

      <div className="px-6 py-4 border-t border-borderGray bg-cardGray/30">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-midnightNavy text-summitGold px-10 py-3.5 text-sm font-black uppercase tracking-widest hover:bg-midnightNavyLight disabled:opacity-50 rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}
        </button>
      </div>
    </form>
  );
}
