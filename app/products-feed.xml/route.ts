import { NextResponse } from 'next/server';
import { getAllProducts } from '../../lib/products-store';
import { getProductPrimaryImage, normalizeProduct } from '../../lib/product-utils';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudpeak.in';
  
  try {
    const rawProducts = await getAllProducts();
    const products = rawProducts.map(normalizeProduct);

    let xml = `<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Cloudpeak Store</title>
    <link>${baseUrl}</link>
    <description>Premium streetwear store Shillong</description>\n`;

    for (const product of products) {
      const primaryImg = getProductPrimaryImage(product, 0);
      const imageUrl = primaryImg.startsWith('http') ? primaryImg : `${baseUrl}${primaryImg}`;
      const productUrl = `${baseUrl}/shop/${product.slug}`;
      const description = product.description || `Buy ${product.name} at Cloudpeak`;
      const availability = product.inStock ? 'in_stock' : 'out_of_stock';
      
      // Helper to escape XML special characters
      const escapeXml = (unsafe: string) => {
        return unsafe.replace(/[<>&'"]/g, (c) => {
          switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
          }
        });
      };

      xml += `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <title>${escapeXml(product.name)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(productUrl)}</link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price} INR</g:price>
      <g:brand>Cloudpeak</g:brand>
    </item>\n`;
    }

    xml += `  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating Google Merchant feed:', error);
    return new NextResponse('Error generating feed', { status: 500 });
  }
}
