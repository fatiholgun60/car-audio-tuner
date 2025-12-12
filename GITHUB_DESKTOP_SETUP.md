# GitHub Desktop ile Yükleme (En Kolay Yol)

GitHub Desktop yüklü olduğu için en kolay yol bu!

## Adımlar:

### 1. GitHub'da Repository Oluşturun

1. https://github.com adresine gidin ve giriş yapın
2. Sağ üstteki **"+"** butonuna tıklayın
3. **"New repository"** seçin
4. Repository bilgilerini doldurun:
   - **Repository name**: `car-audio-tuner`
   - **Description**: "Car Audio Tuner - Audison SR 5.600 Amplifier Ayarlama Uygulaması"
   - **Public** veya **Private** seçin
   - **"Add a README file"** seçeneğini işaretlemeyin
   - **"Add .gitignore"** seçeneğini işaretlemeyin
5. **"Create repository"** butonuna tıklayın

### 2. GitHub Desktop ile Yükleme

1. **GitHub Desktop** uygulamasını açın
2. **File > Add Local Repository** seçin
3. **Browse** butonuna tıklayın
4. Proje klasörünüzü seçin: `C:\Users\fatih\car-audio-tuner`
5. **Add repository** butonuna tıklayın
6. Sol üstte **"Publish repository"** butonuna tıklayın
7. Repository adını kontrol edin ve **"Publish repository"** butonuna tıklayın

### 3. GitHub Pages'i Aktifleştirme

1. GitHub repository'nize gidin: `https://github.com/KULLANICI_ADINIZ/car-audio-tuner`
2. **Settings** sekmesine tıklayın
3. Sol menüden **Pages** seçin
4. **Source** bölümünden **"GitHub Actions"** seçin
5. Değişiklikleri kaydedin

### 4. Otomatik Deploy

Kod push edildiğinde otomatik olarak deploy olacak. 2-3 dakika sonra:

**Uygulamanız şu adresten erişilebilir olacak:**
```
https://KULLANICI_ADINIZ.github.io/car-audio-tuner/
```

### 5. Güncellemeler

Her değişiklikten sonra:
1. GitHub Desktop'ta değişiklikleri göreceksiniz
2. Sol altta commit mesajı yazın (örn: "Yeni özellik eklendi")
3. **"Commit to main"** butonuna tıklayın
4. **"Push origin"** butonuna tıklayın
5. Otomatik olarak deploy olacak!

## Alternatif: PowerShell ile (Git PATH'te ise)

Eğer PowerShell'i yeniden başlattıktan sonra Git çalışıyorsa:

```powershell
git init
git add .
git commit -m "Initial commit: Car Audio Tuner PWA"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/car-audio-tuner.git
git push -u origin main
```

