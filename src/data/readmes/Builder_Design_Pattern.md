# 🏗️ Builder Design Pattern: Computer Assembly Simulation

Bu proje, karmaşık nesne yapılarını (Product) oluşturma mantığını (Builder) ve bu süreci yöneten kontrol mekanizmasını (Director) birbirinden ayıran **Builder (Kurucu)** tasarım deseninin Java uygulamasını içerir.



---

## 🧐 Nedir Bu Builder Deseni?

Builder deseni, bir nesnenin oluşturulma adımlarını soyutlar. Özellikle bir nesne oluşturulurken çok fazla parametre gerekiyorsa veya nesnenin farklı varyasyonları (Gaming vs. Office PC) varsa, kodun okunabilirliğini ve yönetilebilirliğini artırır.

### 🧩 Tasarım Bileşenleri

| Bileşen | Sınıf İsmi | Görevi |
| :--- | :--- | :--- |
| **Product** | `Computer` | Oluşturulacak karmaşık nesne. |
| **Builder Interface** | `ComputerBuilder` | Adımları (CPU, RAM vb.) tanımlayan arayüz. |
| **Concrete Builder** | `GamingComputerBuilder` | Ürünü adım adım inşa eden gerçek sınıf. |
| **Director** | `ComputerDirector` | Belirli bir inşa akışını (Gaming/Office) yöneten sınıf. |

---

## 🏗️ Mimarinin İşleyişi

Projenin temel işleyişi şu şekildedir:

1. **İnşa Planı:** `ComputerBuilder` arayüzü ile bir bilgisayarın hangi parçalardan oluşacağı standartlaştırılır.
2. **Uygulama:** `GamingComputerBuilder`, bu parçaları somut olarak nasıl birleştireceğini bilir.
3. **Yönetim:** `ComputerDirector`, hangi parçaların hangi konfigürasyonla (i9 işlemci, 64GB RAM vb.) birleşeceğine karar verir.

---

## 💻 Kod Üzerinden Örnek Kullanım

```java
// Builder nesnesini hazırla
ComputerBuilder builder = new GamingComputerBuilder();

// Yöneticiye builder'ı teslim et
ComputerDirector director = new ComputerDirector(builder);

// Yönetici önceden tanımlanmış senaryolara göre bilgisayarı inşa eder
Computer gamingPC = director.constructGamingComputer();
System.out.println("Oyun Bilgisayarı: " + gamingPC);

Computer officePC = director.constructOfficeComputer();
System.out.println("Ofis Bilgisayarı: " + officePC);
