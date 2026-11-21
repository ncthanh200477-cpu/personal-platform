import { createClient } from '@supabase/supabase-js';
import { HomePageData, CourseItem } from '@/types/database';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getHomePageData(): Promise<HomePageData> {
  const [
    profileRes,
    domainsRes,
    coursesRes,
    insightsRes,
    projectsRes,
    coursesCountRes,
    lessonsCountRes,
    resourcesCountRes,
    projectsCountRes,
  ] = await Promise.all([
    supabase.from('site_profile').select('*').eq('id', 1).single(),
    supabase.from('domains').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('courses')
      .select('id, slug, title, summary, level, domain:domains(name)')
      .eq('is_published', true)
      .eq('is_featured', true)
      .limit(4),
    supabase
      .from('insights')
      .select('id, slug, title, excerpt, category, reading_time_minutes, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(4),
    supabase
      .from('projects')
      .select('id, slug, title, summary, results, cover_image_url, model_3d_url')
      .eq('is_published', true)
      .eq('is_featured', true)
      .limit(2),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('course_lessons').select('*', { count: 'exact', head: true }),
    supabase.from('library_resources').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_published', true),
  ]);

  return {
    profile: profileRes.data ?? null,
    domains: domainsRes.data ?? [],
    featuredCourses: (coursesRes.data as unknown as CourseItem[]) ?? [],
    latestInsights: insightsRes.data ?? [],
    featuredProjects: projectsRes.data ?? [],
    stats: {
      coursesCount: coursesCountRes.count ?? 0,
      lessonsCount: lessonsCountRes.count ?? 0,
      resourcesCount: resourcesCountRes.count ?? 0,
      projectsCount: projectsCountRes.count ?? 0,
    },
  };
}