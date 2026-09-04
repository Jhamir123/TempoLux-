import React from 'react';
import './LoadingScreen.css';

export default function LoadingScreen({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">NEXORA</div>
        <div className="loading-tag">HAUTE HORLOGERIE</div>
        <div className="loading-spinner">
          <div className="loading-spinner-inner"></div>
        </div>
        <span className="loading-text">Cargando experiencia 3D...</span>
      </div>
    </div>
  );
}

