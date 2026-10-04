Payment Factory - Java Ödeme Sistemi

Bu proje, Java’da Factory Design Pattern kullanımını gösteren basit bir ödeme sistemi örneğidir. Kullanıcıdan alınan ödeme türüne göre (Kredi Kartı veya Banka Transferi) uygun ödeme nesnesi oluşturulur ve ödeme işlemi gerçekleştirilir.

 Amaç

Factory Pattern mantığını göstermek

Kodun genişletilebilirliğini artırmak

Yeni ödeme yöntemlerinin kolayca eklenebilmesi

 Proje Yapısı
src/
 ├── Main.java
 ├── Payment.java
 ├── PaymentFactory.java
 ├── CreditCardPayment.java
 └── BankTransferPayment.java

 Sınıfların Açıklamaları
Payment (Interface)

Tüm ödeme türleri için ortak bir davranış tanımlar.

CreditCardPayment

Kredi kartı ile ödeme işlemini gerçekleştirir.

BankTransferPayment

EFT/Havale ile ödeme işlemini gerçekleştirir.

PaymentFactory

Verilen ödeme tipine göre doğru ödeme sınıfını oluşturan fabrikadır.

Main

Uygulamanın çalıştırıldığı sınıf.

 Kullanım

Main içinde ödeme tipi belirtilerek sistem çalıştırılır:

Payment payment = PaymentFactory.createPayment("CreditCard");
payment.processPayment();


Çıktı:

Kredi kartı ile ödemeniz gerçekleştirildi.

 Yeni Ödeme Yöntemi Eklemek

Payment arayüzünü implemente eden yeni bir sınıf oluştur.

processPayment() metodunu doldur.

PaymentFactory içine yeni ödeme tipini ekle.

 Kullanılan Tasarım Deseni

Bu proje Factory Design Pattern örneğidir.
Nesne oluşturma işlemini merkezileştirerek kodun modüler ve genişletilebilir olmasını sağlar.
