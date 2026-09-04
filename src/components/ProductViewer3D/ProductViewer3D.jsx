import React, { useEffect } from 'react';
import { useThreeJS } from '../../hooks/useThreeJS';
import './ProductViewer3D.css';

export default function ProductViewer3D({ 
  modelPath = `${import.meta.env.BASE_URL}rolex_datejust.glb`, 
  dialColor = '#00C853',
  accentColorHex = '#00C853',
  onPrev, 
  onNext, 
  registerControls 
}) {
  const { 
    containerRef, 
    isLoading, 
    loadError, 
    isRotating, 
    spinModel, 
    toggleRotation, 
    resetPosition 
  } = useThreeJS(modelPath, {
    dialColor,
    accentColorHex,
    rotationSpeed: 0.004,
  });

  // Registrar controles para que el componente padre pueda invocarlos
  useEffect(() => {
    if (registerControls) {
      registerControls({
        toggleRotation,
        resetPosition,
        spinModel,
        isRotating,
      });
    }
  }, [registerControls, toggleRotation, resetPosition, spinModel, isRotating]);

  return (
    <div className="product-viewer">
      {/* Flecha Izquierda */}
      <button 
        className="arrow-btn arrow-btn--prev"
        onClick={() => {
          spinModel(-1);
          if (onPrev) onPrev();
        }}
        aria-label="Reloj anterior"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      {/* Contenedor del Canvas 3D */}
      <div className="product-viewer__canvas" ref={containerRef}>
        {isLoading && (
          <div className="viewer-spinner">
            <div className="spinner-ring"></div>
            <span>Cargando modelo 3D...</span>
          </div>
        )}
      </div>

      {/* Flecha Derecha */}
      <button 
        className="arrow-btn arrow-btn--next"
        onClick={() => {
          spinModel(1);
          if (onNext) onNext();
        }}
        aria-label="Reloj siguiente"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
}

