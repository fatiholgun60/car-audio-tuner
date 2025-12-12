import React, { useState, useEffect, useRef } from 'react';
import AmplifierControl from './components/AmplifierControl';
import FrequencyChart from './components/FrequencyChart';
import { AudioGenerator } from './utils/audioGenerator';
import { AudioAnalyzer } from './utils/audioAnalyzer';
import './App.css';

function App() {
  const [audioContext, setAudioContext] = useState(null);
  const [audioGenerator, setAudioGenerator] = useState(null);
  const [audioAnalyzer, setAudioAnalyzer] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [frequencyData, setFrequencyData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [testMode, setTestMode] = useState('pinkNoise'); // pinkNoise, tone, sweep
  const [showPresets, setShowPresets] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Amplifier settings state
  const [rearSettings, setRearSettings] = useState({
    ampMode: '5 Ch',
    input: 'ON',
    levels: 50,
    hiPass: 80,
    mode: 'FULL',
    loPass: 500,
    boost: 0,
    subsonic: 'OFF'
  });

  const [subSettings, setSubSettings] = useState({
    art: 'ON',
    input: 'ON',
    level: 50
  });

  const [frontSettings, setFrontSettings] = useState({
    mode: 'FULL',
    levels: 50,
    range: 'x1',
    hiPass: 80
  });

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const generator = new AudioGenerator(context);
        const analyzer = new AudioAnalyzer(context);

        setAudioContext(context);
        setAudioGenerator(generator);
        setAudioAnalyzer(analyzer);

        // Request microphone access
        try {
          await analyzer.initializeMicrophone();
          setIsInitialized(true);
        } catch (error) {
          alert('Mikrofon erişimi gerekli. Lütfen izin verin.');
          console.error('Microphone initialization error:', error);
        }
      } catch (error) {
        console.error('Audio initialization error:', error);
        alert('Ses sistemi başlatılamadı. Lütfen tarayıcınızı güncelleyin.');
      }
    };

    initAudio();

    return () => {
      if (audioGenerator) {
        audioGenerator.stop();
      }
      if (audioAnalyzer) {
        audioAnalyzer.cleanup();
      }
    };
  }, []);

  // Handle setting changes
  const handleRearSettingChange = (name, value) => {
    setRearSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubSettingChange = (name, value) => {
    setSubSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFrontSettingChange = (name, value) => {
    setFrontSettings(prev => ({ ...prev, [name]: value }));
  };

  // Play test signal
  const handlePlayTest = () => {
    if (!audioGenerator) return;

    if (isPlaying) {
      audioGenerator.stop();
      setIsPlaying(false);
      if (audioAnalyzer) {
        audioAnalyzer.stopAnalysis();
        setIsAnalyzing(false);
      }
    } else {
      if (testMode === 'pinkNoise') {
        audioGenerator.playPinkNoise();
      } else if (testMode === 'tone') {
        audioGenerator.playTone(1000, null);
      } else if (testMode === 'sweep') {
        audioGenerator.playSweep(20, 20000, 10);
      }
      setIsPlaying(true);

      // Start analysis
      if (audioAnalyzer) {
        audioAnalyzer.startAnalysis((data) => {
          setFrequencyData(data);
          
          // Generate recommendations every 2 seconds
          if (data && data.length > 0) {
            const recs = audioAnalyzer.analyzeFrequencyResponse(data);
            if (recs) {
              setRecommendations({
                rear: recs.rear,
                sub: recs.sub,
                front: recs.front
              });
            }
          }
        });
        setIsAnalyzing(true);
      }
    }
  };

  // Apply recommendations
  const handleApplyRecommendations = () => {
    if (!recommendations) return;

    if (recommendations.rear) {
      setRearSettings(prev => ({
        ...prev,
        levels: recommendations.rear.levels,
        hiPass: recommendations.rear.hiPass,
        loPass: recommendations.rear.loPass || prev.loPass,
        boost: recommendations.rear.boost
      }));
    }

    if (recommendations.sub) {
      setSubSettings(prev => ({
        ...prev,
        level: recommendations.sub.level
      }));
    }

    if (recommendations.front) {
      setFrontSettings(prev => ({
        ...prev,
        levels: recommendations.front.levels,
        hiPass: recommendations.front.hiPass,
        range: recommendations.front.range || prev.range
      }));
    }

    alert('Önerilen ayarlar uygulandı!');
  };

  // Play specific test tone
  const handlePlayTone = (frequency) => {
    if (!audioGenerator) return;
    audioGenerator.stop();
    audioGenerator.playTone(frequency, 2);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  // Preset configurations
  const presets = {
    'subwoofer-yok-sahne-onde': {
      name: 'Subwoofer Yok + Sahne Önde',
      description: 'Subwoofer takılı değilken, ses sahnesi ön hoparlörlerde odaklanmış',
      rear: {
        ampMode: '3 Ch',
        input: 'ON',
        levels: 35,
        hiPass: 100,
        mode: 'HI',
        loPass: 500,
        boost: 0,
        subsonic: 'OFF'
      },
      sub: {
        art: 'OFF',
        input: 'OFF',
        level: 0
      },
      front: {
        mode: 'FULL',
        levels: 75,
        range: 'x1',
        hiPass: 80
      }
    },
    'subwoofer-var-sahne-onde': {
      name: 'Subwoofer Var + Sahne Önde',
      description: 'Subwoofer aktif, ses sahnesi ön hoparlörlerde odaklanmış',
      rear: {
        ampMode: '5 Ch',
        input: 'ON',
        levels: 40,
        hiPass: 80,
        mode: 'HI',
        loPass: 500,
        boost: 0,
        subsonic: 'OFF'
      },
      sub: {
        art: 'ON',
        input: 'ON',
        level: 60
      },
      front: {
        mode: 'FULL',
        levels: 70,
        range: 'x1',
        hiPass: 80
      }
    },
    'subwoofer-var-dengeli': {
      name: 'Subwoofer Var + Dengeli',
      description: 'Subwoofer aktif, tüm kanallar dengeli',
      rear: {
        ampMode: '5 Ch',
        input: 'ON',
        levels: 55,
        hiPass: 80,
        mode: 'FULL',
        loPass: 500,
        boost: 0,
        subsonic: 'OFF'
      },
      sub: {
        art: 'ON',
        input: 'ON',
        level: 55
      },
      front: {
        mode: 'FULL',
        levels: 55,
        range: 'x1',
        hiPass: 80
      }
    },
    'subwoofer-yok-dengeli': {
      name: 'Subwoofer Yok + Dengeli',
      description: 'Subwoofer takılı değilken, tüm kanallar dengeli',
      rear: {
        ampMode: '3 Ch',
        input: 'ON',
        levels: 50,
        hiPass: 100,
        mode: 'FULL',
        loPass: 500,
        boost: 2,
        subsonic: 'OFF'
      },
      sub: {
        art: 'OFF',
        input: 'OFF',
        level: 0
      },
      front: {
        mode: 'FULL',
        levels: 50,
        range: 'x1',
        hiPass: 80
      }
    },
    'sadece-on': {
      name: 'Sadece Ön Hoparlörler',
      description: 'Sadece ön hoparlörler aktif, arka ve subwoofer kapalı',
      rear: {
        ampMode: '3 Ch',
        input: 'OFF',
        levels: 0,
        hiPass: 80,
        mode: 'FULL',
        loPass: 500,
        boost: 0,
        subsonic: 'OFF'
      },
      sub: {
        art: 'OFF',
        input: 'OFF',
        level: 0
      },
      front: {
        mode: 'FULL',
        levels: 70,
        range: 'x1',
        hiPass: 80
      }
    }
  };

  // Apply preset
  const handleApplyPreset = (presetKey) => {
    const preset = presets[presetKey];
    if (!preset) return;

    if (window.confirm(`${preset.name} ayarlarını uygulamak istediğinize emin misiniz?\n\n${preset.description}`)) {
      setRearSettings(preset.rear);
      setSubSettings(preset.sub);
      setFrontSettings(preset.front);
      alert(`${preset.name} ayarları uygulandı!`);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Fatih OLGUN T10x</h1>
        <p className="subtitle">Audison SR 5.600 Amplifier Ayarlama Uygulaması</p>
      </header>

      <div className="app-container">
        {/* PWA Install Banner */}
        {showInstallPrompt && (
          <div className="install-banner">
            <div className="install-banner-content">
              <span>📱 Uygulamayı ana ekrana ekleyin</span>
              <div className="install-banner-buttons">
                <button onClick={handleInstallClick} className="install-button">
                  Kur
                </button>
                <button onClick={() => setShowInstallPrompt(false)} className="install-close">
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {!isInitialized ? (
          <div className="loading">
            <p>Mikrofon erişimi bekleniyor...</p>
            <p className="hint">Lütfen tarayıcınızın mikrofon iznini verin.</p>
          </div>
        ) : (
          <>
            {/* Control Panel */}
            <div className="control-panel">
              {/* Preset Panel Toggle */}
              <div className="preset-toggle-section">
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className={`preset-toggle-button ${showPresets ? 'active' : ''}`}
                >
                  <span>{showPresets ? '▼' : '▶'}</span>
                  <span>Ses Profilleri (Preset)</span>
                </button>
              </div>

              {/* Preset Panel */}
              {showPresets && (
                <div className="preset-panel">
                  <p className="preset-description">
                    Farklı kullanım senaryoları için hazır ayarlar. Profil seçerek tüm ayarları otomatik yapabilirsiniz.
                  </p>
                  <div className="preset-grid">
                    {Object.entries(presets).map(([key, preset]) => (
                      <div key={key} className="preset-card">
                        <h3>{preset.name}</h3>
                        <p>{preset.description}</p>
                        <button
                          onClick={() => handleApplyPreset(key)}
                          className="preset-button"
                        >
                          Uygula
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="test-controls">
                <h2>Test Kontrolleri</h2>
                <div className="test-buttons">
                  <select
                    value={testMode}
                    onChange={(e) => {
                      setTestMode(e.target.value);
                      if (isPlaying) {
                        handlePlayTest();
                        handlePlayTest();
                      }
                    }}
                    className="test-mode-select"
                  >
                    <option value="pinkNoise">Pink Noise (Önerilen)</option>
                    <option value="tone">Test Tonu (1kHz)</option>
                    <option value="sweep">Frekans Taraması</option>
                  </select>
                  <button
                    onClick={handlePlayTest}
                    className={`play-button ${isPlaying ? 'playing' : ''}`}
                  >
                    {isPlaying ? '⏸ Durdur' : '▶ Oynat'}
                  </button>
                  {recommendations && (
                    <button
                      onClick={handleApplyRecommendations}
                      className="apply-button"
                    >
                      ✓ Önerileri Uygula
                    </button>
                  )}
                </div>
                <div className="quick-tones">
                  <span>Hızlı Test Tonları:</span>
                  <button onClick={() => handlePlayTone(50)}>50Hz</button>
                  <button onClick={() => handlePlayTone(100)}>100Hz</button>
                  <button onClick={() => handlePlayTone(500)}>500Hz</button>
                  <button onClick={() => handlePlayTone(1000)}>1kHz</button>
                  <button onClick={() => handlePlayTone(5000)}>5kHz</button>
                </div>
              </div>

              {/* Frequency Chart */}
              <FrequencyChart 
                frequencyData={frequencyData} 
                isAnalyzing={isAnalyzing}
              />

              {/* Amplifier Controls */}
              <AmplifierControl
                section="rear"
                settings={rearSettings}
                onSettingChange={handleRearSettingChange}
                recommendations={recommendations?.rear}
              />

              <AmplifierControl
                section="sub"
                settings={subSettings}
                onSettingChange={handleSubSettingChange}
                recommendations={recommendations?.sub}
              />

              <AmplifierControl
                section="front"
                settings={frontSettings}
                onSettingChange={handleFrontSettingChange}
                recommendations={recommendations?.front}
              />
            </div>

            {/* Instructions */}
            <div className="instructions">
              <h3>Kullanım Talimatları</h3>
              <ol>
                <li>Telefonu veya bilgisayarı araç içinde ses sistemine yakın bir yere yerleştirin.</li>
                <li>"Oynat" butonuna tıklayarak test sinyali başlatın (Pink Noise önerilir).</li>
                <li>Uygulama mikrofon üzerinden sesi analiz edecek ve frekans yanıtını gösterecektir.</li>
                <li>Yeşil işaretler önerilen ayarları gösterir. "Önerileri Uygula" butonuna tıklayarak otomatik ayarlama yapabilirsiniz.</li>
                <li>Manuel olarak da tüm kontrolleri ayarlayabilirsiniz.</li>
                <li>Farklı frekanslarda test tonları çalarak her kanalı ayrı ayrı test edebilirsiniz.</li>
              </ol>
              <div className="system-info">
                <h4>Sistem Bilgileri:</h4>
                <ul>
                  <li>Prima APS 10 S4S Subwoofer</li>
                  <li>Audison Prima APK 165 2ohm (2 Set)</li>
                  <li>Audison SR 5.600 Amplifier</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

