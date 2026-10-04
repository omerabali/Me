<div align="center">
  <img src="public/mixboard-image.png" alt="TerraWatch Logo" width="220" style="filter: drop-shadow(0 0 20px rgba(14, 165, 233, 0.4));"/>

  # <span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; letter-spacing: -1px; color: #0ea5e9;">T E R R A W A T C H</span>
  ### <span style="color: #64748b; font-weight: 400;">Global Agriculture Intelligence • Signal Analysis • Strategic IoT Engine</span>

  **Kesintisiz Veri Akışı** • **Otonom Sensör Analizi** • **Prediktif Karar Destek**

  [🌐 Canlı Demo](https://terrawatch-demo.com) • [📖 Dokümantasyon](#) • [💬 LinkedIn](https://www.linkedin.com/in/omerabali)

  ![License](https://img.shields.io/badge/license-MIT-0ea5e9.svg)
  ![React](https://img.shields.io/badge/Frontend-React%2018-61dafb?logo=react)
  ![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6?logo=typescript)
  ![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase)
  ![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)

  <br/>
  <p align="center">
    <b>"Gürültüden Sinyali Ayıklayın."</b><br/>
    Konvansiyonel tarım verilerini fütüristik bir istihbarat merkezine dönüştüren, yüksek performanslı sinyal analiz platformu.
  </p>
</div>

---

## 🎯 TerraWatch Nedir? (The Vision)

**TerraWatch**, modern tarım çağının en temel paradoksu olan "bilgi asimetrisi" ve "verim kaybını" çözmek amacıyla tasarlanmış, uçtan uca otonom bir tarımsal istihbarat ekosistemidir. Basit bir sensör izleyiciden öte; veriyi otonom olarak işleyen, önceliklendiren ve kullanıcıya stratejik bir "görüş netliği" sunan bir karar destek mekanizmasıdır.

### Temel Değer Önerileri (Core Value Props)

1.  **Autonomous IoT Pipeline**: 7/24 kesintisiz veri madenciliği yapan, ESP32 ve Raspberry Pi düğümlerinden gelen sinyalleri normalize eden merkezi motor.
2.  **Intelligence & Analysis**: Verileri sadece listelemez; anlık durum analizi ile (Kritik/Uyarı/Normal) kategorize eder ve meta-veriler ekler.
3.  **Real-time Visualization**: PostgreSQL Realtime altyapısını kullanarak sensör değişimlerini milisaniyeler içinde arayüze yansıtır.
4.  **Offline-First Infrastructure**: İnternet bağlantısı kesildiğinde dahi kesintisiz erişim sağlayan LocalStorage tabanlı persistency katmanı.

---

## 🏗️ Mimari ve Teknik Altyapı (Architecture & Tech Stack)

TerraWatch, yüksek ölçeklenebilir ve modüler bir mikro-mimari üzerine inşa edilmiştir.

### Teknik Katmanlar
- **Data Orchestration layer**: TanStack Query (v5) kullanılarak asenkron veri akışı, global önbellek yönetimi ve iyimser güncellemeler (optimistic updates) optimize edilmiştir.
- **Embedded Layer**: ESP32 Firmware ve Python Client scriptleri ile saha verilerinin güvenli iletimi.
- **Identity & Security**: Supabase Auth tabanlı, JWT bazlı yetkilendirme ve veritabanı seviyesinde Row Level Security (RLS) politikaları.

```mermaid
graph TD
    Sources[IoT Sensör Düğümleri] --> Ingest{Edge Function}
    Ingest --> DB[(Supabase Cloud)]
    DB --> Realtime[Realtime Subscriptions]
    Realtime --> Hooks[Custom Intelligence Hooks]
    Hooks --> UI[Modern React Dashboard]
    UI --> User((Karar Verici))
    style Ingest fill:#0ea5e9,stroke:#fff,stroke-width:2px,color:#fff
```

---

## 🚀 Gelişmiş Özellikler (Advanced Features)

### 🧠 Akıllı Eşik Yönetimi
Sistem, belirlenen sınır değerlerine göre otonom kararlar verir:
- **Dinamik Skorlama:** Toprak nemi ve sıcaklık oranlarına göre bitki sağlığı skorlanır.
- **Prediktif Bildirimler:** Don riski veya aşırı kuruma gibi durumlar gerçekleşmeden önce uyarı sinyalleri üretilir.

### ⚡ Kesintisiz Veri ve Offline Desteği
- **Auto-Sync:** Belirlenen interval aralıklarıyla durmaksızın veri yenileme.
- **Offline Persistence:** `useOfflineData` ile verilerin yerel depolanması ve bağlantı durumuna göre dinamik toast bildirimleri.

### 📊 Veri İndirme ve Raporlama
- **Advanced Export:** Son 7 veya 30 günlük verileri analiz için tek tıkla CSV formatında dışa aktarma.
- **Trend Analizi:** Recharts tabanlı dinamik grafikler ile uzun vadeli değişim takibi.

---

## 🛠️ Teknik Envanter (Inventory)

| Bileşen | Teknoloji | Mimari Karar Nedeni |
|:---|:---|:---|
| **Platform** | React 18 + Vite | Modern, tree-shaking destekli ve hızlı altyapı. |
| **Mobile** | Capacitor | Hibrit mobil uygulama desteği ile her yerden erişim. |
| **Logic** | Custom TypeScript Hooks | İş mantığının arayüzden soyutlanması. |
| **Backend** | Supabase (Postgres) | Real-time yetenekler ve dahili Auth desteği. |
| **Styling** | Shadcn UI + Tailwind | Erişilebilirlik standartlarına uygun UI. |

---

## ⚙️ Kurulum ve Geliştirme (Setup)

```bash
# 1. Projeyi Klonlayın
git clone https://github.com/omerabali/terrawatch.git

# 2. Bağımlılıkları Yükleyin
npm install

# 3. Ortam Değişkenlerini Tanımlayın (.env)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# 4. Geliştirici Sunucusunu Başlatın
npm run dev
```

---

## 👤 Geliştirici (Author)

**Ömer Abalı**

Yapay zeka odaklı uygulamalar, IoT veri hatları ve modern web mimarileri üzerine uzmanlaşmış bir geliştirici.

- 💼 LinkedIn: [linkedin.com/in/omerabali](https://linkedin.com/in/omerabali)
- 🖥️ GitHub: [github.com/omerabali](https://github.com/omerabali)

---

<div align="center">
  <br/>
  <a href="https://www.linkedin.com/in/omerabali" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Visit_Profile-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <br/><br/>
  <strong>TERRAWATCH | Her Şeyi Gör. Sinyali Yakala.</strong><br/>
  <br/>
  Made with ❤️ for high-performance agricultural mapping.
</div>


<img width="1600" height="899" alt="WhatsApp Image 2026-04-16 at 15 17 07" src="https://github.com/user-attachments/assets/b7e3638b-d50a-415c-af68-33e8349b3292" />

<img width="945" height="2048" alt="WhatsApp Image 2026-04-16 at 15 16 18" src="https://github.com/user-attachments/assets/7a2bbcbe-0ee6-4157-84b3-5960a3c76c9c" />
<img width="1530" height="2040" alt="WhatsApp Image 2026-04-16 at 15 18 59" src="https://github.com/user-attachments/assets/8f7ba98f-105b-465a-87c9-ad157ef1c53b" />
<img width="1530" height="2040" alt="WhatsApp Image 2026-04-16 at 15 18 58" src="https://github.com/user-attachments/assets/8a87e76c-9305-493d-924b-70fe06c4a315" />
<img width="1530" height="2040" alt="WhatsApp Image 2026-04-16 at 15 18 58 (1)" src="https://github.com/user-attachments/assets/3c3abf59-cccc-4e14-98a5-37aa7f46789d" />
<img width="1919" height="1079" alt="Ekran görüntüsü 2026-04-16 151500" src="https://github.com/user-attachments/assets/c48466a2-57ea-4430-9efe-ddd8688c3514" />
<img width="1915" height="1079" alt="Ekran görüntüsü 2026-04-16 151640" src="https://github.com/user-attachments/assets/be8a4df2-32f7-48f1-ba3a-ddeb20ddf2c0" />
<img width="1919" height="1079" alt="Ekran görüntüsü 2026-04-16 151629" src="https://github.com/user-attachments/assets/cf0a7ab8-09f4-40cd-a72b-6222c02eda64" />

