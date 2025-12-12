# Telefonda Kullanım - Deploy Rehberi

Uygulamayı telefonda hiçbir şey kurmadan kullanmak için birkaç seçenek var:

## Seçenek 1: GitHub Pages (Önerilen - Ücretsiz)

### Adımlar:

1. **GitHub'da repository oluşturun:**
   - GitHub'a gidin ve yeni bir repository oluşturun
   - Repository adı: `car-audio-tuner` (veya istediğiniz bir isim)

2. **Kodu GitHub'a yükleyin:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/car-audio-tuner.git
git push -u origin main
```

3. **GitHub Pages'i aktifleştirin:**
   - Repository'de **Settings** > **Pages** bölümüne gidin
   - Source: **GitHub Actions** seçin
   - Save'e tıklayın

4. **Otomatik Deploy:**
   - Kod push edildiğinde otomatik olarak deploy olacak
   - 2-3 dakika sonra şu adresten erişebilirsiniz:
   - `https://KULLANICI_ADINIZ.github.io/car-audio-tuner/`

### Telefonda Kullanım:
- Telefonunuzun tarayıcısında (Chrome, Safari vb.) yukarıdaki linki açın
- Hiçbir şey kurmanıza gerek yok!

---

## Seçenek 2: Netlify (Ücretsiz, Daha Kolay)

1. **Build alın:**
```bash
npm run build
```

2. **Netlify'e yükleyin:**
   - https://www.netlify.com adresine gidin
   - Ücretsiz hesap oluşturun
   - "Add new site" > "Deploy manually"
   - `dist` klasörünü sürükleyip bırakın
   - Anında bir link alacaksınız!

---

## Seçenek 3: Yerel Ağ (Bilgisayar Açık Olmalı)

Eğer bilgisayarınız ve telefonunuz aynı WiFi ağındaysa:

1. **Bilgisayarınızda çalıştırın:**
```bash
npm run dev
```

2. **IP adresinizi bulun:**
   - Windows: `ipconfig` komutunu çalıştırın
   - IPv4 adresini not edin (örn: 192.168.1.100)

3. **Telefonda açın:**
   - Telefon tarayıcısında: `http://192.168.1.100:3000`
   - Bilgisayar açık olduğu sürece çalışır

---

## Seçenek 4: USB ile Telefona Aktarma

1. **Build alın:**
```bash
npm run build
```

2. **dist klasörünü telefona aktarın:**
   - USB ile bağlayın veya cloud'a yükleyin
   - Telefonda bir web sunucusu uygulaması kullanın (örn: "Simple HTTP Server")
   - Veya `dist` klasörünü bir web hosting servisine yükleyin

---

## En Kolay Yol: GitHub Pages

GitHub Pages en pratik çözümdür çünkü:
- ✅ Ücretsiz
- ✅ Otomatik deploy
- ✅ Her zaman erişilebilir
- ✅ Telefonda hiçbir şey kurmaya gerek yok
- ✅ Sadece tarayıcıda link açmanız yeterli

---

## Notlar:

- **HTTPS gerekli:** Mikrofon erişimi için HTTPS gerekli (GitHub Pages otomatik sağlar)
- **İlk kullanım:** Tarayıcı mikrofon izni isteyecek, izin verin
- **Güncellemeler:** Kod değişikliklerini push ettiğinizde otomatik güncellenir

