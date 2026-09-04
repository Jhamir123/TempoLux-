import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Catalog.css';

import ProductInfo from '../../components/ProductInfo/ProductInfo';
import ProductViewer3D from '../../components/ProductViewer3D/ProductViewer3D';
import ProductDesc from '../../components/ProductDesc/ProductDesc';
import Controls3D from '../../components/Controls3D/Controls3D';

// Lista de relojes con soporte para modelo GLB (/rolex_datejust.glb) y colores reactivos
const catalogProducts = [
  {
    id: 'datejust-green',
    sku: '#NX-8427GL',
    name: 'ROLEX\nDATEJUST 41',
    price: 'USD 12,450',
    colorName: 'Verde Esmeralda',
    accentColor: '#00C853',
    accentDim: 'rgba(0, 200, 83, 0.08)',
    dialHex: null,
    modelPath: `${import.meta.env.BASE_URL}rolex_datejust.glb`,
    description: 'Bisel estriado en oro blanco de 18k con esfera verde olivo / esmeralda y brazalete Jubilee. Precisión extrema con calibre 3235 manufactura Rolex.',
    diameter: '41 mm',
    movement: 'Calibre 3235 Automático',
    waterResistance: '100 metros'
  },
  {
    id: 'datejust-blue',
    sku: '#NX-8428BL',
    name: 'ROLEX\nDATEJUST 41',
    price: 'USD 12,850',
    colorName: 'Azul Zafiro',
    accentColor: '#1E88E5',
    accentDim: 'rgba(30, 136, 229, 0.08)',
    dialHex: '#0f3869',
    modelPath: `${import.meta.env.BASE_URL}rolex_datejust.glb`,
    description: 'Elegancia atemporal con esfera azul brillante y acabado rayos de sol. Cristal de zafiro con lente Cyclops sobre la fecha.',
    diameter: '41 mm',
    movement: 'Calibre 3235 Automático',
    waterResistance: '100 metros'
  },
  {
    id: 'datejust-black',
    sku: '#NX-8429BK',
    name: 'ROLEX\nDATEJUST 41',
    price: 'USD 12,150',
    colorName: 'Gris / Negro',
    accentColor: '#94a3b8',
    accentDim: 'rgba(148, 163, 184, 0.08)',
    dialHex: '#1a202c',
    modelPath: `${import.meta.env.BASE_URL}rolex_datejust.glb`,
    description: 'Sutileza monocromática en acero Oystersteel 904L con esfera gris pizarra y rodio oscuro. Hermeticidad garantizada con corona Twinlock.',
    diameter: '41 mm',
    movement: 'Calibre 3235 Automático',
    waterResistance: '100 metros'
  }
];

