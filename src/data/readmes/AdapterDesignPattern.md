# 🔌 Adapter Design Pattern: Media Player System

<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/Pattern-Adapter-9b59b6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Interface-Compatibility-brightgreen?style=for-the-badge" />
</p>

---

## 📖 Proje Hakkında
Bu çalışma, farklı video/ses oynatıcı motorlarını (VLC ve Windows Media Player) ortak bir arayüz üzerinden konuşturmayı amaçlayan **Adapter Pattern** uygulamasıdır. Sistem, mevcut kod yapısını bozmadan, uyumsuz sınıfları bir "adaptör" aracılığıyla sisteme dahil eder.



---

## 🏗️ Mimari Katmanlar

Sistemin çalışma prensibi şu bileşenlere dayanır:

1.  **Hedef Arayüz (`MediaPlayer`):** Sistemin beklediği standart oynatma protokolü.
2.  **Adaptör (`MediaAdapter`):** Hedef arayüzü uygular ve uyumsuz sınıfların metodlarını çağırarak köprü kurar.
3.  **Uyumsuz Sınıflar (`VLCPlayer` & `WindowsMediaPlayer`):** Kendine has metod isimlerine sahip, doğrudan `MediaPlayer` arayüzünü tanımayan sınıflar.
4.  **İstemci (`AudioPlayer`):** Adaptörü kullanarak işlemleri gerçekleştiren ana sınıf.

---

## 🛠️ Dönüşüm Tablosu

Adaptör sınıfı, gelen istekleri aşağıdaki gibi yönlendirir:

<div align="center">

| Dosya Formatı | Kullanılan Adaptör | Hedef Motor (Concrete Class) | Çalıştırılan Metod |
| :--- | :--- | :--- | :--- |
| **MP4** | `MediaAdapter` | `WindowsMediaPlayer` | `playMediaPlayer()` |
| **WEBM** | `MediaAdapter` | `VLCPlayer` | `playVLCPlayer()` |
| **MOV** | *Desteklenmiyor* | - | - |

</div>

---

## 🚀 Örnek Kullanım Akışı

Sistemin çalışma mantığı oldukça esnektir:

```java
AudioPlayer player = new AudioPlayer();

// MP4 formatı Windows Media Player'a adapte edilir
player.play("mp4", "Yüzüklerin Efendisi.mp4");

// WEBM formatı VLC Player'a adapte edilir
player.play("webm", "Harry Potter.webm");
