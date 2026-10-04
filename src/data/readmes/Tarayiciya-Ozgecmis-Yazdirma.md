Simple Web Server

Bu proje, Java kullanarak temel bir HTTP sunucusu oluşturan bir uygulamadır. Sunucu, 1989 numaralı port üzerinden istemcilerin bağlantı taleplerini kabul eder ve basit bir HTML sayfası döndürür.

Özellikler

Socket Programlama: Java ServerSocket sınıfı kullanılarak temel bir web sunucusu oluşturulmuştur.

HTTP Yanıtı: Bağlanan istemcilere HTML formatında bir yanıt döndürülür.

Kişisel Bilgiler Sayfası: Sunucu tarafından döndürülen HTML sayfasında, kişinin adı, öğrenci numarası, iletişim bilgileri, yetenekleri ve deneyimleri bulunmaktadır.

CSS Tasarımı: HTML sayfası modern bir görünüm sağlamak için CSS ile stillendirilmiştir.

Bağlantı Bilgileri: GitHub ve LinkedIn profilleri sayfada bağlantılar olarak eklenmiştir.

Gereksinimler

Bu projeyi çalıştırmak için aşağıdaki gereksinimlere sahip olmanız gerekmektedir:

Java JDK (8 veya üstü)

Komut Satırı veya Terminal

Kurulum ve Çalıştırma

Projeyi Klonlayın veya Dosyaları İndirin :git clone https://github.com/KLU1230505006/SimpleWebServer.git

Java Dosyasını Derleyin :javac SimpleWebServer.java

Sunucuyu Başlatın :java SimpleWebServer

Web Tarayıcınızı Açın ve Sunucuya Bağlanın Tarayıcınıza aşağıdaki adresi yazın ve sayfayı görüntüleyin: http://localhost:1989

Kod Açıklaması

Sunucu Açılışı: ServerSocket nesnesi oluşturularak 1989 numaralı port dinlenmeye başlanır.

İstemci Bağlantısı: Sunucu, istemcilerden gelen bağlantıları kabul eder ve giriş akışı üzerinden HTTP isteğini okur.

Yanıt Gönderme: Sunucu, istemciye HTTP 200 yanıtı ile bir HTML sayfası gönderir.

HTML ve CSS: Sayfanın şık bir tasarıma sahip olması için style etiketi ile CSS kullanılmıştır.

Örnek Çıktı

Sunucu çalıştırıldıktan sonra tarayıcıda aşağıdaki gibi bir sayfa görüntülenecektir:

Ad Soyad: Ömer Abalı

Öğrenci Numarası: 1230505006

E-posta, Telefon, Yaş, Bölüm Bilgileri

GitHub ve LinkedIn Profilleri

Yetenekler (HTML, CSS, Java, C, Python, C++)

Deneyimler (Yazılım Mühendisi, Web Geliştirici, Stajyer)
