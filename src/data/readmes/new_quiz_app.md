# Quiz Uygulaması (Flutter)

Bu proje, öğrencilerin temel programlama dilleri ve teknolojileri üzerindeki bilgilerini test etmelerini sağlayan modern ve interaktif bir mobil quiz uygulamasıdır. Material 3 tasarım prensipleriyle geliştirilmiş, kullanıcı dostu ve akıcı bir deneyim sunar.

## 🚀 Özellikler

- **Dört Farklı Kategori:** Java, Flutter, Python ve React konularında uzmanlık testleri.
- **Dinamik Soru Havuzu:** Her kategori için yerel JSON dosyalarından yüklenen ve her açılışta karıştırılarak gelen sorular.
- **Zaman Sınırı:** Her soru için heyecanı artıran 15 saniyelik geri sayım sayacı.
- **Anlık Geri Bildirim:** Cevap verildiği anda doğru ve yanlış seçeneklerin görsel ve animasyonlu olarak belirtilmesi.
- **Kapsamlı Sonuç Ekranı:** Quiz sonunda toplam puan, başarı oranı ve performansa özel motivasyon mesajları.
- **Premium Tasarım:** Google Fonts (Poppins) entegrasyonu, modern renk paletleri ve mikro animasyonlar.
- **Çoklu Platform Desteği:** Android, iOS, Windows ve Web (Chrome/Edge) üzerinde sorunsuz çalışma.

## 🛠️ Kullanılan Teknolojiler

- **Flutter & Dart:** Uygulama geliştirme framework'ü.
- **Material 3:** Modern kullanıcı arayüzü bileşenleri.
- **Google Fonts:** Profesyonel tipografi.
- **JSON Serialization:** Veri yönetimi ve soru yükleme işlemleri.

## 📦 Kurulum ve Çalıştırma

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Gereksinimler:** Bilgisayarınızda Flutter SDK'nın kurulu ve PATH'e ekli olduğundan emin olun.
2.  **Paketleri Yükleme:** Terminali proje ana dizininde açın ve bağımlılıkları yüklemek için şu komutu çalıştırın:
    ```bash
    flutter pub get
    ```
3.  **Uygulamayı Başlatma:** 
    - Uygulamayı bir emülatörde veya bağlı bir cihazda başlatmak için:
      ```bash
      flutter run
      ```
    - Windows masaüstü uygulaması olarak çalıştırmak için:
      ```bash
      flutter run -d windows
      ```
    - Tarayıcıda (Chrome) test etmek için:
      ```bash
      flutter run -d chrome
      ```

> **Not:** Eğer proje size ZIP olarak ulaştıysa, çalıştırmadan önce klasöre çıkarttığınızdan emin olun. `build/` klasörü boyut tasarrufu için silinmiş olabilir, `flutter pub get` komutu sonrası ilk çalıştırmada otomatik olarak tekrar oluşturulacaktır.

## 📂 Proje Yapısı

- `lib/data/`: JSON verilerini okuyan ve işleyen loader sınıfı.
- `lib/models/`: Projede kullanılan veri modelleri (Question class).
- `lib/screens/`: Ana kategori seçimi, quiz arayüzü ve sonuç ekranları.
- `lib/widgets/`: Zamanlayıcı (Timer) ve butonlar (OptionButton) gibi özelleştirilmiş bileşenler.
- `assets/questions/`: Kategori bazlı soru dosyaları.

---
*Bu proje, mobil uygulama geliştirme dersi gereksinimlerine uygun olarak hazırlanmış akademik bir çalışmadır.*
