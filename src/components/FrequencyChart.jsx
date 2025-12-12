import React, { useRef, useEffect } from 'react';
import './FrequencyChart.css';

const FrequencyChart = ({ frequencyData, isAnalyzing }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!frequencyData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // Horizontal lines (dB levels)
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines (frequency bands)
    const freqBands = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    freqBands.forEach(freq => {
      const x = (Math.log10(freq / 20) / Math.log10(20000 / 20)) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    });

    // Draw frequency response curve
    if (frequencyData.length > 0) {
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sampleRate = 44100;
      const nyquist = sampleRate / 2;
      const frequencyResolution = nyquist / frequencyData.length;

      for (let i = 0; i < frequencyData.length; i++) {
        const frequency = i * frequencyResolution;
        if (frequency < 20 || frequency > 20000) continue;

        const magnitude = frequencyData[i].magnitude;
        const normalizedMagnitude = magnitude / 255; // Normalize to 0-1
        const y = height - (normalizedMagnitude * height);

        const x = (Math.log10(frequency / 20) / Math.log10(20000 / 20)) * width;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Fill area under curve
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)');
      gradient.addColorStop(1, 'rgba(76, 175, 80, 0.0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Draw frequency labels
    ctx.fillStyle = '#aaa';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    freqBands.forEach(freq => {
      const x = (Math.log10(freq / 20) / Math.log10(20000 / 20)) * width;
      ctx.fillText(freq >= 1000 ? `${freq / 1000}k` : freq.toString(), x, height - 5);
    });

    // Draw dB labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      const dB = -60 + (i * 6);
      ctx.fillText(`${dB}dB`, width - 5, y + 4);
    }

  }, [frequencyData, isAnalyzing]);

  return (
    <div className="frequency-chart-container">
      <div className="chart-header">
        <h3>Frekans Yanıtı</h3>
        <div className={`analyzing-indicator ${isAnalyzing ? 'active' : ''}`}>
          <span></span>
          {isAnalyzing ? 'Analiz Ediliyor...' : 'Duraklatıldı'}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="frequency-chart"
      />
    </div>
  );
};

export default FrequencyChart;

