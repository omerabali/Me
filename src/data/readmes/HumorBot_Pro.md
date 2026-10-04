MizahBot Pro – AI Destekli Sosyal Medya İçerik Üretici


📌 Proje Hakkında

MizahBot Pro, AI simülasyonu tabanlı sosyal medya içerik üreticisidir.
Kullanıcı bilgileri, hobiler ve güncel trendleri kullanarak 2-4 cümlelik mini hikaye tarzında mizahi içerikler üretir.
Bu içerikler, sosyal medya paylaşımlarına hazır şekilde punchline, emoji ve hashtag ile tamamlanır.

AI Engine ile simüle edilmiş yapay zekâ

Mizah tarzına göre içerik varyasyonu: sarkastik, absürd, kelime oyunu, kara mizah

Trend ve hobi kombinasyonlarıyla benzersiz içerik

History Manager ile tekrar eden içeriklerin önlenmesi

📂 Dosya Yapısı
proje2/
│
├── gui_app.py                  # Streamlit GUI ana dosyası
├── core/
│   └── ai_engine.py            # AI Simulation Layer
├── modules/
│   ├── __init__.py
│   ├── history_manager.py      # Üretilen içeriklerin kaydedilmesi
│   ├── content_generator.py
│   └── trend_manager.py        # Trend verilerini okuma
├── data/
│   └── history.json            # Kaydedilen içerikler
├── config/
│   └── trends.json             # Güncel trendler
└── run.bat                     # Tek tıkla çalıştırma

⚙️ Kurulum

Depoyu klonlayın veya zip olarak indirin:

git clone https://github.com/kullaniciadi/mizahbot-pro.git
cd mizahbot-pro


Python ve pip yüklü olmalı (Python 3.12 önerilir)

Gerekli paketleri kurun:

pip install streamlit


run.bat dosyası ile veya terminalden çalıştırın:

python -m streamlit run gui_app.py

🖥 Kullanım

Tarayıcıda açılan sayfada:

İsim girin

Hobiler (virgülle ayırın)

Mizah tarzını seçin

Üretilecek içerik sayısını girin

“İçerik Üret” butonuna tıklayın

Üretilen içerikler altta gösterilecektir, her üretim farklı ve sosyal medyaya hazırdır.

🎯 Özellikler

Trendler: config/trends.json dosyasından okunur → kolayca güncellenebilir

AI Engine simülasyonu: rastgele mini hikayeler, mizah tarzı ve emoji/hashtag desteği

History Manager: duplicate içerik kontrolü ve kaydetme

Basit ve anlaşılır GUI: Streamlit tabanlı

📈 Örnek İçerik
Bir anda öyle bir şey oldu ki Ömer, video oyunları yaparken #Futbol ile karşılaştı. Ömer bunu görünce bir an duraksadı ve düşündü ki 'Ne garip!'. Kimse bunu beklemiyordu 😂 🤯

İnanılmaz… Ömer, kahve yaparken #Basketbol ile karşılaştı. Ömer, #Basketbol karşısında şaşırdı. Ama tabii ki işler hiç planlandığı gibi gitmedi 🤯 #funny
