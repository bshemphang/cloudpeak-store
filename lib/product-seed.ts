import { productImages } from './images';
import type { ProductInput } from '../types/product';

const now = new Date().toISOString();

function seed(
  id: string,
  slug: string,
  data: Omit<ProductInput, 'images' | 'inStock'> & { images?: string[]; inStock?: boolean }
): ProductInput & { id: string; slug: string; createdAt: string; updatedAt: string } {
  const images = data.images ?? [productImages[id]];
  return {
    id,
    slug,
    images,
    name: data.name,
    price: data.price,
    category: data.category,
    isNew: data.isNew,
    inStock: data.inStock ?? true,
    description: data.description,
    details: data.details,
    sizes: data.sizes,
    buyLink: data.buyLink,
    createdAt: now,
    updatedAt: now,
  };
}

export const SEED_PRODUCTS = [
  seed('1', 'cloudpeak-graphic-tee', {
    name: 'Cloudpeak Graphic Tee',
    price: 999,
    category: 'POD Exclusives',
    isNew: true,
    description: 'Premium cotton POD graphic tee featuring the Cloudpeak mountain mark. Soft hand-feel with a relaxed street fit.',
    details: '100% combed cotton\n220 GSM heavyweight\nPre-shrunk fabric\nScreen-printed in India\nMachine wash cold',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [productImages['1'], productImages['8']],
  }),
  seed('2', 'retro-90s-sneaker', {
    name: 'Retro 90s Sneaker',
    price: 3499,
    category: 'Footwear',
    isNew: false,
    description: 'Throwback silhouette with modern comfort. A staple for any streetwear rotation.',
    details: 'Synthetic leather upper\nRubber outsole\nCushioned insole\nTrue to size\nPan-India shipping',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    images: [productImages['2'], productImages['6']],
  }),
  seed('3', 'minimalist-black-watch', {
    name: 'Minimalist Black Watch',
    price: 1299,
    category: 'Accessories',
    isNew: true,
    description: 'Clean dial, matte black finish. Minimal design that pairs with everything.',
    details: 'Quartz movement\nStainless steel case\nWater resistant 3 ATM\nAdjustable strap\n1-year warranty',
    sizes: ['One Size'],
    images: [productImages['3']],
  }),
  seed('4', 'elevate-heavy-hoodie', {
    name: 'Elevate Heavy Hoodie',
    price: 1899,
    category: 'Streetwear',
    isNew: false,
    description: '400 GSM fleece-lined hoodie built for Shillong winters and street layering.',
    details: '80% cotton / 20% polyester\nKangaroo pocket\nDouble-lined hood\nRibbed cuffs and hem\nOversized fit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [productImages['4']],
  }),
  seed('5', 'urban-cargo-pants', {
    name: 'Urban Cargo Pants',
    price: 2499,
    category: 'Streetwear',
    isNew: false,
    description: 'Tapered cargo pants with multiple utility pockets. Street-ready everyday wear.',
    details: 'Cotton twill blend\nAdjustable ankle cuffs\n6-pocket design\nMid-rise waist\nRelaxed taper fit',
    sizes: ['28', '30', '32', '34', '36'],
    images: [productImages['5']],
  }),
  seed('6', 'high-top-court-shoes', {
    name: 'High-Top Court Shoes',
    price: 4299,
    category: 'Footwear',
    isNew: true,
    description: 'Court-inspired high-top with premium materials and bold street presence.',
    details: 'Leather and mesh upper\nPadded collar\nRubber cupsole\nLace-up closure\nIncludes extra laces',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    images: [productImages['6'], productImages['2']],
  }),
  seed('7', 'signature-snapback', {
    name: 'Signature Snapback',
    price: 799,
    category: 'Accessories',
    isNew: false,
    description: 'Structured snapback with embroidered Cloudpeak mark. One size fits most.',
    details: '6-panel construction\nFlat brim\nAdjustable snap closure\nEmbroidered logo\nOne size',
    sizes: ['One Size'],
    images: [productImages['7']],
  }),
  seed('8', 'culture-over-everything-tee', {
    name: 'Culture Over Everything Tee',
    price: 1099,
    category: 'POD Exclusives',
    isNew: true,
    description: 'Statement POD tee celebrating Northeast culture. Limited print run.',
    details: '100% organic cotton\n180 GSM\nDirect-to-garment print\nUnisex fit\nMade to order',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [productImages['8'], productImages['1']],
  }),
];
