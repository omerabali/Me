# 🏧 ATM State Design Pattern

<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/Design_Pattern-State-007ACC?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge" />
</p>

---

## 📖 Proje Hakkında
Bu proje, bir ATM'nin işleyişini **State (Durum) Tasarım Kalıbı** kullanarak simüle eder. Yazılımın içerisinde karmaşık `if-else` yapıları yerine, her bir ATM durumu (Kart Yok, Şifre Girildi vb.) ayrı birer nesne olarak yönetilir.



---

## 🛠️ Sistem Mimarisi

ATM sistemi toplamda 3 ana durumdan oluşmaktadır. Durumlar arası geçişler kullanıcı etkileşimine göre tetiklenir:

<div align="center">

| Durum Sınıfı | Açıklama | Sonraki Olası Durum |
| :--- | :--- | :--- |
| <code style="color: #e74c3c;">NoCardState</code> | Kart takılmamış durum. | `HasCardState` |
| <code style="color: #f1c40f;">HasCardState</code> | Kart takılı, şifre bekleniyor. | `HasCorrectPinState` |
| <code style="color: #2ecc71;">HasCorrectPinState</code> | Şifre doğru, işlemler aktif. | `NoCardState` |

</div>

---

## 🚀 Kod Yapısı ve Akış

Proje, genişletilebilir ve sürdürülebilir bir yapı sunar. İşte temel bileşenler:

### 1. Durum Arayüzü (Interface)
`ATMState` arayüzü, tüm durum sınıflarının uygulaması gereken metodları tanımlar:
- `insertCard()`
- `enterPin()`
- `ejectCard()`
- `withdrawCash()`

### 2. Bağlam (Context) Sınıfı
`ATMMachine` sınıfı, mevcut durumu (`currentState`) bünyesinde barındırır ve istemciden gelen istekleri o anki duruma yönlendirir.

---

## 💻 Kullanım Örneği

Sistem şu şekilde çalışmaktadır:

```java
ATMMachine atmMachine = new ATMMachine(1650);

atmMachine.insertCard();      // Kart takıldı
atmMachine.enterPin(1234);    // Şifre doğrulandı
atmMachine.withdrawCash(650); // Para çekildi
atmMachine.ejectCard();       // Kart iade edildi
