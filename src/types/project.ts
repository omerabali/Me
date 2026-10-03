export interface Project {
  slug: string;
  name: string;
  display_name?: string;
  description: string | null;
  readme_h1?: string | null;
  readme_detail?: string | null;
  readme_summary?: string | null;
  readme_raw?: string | null;
  readme_html?: string | null;
  image_url?: string | null;
  tech_stack: string[];
  features?: string[];
  category?: string;
  languages?: Record<string, number>;
  github_url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  open_issues?: number;
  topics: string[];
  id?: string;
  is_featured?: boolean;
  is_showcased?: boolean;
  created_at?: string;
  updated_at: string;
  pushed_at?: string | null;
}

export interface ProjectDetail extends Project {
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

export interface HealthResponse {
  status: string;
  app_name: string;
  environment: string;
  timestamp: string;
  github_configured: boolean;
  cache_ttl_seconds: number;
}
