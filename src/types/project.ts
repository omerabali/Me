export interface Project {
  id?: number | string;
  slug: string;
  name: string;
  repo_name?: string;
  display_name?: string;
  title_tr?: string;
  title_en?: string | null;
  description: string | null;
  description_tr?: string | null;
  description_en?: string | null;
  readme_h1?: string | null;
  readme_detail?: string | null;
  readme_summary?: string | null;
  readme_raw?: string | null;
  readme_markdown?: string | null;
  readme_updated_at?: string | null;
  has_readme?: boolean;
  readme_html?: string | null;
  image_url?: string | null;
  cover_image_url?: string | null;
  tech_stack: string[];
  tags?: string[];
  features?: string[];
  category: string;
  languages?: Record<string, number>;
  github_url: string;
  demo_url?: string | null;
  homepage: string | null;
  stars: number;
  forks: number;
  open_issues?: number;
  topics: string[];
  is_featured?: boolean;
  is_showcased?: boolean;
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at: string;
  pushed_at?: string | null;
}

export interface ProjectDetail extends Project {
  readme_markdown?: string | null;
  readme_html?: string | null;
  readme_raw?: string | null;
  default_branch?: string;
  license?: string | null;
  archived?: boolean;
}

export interface ProjectsListResponse {
  total: number;
  showcased_count: number;
  cached: boolean;
  data: Project[];
}

export interface AdminProject {
  id: number;
  slug: string;
  repo_name: string;
  title_tr: string;
  title_en: string | null;
  description_tr: string | null;
  description_en: string | null;
  category: string;
  tags: string[];
  github_url: string;
  demo_url: string | null;
  cover_image_url: string | null;
  stars: number;
  forks: number;
  sort_order: number;
  is_published: boolean;
  has_readme: boolean;
  readme_markdown: string | null;
  readme_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthResponse {
  status: string;
  app_name: string;
  environment: string;
  timestamp: string;
  github_configured: boolean;
  cache_ttl_seconds: number;
}
