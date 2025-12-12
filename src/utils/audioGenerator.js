/**
 * Audio signal generator for testing
 * Generates test tones, pink noise, and sweep signals
 */

export class AudioGenerator {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.oscillator = null;
    this.gainNode = null;
    this.pinkNoiseNode = null;
    this.isPlaying = false;
  }

  /**
   * Generate pink noise
   * Pink noise has equal energy per octave
   */
  generatePinkNoise() {
    const bufferSize = 4096;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    this.gainNode = this.audioContext.createGain();
    source.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    this.pinkNoiseNode = source;
    return source;
  }

  /**
   * Generate sine wave tone at specific frequency
   */
  generateTone(frequency, duration = null) {
    this.stop();
    
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
    
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = frequency;
    
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
    
    if (duration) {
      this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration - 0.1);
    }
    
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    return this.oscillator;
  }

  /**
   * Generate frequency sweep
   */
  generateSweep(startFreq, endFreq, duration) {
    this.stop();
    
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
    
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    this.oscillator.frequency.exponentialRampToValueAtTime(
      endFreq,
      this.audioContext.currentTime + duration
    );
    
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
    this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration - 0.1);
    
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    return this.oscillator;
  }

  /**
   * Play pink noise
   */
  playPinkNoise() {
    this.stop();
    const source = this.generatePinkNoise();
    source.start();
    this.isPlaying = true;
    return source;
  }

  /**
   * Play tone
   */
  playTone(frequency, duration = null) {
    const oscillator = this.generateTone(frequency, duration);
    oscillator.start();
    if (duration) {
      oscillator.stop(this.audioContext.currentTime + duration);
    }
    this.isPlaying = true;
    return oscillator;
  }

  /**
   * Play sweep
   */
  playSweep(startFreq, endFreq, duration) {
    const oscillator = this.generateSweep(startFreq, endFreq, duration);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
    this.isPlaying = true;
    return oscillator;
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }

  /**
   * Stop all audio
   */
  stop() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
      } catch (e) {}
      this.oscillator = null;
    }
    if (this.pinkNoiseNode) {
      try {
        this.pinkNoiseNode.stop();
      } catch (e) {}
      this.pinkNoiseNode = null;
    }
    this.isPlaying = false;
  }
}

