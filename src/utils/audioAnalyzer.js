/**
 * Audio analyzer for microphone input
 * Analyzes frequency response and provides tuning recommendations
 */

export class AudioAnalyzer {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.analyser = null;
    this.microphone = null;
    this.dataArray = null;
    this.bufferLength = 0;
    this.isAnalyzing = false;
    this.frequencyData = null;
    this.callbacks = {
      onFrequencyData: null,
      onAnalysisComplete: null
    };
  }

  /**
   * Initialize microphone input
   */
  async initializeMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 8192; // Higher resolution for better frequency analysis
      this.analyser.smoothingTimeConstant = 0.8;
      
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      this.frequencyData = new Float32Array(this.bufferLength);
      
      this.microphone.connect(this.analyser);
      
      return true;
    } catch (error) {
      console.error('Microphone access error:', error);
      throw error;
    }
  }

  /**
   * Get frequency response data
   */
  getFrequencyData() {
    if (!this.analyser) return null;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    this.analyser.getFloatFrequencyData(this.frequencyData);
    
    const sampleRate = this.audioContext.sampleRate;
    const nyquist = sampleRate / 2;
    const frequencyResolution = nyquist / this.bufferLength;
    
    const frequencyResponse = [];
    
    for (let i = 0; i < this.bufferLength; i++) {
      const frequency = i * frequencyResolution;
      const magnitude = this.dataArray[i];
      const decibel = this.frequencyData[i];
      
      frequencyResponse.push({
        frequency,
        magnitude,
        decibel
      });
    }
    
    return frequencyResponse;
  }

  /**
   * Get average level for specific frequency range
   */
  getAverageLevelForRange(frequencyResponse, minFreq, maxFreq) {
    if (!frequencyResponse) return 0;
    
    const filtered = frequencyResponse.filter(
      point => point.frequency >= minFreq && point.frequency <= maxFreq
    );
    
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, point) => acc + point.magnitude, 0);
    return sum / filtered.length;
  }

  /**
   * Analyze frequency response and get recommendations
   */
  analyzeFrequencyResponse(frequencyResponse) {
    if (!frequencyResponse) return null;
    
    const recommendations = {
      rear: {
        levels: 50,
        hiPass: 80,
        loPass: 0,
        boost: 0
      },
      sub: {
        level: 50
      },
      front: {
        levels: 50,
        hiPass: 80,
        range: 'x1'
      }
    };
    
    // Analyze subwoofer range (20-80 Hz)
    const subLevel = this.getAverageLevelForRange(frequencyResponse, 20, 80);
    const subTarget = 128; // Target level
    const subRatio = subLevel / subTarget;
    recommendations.sub.level = Math.max(0, Math.min(100, 50 + (subRatio - 1) * 30));
    
    // Analyze mid-bass range (80-200 Hz)
    const midBassLevel = this.getAverageLevelForRange(frequencyResponse, 80, 200);
    const midBassTarget = 128;
    const midBassRatio = midBassLevel / midBassTarget;
    recommendations.rear.levels = Math.max(0, Math.min(100, 50 + (midBassRatio - 1) * 30));
    
    // Analyze midrange (200-2000 Hz)
    const midLevel = this.getAverageLevelForRange(frequencyResponse, 200, 2000);
    const midTarget = 128;
    const midRatio = midLevel / midTarget;
    recommendations.front.levels = Math.max(0, Math.min(100, 50 + (midRatio - 1) * 30));
    
    // Analyze high frequencies (2000-20000 Hz)
    const highLevel = this.getAverageLevelForRange(frequencyResponse, 2000, 20000);
    const highTarget = 128;
    const highRatio = highLevel / highTarget;
    
    // Determine crossover points based on frequency response
    // Find where response drops significantly
    const subDrop = this.findFrequencyDrop(frequencyResponse, 20, 80);
    if (subDrop > 0) {
      recommendations.rear.hiPass = Math.max(50, Math.min(500, subDrop + 20));
    }
    
    const midDrop = this.findFrequencyDrop(frequencyResponse, 200, 2000);
    if (midDrop > 0) {
      recommendations.front.hiPass = Math.max(50, Math.min(500, midDrop + 20));
    }
    
    // Boost recommendation based on overall response
    const overallLevel = (subLevel + midBassLevel + midLevel + highLevel) / 4;
    if (overallLevel < 100) {
      recommendations.rear.boost = Math.min(12, Math.round((100 - overallLevel) / 10));
    }
    
    return recommendations;
  }

  /**
   * Find frequency where response drops significantly
   */
  findFrequencyDrop(frequencyResponse, minFreq, maxFreq) {
    const filtered = frequencyResponse.filter(
      point => point.frequency >= minFreq && point.frequency <= maxFreq
    );
    
    if (filtered.length < 2) return 0;
    
    let maxLevel = 0;
    let peakFreq = 0;
    let dropFreq = 0;
    
    for (const point of filtered) {
      if (point.magnitude > maxLevel) {
        maxLevel = point.magnitude;
        peakFreq = point.frequency;
      }
    }
    
    // Find where level drops to 70% of max
    const threshold = maxLevel * 0.7;
    for (const point of filtered) {
      if (point.frequency > peakFreq && point.magnitude < threshold) {
        dropFreq = point.frequency;
        break;
      }
    }
    
    return dropFreq;
  }

  /**
   * Start continuous analysis
   */
  startAnalysis(onUpdate) {
    if (!this.analyser) return;
    
    this.isAnalyzing = true;
    this.callbacks.onFrequencyData = onUpdate;
    
    const analyze = () => {
      if (!this.isAnalyzing) return;
      
      const frequencyData = this.getFrequencyData();
      if (frequencyData && this.callbacks.onFrequencyData) {
        this.callbacks.onFrequencyData(frequencyData);
      }
      
      requestAnimationFrame(analyze);
    };
    
    analyze();
  }

  /**
   * Stop analysis
   */
  stopAnalysis() {
    this.isAnalyzing = false;
    this.callbacks.onFrequencyData = null;
  }

  /**
   * Cleanup
   */
  cleanup() {
    this.stopAnalysis();
    if (this.microphone && this.microphone.mediaStream) {
      this.microphone.mediaStream.getTracks().forEach(track => track.stop());
    }
    this.microphone = null;
    this.analyser = null;
  }
}

