# 🌉 Bridge Design Pattern Implementation

Bu proje, **Bridge (Köprü)** tasarım deseninin Java dilindeki temel bir uygulamasını içermektedir. Bridge deseni, büyük bir sınıfı veya birbiriyle yakından ilişkili sınıflar kümesini, birbirinden bağımsız olarak geliştirilebilecek iki ayrı hiyerarşiye (Soyutlama ve Uygulama) ayırmayı amaçlar.



---

## 🚀 Proje Genel Bakış

Bu örnekte, bir veritabanı yönetim sistemi simüle edilmiştir. Amaç, veritabanı operasyonlarını (**Connector**) ve veritabanı platformlarını (**Platform**) birbirinden ayırarak, yeni bir platform eklendiğinde mevcut kod yapısını bozmadan genişletebilmektir.

### 🛠️ Kullanılan Teknolojiler
| Teknoloji | Açıklama |
| :--- | :--- |
| **Dil** | Java 17+ |
| **Desen** | Structural (Yapısal) - Bridge |
| **Araç** | IntelliJ IDEA / VS Code |

---

## 🏗️ Mimari Yapı

Bridge deseni iki ana sütun üzerine kuruludur:

### 1. Abstraction (Soyutlama)
Kullanıcının etkileşime girdiği yüksek seviyeli kontrol arayüzüdür.
* `DatabaseConnector` (Arayüz)
* `MySQLDatabaseConnector` (Gerçekleştirim)

### 2. Implementation (Uygulama)
Platforma özgü işlemlerin yapıldığı düşük seviyeli arayüzdür.
* `DatabasePlatform` (Arayüz)
* `MySQLConnection` (Gerçekleştirim)

---

## 💻 Kod Yapısı ve Akış

Aşağıdaki tabloda sınıfların rolleri ve sorumlulukları belirtilmiştir:

<div align="center">

| Katman | Sınıf / Interface | Görevi |
| :--- | :--- | :--- |
| **Abstraction** | `DatabaseConnector` | `connect()` ve `executeQuery()` metodlarını tanımlar. |
| **Refined Abstraction** | `MySQLDatabaseConnector` | Platform nesnesini kullanarak bağlantı mantığını yürütür. |
| **Implementor** | `DatabasePlatform` | Platforma özel konfigürasyon arayüzünü sunar. |
| **Concrete Implementor**| `MySQLConnection` | MySQL için spesifik bağlantı ayarlarını içerir. |

</div>

---

## 📝 Örnek Kullanım (Main)

```java
public class Main {
    public static void main(String[] args) {
        // Platform nesnesi oluşturulur
        DatabasePlatform platform = new MySQLConnection();
        
        // Soyutlama katmanı, platform nesnesi ile köprülenir
        DatabaseConnector mySQLDBConnector = new MySQLDatabaseConnector(platform);
        
        // İşlemler gerçekleştirilir
        mySQLDBConnector.connect();
        mySQLDBConnector.executeQuery("SELECT * FROM tbl.Users");
    }
}
