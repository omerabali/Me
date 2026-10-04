Zamanlayıcılı, çoktan seçmeli sorulardan oluşan interaktif bir JavaScript Quiz Uygulaması. Kullanıcı, quiz’i başlatabilir, sorulara cevap verebilir, zaman dolduğunda otomatik olarak sonraki soruya geçer ve test bitince skor ekranını görüntüler.

📸 Ekran Görüntüsü

Uygulamanın arayüzü modern, sade ve duyarlı (responsive) yapıdadır.

👉 Eğer ekran görüntüsü eklersen README'ye koyabilirim.

🚀 Özellikler

✔️ Başlat butonu ile quize giriş

✔️ JavaScript OOP ile oluşturulmuş soru yapısı

✔️ Her soru için geri sayım (10 saniye)

✔️ İlerleyen zaman çubuğu (timeline)

✔️ Doğru/yanlış seçenek gösterimi

✔️ Sonuç ekranı (Doğru sayısı + Toplam soru)

✔️ Tek tıkla Replay ve Quit özellikleri

✔️ Bootstrap & Bootstrap Icons entegrasyonu

🛠️ Kullanılan Teknolojiler

HTML5

CSS3

Bootstrap 5.3

Bootstrap Icons

Vanilla JavaScript (ES5 + Prototypal OOP)

📂 Proje Dosya Yapısı
/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── soru.js
│   ├── quiz.js
│   ├── ui.js
│   └── app.js
└── README.md

📘 Kod Yapısı Hakkında
✔ Soru Yapısı (Soru)

Her soru şu bilgilerden oluşur:

new Soru(
    "Soru metni",
    { a: "Seçenek A", b: "Seçenek B", c: "Seçenek C", d: "Seçenek D" },
    "a" // doğru cevap
);

✔ Quiz Yönetimi (Quiz)

Quiz sınıfı şunları takip eder:

soruIndex

dogruCevapSayisi

soruGetir()

✔ UI Yönetimi (UI)

UI sınıfı tüm DOM işlemlerini kontrol eder:

Soru gösterme

Seçenekleri oluşturma

Timer kontrolü

Timeline kontrolü

Sonuç ekranı

Start / Next / Replay / Quit
