'use client';

import { useEffect, useState } from 'react';
import type { Product } from '../types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        else setError('Failed to load products');
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
