# 🎯 Strategy Design Pattern: Message Sender

<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/Pattern-Strategy-FF4500?style=for-the-badge" />
  <img src="https://img.shields.io/badge/OOP-Principles-blue?style=for-the-badge" />
</p>

---

## 📝 Proje Tanımı
Bu proje, mesaj gönderim sistemlerinde farklı stratejilerin (Email, E-Posta vb.) nasıl dinamik olarak değiştirilebileceğini gösteren bir **Strategy Pattern** uygulamasıdır. Kod, bağımlılıkları minimize ederek (Loose Coupling) sistemin yeni gönderim yöntemlerine kolayca adapte olmasını sağlar.



---

## 🏗️ Mimari Yapı

Sistem üç temel katmandan oluşmaktadır:

1.  **Strateji Arayüzü (`Mesaj`):** Tüm gönderim yöntemlerinin uyması gereken standart protokol.
2.  **Somut Stratejiler (`Email`, `Eposta`):** Mesajın nasıl gönderileceğine dair gerçek mantığı barındıran sınıflar.
3.  **Bağlam Sınıfı (`Yonerici`):** Hangi stratejinin kullanılacağını belirleyen ve istemciyle iletişim kuran yönetici sınıf.

---

## 🛠️ Sınıf Detayları ve Fonksiyonlar

<table style="width:100%">
  <thead>
    <tr style="background-color: #1b1f23; color: white;">
      <th>Sınıf / Arayüz</th>
      <th>Rol</th>
      <th>Açıklama</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>Mesaj</code></td>
      <td><b>Interface</b></td>
      <td><code>gonder()</code> metodunu tanımlayarak ortak bir çatı sunar.</td>
    </tr>
    <tr>
      <td><code>Email</code></td>
      <td><b>Strategy A</b></td>
      <td>Mesajı "Email" protokolü üzerinden simüle eder.</td>
    </tr>
    <tr>
      <td><code>Eposta</code></td>
      <td><b>Strategy B</b></td>
      <td>Mesajı "E-posta" protokolü üzerinden simüle eder.</td>
    </tr>
    <tr>
      <td><code>Yonerici</code></td>
      <td><b>Context</b></td>
      <td>Seçilen stratejiyi saklar ve tetikler.</td>
    </tr>
  </tbody>
</table>

---

## 🚀 Çalışma Mantığı

Kodun çalışma akışı şu şekildedir:

```mermaid
graph LR
A[Yonerici] --> B{Strateji Seçimi}
B --> C[Email Stratejisi]
B --> D[Eposta Stratejisi]
C --> E[Sonuç: Email ile gönderildi]
D --> E[Sonuç: Posta ile gönderildi]
