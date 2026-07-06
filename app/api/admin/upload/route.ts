import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { checkAdminAuth, adminAuthErrorMessage } from '../../../../lib/admin-auth';
import { getSupabase, isSupabaseConfigured } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.storage.createBucket('product-images', { public: true });
        } catch {
          // ignore error if bucket exists
        }

        const ext = path.extname(file.name) || '.jpg';
        const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${Date.now()}_${baseName}${ext}`;

        const { error } = await supabase.storage
          .from('product-images')
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filename);
          return NextResponse.json({ url: publicUrl });
        }
        console.error('Supabase storage upload failed:', error);
      }
    }

    // Ensure uploads directory exists in public folder (local dev fallback)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique name to prevent collisions
    const ext = path.extname(file.name) || '.jpg';
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);
    const url = `/uploads/${filename}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload design image.' }, { status: 500 });
  }
}
