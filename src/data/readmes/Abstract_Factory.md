 Abstract Factory Design Pattern – Araba Üretim Sistemi

Bu proje, Abstract Factory Design Pattern örneğidir.
Amaç, bir ürün ailesini (motor + koltuk) marka (BMW / Audi) bazlı şekilde üretmektir.

 Amaç

Birbirleriyle ilişkili ürün gruplarını üretmek

Markaya özel komponentleri bir arada sunmak

Kodun genişletilebilirliğini ve bağımlılığı azaltmak

 Proje Yapısı
src/
 ├── Engine.java
 ├── Seat.java
 ├── BMWEngine.java
 ├── BMWSeat.java
 ├── AudiEngine.java
 ├── AudiSeat.java
 ├── CarFactory.java
 ├── BMWFactory.java
 ├── AudiFactory.java
 └── Main.java

 Yapının Açıklaması
Engine & Seat (Interface)

Tüm motor ve koltuk tipleri için temel davranışları tanımlar.

BMW Ürün Ailesi

BMWEngine

BMWSeat

BMW markasına özgü motor ve koltuk üretir.

Audi Ürün Ailesi

AudiEngine

AudiSeat

Audi markasına özgü motor ve koltuk üretir.

🏭 Abstract Factory
CarFactory

Bir araç için 2 ürün üretir:

Motor

Koltuk

Concrete Factories

BMWFactory → BMW motor + koltuk üretir

AudiFactory → Audi motor + koltuk üretir

 Kullanım
CarFactory factory = new BMWFactory();
Engine engine = factory.createEngine();
Seat seat = factory.createSeat();

engine.start();
seat.sit();

 Abstract Factory Neden Kullanılır?

Ürünlerin birbiriyle uyumlu olmasını sağlar

Marka bazlı ürünlerin birlikte üretilmesi gerektiğinde ideal

Yeni bir marka eklemek çok kolaydır

Kod daha düzenli ve yönetilebilir olur
