import React from 'react';
import './Footer.css';

export default function Footer({ onNavigate }) {
  return (
    <footer className="luxury-footer">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="footer-logo-brand">NEXORA</span>
              <span className="footer-logo-sub">HAUTE HORLOGERIE SUIZA</span>
            </div>
            <p className="footer-brand-desc">
              Pioneros en la convergencia entre la maestría relojera centenaria de Ginebra y las experiencias digitales 3D de nueva generación.
            </p>
            <div className="footer-socials">
              <a href="#instagram" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#youtube" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
              <a href="#linkedin" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#twitter" aria-label="X"><i className="fa-brands fa-x-twitter"></i></a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Colecciones</h4>
            <ul>
              <li><button onClick={() => onNavigate('catalogo')}>Oyster Perpetual Datejust</button></li>
              <li><button onClick={() => onNavigate('catalogo')}>Submariner Date</button></li>
              <li><button onClick={() => onNavigate('catalogo')}>Cosmograph Daytona</button></li>
              <li><button onClick={() => onNavigate('catalogo')}>Ediciones Limitadas 2026</button></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Experiencia</h4>
            <ul>
              <li><button onClick={() => onNavigate('inicio')}>Inicio</button></li>
              <li><button onClick={() => onNavigate('catalogo')}>Estudio 3D & 360°</button></li>
              <li><button onClick={() => onNavigate('artesania')}>Calibres & Manufactura</button></li>
              <li><button onClick={() => onNavigate('contacto')}>Boutiques Oficiales</button></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="footer-newsletter-col">
            <h4 className="footer-col-title">Círculo Privado</h4>
            <p className="footer-newsletter-p">Recibe invitaciones exclusivas a lanzamientos de piezas limitadas y exposiciones privadas.</p>
            <form className="footer-newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por unirte al Círculo Privado de NEXORA!'); }}>
              <input type="email" placeholder="Ingresa tu correo electrónico..." required />
              <button type="submit" aria-label="Suscribirse">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © 2026 NEXORA WATCHES S.A. Todos los derechos reservados. Hecho con precisión suiza.
          </div>
          <div className="footer-legal-links">
            <a href="#privacidad">Privacidad</a>
            <a href="#terminos">Términos de Servicio</a>
            <a href="#garantia">Certificación</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

