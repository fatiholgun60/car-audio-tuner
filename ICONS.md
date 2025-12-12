# PWA Icon Oluşturma

PWA için icon dosyaları oluşturmanız gerekiyor. İşte kolay yollar:

## Yöntem 1: Online Tool (En Kolay)

1. https://realfavicongenerator.net/ veya https://www.pwabuilder.com/imageGenerator adresine gidin
2. Bir logo/ikon yükleyin (512x512 px önerilir)
3. Tüm boyutları otomatik oluşturun
4. Dosyaları `public` klasörüne kopyalayın:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `favicon.ico`
   - `apple-touch-icon.png`

## Yöntem 2: Manuel Oluşturma

Basit bir icon için:

1. 512x512 px bir kare görsel oluşturun
2. Arka plan: #1e1e1e (koyu gri)
3. Ortada yeşil (#4CAF50) bir daire veya "AT" yazısı
4. Bu görseli farklı boyutlara resize edin:
   - 192x192 px → `pwa-192x192.png`
   - 512x512 px → `pwa-512x512.png`
   - 180x180 px → `apple-touch-icon.png`
   - 32x32 px → `favicon.ico`

## Yöntem 3: Otomatik Script (Node.js)

```bash
npm install -g pwa-asset-generator
```

Sonra bir logo dosyanız varsa:
```bash
pwa-asset-generator logo.png public/
```

## Not

Icon dosyaları olmadan da PWA çalışır, ancak ana ekrana eklerken varsayılan bir icon gösterilir. 
Daha profesyonel görünüm için yukarıdaki yöntemlerden birini kullanın.

