import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getAboutData() {
  const [{ data: profile }, { data: domains }, { data: roadmap }] = await Promise.all([
    supabase.from('site_profile').select('*').eq('id', 1).single(),
    supabase.from('domains').select('*').order('sort_order', { ascending: true }),
    supabase.from('roadmap_items').select('*').order('sort_order', { ascending: true }),
  ]);

  return {
    profile: profile || null,
    domains: domains || [],
    roadmap: roadmap || [],
  };
}

export async function getCoursesData() {
  const [{ data: domains }, { data: courses }] = await Promise.all([
    supabase.from('domains').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('courses')
      .select('*, domains(name, code)')
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
  ]);

  return {
    domains: domains || [],
    courses: courses || [],
  };
}

export async function getCourseBySlug(slug: string) {
  const { data: course } = await supabase
    .from('courses')
    .select('*, domains(name, code)')
    .eq('slug', slug)
    .single();

  if (!course) return null;

  const [{ data: modules }, { data: lessons }] = await Promise.all([
    supabase.from('course_modules').select('*').eq('course_id', course.id).order('sort_order', { ascending: true }),
    supabase.from('course_lessons').select('*').eq('course_id', course.id).order('sort_order', { ascending: true }),
  ]);

  return {
    course,
    modules: modules || [],
    lessons: lessons || [],
  };
}

export async function getRoadmapData() {
  const [{ data: domains }, { data: items }] = await Promise.all([
    supabase.from('domains').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('roadmap_items')
      .select('*, domains(name, code)')
      .order('sort_order', { ascending: true }),
  ]);

  return {
    domains: domains || [],
    items: items || [],
  };
}

export async function getLibraryData() {
  const [{ data: domains }, { data: resources }] = await Promise.all([
    supabase.from('domains').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('library_resources')
      .select('*, domains(name, code)')
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
  ]);

  return {
    domains: domains || [],
    resources: resources || [],
  };
}

export async function getInsightsData() {
  const [{ data: domains }, { data: insights }] = await Promise.all([
    supabase.from('domains').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('insights')
      .select('*, domains(name, code)')
      .eq('is_published', true)
      .order('published_at', { ascending: false }),
  ]);

  return {
    domains: domains || [],
    insights: insights || [],
  };
}

export async function getProjectsData() {
  const [{ data: domains }, { data: projects }] = await Promise.all([
    supabase.from('domains').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('projects')
      .select('*, domains(name, code)')
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
  ]);

  return {
    domains: domains || [],
    projects: projects || [],
  };
}

export async function getProjectBySlug(slug: string) {
  const { data: project } = await supabase
    .from('projects')
    .select('*, domains(name, code)')
    .eq('slug', slug)
    .single();

  return project || null;
}

export async function getContactProfile() {
  const { data: profile } = await supabase
    .from('site_profile')
    .select('full_name, professional_title, contact_email, social_links')
    .eq('id', 1)
    .single();

  return profile || null;
}
