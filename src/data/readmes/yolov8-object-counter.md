# YOLOv8 Object Counter with GUI

Bu proje, **YOLOv8** modeli kullanarak gerçek zamanlı nesne tanıma ve sayım işlemi yapan bir Python uygulamasıdır.  
Tkinter ile basit bir GUI sunar ve sesli uyarılar ile kullanıcıyı bilgilendirir. Tespit edilen nesneler CSV formatında kaydedilebilir.

## Özellikler
- Gerçek zamanlı kamera görüntüsü üzerinden nesne tanıma.
- Belirli nesneleri filtreleme (örn: person, car) veya tüm nesneleri tanıma.
- Sesli bildirim ile tespit edilen nesneleri duyurma.
- Thread-safe tasarım sayesinde GUI kilitlenmeden çalışır.
- Tespit edilen nesnelerin sayısını CSV dosyasına kaydetme.

## Gereksinimler
- Python 3.9+
- OpenCV
- Pyttsx3
- Pandas
- Tkinter
- Ultralytics YOLOv8 (`pip install ultralytics`)

## Kullanım
1. Repo klonlanır:
   ```bash
   git clone <repo-link>
   cd yolov8-object-counter


Gerekli paketler yüklenir:

pip install -r requirements.txt


Uygulamayı başlatın:

python main.py
