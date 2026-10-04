 City List – Singleton Design Pattern Örneği

Bu proje, Java’da Singleton Tasarım Deseni kullanımını gösteren basit bir şehir listesi uygulamasıdır. Amaç, uygulama boyunca şehir listesini yöneten sınıfın yalnızca bir kez oluşturulmasını ve her yerden aynı örneğin kullanılmasını sağlamaktır.

 Projenin Amacı

Bir sınıfın yalnızca tek bir örneğe sahip olmasını garanti etmek

Bu örneğe uygulamanın her yerinden global erişim sağlamak

Veri yükleme gibi maliyetli işlemlerin gereksiz yere tekrar oluşturulmasını engellemek

Singleton Pattern’in temel mantığını pratik olarak göstermek

 Proje Nasıl Çalışır?

Uygulamada bir CityListSingleton sınıfı bulunur. Bu sınıf:

Program boyunca yalnızca bir kez oluşturulur.

İlk kez çağrıldığında şehir listesini hazırlar.

Tarih ve saat gibi bilgileri sadece ilk oluşturulduğu anda üretir.

Daha sonraki tüm çağrılarda aynı örnek geri döner.

Yani program birden fazla kez şehir listesini istese bile aynı nesne kullanılır.

🧠 Neden Singleton Kullanıldı?

Bu örnekte şehir listesini almak biraz "maliyetli" bir işlem gibi simüle edilmiştir (örneğin: bekleme süresi).

Singleton sayesinde:

Aynı işlem tekrar tekrar yapılmaz,

Zaman kazandırır,

Gereksiz bellek tüketimini önler.

Bu yapı; cache, veritabanı bağlantıları, konfigürasyon yönetimi, log sistemi gibi birçok gerçek projede kullanılır.

 Programdan Beklenen Davranış

Uygulama, iki farklı noktada şehir listesini çağırır.
Ancak Singleton sayesinde:

Sadece ilk çağrıda yükleme yapılır,

İkinci çağrı aynı örneği kullanır,

Saat bilgisi her iki çağrıda da aynı kalır.

Bu, Singleton’ın doğru çalıştığının bir göstergesidir.

 Singleton Pattern’in Avantajları

Tek örnek garantisi

Global erişilebilirlik

Performans ve kaynak tasarrufu

Veri tutarlılığı

 Dezavantajları

Yanlış kullanılırsa global bağımlılık oluşturabilir

Çok iş parçacıklı yapılarda ek önlem gerektirir
