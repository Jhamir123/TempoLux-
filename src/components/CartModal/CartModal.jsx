import React from 'react';
import './CartModal.css';

export default function CartModal({ isOpen, onClose, cartItems, onRemoveItem, onClearCart, accentColor = '#00C853' }) {
  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + (item.priceNum || 12450), 0);

  // El color activo del carrito corresponde exactamente al reloj que el usuario tiene seleccionado en la pantalla
  const activeColor = accentColor || '#00C853';

  // Configuración de atmósfera y estilos según el color del reloj activo
  const getThemeStyles = (color) => {
    const c = (color || '').toLowerCase();
    
    // Azul Zafiro
    if (c === '#1e88e5' || c.includes('blue')) {
      return {
        drawerBg: 'linear-gradient(180deg, #0a172c 0%, #050b16 100%)',
        drawerBorder: '1px solid rgba(30, 136, 229, 0.3)',
        footerBg: 'rgba(5, 11, 22, 0.96)',
        btnBg: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
        btnShadow: '0 6px 24px rgba(30, 136, 229, 0.5)',
        accentText: '#38bdf8',
        cardBg: 'rgba(30, 136, 229, 0.05)',
        cardBorder: '1px solid rgba(30, 136, 229, 0.2)'
      };
    }

    // Gris / Negro
    if (c === '#94a3b8' || c.includes('grey') || c.includes('gray')) {
      return {
        drawerBg: 'linear-gradient(180deg, #151821 0%, #0b0d12 100%)',
        drawerBorder: '1px solid rgba(148, 163, 184, 0.25)',
        footerBg: 'rgba(11, 13, 18, 0.96)',
        btnBg: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
        btnShadow: '0 6px 24px rgba(100, 116, 139, 0.45)',
        accentText: '#cbd5e1',
        cardBg: 'rgba(148, 163, 184, 0.05)',
        cardBorder: '1px solid rgba(148, 163, 184, 0.18)'
      };
    }

    // Verde Esmeralda (Rolex Clásico)
    return {
      drawerBg: 'linear-gradient(180deg, #091e13 0%, #040d08 100%)',
      drawerBorder: '1px solid rgba(0, 200, 83, 0.3)',
      footerBg: 'rgba(4, 13, 8, 0.96)',
      btnBg: 'linear-gradient(135deg, #00c853 0%, #00963d 100%)',
      btnShadow: '0 6px 24px rgba(0, 200, 83, 0.5)',
      accentText: '#00e676',
      cardBg: 'rgba(0, 200, 83, 0.05)',
      cardBorder: '1px solid rgba(0, 200, 83, 0.2)'
    };
  };

  const theme = getThemeStyles(activeColor);

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div 
        className="cart-modal-drawer glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.drawerBg,
          borderLeft: theme.drawerBorder
        }}
      >
        <div className="cart-modal-header" style={{ borderBottom: theme.drawerBorder }}>
          <div className="cart-header-title">
            <i className="fa-solid fa-bag-shopping" style={{ color: theme.accentText }}></i>
            <h3>Tu Selección VIP</h3>
            <span className="cart-items-count">({cartItems.length})</span>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cart-modal-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <i className="fa-regular fa-gem" style={{ color: theme.accentText }}></i>
              <p>Tu selección está vacía.</p>
              <span>Explora nuestro catálogo 3D para agregar piezas exclusivas.</span>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item, index) => {
                const itemColor = item.colorHex || item.accentColor || '#00c853';
                const itemColorName = item.selectedColor || item.colorName || 'Verde Esmeralda';
                return (
                  <div 
                    key={index} 
                    className="cart-item-card"
                    style={{
                      background: theme.cardBg,
                      border: theme.cardBorder
                    }}
                  >
                    <div 
                      className="cart-item-color-dot" 
                      style={{ 
                        backgroundColor: itemColor,
                        boxShadow: `0 0 12px ${itemColor}99` 
                      }} 
                    />
                    <div className="cart-item-info">
                      <span className="cart-item-series" style={{ color: theme.accentText }}>
                        {item.series || 'Oyster Perpetual'}
                      </span>
                      <h4 className="cart-item-name">{item.name ? item.name.replace('\n', ' ') : 'ROLEX DATEJUST 41'}</h4>
                      <span className="cart-item-color">
                        Esfera: <strong style={{ color: itemColor }}>{itemColorName}</strong>
                      </span>
                      <span className="cart-item-price">{item.price}</span>
                    </div>
                    <button className="cart-item-remove" onClick={() => onRemoveItem(index)}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div 
            className="cart-modal-footer"
            style={{
              background: theme.footerBg,
              borderTop: theme.drawerBorder
            }}
          >
            <div className="cart-total-row">
              <span>Total Estimado:</span>
              <strong>${total.toLocaleString()} USD</strong>
            </div>
            <button 
              className="btn-checkout-vip"
              style={{
                background: theme.btnBg,
                boxShadow: theme.btnShadow
              }}
              onClick={() => alert('¡Gracias por tu interés! Un asesor concierge de NEXORA se contactará contigo para coordinar tu entrega personalizada.')}
            >
              <i className="fa-solid fa-lock"></i>
              <span>Proceder a la Reserva</span>
            </button>
            <button className="btn-clear-cart" onClick={onClearCart}>
              Vaciar selección
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

