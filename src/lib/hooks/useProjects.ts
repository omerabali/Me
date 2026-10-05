import { useCallback, useEffect, useState } from 'react';
import type { Project } from '../../types/project';
import { fetchPublicProjects } from '../apiClient';
import { STATIC_PROJECTS } from '../staticProjects';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  /** true = API yok/düştü, build-time JSON kullanılıyor */
  usingFallback: boolean;
  total: number;
  reload: () => void;
}

export function useProjects(): ProjectsState {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    try {
      const data = await fetchPublicProjects();
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
        return;
      }
      // Boş API cevabı → statik katalog
      setProjects(STATIC_PROJECTS);
      setUsingFallback(true);
    } catch (err: unknown) {
      console.warn('[useProjects] API unreachable, using static catalog:', err);
      setProjects(STATIC_PROJECTS);
      setUsingFallback(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    usingFallback,
    total: projects.length,
    reload: loadProjects,
  };
}
