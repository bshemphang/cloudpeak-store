import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getSupabase, isSupabaseConfigured } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    let email: string | null = null;
    const hasPublicAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    if (isSupabaseConfigured() && (hasPublicAnon || authHeader?.startsWith('Bearer '))) {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const token = authHeader.substring(7);
      const supabase = getSupabase()!;
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      email = user.email ?? null;
    } else {
      // Mock mode auth check
      const { searchParams } = new URL(request.url);
      email = searchParams.get('email') || request.headers.get('x-mock-user-email');
    }

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Limit files to images or videos
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Only image or video files are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.storage.createBucket('review-media', { public: true });
        } catch {}

        const ext = path.extname(file.name) || '.jpg';
        const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${Date.now()}_${baseName}${ext}`;

        const { error } = await supabase.storage
          .from('review-media')
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from('review-media')
            .getPublicUrl(filename);
          return NextResponse.json({ url: publicUrl });
        }
      }
    }

    // Local fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'reviews');
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || '.jpg';
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);
    const url = `/uploads/reviews/${filename}`;
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
