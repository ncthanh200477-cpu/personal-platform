import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const pattern = `%${q}%`;

  const [coursesRes, projectsRes, libraryRes, insightsRes] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, slug, summary')
      .eq('is_published', true)
      .or(`title.ilike.${pattern},summary.ilike.${pattern}`)
      .limit(5),
    supabase
      .from('projects')
      .select('id, title, slug, summary')
      .eq('is_published', true)
      .or(`title.ilike.${pattern},summary.ilike.${pattern}`)
      .limit(5),
    supabase
      .from('library_resources')
      .select('id, title, description, resource_type')
      .eq('is_published', true)
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .limit(5),
    supabase
      .from('insights')
      .select('id, title, excerpt, category')
      .eq('is_published', true)
      .or(`title.ilike.${pattern},excerpt.ilike.${pattern}`)
      .limit(5),
  ]);

  const results = [
    ...(coursesRes.data || []).map((item) => ({
      id: `course-${item.id}`,
      type: 'Khóa học',
      title: item.title,
      subtitle: item.summary,
      href: `/courses/${item.slug}`,
    })),
    ...(projectsRes.data || []).map((item) => ({
      id: `project-${item.id}`,
      type: 'Dự án & 3D',
      title: item.title,
      subtitle: item.summary,
      href: `/projects/${item.slug}`,
    })),
    ...(libraryRes.data || []).map((item) => ({
      id: `library-${item.id}`,
      type: `Thư viện (${item.resource_type})`,
      title: item.title,
      subtitle: item.description,
      href: '/library',
    })),
    ...(insightsRes.data || []).map((item) => ({
      id: `insight-${item.id}`,
      type: `Bài viết • ${item.category}`,
      title: item.title,
      subtitle: item.excerpt,
      href: '/insights',
    })),
  ];

  return NextResponse.json({ results });
}