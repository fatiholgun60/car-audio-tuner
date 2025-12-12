# GitHub'a Yükleme Adımları

## 1. Git Kurulumu (Eğer yüklü değilse)

1. https://git-scm.com/download/win adresinden Git'i indirin
2. Kurulum sırasında varsayılan ayarları kullanın
3. Kurulumdan sonra PowerShell'i yeniden başlatın

## 2. GitHub'da Repository Oluşturma

1. https://github.com adresine gidin ve giriş yapın
2. Sağ üstteki **"+"** butonuna tıklayın
3. **"New repository"** seçin
4. Repository bilgilerini doldurun:
   - **Repository name**: `car-audio-tuner` (veya istediğiniz isim)
   - **Description**: "Car Audio Tuner - Audison SR 5.600 Amplifier Ayarlama Uygulaması"
   - **Public** veya **Private** seçin
   - **"Add a README file"** seçeneğini işaretlemeyin (zaten var)
   - **"Add .gitignore"** seçeneğini işaretlemeyin (zaten var)
5. **"Create repository"** butonuna tıklayın

## 3. Kodu GitHub'a Yükleme

PowerShell'de proje klasöründe şu komutları çalıştırın:

```powershell
# Git'i başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: Car Audio Tuner PWA"

# Ana branch'i main olarak ayarla
git branch -M main

# GitHub repository'nizi ekleyin (KULLANICI_ADINIZ'ı değiştirin)
git remote add origin https://github.com/KULLANICI_ADINIZ/car-audio-tuner.git

# Kodu GitHub'a yükle
git push -u origin main
```

**Not**: İlk push'ta GitHub kullanıcı adı ve şifre isteyebilir. Personal Access Token kullanmanız gerekebilir.

## 4. GitHub Pages'i Aktifleştirme

1. GitHub repository'nize gidin
2. **Settings** sekmesine tıklayın
3. Sol menüden **Pages** seçin
4. **Source** bölümünden **"GitHub Actions"** seçin
5. Değişiklikleri kaydedin

## 5. Otomatik Deploy

Kod push edildiğinde otomatik olarak deploy olacak. 2-3 dakika sonra:

**Uygulamanız şu adresten erişilebilir olacak:**
```
https://KULLANICI_ADINIZ.github.io/car-audio-tuner/
```

## 6. Telefonda Kullanım

1. Telefonunuzun tarayıcısında yukarıdaki linki açın
2. Alt kısımda "Uygulamayı ana ekrana ekleyin" bildirimi görünecek
3. "Kur" butonuna tıklayın
4. Artık ana ekrandan uygulama gibi açabilirsiniz!

## Sorun Giderme

### Git kimlik doğrulama hatası:
```powershell
git config --global user.name "Adınız"
git config --global user.email "email@example.com"
```

### Personal Access Token gerekirse:
1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. "Generate new token" tıklayın
3. "repo" yetkisini seçin
4. Token'ı kopyalayın ve şifre yerine kullanın

### Push hatası:
```powershell
# Önce pull yapın
git pull origin main --allow-unrelated-histories

# Sonra tekrar push yapın
git push -u origin main
```

