import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Footer from './components/Footer/Footer';
import CartModal from './components/CartModal/CartModal';
import { WATCHES } from './data/watchesData';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio'); // 'inicio' | 'catalogo' | 'modelos' | 'artesania' | 'contacto'
  const [selectedWatchId, setSelectedWatchId] = useState(WATCHES[0].id);
  const [themeAccent, setThemeAccent] = useState('#00C853');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleNavigateToCatalog = (watchId) => {
    if (watchId) setSelectedWatchId(watchId);
    setActiveTab('catalogo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (watchItem) => {
    setCart((prev) => [...prev, watchItem]);
  };

  const handleRemoveCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="app-main-layout">
      {/* Top Navbar matching reference layout */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        accentColor={themeAccent}
      />

      {/* Main Page Routing */}
      <main className="app-content-body">
        {activeTab === 'inicio' && (
          <Home 
            onNavigateToCatalog={handleNavigateToCatalog} 
            onSelectWatchForCatalog={(w) => setSelectedWatchId(w.id)}
          />
        )}

        {activeTab === 'catalogo' && (
          <Catalog 
            initialWatchId={selectedWatchId} 
            onAddToCart={handleAddToCart}
            onAccentChange={setThemeAccent}
          />
        )}

        {activeTab === 'modelos' && (
          <div className="static-page-wrapper">
            <div className="static-page-header">
              <span className="section-eyebrow">COLECCIONES EXCLUSIVAS</span>
              <h1 className="static-page-title">Gama Completa de Modelos</h1>
              <p className="static-page-subtitle">
                Descubre nuestra selección de cronómetros y relojes de alta complicación.
              </p>
            </div>
            <div className="models-full-grid">
              {WATCHES.map((w) => (
                <div key={w.id} className="model-full-card glass-panel">
                  <div className="model-card-header">
                    <span className="model-series-badge">{w.series}</span>
                    <span className="model-price-badge">{w.price}</span>
                  </div>
                  <h3 className="model-card-name">{w.name}</h3>
                  <p className="model-card-tagline">{w.tagline}</p>
                  <ul className="model-specs-bullets">
                    <li><i className="fa-solid fa-check"></i> Caja: {w.caseMaterial}</li>
                    <li><i className="fa-solid fa-check"></i> Bisel: {w.bezel}</li>
                    <li><i className="fa-solid fa-check"></i> Calibre: {w.movement}</li>
                    <li><i className="fa-solid fa-check"></i> Reserva: {w.powerReserve}</li>
                  </ul>
                  <button 
                    className="btn-primary-explore"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                    onClick={() => handleNavigateToCatalog(w.id)}
                  >
                    <span>Configurar en 3D</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'artesania' && (
          <div className="static-page-wrapper">
            <div className="static-page-header">
              <span className="section-eyebrow">MANUFACTURA SUIZA</span>
              <h1 className="static-page-title">El Arte de la Alta Relojería</h1>
              <p className="static-page-subtitle">
                Más de un siglo de tradición, precisión y dominio de los materiales más nobles.
              </p>
            </div>
            <div className="artesania-grid">
              <div className="artesania-card glass-panel">
                <div className="art-icon"><i className="fa-solid fa-gem"></i></div>
                <h3>Zafiro y Lentes de Precisión</h3>
                <p>Nuestros cristales de zafiro sintético son cortados con diamante y tratados con recubrimiento antirreflejo multicapa para una transparencia inalterable.</p>
              </div>
              <div className="artesania-card glass-panel">
                <div className="art-icon"><i className="fa-solid fa-gear"></i></div>
                <h3>Calibres Automáticos</h3>
                <p>Ensamblados íntegramente a mano por maestros relojeros en Ginebra, con espiral de silicio antimagnética y amortiguadores de alta absorción.</p>
              </div>
              <div className="artesania-card glass-panel">
                <div className="art-icon"><i className="fa-solid fa-shield-halved"></i></div>
                <h3>Oystersteel 904L</h3>
                <p>Acero superaleado utilizado en la industria aeroespacial que ofrece una resistencia extrema a la corrosión y un brillo excepcional al ser pulido.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacto' && (
          <div className="static-page-wrapper">
            <div className="static-page-header">
              <span className="section-eyebrow">ATENCIÓN PERSONALIZADA</span>
              <h1 className="static-page-title">Contacto & Boutiques Privadas</h1>
              <p className="static-page-subtitle">
                Agenda una cita privada con nuestros expertos en relojería o solicita asistencia VIP.
              </p>
            </div>
            <div className="contact-form-card glass-panel">
              <form onSubmit={(e) => { e.preventDefault(); alert('Solicitud enviada con éxito. Un asesor concierge se comunicará contigo.'); }}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Nombre y Apellidos</label>
                    <input type="text" placeholder="Ej. Alexander Vance" required />
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" placeholder="alexander@luxury.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Colección de Interés</label>
                  <select>
                    <option>Rolex Datejust 41</option>
                    <option>Rolex Submariner Date</option>
                    <option>Rolex Cosmograph Daytona</option>
                    <option>Edición a Medida / Personalizada</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mensaje o Preferencia de Cita</label>
                  <textarea rows="4" placeholder="Indica tu horario preferido o consulta especial..."></textarea>
                </div>
                <button type="submit" className="btn-primary-explore" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Enviar Solicitud VIP</span>
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* VIP Cart Drawer Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        accentColor={themeAccent}
      />
    </div>
  );
}

