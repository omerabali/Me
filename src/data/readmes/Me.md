# ⚡ Ömer Abalı — Personal Portfolio & Engineering Showcase

<div align="center">

![Portfolio Preview Banner](/public/profile-avatar.png)

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Active-222222?style=for-the-badge&logo=github&logoColor=white)](https://omerabali.github.io/Me/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**AI Engineer · Mobile & Full-Stack Developer**

[🌐 Canlı Siteyi Görüntüle](https://omerabali.github.io/Me/) · [📄 Özgeçmiş (CV)](https://omerabali.github.io/Me/cv.pdf) · [📬 İletişime Geç](mailto:omerabali09@gmail.com)

</div>

---

## 🌟 Genel Bakış (Overview)

Bu repo; **Ömer Abalı**'nın yapay zeka (Deep Learning, RAG, PyTorch), çapraz platform mobil (Flutter/Dart) ve modern Full-Stack mimarilerini (React 19, FastAPI, Neon Serverless PostgreSQL) bir araya getiren editoryal mühendislik portfolyosudur.

### ✨ Temel Özellikler
- 🌍 **Üç Dilli Mimari (i18n):** Türkçe (TR), İngilizce (EN) ve Almanca (DE) dillerinde anında reaktif dil değişimi.
- 🎨 **Neo-Brutalist & Editoryal Tasarım:** Yüksek kontrastlı tipografi, cam ve kâğıt yüzey geçişleri, pürüzsüz micro-interaction animasyonları.
- ⚡ **Otomatik GitHub Entegrasyonu:** `scripts/fetch-repos.ts` build-time senkronizasyonu ile 59+ GitHub deposunun README, teknoloji etiketleri ve istatistiklerinin statik olarak paketlenmesi.
- 🏆 **Doğrulanmış Sertifikalar:** CV'deki 7 resmi eğitim ve sertifikanın (Tech Istanbul, BTK Akademi, Udemy) doğrulanmış rozetlerle sunumu.
- 🚀 **GitHub Actions CI/CD:** Her `main` branch push işleminde otomatik test, derleme ve GitHub Pages dağıtımı.
- 📱 **Tam Responsive:** Mobil, tablet ve masaüstü ekranlarda akıcı 60fps kullanıcı deneyimi.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Alan | Teknolojiler |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Lucide React |
| **Derleme & Paketleme** | Vite 6, tsx, PostCSS |
| **Yönlendirme & i18n** | React Router DOM v7 (SPA with 404 fallback), React Context i18n |
| **Backend & Veritabanı** | FastAPI (Python), Neon Serverless PostgreSQL, SQLAlchemy, Pydantic |
| **CI / CD & Barındırma** | GitHub Actions, GitHub Pages |

---

## 🚀 Hızlı Başlangıç (Quick Start)

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/omerabali/Me.git
cd Me
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama yerel olarak `http://localhost:5173` adresinde çalışacaktır.

---

## 📦 Scriptler ve Komutlar

| Komut | Açıklama |
| :--- | :--- |
| `npm run dev` | Yerel Vite geliştirme sunucusunu başlatır (`localhost:5173`). |
| `npm run fetch-repos` | GitHub API'den repoları çekip `src/data/repos.json` dosyasını günceller. |
| `npm run build` | Repoları eşitler, TypeScript tip kontrolü yapar, Vite bundle oluşturur ve GitHub Pages için `404.html` dosyasını hazırlar. |
| `npm run preview` | Üretilen `dist` çıktısını yerel olarak önizler. |

---

## 🌐 GitHub Pages & Domain Dağıtımı

Bu proje GitHub Actions ile entegre edilmiştir. Depoya kod push edildiğinde `.github/workflows/deploy.yml` tetiklenir ve siteyi otomatik olarak GitHub Pages ortamına derler.

### GitHub Pages Ayarları:
1. Depo sayfasında **Settings** ➔ **Pages** bölümüne gidin.
2. **Build and deployment > Source** seçeneğini **`GitHub Actions`** olarak belirleyin.
3. Otomasyon sitenizi `https://omerabali.github.io/Me/` adresine canlıya alacaktır.
4. *GitHub Education / Custom Domain:* Özel alan adınızı (örn. `omerabali.me`) aynı sayfadaki **Custom domain** kutusuna yazarak bağlayabilirsiniz.

---

## 📬 İletişim & Ağ

- **E-Posta:** [omerabali09@gmail.com](mailto:omerabali09@gmail.com)
- **LinkedIn:** [linkedin.com/in/omerabali](https://linkedin.com/in/omerabali)
- **GitHub:** [github.com/omerabali](https://github.com/omerabali)

---

<div align="center">
  <sub>Tasarım ve Geliştirme: <b>Ömer Abalı</b> · MIT Lisansı ile korunmaktadır.</sub>
</div>
