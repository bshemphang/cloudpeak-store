import { useRef, useState } from 'react';
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    setUploadError('');
    try {
      const uploadedUrls: string[] = [];
      const adminPwd = sessionStorage.getItem('cloudpeak-admin-pwd') ?? '';

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'x-admin-password': adminPwd,
          },
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error ?? 'Upload failed.');
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      // Update form colors & images
      const updatedColors = [...form.colors];
      if (updatedColors.length === 0) {
        updatedColors.push({ name: 'Default', hex: '#0A1628', images: [] });
      }
      
      const existingImages = updatedColors[0].images.filter(Boolean);
      updatedColors[0].images = [...existingImages, ...uploadedUrls];

      setForm({
        ...form,
        colors: updatedColors,
        images: [...(form.images || []).filter(Boolean), ...uploadedUrls],
      });
    } catch (err: any) {
      setUploadError(err.message ?? 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedColors = [...form.colors];
    if (updatedColors.length > 0) {
      updatedColors[0].images = updatedColors[0].images.filter((_, idx) => idx !== indexToRemove);
    }
    
    setForm({
      ...form,
      colors: updatedColors,
      images: (form.images || []).filter((_, idx) => idx !== indexToRemove),
    });
  };

  // Map status: Active is inStock = true, Draft is inStock = false
  const status = form.inStock ? 'active' : 'draft';
  const handleStatusChange = (val: string) => {
    setForm({ ...form, inStock: val === 'active' });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
      {/* ─── Header Action Row ─── */}
      <div className="flex items-center justify-between pb-4 border-b border-borderGray">
        <div>
          <h2 className="font-display text-2xl text-midnightNavy uppercase tracking-wide">
            {isEditing ? 'Edit Product' : 'Add product'}
          </h2>
          <p className="text-xs text-midnightNavy/50 mt-1 font-semibold">
            {isEditing ? `Modifying ${form.name || 'product'}` : 'Create a new release'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-borderGray text-midnightNavy font-bold uppercase tracking-wider text-[10px] rounded-lg bg-storeWhite hover:bg-cardGray/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-midnightNavy text-summitGold px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-midnightNavyLight disabled:opacity-50 rounded-lg transition-colors shadow-sm"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 font-bold bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* ─── Two-Column Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) - Title, Description, Media, Variants */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Title & Description */}
          <div className="bg-storeWhite border border-borderGray rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <label className="field-label">Title</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field-input rounded-lg"
                placeholder="Short sleeve t-shirt"
              />
            </div>

            <div>
              <label className="field-label">Description</label>
              <div className="border border-borderGray rounded-lg overflow-hidden">
                {/* Mock Rich Text Editor Toolbar */}
                <div className="bg-cardGray/50 border-b border-borderGray px-3 py-2 flex flex-wrap gap-2 text-midnightNavy/60">
                  <button type="button" className="p-1 hover:bg-borderGray rounded font-bold text-xs" title="Paragraph">Paragraph ▾</button>
                  <span className="text-borderGray">|</span>
                  <button type="button" className="p-1 hover:bg-borderGray rounded font-black text-xs" title="Bold">B</button>
                  <button type="button" className="p-1 hover:bg-borderGray rounded italic text-xs" title="Italic">I</button>
                  <button type="button" className="p-1 hover:bg-borderGray rounded underline text-xs" title="Underline">U</button>
                  <span className="text-borderGray">|</span>
                  <button type="button" className="p-1 hover:bg-borderGray rounded text-xs" title="Link">🔗</button>
                  <button type="button" className="p-1 hover:bg-borderGray rounded text-xs" title="Image">🖼️</button>
                  <button type="button" className="p-1 hover:bg-borderGray rounded text-xs" title="Video">🎥</button>
                  <button type="button" className="p-1 hover:bg-borderGray rounded text-xs" title="Table">▦</button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-4 text-sm outline-none resize-none bg-storeWhite min-h-[120px]"
                  placeholder="Tell customers about the design, fit, and aesthetic..."
                />
              </div>
            </div>

            {/* Extra Technical Details */}
            <div>
              <label className="field-label">Technical Details (one item per line)</label>
              <textarea
                rows={3}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className="field-input rounded-lg font-mono text-xs"
                placeholder="100% heavy cotton&#10;Screen-printed front graphic&#10;Made in India"
              />
            </div>
          </div>

          {/* Card: Media & Color Variants */}
          <div className="bg-storeWhite border border-borderGray rounded-2xl p-5 shadow-sm space-y-6">
            <div>
              <label className="field-label font-bold uppercase tracking-wider text-xs text-midnightNavy/60 mb-2 block">Media (Design Images)</label>
              
              {/* Image Grid Preview */}
              {form.colors && form.colors[0] && form.colors[0].images.filter(Boolean).length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                  {form.colors[0].images.filter(Boolean).map((imgUrl, index) => (
                    <div key={`${imgUrl}-${index}`} className="relative aspect-[3/4] bg-cardGray rounded-xl overflow-hidden border border-borderGray group shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt="Design thumbnail" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1.5 right-1.5 bg-[#1e1e1e]/80 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black transition-all shadow shadow-black/20 select-none cursor-pointer"
                        title="Remove design"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Box */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
                id="design-file-upload-input"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-borderGray rounded-2xl p-8 text-center hover:border-summitGold transition-colors cursor-pointer bg-cardGray/20 flex flex-col items-center justify-center min-h-[140px]"
              >
                {uploading ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="w-8 h-8 rounded-full border-4 border-summitGold border-t-transparent animate-spin" />
                    <p className="text-xs font-bold text-midnightNavy">Uploading design image...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 text-midnightNavy/40 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="bg-summitGold text-midnightNavy text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-lg shadow-sm hover:bg-summitGoldDark transition-colors">
                      📤 Upload Design from Device
                    </span>
                    <p className="text-[10px] text-midnightNavy/45 mt-2.5 font-semibold">Works on Desktop & Mobile (JPEG, PNG)</p>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-xs text-red-600 font-bold mt-2 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                  {uploadError}
                </p>
              )}
            </div>

            {/* Color variants and URL fields */}
            <div className="border-t border-borderGray/60 pt-6">
              <ColorVariantEditor
                colors={form.colors}
                onChange={(colors) => setForm({ ...form, colors })}
              />
            </div>
          </div>

          {/* Card: Pricing & Sizes */}
          <div className="bg-storeWhite border border-borderGray rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50 pb-2 border-b border-borderGray/65">
              Pricing & Sizes
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Base Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-xs font-bold text-midnightNavy/40">₹</span>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="field-input rounded-lg pl-8"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Available Sizes (comma separated) *</label>
                <input
                  required
                  value={form.sizes.join(', ')}
                  onChange={(e) => {
                    const newSizes = e.target.value.split(',').map((s) => s.trim());
                    const cleanPrices: Record<string, number> = {};
                    newSizes.forEach(s => {
                      if (form.sizePrices && form.sizePrices[s]) {
                        cleanPrices[s] = form.sizePrices[s];
                      }
                    });
                    setForm({ ...form, sizes: newSizes, sizePrices: cleanPrices });
                  }}
                  className="field-input rounded-lg"
                  placeholder="S, M, L, XL"
                />
              </div>
            </div>

            {form.sizes.filter(Boolean).length > 0 && (
              <div className="border-t border-borderGray/60 pt-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-midnightNavy">Size-Specific Prices (Optional)</h4>
                  <p className="text-[10px] text-midnightNavy/50">Leave empty to use Base Price (₹{form.price || 0}).</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {form.sizes.filter(Boolean).map((size) => {
                    const priceVal = form.sizePrices?.[size] ?? '';
                    return (
                      <div key={size} className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-midnightNavy/70">{size} Price</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 text-[10px] font-bold text-midnightNavy/40">₹</span>
                          <input
                            type="number"
                            min={0}
                            value={priceVal}
                            onChange={(e) => {
                              const val = e.target.value === '' ? undefined : Number(e.target.value);
                              const updatedPrices = { ...(form.sizePrices || {}) };
                              if (val === undefined) {
                                delete updatedPrices[size];
                              } else {
                                updatedPrices[size] = val;
                              }
                              setForm({ ...form, sizePrices: updatedPrices });
                            }}
                            className="w-full border border-borderGray px-2 py-1.5 pl-6 text-xs outline-none focus:border-summitGold transition-colors rounded-md"
                            placeholder={form.price ? form.price.toString() : '0'}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width) - Status, Org, Theme */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card: Status */}
          <div className="bg-storeWhite border border-borderGray rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50 pb-2 border-b border-borderGray/65">
              Status
            </h3>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="field-input rounded-lg"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
            <p className="text-[10px] text-midnightNavy/50 font-semibold leading-relaxed">
              Active products are shown on the storefront catalog. Draft products are hidden.
            </p>
          </div>

          {/* Card: Publishing */}
          <div className="bg-storeWhite border border-borderGray rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-borderGray/65">
              <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50">
                Publishing
              </h3>
              <span className="text-[9px] font-black uppercase text-summitGoldDark">Managed</span>
            </div>
            <div className="space-y-2 text-xs font-bold text-midnightNavy/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Online Store</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>WhatsApp Catalog</span>
              </div>
            </div>
          </div>

          {/* Card: Product Organization */}
          <div className="bg-storeWhite border border-borderGray rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50 pb-2 border-b border-borderGray/65">
              Product organization
            </h3>

            <div>
              <label className="field-label">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="field-input rounded-lg"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Vendor / Buy Link</label>
              <input
                value={form.buyLink ?? ''}
                onChange={(e) => setForm({ ...form, buyLink: e.target.value })}
                className="field-input rounded-lg"
                placeholder="https://original-vendor.com/product"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isNew}
                  onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                  className="w-4 h-4 rounded border-borderGray accent-summitGold"
                />
                <span className="text-xs font-bold text-midnightNavy">Apply &quot;NEW DROP&quot; Badge</span>
              </label>
            </div>
          </div>

          {/* Card: Theme Template */}
          <div className="bg-storeWhite border border-borderGray rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50 pb-2 border-b border-borderGray/65">
              Theme template
            </h3>
            <select className="field-input rounded-lg" disabled>
              <option>Default product</option>
            </select>
            <span className="text-[9px] text-midnightNavy/40 font-bold block uppercase tracking-wider">Template layout is default</span>
          </div>
        </div>
      </div>
    </form>
  );
}
