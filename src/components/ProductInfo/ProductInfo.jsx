import React from 'react';
import './ProductInfo.css';

export default function ProductInfo({ 
  sku = '#NX-8427GL', 
  name = 'ROLEX\nDATEJUST 41', 
  price = 'USD 12,450',
  accentColor = '#00C853',
  onExploreClick 
}) {
  return (
    <div className="product-info">
      <span className="product-info__sku" style={{ color: accentColor }}>
        {sku}
      </span>

      <h1 className="product-info__name">
        {name.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < name.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </h1>

      <div className="product-info__price">{price}</div>

      <button 
        className="product-info__btn"
        style={{ borderColor: accentColor, color: accentColor }}
        onClick={onExploreClick}
      >
        <span>Explorar Reloj</span>
      </button>
    </div>
  );
}

