import { useCallback, useEffect, useState } from 'react';
import type { Project } from '../../types/project';
import { fetchPublicProjects } from '../apiClient';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  reload: () => void;
}

export function useProjects(): ProjectsState {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublicProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('[useProjects] API hatası:', err);
      setProjects([]);
      setError('Projeler yüklenemedi. Lütfen tekrar deneyin.');
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
    total: projects.length,
    reload: loadProjects,
  };
}
