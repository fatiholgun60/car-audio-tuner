# Car Audio Tuner - Audison SR 5.600

Araç ses sistemi ayarlama uygulaması. Telefon veya bilgisayar mikrofonunu kullanarak ses sisteminizi analiz eder ve otomatik ayar önerileri sunar.

## Özellikler

- 🎵 **Pink Noise Test**: Eşit enerji dağılımlı test sinyali
- 📊 **Frekans Analizi**: Gerçek zamanlı frekans yanıtı görselleştirmesi
- 🎛️ **Otomatik Ayar Önerileri**: Mikrofon analizine dayalı akıllı öneriler
- 🎚️ **Manuel Kontrol**: Tüm amplifikatör ayarlarını manuel olarak kontrol edebilme
- 📱 **Mobil Uyumlu**: Telefon ve bilgisayarda çalışır

## Desteklenen Sistem

- **Subwoofer**: Prima APS 10 S4S
- **Hoparlörler**: Audison Prima APK 165 2ohm (2 Set)
- **Amplifikatör**: Audison SR 5.600

## Kurulum

1. Projeyi klonlayın veya indirin
2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcıda `http://localhost:3000` adresine gidin

## Kullanım

1. **Mikrofon İzni**: Uygulama ilk açılışta mikrofon erişimi isteyecektir. İzin verin.

2. **Test Sinyali**: 
   - "Pink Noise" seçeneğini seçin (önerilen)
   - "Oynat" butonuna tıklayın
   - Test sinyali çalmaya başlayacaktır

3. **Analiz**:
   - Uygulama mikrofon üzerinden sesi analiz eder
   - Frekans yanıtı grafikte görüntülenir
   - Yeşil işaretler önerilen ayarları gösterir

4. **Otomatik Ayar**:
   - "Önerileri Uygula" butonuna tıklayarak otomatik ayarlama yapabilirsiniz
   - Veya manuel olarak kontrolleri ayarlayabilirsiniz

5. **Hızlı Test Tonları**:
   - Belirli frekanslarda test tonları çalarak her kanalı ayrı ayrı test edebilirsiniz

## Amplifikatör Kontrolleri

### REAR (Arka Kanallar)
- **AMP MODE**: 5 Ch / 3 Ch
- **INPUT**: ON / OFF
- **LEVELS**: 0-100
- **HI PASS**: 50-500 Hz
- **MODE**: FULL / HI / BAND (FRONT IN)
- **LO PASS**: 50-500 Hz
- **BOOST**: 0-12 dB
- **SUBSONIC**: ON / OFF

### SUB (Subwoofer)
- **ART**: ON / OFF
- **INPUT**: ON / OFF
- **LEVEL**: 0-100

### FRONT (Ön Kanallar - 3Ch)
- **MODE**: HI / FULL
- **LEVELS**: 0-100
- **RANGE**: x10 / x1
- **HI PASS**: 50-500 Hz

## Teknik Detaylar

- **Web Audio API**: Ses üretimi ve analiz için
- **FFT Analizi**: 8192 nokta FFT ile yüksek çözünürlüklü frekans analizi
- **Pink Noise**: Eşit enerji per oktav dağılımı
- **Responsive Design**: Mobil ve masaüstü uyumlu

## PWA (Progressive Web App) Özellikleri

- ✅ **Ana Ekrana Ekleme**: Telefonda uygulama gibi kurulabilir
- ✅ **Çevrimdışı Çalışma**: İnternet olmadan da çalışır (cache sayesinde)
- ✅ **Tam Ekran Modu**: Tarayıcı çerçevesi olmadan çalışır
- ✅ **Otomatik Güncelleme**: Yeni versiyonlar otomatik yüklenir

### Telefonda Kurulum:

1. Uygulamayı tarayıcıda açın
2. Alt kısımda "Uygulamayı ana ekrana ekleyin" bildirimi görünecek
3. "Kur" butonuna tıklayın
4. Veya tarayıcı menüsünden "Ana ekrana ekle" seçeneğini kullanın

## Notlar

- Mikrofon kalitesi analiz sonuçlarını etkiler
- Test sırasında araç içi gürültüyü minimize edin
- Önerilen ayarlar başlangıç noktasıdır, manuel ince ayar gerekebilir
- DSP olmayan sistemler için optimize edilmiştir
- PWA icon'ları için `ICONS.md` dosyasına bakın

## Lisans

Bu proje kişisel kullanım içindir.

