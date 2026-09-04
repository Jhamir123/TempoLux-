import React from 'react';
import './ProductDesc.css';

export default function ProductDesc({ 
  description = 'Precisión extrema con diseño imponente. Cada detalle ha sido cuidadosamente elaborado para ofrecer una experiencia única de lujo y funcionalidad.',
  accentColor = '#00C853',
  onWishlist,
  onShare,
  onInfo
}) {
  return (
    <div className="product-desc">
      <p className="product-desc__text">
        {description}
      </p>

      <div className="product-desc__actions">
        <button 
          className="action-icon" 
          onClick={onWishlist}
          title="Guardar en favoritos"
          aria-label="Favoritos"
        >
          <i className="fa-regular fa-heart"></i>
        </button>

        <button 
          className="action-icon" 
          onClick={onShare}
          title="Compartir modelo"
          aria-label="Compartir"
        >
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </button>

        <button 
          className="action-icon" 
          onClick={onInfo}
          title="Ver especificaciones"
          aria-label="Información"
        >
          <i className="fa-solid fa-circle-info"></i>
        </button>
      </div>
    </div>
  );
}

