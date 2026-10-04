🔗 Pro QR Kod Oluşturucu (Dynamic QR Destekli)

Bu proje, kullanıcının girdiği veriyi (URL, metin, vCard vb.) anında yüksek kaliteli SVG ve PNG formatında QR koduna dönüştüren modern ve karanlık temalı bir web uygulamasıdır. Özellikle **Dynamic QR Desteği** sayesinde, büyük boyutlu verilerin bile sorunsuz bir şekilde QR kodu olarak paylaşılmasını sağlar.

## ✨ Temel Özellikler

* **Canlı Önizleme:** Kullanıcı girişi anında QR kodu önizlemesini gösterir.
* **Hata Düzeltme Seviyeleri:** Kullanıcının ihtiyacına göre L, M, Q, H seviyelerinde hata düzeltme (Error Correction) seçeneği sunar.
* **Boyut Ayarı:** QR kodunun boyutunu (piksel cinsinden) ayarlayabilme imkanı.
* **Dynamic QR Desteği:**
    * QR kodunun taşıyabileceği veri kapasitesi aşıldığında, veri otomatik olarak ücretsiz `0x0.st` API'sine yüklenir ve QR kodu oluşturulur.
    * Bu, büyük metin blokları veya kodlar için dahi **kısa URL** üzerinden çalışan *Dynamic QR* çözümü sunar.
* **Çıktı Formatları:** Oluşturulan QR kodunu **PNG** ve **SVG** formatlarında indirme seçeneği.
* **Logo Ekleme (Opsiyonel):** Kullanıcının isteğe bağlı olarak bir görsel yükleyerek QR kodunun ortasına entegre etme altyapısı mevcuttur (Kod içinde bu özellik henüz tam olarak tamamlanmamış olup, arayüzde yer almaktadır).

## 🛠️ Kullanılan Teknolojiler

* **HTML5**
* **CSS3** (Modern, karanlık, `backdrop-filter` içeren neon temalı tasarım)
* **JavaScript (ES6+)**
* **Kütüphane:** `qrcode.min.js` (Hızlı ve güvenilir QR kod üretimi için)
* **API Entegrasyonu:** `0x0.st` (Büyük verileri yükleyip kısa URL üretmek için)

## 🚀 Kurulum ve Çalıştırma

Bu proje tamamen **Client-Side (İstemci Tarafı)** çalıştığı için herhangi bir sunucu kurulumu gerektirmez.

1.  Bu repository'yi klonlayın veya zip olarak indirin.
2.  `index.html` dosyasını herhangi bir web tarayıcıda (`Chrome`, `Firefox`, vb.) açın.

## 💡 Gelecek Geliştirmeler

* Logo entegrasyonu için Canvas işlemleri (SVG çıktısına logonun tam olarak yerleştirilmesi).
* Renk ve arka plan özelleştirme seçenekleri.
* Farklı veri tipleri için (vCard, WiFi, E-posta) otomatik formatlama.
