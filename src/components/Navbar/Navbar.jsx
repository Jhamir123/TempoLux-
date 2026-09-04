import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab, cartCount = 0, onOpenCart, accentColor = '#00C853' }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getCtaStyle = () => {
    const col = (accentColor || '').toLowerCase();
    if (col === '#1e88e5') {
      return {
        background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
        boxShadow: '0 4px 20px rgba(30, 136, 229, 0.55)'
      };
    }
    if (col === '#94a3b8') {
      return {
        background: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
        boxShadow: '0 4px 20px rgba(100, 116, 139, 0.45)'
      };
    }
    return {
      background: 'linear-gradient(135deg, #00c853 0%, #00963d 100%)',
      boxShadow: '0 4px 18px rgba(0, 200, 83, 0.35)'
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'artesania', label: 'Artesanía' },
    { id: 'contacto', label: 'Contacto' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`navbar-header ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-logo" onClick={() => handleNavClick('inicio')}>
          <span className="logo-brand">NEXORA</span>
          <span className="logo-tag" style={{ color: accentColor }}>GENÈVE · 1908</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="navbar-nav">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-link-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <span 
                      className="nav-indicator" 
                      style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} 
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right CTA and Cart Action */}
        <div className="navbar-actions">
          <button 
            className="btn-cart" 
            onClick={onOpenCart}
            aria-label="Ver carrito"
          >
            <i className="fa-solid fa-bag-shopping"></i>
            {cartCount > 0 && (
              <span className="cart-badge" style={{ backgroundColor: accentColor }}>
                {cartCount}
              </span>
            )}
          </button>

          <button 
            className="btn-demo-cta" 
            onClick={() => handleNavClick('catalogo')}
            style={getCtaStyle()}
          >
            Explorar Catálogo 3D
          </button>

          {/* Mobile hamburger */}
          <button 
            className="btn-hamburger" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <ul className="mobile-nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`mobile-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