export default function Catalog({ onAddToCart, onAccentChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const controlsRef = useRef(null);
  const currentProduct = catalogProducts[currentIndex];

  // Cambiar el resplandor ambiental y variables CSS cuando cambia el reloj
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-green', currentProduct.accentColor);
    root.style.setProperty('--accent-green-dim', currentProduct.accentDim);
    root.style.setProperty('--accent-green-soft', currentProduct.accentColor + '26');
    root.style.setProperty('--accent-green-glow', currentProduct.accentColor + '66');
    root.style.setProperty('--glass-border-hover', currentProduct.accentColor + '4d');

    if (onAccentChange) {
      onAccentChange(currentProduct.accentColor);
    }

    return () => {
      // Restaurar verde Rolex por defecto al salir
      root.style.setProperty('--accent-green', '#00C853');
      root.style.setProperty('--accent-green-dim', 'rgba(0, 200, 83, 0.08)');
      root.style.setProperty('--accent-green-soft', 'rgba(0, 200, 83, 0.15)');
      root.style.setProperty('--accent-green-glow', 'rgba(0, 200, 83, 0.4)');
      root.style.setProperty('--glass-border-hover', 'rgba(0, 200, 83, 0.3)');
    };
  }, [currentProduct, onAccentChange]);

  const handleSelectColor = (index) => {
    setCurrentIndex(index);
    const prod = catalogProducts[index];
    setToastMessage(`Variante seleccionada: ${prod.colorName}`);
  };

  // Restablecer posición de cámara y modelo
  const handleResetPosition = () => {
    if (controlsRef.current && controlsRef.current.resetPosition) {
      controlsRef.current.resetPosition();
    }
  };

  // Alternar rotación automática
  const handleToggleRotation = () => {
    if (controlsRef.current && controlsRef.current.toggleRotation) {
      controlsRef.current.toggleRotation();
    }
  };

  const registerControls = useCallback((controls) => {
    controlsRef.current = controls;
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? catalogProducts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === catalogProducts.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    const itemToAdd = {
      ...currentProduct,
      series: 'Oyster Perpetual',
      colorHex: currentProduct.accentColor,
      selectedColor: currentProduct.colorName,
      priceNum: parseInt(currentProduct.price.replace(/[^0-9]/g, ''), 10) || 12450
    };
    if (onAddToCart) {
      onAddToCart(itemToAdd);
    }
    setToastMessage(`${currentProduct.name.replace('\n', ' ')} (${currentProduct.colorName}) añadido.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="catalog-experience-page">
      {/* Toast informativo con color dinámico del reloj */}
      {toastMessage && (
        <div 
          className="catalog-toast"
          style={{
            background: currentProduct.accentColor,
            color: currentProduct.accentColor === '#94a3b8' ? '#000000' : '#ffffff',
            boxShadow: `0 10px 30px ${currentProduct.accentColor}66`
          }}
        >
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Badge Disponible */}
      <div className="badge-disponible">
        <span className="badge-pulse" style={{ backgroundColor: currentProduct.accentColor }}></span>
        Disponible para entrega inmediata
      </div>

      {/* Selector de variantes de color */}
      <div className="catalog-color-pills">
        {catalogProducts.map((p, idx) => {
          const isActive = currentIndex === idx;
          return (
            <button
              key={p.id}
              className={`color-pill-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              style={isActive ? {
                borderColor: p.accentColor,
                backgroundColor: `${p.accentColor}26`,
                boxShadow: `0 0 18px ${p.accentColor}55`,
                color: '#ffffff'
              } : {}}
            >
              <span className="pill-dot" style={{ backgroundColor: p.accentColor }}></span>
              <span>{p.colorName}</span>
            </button>
          );
        })}
      </div>

      {/* Hero Central 3D Experience */}
      <section className="catalog-hero-3d">
        <div className="catalog-hero__content">
          {/* Panel Izquierdo */}
          <ProductInfo 
            sku={currentProduct.sku}
            name={currentProduct.name}
            price={currentProduct.price}
            accentColor={currentProduct.accentColor}
            onExploreClick={handleAddToCart}
          />

          {/* Panel Central - Canvas 3D (Carga de /rolex_datejust.glb con Three.js) */}
          <div className="viewer-central-stage">
            <div 
              className="stage-ambient-glow" 
              style={{
                background: `radial-gradient(circle, ${currentProduct.accentDim} 0%, transparent 70%)`
              }} 
            />
            <ProductViewer3D 
              modelPath={currentProduct.modelPath}
              dialColor={currentProduct.dialHex}
              accentColorHex={currentProduct.accentColor}
              onPrev={handlePrev}
              onNext={handleNext}
              registerControls={registerControls}
            />
            
            {/* Controles 3D Inferiores Flotantes */}
            <Controls3D 
              isRotating={isRotating}
              onToggleRotation={handleToggleRotation}
              onResetPosition={handleResetPosition}
            />
          </div>

          {/* Panel Derecho */}
          <ProductDesc 
            description={currentProduct.description}
            accentColor={currentProduct.accentColor}
            onWishlist={() => alert('Añadido a tu lista de deseos')}
            onShare={() => alert('Enlace del reloj copiado al portapapeles')}
            onInfo={() => alert(`Especificaciones:\n• Diámetro: ${currentProduct.diameter}\n• Movimiento: ${currentProduct.movement}\n• Hermeticidad: ${currentProduct.waterResistance}`)}
          />
        </div>
      </section>
    </div>
  );
}
