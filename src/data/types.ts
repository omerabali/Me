export interface RepoItem {
  id: number | string;
  name: string;
  display_name: string;
  description: string;
  readme_h1?: string;
  readme_detail?: string;
  readme_summary?: string;
  readme_raw?: string | null;
  image_url?: string;
  html_url: string;
  homepage?: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  is_featured: boolean;
  category: 'AI/ML' | 'Full-Stack' | 'Mobile' | 'Backend / Systems';
  tech_stack?: string[];
  features?: string[];
}
