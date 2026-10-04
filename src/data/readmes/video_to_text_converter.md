🎥 Video → Metin Dönüştürücü (Whisper + FFmpeg + Flask)

Bu proje, yüklenen bir videoyu otomatik olarak metne dönüştüren bir Flask tabanlı web uygulamasıdır.
Arka planda OpenAI’nin Whisper modeli kullanılır ve ses çıkarma işlemi FFmpeg ile yapılır.

🚀 Özellikler

✔ Video dosyasından otomatik ses çıkarma (FFmpeg)

✔ Whisper modeli ile tamamen offline transkript

✔ Tarayıcı üzerinden video yükleme

✔ Sonuç metnini ekranda görüntüleme

✔ Çıktıyı .txt olarak indirme

✔ Modern ve temiz arayüz

✔ Upload ve output klasörleri .gitignore ile kontrol altında tutulur

📌 Kullanılan Teknolojiler
Teknoloji	Amaç
Python	Backend
Flask	Web arayüzü
Whisper	Ses → Metin dönüştürme
FFmpeg	Videodan ses çıkarma
HTML / CSS	Arayüz tasarımı
📂 Proje Yapısı
├── app.py
├── templates/
│   └── index.html
├── static/
│   └── uploads/      (GitHub’a dahil edilmez)
├── output/           (GitHub’a dahil edilmez)
├── .gitignore
└── README.md

⚙ Kurulum
1️⃣ Gerekli paketleri yükle
pip install flask whisper ffmpeg-python

2️⃣ FFmpeg kur ve PATH’e ekle

Windows için:
https://www.gyan.dev/ffmpeg/builds/

3️⃣ Flask sunucusunu başlat
python app.py


Tarayıcıdan aç:
👉 http://127.0.0.1:5000

🎯 Kullanım

Videoyu yükle

“Dönüştür” butonuna bas

Whisper modeli videodaki sesi otomatik çözümler

Çıktıyı ekranda gör

İstersen .txt olarak indir
