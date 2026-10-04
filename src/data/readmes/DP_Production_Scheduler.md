Üretim Planlama Algoritması
Proje Hakkında
Bu proje, dinamik programlama (DP) yöntemini kullanarak bir üretim hattındaki işlerin tamamlanma süresini minimize etmeyi hedefler. Amaç, her biri farklı makineye atanabilen n adet işin, m adet makine kullanılarak tamamlanma süresinin toplamını en aza indirmektir. Makineler arasında geçiş yapıldığında, geçiş maliyetleri de dikkate alınır.

Proje, her işin her makinedeki tamamlanma süresini ve makineler arası geçiş maliyetlerini rastgele olarak üretir ve ardından en düşük toplam süreyi bulmak için dinamik programlama yaklaşımını uygular.

Özellikler
İş Sayısı (n): 1 ile 100 arasında rastgele seçilir.
Makine Sayısı (m): 1 ile 50 arasında rastgele seçilir.
İş Süreleri: Her işin her makinedeki tamamlanma süresi 1 ile 100 saniye arasında rastgele belirlenir.
Geçiş Maliyetleri: Makineler arasındaki geçiş maliyetleri 0 ile 20 arasında rastgele belirlenir.
Hedef: Tüm işleri sırayla tamamlamak için minimum toplam süreyi hesaplamak.

Kullanılan Yöntem
Dinamik Programlama (DP)
Dinamik programlama tablosu (dp[i][j]), i numaralı işin j numaralı makinede tamamlanmasının ardından elde edilecek minimum toplam süreyi tutar.

Tablo başlangıçta tüm değerler sonsuz olarak atanır.
İlk iş için, sadece her makinedeki işin süresi alınır.
Diğer işler için, her işin her makinesi için, bir önceki işin her makinesine geçişin toplam maliyeti hesaplanır.
En düşük maliyetli geçişler bulunarak dinamik tablodaki değerler güncellenir.

Karmaşıklıklar
Zaman Karmaşıklığı: O(n * m²)
Her iş için, her makineyi kontrol ederiz, ve her makine için bir önceki işin her makinesini kontrol ederiz.

Uzay Karmaşıklığı: O(n * m)
Dinamik programlama tablosunun yanı sıra, iş süreleri ve geçiş maliyetleri için ek bellek kullanılır.

Kullanım
Bu programı çalıştırmak için sadece Python yüklü olmalıdır. Ardından şu adımları izleyebilirsiniz:
Python dosyasını çalıştırın.
Program, rastgele iş ve makine sayısı belirleyerek, her işin her makinedeki süresini ve makineler arası geçiş maliyetlerini oluşturacaktır.
Program, minimum toplam süreyi hesaplayacak ve sonucu ekrana yazdıracaktır.
