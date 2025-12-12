# GitHub'a Yükleme Scripti
# Bu script'i çalıştırmadan önce GitHub'da repository oluşturmanız gerekiyor!

Write-Host "=== Car Audio Tuner - GitHub Setup ===" -ForegroundColor Green
Write-Host ""

# Git kontrolü
try {
    $gitVersion = git --version
    Write-Host "✓ Git bulundu: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git bulunamadı! Lütfen önce Git'i kurun: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "GitHub repository URL'inizi girin:" -ForegroundColor Yellow
Write-Host "Örnek: https://github.com/KULLANICI_ADINIZ/car-audio-tuner.git" -ForegroundColor Gray
$repoUrl = Read-Host "Repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "✗ Repository URL boş olamaz!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Git yapılandırması kontrol ediliyor..." -ForegroundColor Yellow

# Git config kontrolü
$userName = git config --global user.name
$userEmail = git config --global user.email

if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
    Write-Host "Git kullanıcı bilgileri eksik. Lütfen girin:" -ForegroundColor Yellow
    if ([string]::IsNullOrWhiteSpace($userName)) {
        $userName = Read-Host "Git kullanıcı adı"
        git config --global user.name $userName
    }
    if ([string]::IsNullOrWhiteSpace($userEmail)) {
        $userEmail = Read-Host "Git email"
        git config --global user.email $userEmail
    }
}

Write-Host ""
Write-Host "Git repository başlatılıyor..." -ForegroundColor Yellow

# Git init
if (Test-Path .git) {
    Write-Host "✓ Git repository zaten başlatılmış" -ForegroundColor Green
} else {
    git init
    Write-Host "✓ Git repository başlatıldı" -ForegroundColor Green
}

Write-Host ""
Write-Host "Dosyalar ekleniyor..." -ForegroundColor Yellow
git add .
Write-Host "✓ Dosyalar eklendi" -ForegroundColor Green

Write-Host ""
Write-Host "Commit oluşturuluyor..." -ForegroundColor Yellow
git commit -m "Initial commit: Car Audio Tuner PWA - Audison SR 5.600"
Write-Host "✓ Commit oluşturuldu" -ForegroundColor Green

Write-Host ""
Write-Host "Branch ayarlanıyor..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch 'main' olarak ayarlandı" -ForegroundColor Green

Write-Host ""
Write-Host "Remote repository ekleniyor..." -ForegroundColor Yellow
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Mevcut remote URL: $existingRemote" -ForegroundColor Yellow
    $change = Read-Host "Değiştirmek ister misiniz? (y/n)"
    if ($change -eq "y" -or $change -eq "Y") {
        git remote set-url origin $repoUrl
        Write-Host "✓ Remote URL güncellendi" -ForegroundColor Green
    }
} else {
    git remote add origin $repoUrl
    Write-Host "✓ Remote repository eklendi" -ForegroundColor Green
}

Write-Host ""
Write-Host "GitHub'a yükleniyor..." -ForegroundColor Yellow
Write-Host "Not: GitHub kullanıcı adı ve şifre/Personal Access Token istenebilir" -ForegroundColor Gray
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Başarılı! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Kodunuz GitHub'a yüklendi!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Şimdi yapmanız gerekenler:" -ForegroundColor Yellow
    Write-Host "1. GitHub repository'nize gidin: $repoUrl" -ForegroundColor White
    Write-Host "2. Settings > Pages > Source: GitHub Actions seçin" -ForegroundColor White
    Write-Host "3. 2-3 dakika bekleyin, deploy otomatik olacak" -ForegroundColor White
    Write-Host "4. Uygulamanız şu adresten erişilebilir olacak:" -ForegroundColor White
    $pagesUrl = $repoUrl -replace '\.git$', '' -replace 'github\.com', 'github.io'
    Write-Host "   $pagesUrl" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ Push başarısız oldu!" -ForegroundColor Red
    Write-Host "Lütfen hata mesajını kontrol edin ve GITHUB_SETUP.md dosyasına bakın" -ForegroundColor Yellow
}

