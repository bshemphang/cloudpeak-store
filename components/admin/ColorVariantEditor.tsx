'use client';

import type { ProductColor } from '../../types/product';

type ColorVariantEditorProps = {
  colors: ProductColor[];
  onChange: (colors: ProductColor[]) => void;
};

export default function ColorVariantEditor({ colors, onChange }: ColorVariantEditorProps) {
  const updateColor = (index: number, patch: Partial<ProductColor>) => {
    onChange(colors.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const addColor = () => {
    onChange([...colors, { name: '', hex: '#0A1628', images: [''] }]);
  };

  const removeColor = (index: number) => {
    if (colors.length <= 1) return;
    onChange(colors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-midnightNavy">Color Variants</h3>
          <p className="text-xs text-midnightNavy/50 mt-0.5">Each color has its own gallery angles</p>
        </div>
        <button
          type="button"
          onClick={addColor}
          className="text-xs font-bold uppercase tracking-widest text-summitGoldDark hover:text-midnightNavy border border-summitGold/40 px-3 py-1.5 rounded-md"
        >
          + Add Color
        </button>
      </div>

      {colors.map((color, ci) => (
        <div key={ci} className="bg-cardGray/60 border border-borderGray rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(ci, { hex: e.target.value })}
                className="w-10 h-10 rounded-lg border border-borderGray cursor-pointer shrink-0"
                title="Color swatch"
              />
              <input
                value={color.name}
                onChange={(e) => updateColor(ci, { name: e.target.value })}
                placeholder="Color name (e.g. Midnight Navy)"
                className="field-input flex-1"
                required
              />
            </div>
            {colors.length > 1 && (
              <button
                type="button"
                onClick={() => removeColor(ci)}
                className="text-xs text-red-500 font-bold uppercase hover:underline shrink-0 pt-2"
              >
                Remove
              </button>
            )}
          </div>

          <div>
            <label className="field-label">Images for this color (one URL per line)</label>
            <textarea
              rows={3}
              value={color.images.join('\n')}
              onChange={(e) =>
                updateColor(ci, { images: e.target.value.split('\n') })
              }
              className="field-input resize-none font-mono text-xs"
              placeholder="Front view URL&#10;Side view URL&#10;Back view URL"
            />
          </div>

          {color.images.filter(Boolean).length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {color.images.filter(Boolean).map((url, ii) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${url}-${ii}`}
                  src={url}
                  alt=""
                  className="w-14 h-16 object-cover rounded border border-borderGray shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = '0.3';
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
