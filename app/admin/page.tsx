import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminDashboard from '@/components/AdminDashboard';

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [profileRes, domainsRes, coursesRes, libraryRes, insightsRes, projectsRes, messagesRes] =
    await Promise.all([
      supabase.from('site_profile').select('*').eq('id', 1).single(),
      supabase.from('domains').select('*').order('sort_order', { ascending: true }),
      supabase.from('courses').select('*').order('created_at', { ascending: false }),
      supabase.from('library_resources').select('*').order('created_at', { ascending: false }),
      supabase.from('insights').select('*').order('published_at', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ]);

  return (
    <AdminDashboard
      userEmail={user.email || ''}
      initialProfile={profileRes.data}
      initialDomains={domainsRes.data ?? []}
      initialCourses={coursesRes.data ?? []}
      initialLibrary={libraryRes.data ?? []}
      initialInsights={insightsRes.data ?? []}
      initialProjects={projectsRes.data ?? []}
      initialMessages={messagesRes.data ?? []}
    />
  );
}