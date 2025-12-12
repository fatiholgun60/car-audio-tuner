import React from 'react';
import './AmplifierControl.css';

const AmplifierControl = ({ 
  section, 
  settings, 
  onSettingChange, 
  recommendations = null 
}) => {
  const renderButton = (name, value, options) => {
    const currentValue = settings[name];
    const hasRecommendation = recommendations && recommendations[name] !== undefined;
    
    return (
      <div className="control-button-group">
        <button
          className={`control-button ${hasRecommendation ? 'has-recommendation' : ''}`}
          onClick={() => {
            const nextValue = options.find(opt => opt !== currentValue) || options[0];
            onSettingChange(name, nextValue);
          }}
        >
          {name}
        </button>
        <div className="button-options">
          {options.map(opt => (
            <span 
              key={opt} 
              className={currentValue === opt ? 'active' : ''}
            >
              {opt}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderKnob = (name, min, max, unit = '', step = 1, bandLabel = '', useMinMax = false) => {
    const value = settings[name] || min;
    const hasRecommendation = recommendations && recommendations[name] !== undefined;
    const recommendedValue = hasRecommendation ? recommendations[name] : null;
    
    const percentage = ((value - min) / (max - min)) * 100;
    const rotation = (percentage / 100) * 270 - 135; // -135 to 135 degrees
    
    return (
      <div className="control-knob-group">
        <div className="knob-container">
          <div 
            className={`knob ${hasRecommendation ? 'has-recommendation' : ''}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="knob-indicator"></div>
          </div>
          {hasRecommendation && (
            <div 
              className="knob-recommendation"
              style={{ 
                transform: `rotate(${((recommendedValue - min) / (max - min)) * 270 - 135}deg)` 
              }}
            >
              <div className="recommendation-marker"></div>
            </div>
          )}
        </div>
        <div className="knob-label">
          {name}
          {bandLabel && <span className="band-label">{bandLabel}</span>}
        </div>
        <div className="knob-values">
          {useMinMax ? (
            <>
              <span>MIN</span>
              <span>MAX</span>
            </>
          ) : (
            <>
              <span>{min}{unit}</span>
              <span>{max}{unit}</span>
            </>
          )}
        </div>
        <div className="knob-value-display">{value.toFixed(0)}{unit}</div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onSettingChange(name, parseFloat(e.target.value))}
          className="knob-input"
        />
      </div>
    );
  };

  const renderSlider = (name, options) => {
    const currentValue = settings[name];
    const currentIndex = options.indexOf(currentValue);
    const hasRecommendation = recommendations && recommendations[name] !== undefined;
    
    return (
      <div className="control-slider-group">
        <div className="slider-label">{name}</div>
        <div className="slider-container">
          <div className="slider-track">
            <div 
              className="slider-thumb"
              style={{ left: `${(currentIndex / (options.length - 1)) * 100}%` }}
            ></div>
            {hasRecommendation && (
              <div 
                className="slider-recommendation"
                style={{ 
                  left: `${(options.indexOf(recommendations[name]) / (options.length - 1)) * 100}%` 
                }}
              ></div>
            )}
          </div>
        </div>
        <div className="slider-options">
          {options.map(opt => (
            <span 
              key={opt} 
              className={currentValue === opt ? 'active' : ''}
            >
              {opt}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (section === 'rear') {
    return (
      <div className="amplifier-section rear-section">
        <div className="section-header">REAR</div>
        <div className="controls-grid rear-grid">
          {/* First Row */}
          {renderButton('ampMode', settings.ampMode, ['5 Ch', '3 Ch'])}
          {renderButton('input', settings.input, ['ON', 'OFF'])}
          {renderKnob('levels', 0, 100, '', 1, '', true)}
          {renderKnob('hiPass', 50, 500, ' Hz', 10, 'BAND: HI PASS')}
          {/* Second Row */}
          {renderSlider('mode', ['FULL', 'HI', 'BAND (FRONT IN)'])}
          {renderKnob('loPass', 50, 500, ' Hz', 10)}
          {renderKnob('boost', 0, 12, ' dB', 1)}
          {renderButton('subsonic', settings.subsonic, ['ON', 'OFF'])}
        </div>
      </div>
    );
  }

  if (section === 'sub') {
    return (
      <div className="amplifier-section sub-section">
        <div className="section-header">SUB</div>
        <div className="controls-grid sub-grid">
          {renderButton('art', settings.art, ['ON', 'OFF'])}
          {renderButton('input', settings.input, ['ON', 'OFF'])}
          {renderKnob('level', 0, 100, '', 1, '', true)}
        </div>
      </div>
    );
  }

  if (section === 'front') {
    return (
      <div className="amplifier-section front-section">
        <div className="section-header">FRONT (3Ch)</div>
        <div className="controls-grid front-grid">
          {renderButton('mode', settings.mode, ['HI', 'FULL'])}
          {renderKnob('levels', 0, 100, '', 1, '', true)}
          {renderButton('range', settings.range, ['x10', 'x1'])}
          {renderKnob('hiPass', 50, 500, ' Hz', 10, 'BAND: LO PASS')}
        </div>
      </div>
    );
  }

  return null;
};

export default AmplifierControl;

