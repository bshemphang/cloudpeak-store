/** Centralised image URLs — verified Unsplash sources with consistent query params */
const u = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const productImages: Record<string, string> = {
  '1': u('1583743814966-8936f5b7be1a', 600),
  '2': u('1542291026-7eec264c27ff', 600),
  '3': u('1523275335684-37898b6baf30', 600),
  '4': u('1556821840-3a63f95609a7', 600),
  '5': u('1624378439575-d8705ad7ae80', 600),
  '6': u('1606107557192-0be29b2b5b2b', 600),
  '7': u('1588850561407-ed78c282e89b', 600),
  '8': u('1503342217505-b0a15ec3261c', 600),
};

export const categoryImages = {
  hoodies: u('1556821840-3a63f95609a7', 1000),
  accessories: u('1572635196237-14b3f281503f', 800),
  hats: u('1588850561407-ed78c282e89b', 600),
  jackets: u('1551028719-00167b16eac5', 600),
  hero: u('1552374196-1ab2a1c593e8', 2000),
} as const;

export const IMAGE_FALLBACK = '/images/product-fallback.svg';
