import React from 'react';
import './Controls3D.css';

export default function Controls3D({ isRotating, onToggleRotation, onResetPosition }) {
  return (
    <div className="controls-3d">
      <button 
        className="control-btn"
        onClick={onToggleRotation}
        aria-label={isRotating ? 'Pausar rotación' : 'Reanudar rotación'}
      >
        <i className={`fa-solid ${isRotating ? 'fa-arrows-spin fa-spin' : 'fa-play'}`}></i>
        <span>{isRotating ? 'Pausar Giro' : 'Reanudar Giro'}</span>
      </button>

      {onResetPosition && (
        <>
          <div className="control-divider"></div>
          <button 
            className="control-btn"
            onClick={onResetPosition}
            aria-label="Restablecer posición original"
            title="Restablecer posición del reloj"
          >
            <i className="fa-solid fa-arrows-rotate"></i>
            <span>Restablecer</span>
          </button>
        </>
      )}

      <div className="control-divider"></div>
      <div className="control-hint">
        <i className="fa-solid fa-hand-pointer"></i>
        <span>Arrastra en 360° & Zoom</span>
      </div>
    </div>
  );
}

