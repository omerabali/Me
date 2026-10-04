import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Eye,
  FileText,
  Key,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';
import { ReadmeView } from '../components/ui/ReadmeView';
import {
  checkAdminAuth,
  createAdminProject,
  deleteAdminProject,
  fetchAdminProjects,
  importGitHubMeta,
  loginAdmin,
  logoutAdmin,
  reorderAdminProjects,
  updateAdminProject,
} from '../lib/apiClient';
import { extractMetaFromReadme } from '../lib/readmeMeta';
import type { AdminProject } from '../types/project';

const CATEGORIES = [
  { id: 'ai-ml', label: 'AI / Makine Öğrenmesi' },
  { id: 'web-cloud', label: 'Web & Bulut' },
  { id: 'mobile', label: 'Mobil Uygulamalar' },
  { id: 'software-algo', label: 'Yazılım & Algoritmalar' },
];

function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
    Ç: 'c',
    Ğ: 'g',
    İ: 'i',
    Ö: 'o',
    Ş: 's',
    Ü: 'u',
  };
  const cleaned = text
    .split('')
    .map((c) => trMap[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || 'proje';
}

export const AdminPage: React.FC = () => {
  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) {
      robots.setAttribute('content', 'noindex, nofollow');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }
    document.title = 'Admin | Proje Yönetimi';
    return () => {
      const r = document.querySelector('meta[name="robots"]');
      if (r) r.setAttribute('content', 'index, follow');
    };
  }, []);

  // Auth state
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | 'new' | null>(null);

  // Editor form state
  const [formSlug, setFormSlug] = useState('');
  const [formRepoName, setFormRepoName] = useState('');
  const [formTitleTr, setFormTitleTr] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formDescTr, setFormDescTr] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formCategory, setFormCategory] = useState('software-algo');
  const [formTagsStr, setFormTagsStr] = useState('');
  const [formGithubUrl, setFormGithubUrl] = useState('');
  const [formDemoUrl, setFormDemoUrl] = useState('');
  const [formCoverImageUrl, setFormCoverImageUrl] = useState('');
  const [formStars, setFormStars] = useState(0);
  const [formForks, setFormForks] = useState(0);
  const [formIsPublished, setFormIsPublished] = useState(false);
  const [formReadmeMarkdown, setFormReadmeMarkdown] = useState('');
  const [formSortOrder, setFormSortOrder] = useState(0);

  // Editor tabs & UI
  const [editorTab, setEditorTab] = useState<'write' | 'preview' | 'split'>('write');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [isImportingGh, setIsImportingGh] = useState(false);
  const [autofillHint, setAutofillHint] = useState<string | null>(null);

  // Initial Auth Check
  useEffect(() => {
    checkAdminAuth().then((res) => {
      setAuthenticated(res.authenticated);
      if (res.authenticated) {
        loadProjectsList();
      }
    });
  }, []);

  const loadProjectsList = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminProjects();
      setProjects(data);
      if (data.length > 0 && selectedId === null) {
        loadProjectIntoForm(data[0]);
      }
    } catch (err: any) {
      console.error('Admin projeleri getirilemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      await loginAdmin(password);
      setAuthenticated(true);
      await loadProjectsList();
    } catch (err: any) {
      setAuthError(err.message || 'Giriş yapılamadı.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setAuthenticated(false);
    setPassword('');
  };

  const loadProjectIntoForm = (p: AdminProject) => {
    setSelectedId(p.id);
    setFormSlug(p.slug);
    setFormRepoName(p.repo_name);
    setFormTitleTr(p.title_tr || '');
    setFormTitleEn(p.title_en || '');
    setFormDescTr(p.description_tr || '');
    setFormDescEn(p.description_en || '');
    setFormCategory(p.category || 'software-algo');
    setFormTagsStr((p.tags || []).join(', '));
    setFormGithubUrl(p.github_url || '');
    setFormDemoUrl(p.demo_url || '');
    setFormCoverImageUrl(p.cover_image_url || '');
    setFormStars(p.stars || 0);
    setFormForks(p.forks || 0);
    setFormIsPublished(p.is_published);
    setFormReadmeMarkdown(p.readme_markdown || '');
    setFormSortOrder(p.sort_order || 0);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);
    setAutofillHint(null);
  };

  const handleNewProject = () => {
    setSelectedId('new');
    setFormSlug('');
    setFormRepoName('');
    setFormTitleTr('');
    setFormTitleEn('');
    setFormDescTr('');
    setFormDescEn('');
    setFormCategory('software-algo');
    setFormTagsStr('');
    setFormGithubUrl('');
    setFormDemoUrl('');
    setFormCoverImageUrl('');
    setFormStars(0);
    setFormForks(0);
    setFormIsPublished(false);
    setFormReadmeMarkdown('');
    setFormSortOrder(projects.length + 1);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);
    setAutofillHint(null);
  };

  // Başlık yazıldığında slug otomatik doldurulsun (eğer henüz elle düzenlenmediyse)
  const handleTitleTrChange = (val: string) => {
    setFormTitleTr(val);
    if (selectedId === 'new' || !formSlug) {
      setFormSlug(slugify(val));
    }
  };

  /**
   * README içeriğinden üst form alanlarını doldurur.
   * force=false: yalnızca boş alanları doldurur (yapıştırınca).
   * force=true: üzerine yazar (buton).
   */
  const applyMetaFromReadme = useCallback(
    (md: string, force: boolean) => {
      const meta = extractMetaFromReadme(md);
      if (!meta.title && !meta.description && meta.tags.length === 0) {
        if (force) setAutofillHint('README’den çıkarılabilir meta bulunamadı.');
        return;
      }

      let filled = 0;

      if (meta.title && (force || !formTitleTr.trim())) {
        setFormTitleTr(meta.title);
        filled++;
        if (force || !formTitleEn.trim()) {
          setFormTitleEn(meta.title);
        }
        if (force || !formSlug.trim() || selectedId === 'new') {
          setFormSlug(slugify(meta.title));
        }
      }

      if (meta.description && (force || !formDescTr.trim())) {
        setFormDescTr(meta.description);
        filled++;
        if (force || !formDescEn.trim()) {
          setFormDescEn(meta.description);
        }
      }

      if (meta.tags.length > 0 && (force || !formTagsStr.trim())) {
        setFormTagsStr(meta.tags.join(', '));
        filled++;
      }

      if (force || formCategory === 'software-algo') {
        setFormCategory(meta.categoryHint);
        filled++;
      }

      if (
        formRepoName.trim() &&
        (force || !formGithubUrl.trim())
      ) {
        setFormGithubUrl(`https://github.com/omerabali/${formRepoName.trim()}`);
      }

      if (filled > 0 || force) {
        setAutofillHint(
          force
            ? '✓ README’den üst alanlar dolduruldu — yayınlamadan önce kontrol et.'
            : '✓ Boş alanlar README’den otomatik dolduruldu — yayınlamadan önce kontrol et.'
        );
      }
    },
    [
      formTitleTr,
      formTitleEn,
      formSlug,
      formDescTr,
      formDescEn,
      formTagsStr,
      formCategory,
      formRepoName,
      formGithubUrl,
      selectedId,
    ]
  );

  const handleReadmeChange = (value: string) => {
    setFormReadmeMarkdown(value);
    // Büyük yapıştırma / anlamlı içerik gelince boş alanları doldur
    if (value.trim().length > 40) {
      applyMetaFromReadme(value, false);
    }
  };

  // GitHub meta verilerini tek seferlik çek
  const handleImportMeta = async () => {
    if (!formRepoName.trim()) {
      alert('Lütfen önce GitHub repo adını girin (Örn: Me, Farm-Ai)');
      return;
    }
    setIsImportingGh(true);
    try {
      const meta = await importGitHubMeta(formRepoName.trim());
      if (meta.title && !formTitleTr) setFormTitleTr(meta.title);
      if (meta.description) {
        if (!formDescTr) setFormDescTr(meta.description);
        if (!formDescEn) setFormDescEn(meta.description);
      }
      if (meta.github_url) setFormGithubUrl(meta.github_url);
      if (meta.demo_url) setFormDemoUrl(meta.demo_url);
      if (meta.stars !== undefined) setFormStars(meta.stars);
      if (meta.forks !== undefined) setFormForks(meta.forks);
      if (meta.tags && meta.tags.length > 0) {
        setFormTagsStr(meta.tags.join(', '));
      }
      alert('✓ Bilgiler GitHub API üzerinden başarıyla dolduruldu!');
    } catch (err: any) {
      alert(`Hata: ${err.message}`);
    } finally {
      setIsImportingGh(false);
    }
  };

  // Kaydet & Doğrula
  const handleSave = async (publishedStatus?: boolean) => {
    if (!formTitleTr.trim()) {
      setSaveErrorMsg('Türkçe Proje Başlığı zorunludur.');
      return;
    }
    if (!formRepoName.trim()) {
      setSaveErrorMsg('Gerçek GitHub repo adı zorunludur (resim çözümlemesi için).');
      return;
    }
    const finalSlug = slugify(formSlug || formTitleTr);
    const isPub = publishedStatus !== undefined ? publishedStatus : formIsPublished;

    // Normalizasyon: BOM kaldır, CRLF -> LF
    const normalizedMarkdown = formReadmeMarkdown
      ? formReadmeMarkdown.replace(/^\ufeff/, '').replace(/\r\n/g, '\n')
      : null;

    const payload = {
      slug: finalSlug,
      repo_name: formRepoName.trim(),
      title_tr: formTitleTr.trim(),
      title_en: formTitleEn.trim() || null,
      description_tr: formDescTr.trim() || null,
      description_en: formDescEn.trim() || null,
      category: formCategory,
      tags: formTagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      github_url: formGithubUrl.trim() || `https://github.com/omerabali/${formRepoName.trim()}`,
      demo_url: formDemoUrl.trim() || null,
      cover_image_url: formCoverImageUrl.trim() || null,
      stars: Number(formStars) || 0,
      forks: Number(formForks) || 0,
      sort_order: Number(formSortOrder) || 0,
      is_published: isPub,
      readme_markdown: normalizedMarkdown,
    };

    setIsSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      let savedProject: AdminProject;
      if (selectedId === 'new') {
        savedProject = await createAdminProject(payload);
        setSelectedId(savedProject.id);
      } else {
        savedProject = await updateAdminProject(selectedId as number, payload);
      }

      // DOĞRULAMA (Kabul Kriteri 3):
      // Sunucudan dönen README uzunluğunu karşılaştır, kesilme olmadığını doğrula
      const sentLength = normalizedMarkdown ? normalizedMarkdown.length : 0;
      const returnedLength = savedProject.readme_markdown ? savedProject.readme_markdown.length : 0;

      setFormIsPublished(savedProject.is_published);
      const pubLabel = savedProject.is_published
        ? 'Yayında — sitede görünür'
        : 'Taslak — sitede görünmez';

      if (sentLength === returnedLength) {
        setSaveSuccessMsg(
          `✓ Eksiksiz kaydedildi (${returnedLength.toLocaleString('tr-TR')} karakter) · ${pubLabel}`
        );
      } else {
        setSaveErrorMsg(
          `⚠️ Karakter uyuşmazlığı tespit edildi! Gönderilen: ${sentLength}, Kaydedilen: ${returnedLength}`
        );
      }

      // Proje listesini güncelle
      await loadProjectsList();
      setSelectedId(savedProject.id);
    } catch (err: any) {
      setSaveErrorMsg(err.message || 'Kayıt sırasında hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (selectedId === 'new' || selectedId === null) return;
    const confirmDelete = window.confirm(
      `"${formTitleTr}" projesini ve README dokümanını kalıcı olarak silmek istediğinizden emin misiniz?`
    );
    if (!confirmDelete) return;

    try {
      await deleteAdminProject(selectedId);
      alert('Proje başarıyla silindi.');
      setSelectedId(null);
      await loadProjectsList();
    } catch (err: any) {
      alert(`Silme hatası: ${err.message}`);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === projects.length - 1)
    ) {
      return;
    }

    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // sort_order değerlerini yeniden ata
    const reorderPayload = newProjects.map((p, idx) => ({
      id: p.id,
      sort_order: idx + 1,
    }));

    setProjects(newProjects);
    try {
      await reorderAdminProjects(reorderPayload);
    } catch (err) {
      console.error('Sıralama kaydedilemedi:', err);
      loadProjectsList();
    }
  };

  // Karakter & Bayt Sayacı
  const readmeCharCount = formReadmeMarkdown.length;
  const readmeByteCount = new TextEncoder().encode(formReadmeMarkdown).length;

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title_tr.toLowerCase().includes(q) ||
        p.repo_name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  // LOGIN EKRANI
  if (authenticated === false) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="neo-card w-full max-w-md p-8">
          <div className="text-center space-y-2 mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Key className="h-6 w-6" />
            </div>
            <h1 className="font-display text-xl font-bold text-ink">Portfolyo Admin Girişi</h1>
            <p className="text-xs text-ink-2">
              Yalnızca yönetici şifresi · JWT oturum · SHA-256
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                Yönetici Şifresi
              </label>
              <input
                type="password"
                name="admin_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin..."
                required
                autoComplete="current-password"
                autoFocus
                className="w-full rounded-xl border border-rule bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-500 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {authLoading ? 'Doğrulanıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  // YÖNETİM PANELİ (İKİ SÜTUNLU MASAÜSTÜ ARAYÜZÜ)
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      {/* Üst Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
        <div>
          <h1 className="font-display text-xl font-bold text-ink">Proje & README Yönetim Paneli</h1>
          <p className="text-xs text-ink-2">
            Toplam {projects.length} proje · Neon PostgreSQL · GitHub otomatik senkron kapalı
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleNewProject}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Proje Ekle</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rule bg-surface px-3 py-2 text-xs font-medium text-ink-2 hover:border-ink hover:text-ink cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Çıkış</span>
          </button>
        </div>
      </div>

      {/* İki Sütunlu Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* SOL SÜTUN: Proje Listesi (lg:col-span-4) */}
        <div className="lg:col-span-4 neo-card flex flex-col h-[85vh]">
          {/* Arama */}
          <div className="p-4 border-b border-rule">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Projelerde ara..."
                className="w-full rounded-xl border border-rule bg-surface py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Liste */}
          <div className="flex-1 overflow-y-auto divide-y divide-rule/60 p-2 space-y-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-ink-3">Projeler yükleniyor...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-ink-3">Proje bulunamadı.</div>
            ) : (
              filteredProjects.map((p, index) => {
                const isSelected = selectedId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => loadProjectIntoForm(p)}
                    className={`group flex items-center justify-between rounded-xl p-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-accent/10 border border-accent/40'
                        : 'hover:bg-surface border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xs font-bold text-ink truncate">
                          {p.title_tr || p.repo_name}
                        </span>
                        {p.is_published ? (
                          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                            YAYINDA
                          </span>
                        ) : (
                          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                            TASLAK
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[10px] text-ink-2">
                        <span className="font-mono text-ink-2">{p.repo_name}</span>
                        <span className="text-ink-3">·</span>
                        {p.has_readme ? (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            README Var
                          </span>
                        ) : (
                          <span className="text-ink-2">README Yok</span>
                        )}
                      </div>
                    </div>

                    {/* Sıralama Butonları */}
                    <div className="flex flex-col gap-0.5 opacity-60 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveOrder(index, 'up');
                        }}
                        disabled={index === 0}
                        className="rounded p-1 hover:bg-paper disabled:opacity-20 cursor-pointer"
                        title="Yukarı taşı"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveOrder(index, 'down');
                        }}
                        disabled={index === projects.length - 1}
                        className="rounded p-1 hover:bg-paper disabled:opacity-20 cursor-pointer"
                        title="Aşağı taşı"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SAĞ SÜTUN: Editör & Canlı Önizleme (lg:col-span-8) */}
        <div className="lg:col-span-8 neo-card flex flex-col h-[85vh] overflow-hidden">
          {selectedId === null ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-ink-3">
              Sol taraftan bir proje seçin veya "Yeni Proje Ekle" butonuna tıklayın.
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
              {/* Form Üst Bilgi & Aksiyonlar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-bold text-ink">
                    {selectedId === 'new' ? 'Yeni Proje Oluştur' : `Düzenle: ${formTitleTr}`}
                  </span>
                  {selectedId !== 'new' && (
                    <a
                      href={`/projects/${formSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent hover:underline ml-2"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Sitede Gör</span>
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedId !== 'new' && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Sil</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                    className="rounded-xl border border-rule bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink cursor-pointer disabled:opacity-50"
                  >
                    Taslak Kaydet
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                    className="rounded-xl bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet & Yayınla'}
                  </button>
                </div>
              </div>

              {/* Bildirim Mesajları (Başarılı / Hata / Oto-dolum) */}
              {saveSuccessMsg && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {saveSuccessMsg}
                </div>
              )}
              {saveErrorMsg && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-500 font-medium">
                  {saveErrorMsg}
                </div>
              )}
              {autofillHint && (
                <div className="rounded-xl bg-sky-500/10 border border-sky-500/20 p-3 text-xs text-sky-700 dark:text-sky-300 font-medium">
                  {autofillHint}
                </div>
              )}
              <p className="text-[11px] text-ink-3">
                Durum:{' '}
                <span className={formIsPublished ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                  {formIsPublished ? 'Yayında' : 'Taslak'}
                </span>
                {' · '}
                Sitede görünmesi için <strong>Kaydet &amp; Yayınla</strong> kullan.
              </p>

              {/* Temel Proje Form Alanları */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Başlık (Türkçe) *
                  </label>
                  <input
                    type="text"
                    value={formTitleTr}
                    onChange={(e) => handleTitleTrChange(e.target.value)}
                    placeholder="Örn: Otel Yönetim Sistemi"
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Başlık (İngilizce)
                  </label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="Örn: Hotel Management System"
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-ink-2">
                      GitHub Repo Adı * (Resim çözümlemesi için şart)
                    </label>
                    <button
                      type="button"
                      onClick={handleImportMeta}
                      disabled={isImportingGh}
                      className="text-[10px] text-accent hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <GithubIcon className="h-3 w-3" />
                      <span>{isImportingGh ? 'Çekiliyor...' : 'GitHub Bilgilerini Doldur'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formRepoName}
                    onChange={(e) => setFormRepoName(e.target.value)}
                    placeholder="Örn: Me veya HotelMailBot"
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    URL Slug * (Otomatik üretilir, düzenlenebilir)
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(slugify(e.target.value))}
                    placeholder="otel-yonetim-sistemi"
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Teknoloji Etiketleri (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={formTagsStr}
                    onChange={(e) => setFormTagsStr(e.target.value)}
                    placeholder="React 19, TypeScript, PostgreSQL, Tailwind"
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formGithubUrl}
                    onChange={(e) => setFormGithubUrl(e.target.value)}
                    placeholder="https://github.com/omerabali/..."
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Canlı Demo URL (Varsa)
                  </label>
                  <input
                    type="url"
                    value={formDemoUrl}
                    onChange={(e) => setFormDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Açıklamalar */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Kart Açıklaması (Türkçe)
                  </label>
                  <textarea
                    rows={2}
                    value={formDescTr}
                    onChange={(e) => setFormDescTr(e.target.value)}
                    placeholder="Kart üzerinde görünecek kısa özet..."
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Kart Açıklaması (İngilizce)
                  </label>
                  <textarea
                    rows={2}
                    value={formDescEn}
                    onChange={(e) => setFormDescEn(e.target.value)}
                    placeholder="Card summary in English (optional)..."
                    className="w-full rounded-xl border border-rule bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* README ALANI (BÖLÜM 6 KRİTİK ALAN) */}
              <div className="border-t border-rule pt-4 space-y-3">
                <div className="rounded-xl border border-ink/15 bg-paper-sunk p-3 text-[11px] text-ink-2 leading-relaxed">
                  <strong className="text-ink font-semibold">GitHub senkronu kapalı:</strong> Yeni
                  repo veya commit atınca site <strong>otomatik güncellenmez</strong>. README’yi
                  buraya yapıştırıp <strong>Kaydet &amp; Yayınla</strong> demen gerekir.
                </div>

                {/* README İpucu Kutusu */}
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5 text-xs text-ink-2 leading-relaxed">
                  <strong className="text-accent font-semibold block mb-0.5">
                    💡 README Kopyalama İpucu:
                  </strong>
                  GitHub'da README dosyasını açın → sağ üstteki <strong>Copy raw file</strong> (veya{' '}
                  <strong>Raw</strong> sekmesi → tümünü seç) ile <strong>ham markdown'ı</strong>{' '}
                  kopyalayın. Sayfada görünen render halini kopyalamayın, markdown biçimi kaybolur.
                </div>

                {/* Bilinen Sınırlar Notu */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-ink-2">
                  <strong>Not:</strong> Repo private ise göreli resimler herkese açık CDN'den
                  yüklenemez. Public repolarda tüm göreli resimler otomatik jsDelivr CDN ve GitHub
                  Raw fallback zinciri üzerinden çözümlenir.
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyMetaFromReadme(formReadmeMarkdown, true)}
                    disabled={!formReadmeMarkdown.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 disabled:opacity-40 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>README’den üst alanları doldur</span>
                  </button>
                  <span className="text-[11px] text-ink-3">
                    Yapıştırınca boş alanlar otomatik dolar; bu buton üzerine yazar.
                  </span>
                </div>

                {/* Sekmeler & Sayaç */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-2">
                  <div className="flex items-center gap-1 rounded-xl border border-rule bg-surface p-1">
                    <button
                      type="button"
                      onClick={() => setEditorTab('write')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        editorTab === 'write' ? 'bg-paper text-ink shadow-xs' : 'text-ink-3 hover:text-ink'
                      }`}
                    >
                      Yaz
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        editorTab === 'preview' ? 'bg-paper text-ink shadow-xs' : 'text-ink-3 hover:text-ink'
                      }`}
                    >
                      Canlı Önizleme
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('split')}
                      className={`hidden sm:block px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        editorTab === 'split' ? 'bg-paper text-ink shadow-xs' : 'text-ink-3 hover:text-ink'
                      }`}
                    >
                      Yan Yana
                    </button>
                  </div>

                  <div className="text-xs font-mono text-ink-3">
                    <span>{readmeCharCount.toLocaleString('tr-TR')} karakter</span>
                    <span className="mx-2">·</span>
                    <span>{(readmeByteCount / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                {/* Editör / Önizleme Alanı */}
                <div className="min-h-[420px]">
                  {editorTab === 'write' && (
                    <textarea
                      rows={18}
                      value={formReadmeMarkdown}
                      onChange={(e) => handleReadmeChange(e.target.value)}
                      placeholder="# Proje Başlığı&#10;&#10;GitHub'dan kopyaladığınız ham markdown'ı buraya yapıştırın..."
                      className="w-full rounded-2xl border border-rule bg-surface p-4 font-mono text-xs text-ink leading-relaxed focus:border-accent focus:outline-none"
                    />
                  )}

                  {editorTab === 'preview' && (
                    <div className="rounded-2xl border border-rule bg-paper p-6 overflow-y-auto max-h-[600px]">
                      {formReadmeMarkdown ? (
                        <ReadmeView repo={formRepoName || 'Me'} md={formReadmeMarkdown} />
                      ) : (
                        <p className="text-xs text-ink-3 italic">Henüz markdown içeriği girilmedi.</p>
                      )}
                    </div>
                  )}

                  {editorTab === 'split' && (
                    <div className="grid grid-cols-2 gap-4">
                      <textarea
                        rows={18}
                        value={formReadmeMarkdown}
                        onChange={(e) => handleReadmeChange(e.target.value)}
                        placeholder="Ham markdown..."
                        className="w-full rounded-2xl border border-rule bg-surface p-4 font-mono text-xs text-ink leading-relaxed focus:border-accent focus:outline-none"
                      />
                      <div className="rounded-2xl border border-rule bg-paper p-6 overflow-y-auto max-h-[600px]">
                        {formReadmeMarkdown ? (
                          <ReadmeView repo={formRepoName || 'Me'} md={formReadmeMarkdown} />
                        ) : (
                          <p className="text-xs text-ink-3 italic">Henüz markdown içeriği girilmedi.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
