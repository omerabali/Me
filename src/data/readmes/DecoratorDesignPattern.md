# 💻 Computer Configurator: Decorator Design Pattern

<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/Pattern-Decorator-E74C3C?style=for-the-badge" />
  <img src="https://img.shields.io/badge/OOP-Structural-blueviolet?style=for-the-badge" />
</p>

---

## 📖 Proje Hakkında
Bu proje, bir bilgisayarın donanım bileşenlerini dinamik olarak özelleştirmek için kullanılan **Decorator Pattern** uygulamasını içerir. Ana amaç, temel bir nesneye (Temel Bilgisayar) mevcut sınıfları değiştirmeden yeni sorumluluklar (RAM, Depolama) eklemektir.



---

## 🏗️ Mimari Katmanlar

Sistem, "iç içe geçen matruşka bebekleri" gibi çalışan bir yapıya sahiptir:

1.  **Bileşen Arayüzü (`Bilgisayar`):** Hem temel nesnelerin hem de dekoratörlerin uyması gereken ortak arayüz.
2.  **Somut Bileşen (`Temel Bilgisayar`):** Üzerine ekleme yapılacak olan temel sınıf.
3.  **Soyut Dekoratör (`BilgisayarDecorator`):** Bileşen nesnesini sarmalayan ve dekoratör sınıfları için temel oluşturan yapı.
4.  **Somut Dekoratörler (`RamEkleDecorator`, `DepolamaBirimiEkleDecorator`):** Gerçek özellikleri (fiyat artışı ve açıklama güncellemesi) ekleyen sınıflar.

---

## 🛠️ Donanım ve Fiyatlandırma Tablosu

Dekoratörler, temel fiyatın üzerine aşağıdaki değerleri ekler:

<div align="center">

| Eklenti | Parametre | Ek Fiyat (TL) | Açıklama Güncellemesi |
| :--- | :--- | :--- | :--- |
| **Temel Bilgisayar** | - | 30.000 | "Temel Bilgisayar" |
| **RAM Dekoratörü** | 8 GB | +4.500 | "+ 8 GB Ram eklendi." |
| **RAM Dekoratörü** | 16 GB | +9.000 | "+ 16 GB Ram eklendi." |
| **RAM Dekoratörü** | 32 GB | +16.000 | "+ 32 GB Ram eklendi." |
| **SSD Dekoratörü** | 2 TB | +5.000 | "+ 2 TB SSD Disk eklendi." |

</div>

---

## 🚀 Dinamik Nesne Oluşturma Mantığı

Kod içerisinde nesneler birbirini sarmalayarak (wrapping) birikir:

```java
// Adım 1: Temel Bilgisayar
Bilgisayar pc = new TemelBilgisayar();

// Adım 2: RAM eklenmiş hali (Sarmalama 1)
pc = new RamEkleDecorator(pc, 32);

// Adım 3: SSD eklenmiş hali (Sarmalama 2)
pc = new DepolamaBirimiEkleDecorator(pc);
