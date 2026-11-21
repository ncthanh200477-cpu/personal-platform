export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteProfile {
  full_name: string;
  professional_title: string;
  hero_badge: string;
  philosophy_quote: string;
  short_bio: string;
  avatar_url: string | null;
  contact_email: string;
  social_links: SocialLink[];
}

export interface Domain {
  id: string;
  slug: string;
  code: string;
  name: string;
  description: string;
}

export interface CourseItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  domain?: { name: string } | null;
}

export interface InsightItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  reading_time_minutes: number;
  published_at: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  results: string;
  cover_image_url: string | null;
  model_3d_url: string | null;
}

export interface HomePageData {
  profile: SiteProfile | null;
  domains: Domain[];
  featuredCourses: CourseItem[];
  latestInsights: InsightItem[];
  featuredProjects: ProjectItem[];
  stats: {
    coursesCount: number;
    lessonsCount: number;
    resourcesCount: number;
    projectsCount: number;
  };
}