# 📚 Akıllı Kütüphane Yönetim Sistemi (Smart Library Management System)

<p align="center">
  <img src="https://img.shields.io/badge/C%23-.NET-blue?style=for-the-badge&logo=csharp"/>
  <img src="https://img.shields.io/badge/MS%20SQL%20Server-Database-red?style=for-the-badge&logo=microsoftsqlserver"/>
  <img src="https://img.shields.io/badge/Windows%20Forms-GUI-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Nielsen-Usability-success?style=for-the-badge"/>
</p>

---

## 👨‍💻 Geliştirici Ekibi

| Geliştirici | GitHub | LinkedIn |
| :--- | :--- | :--- |
| **Murat Aydoğan** | [🔗 murataydogan](https://github.com/murataydogan) | [🔗 LinkedIn](https://www.linkedin.com/in/murat-aydo%C4%9Fan-51587b298/) |
| **Kerem Yıldız** | [🔗 yldz1kerem](https://github.com/yldz1kerem) | [🔗 LinkedIn](https://www.linkedin.com/in/kerem-y%C4%B1ld%C4%B1z-ba4bb1362?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app) |
| **Ömer Abalı** | [🔗 omerabali](https://github.com/omerabali) | [🔗 LinkedIn](https://www.linkedin.com/in/omerabali/) |

---

## 📌 Proje Tanımı

**Akıllı Kütüphane Yönetim Sistemi**, üniversite kütüphanelerindeki materyal erişim, ödünç alma ve yönetim süreçlerini tamamen dijital ortama taşımak amacıyla geliştirilmiştir. 

Bu proje, akademik gereksinimlerin yanı sıra **Jakob Nielsen’in Kullanılabilirlik İlkeleri** dikkate alınarak tasarlanmıştır. Sistem; veritabanı entegrasyonu, gelişmiş veri doğrulama ve çoklu rol yönetimi (Öğrenci, Personel, Yönetici) ile güvenilir bir kullanıcı deneyimi sunar.

---

## 🏗 Teknik Mimari ve Teknolojiler

| Alan | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Programlama Dili** | C# | Uygulamanın geliştirme dili. |
| **Arayüz (GUI)** | Windows Forms | Dinamik ve kullanıcı dostu masaüstü arayüzü. |
| **Veritabanı** | MS SQL Server | İlişkisel veritabanı (KutuphaneDB) yönetimi. |
| **Güvenlik** | Katmanlı Doğrulama | Parola güçlülüğü ve zorunlu alan kontrolleri. |

---

## 💾 Veritabanı Tasarımı

Sistem, veri bütünlüğünü korumak amacıyla tasarlanmış ilişkisel bir veritabanı yapısı kullanır:

* **Kullanicilar:** Kimlik bilgileri, e-posta, şifre ve rol ilişkilerini saklar.
* **Kitaplar:** Kitap detayları, ISBN, stok durumu ve raf bilgilerini yönetir.
* **OduncIslemleri:** Ödünç alma, teslimat ve iade tarihlerini kronolojik olarak takip eder.
* **OduncDurumlari:** Beklemede, Onaylandı, Teslim Edildi, İade Edildi ve Gecikmiş durumlarını yönetir.

---

## ✨ Sistem Özellikleri

### 👤 Kullanıcı (Öğrenci) Modülü
* **Akıllı Arama:** Kategori, yazar ve yayın yılına göre filtreleme.
* **Durum Takibi:** Taleplerin hangi aşamada olduğunun (Beklemede, Onaylandı vb.) anlık izlenmesi.

### 🛠 Yönetim ve Personel Modülü
* **Envanter Yönetimi:** Admin yetkisiyle kitap ekleme, silme ve güncelleme işlemleri.
* **Süreç Yönetimi:** Personel tarafından ödünç taleplerinin onaylanması ve iade takibi.
* **Raporlama ve Analiz:** Günlük/aylık kullanım istatistikleri ve popüler kitap analizleri.

### 🛡️ Güvenlik ve Hata Yönetimi
* **Parola Güvenliği:** En az 8 karakter, büyük-küçük harf ve rakam zorunluluğu.
* **Stok Kontrolü:** Stoğu biten kitaplar için otomatik ödünç engelleme.
* **Veri Doğrulama:** Boş bırakılan alanlar ve hatalı girişler için kullanıcı dostu uyarılar.

---

## 🚀 Kurulum

1.  **Repository'i Klonlayın:**
    ```bash
    git clone [https://github.com/omerabali/Smart_Library_Management_System]
    ```
2.  **Veritabanı Ayarları:**
    * SQL Server üzerinden `KutuphaneDB` veritabanını oluşturun.
    * Projedeki `App.config` dosyasındaki bağlantı dizesini (connectionString) kendi sunucunuza göre düzenleyin.
3.  **Çalıştırın:** Visual Studio üzerinden projeyi açın ve derleyin.

---

*Bu proje Kırklareli Üniversitesi Mühendislik Fakültesi Yazılım Mühendisliği Bölümü Görsel Programlama dersi projesi olarak geliştirilmiştir.*
