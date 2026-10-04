# Tarımsal Görüntü İşleme: Ürün Sırası Segmentasyonu ve Boşluk Analizi

Bu proje, hassas tarım uygulamaları kapsamında tarla görüntülerindeki ürün sıralarını tespit etmek ve bu sıralar üzerindeki bitki eksikliklerini (boşlukları) sayısal olarak analiz etmek amacıyla geliştirilmiştir. Çalışmada klasik görüntü işleme teknikleri ve morfolojik operatörler kullanılarak yüksek doğrulukta sonuçlar elde edilmiştir.

## 🎯 Projenin Amacı
Projenin temel amacı, yer seviyesinden çekilmiş tarla görüntülerinde perspektif bozulmalarını aşarak ürün sıralarını birbirinden ayırmak ve her bir sıra özelinde bitki yoğunluğu analizini gerçekleştirmektir. Elde edilen veriler, rekolte tahmini ve ekim stratejilerinin iyileştirilmesi için kullanılabilir.

## 🏛️ Uygulanan Metodoloji

### 1. Perspektif Kontrollü Sıra Segmentasyonu
Görüntülerdeki perspektif etkisi nedeniyle sıraların ufuk çizgisinde birleşmesi sorununu çözmek için **"Cut-Top ROI Masking"** yaklaşımı geliştirilmiştir:
- Görüntünün üst bölgesi filtrelenerek sıraların ayrık olduğu alanlara odaklanılmıştır.
- **Connectivity-4** komşuluk algoritması ile dikey hatlar birbirine temas etmeden başarıyla segmente edilmiştir.
- Her sıra otomatik olarak numaralandırılmıştır (`Row-1`, `Row-2` vb.).

### 2. Spektral Analiz ve Boşluk Tespiti
Bitki varlığını tespit etmek için **HSV (Hue-Saturation-Value)** renk uzayında analiz yapılmıştır:
- Yeşil spektrumdaki pikseller filtrelenerek bitki maskesi oluşturulmuştur.
- Ürün sırası maskesi ile bitki maskesi arasındaki fark (difference) alınarak boş alanlar saptanmıştır.
- Küçük gürültüleri engellemek için 500 $px^2$ altındaki alanlar filtrelenmiş, sadece anlamlı boşluklar rapora dahil edilmiştir.

### 3. Metrik Hesaplama ve Raporlama
Tespit edilen her boşluk için aşağıdaki veriler üretilmektedir:
- **Konum:** Boşluğun görüntü üzerindeki merkez koordinatları (x, y).
- **Boyut:** Boşluğun genişlik ve yükseklik (uzunluk) değerleri.
- **Alan:** GSD (Ground Sample Distance) varsayımı ($1 \text{ px} = 0.5 \text{ cm}$) üzerinden gerçek dünya birimiyle ($m^2$) alan hesabı.

## 🏗️ Kullanılan Teknolojiler
- **Python 3.10+**
- **OpenCV:** Görüntü işleme ve filtreleme işlemleri.
- **Pandas & NumPy:** Veri analizi ve metrik hesaplamaları.
- **Matplotlib:** Sonuçların görselleştirilmesi.

## 🚀 Kurulum ve Çalıştırma
1. Gerekli kütüphaneleri yükleyin:
   ```bash
   pip install -r requirements.txt
