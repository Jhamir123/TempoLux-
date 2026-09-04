import React from 'react';
import { LUXURY_SPECS } from '../../data/watchesData';
import './Home.css';

export default function Home({ onNavigateToCatalog }) {
  return (
    <div className="home-page-container">
      {/* 1. HERO SECTION */}
      <section className="hero-reference-section">
        <video className="hero-bg-video" autoPlay muted loop playsInline>
          <source src={`${import.meta.env.BASE_URL}videos/hero-bg.mp4`} type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
        <div className="hero-inner-frame">
          <div className="hero-grid">
            {/* Columna Izquierda: Tipografía y Botones de Acción */}
            <div className="hero-left-content">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                ALTA RELOJERÍA SUIZA · EDICIÓN 2026
              </div>

              <h1 className="hero-main-title">
                Innovación <br />
                <span className="hero-title-highlight">que cobra</span> <br />
                forma.
              </h1>

              <p className="hero-description">
                Experiencias de relojería en 3D que conectan la precisión suiza, la alta artesanía y el diseño más vanguardista.
              </p>

              {/* Botones de Acción */}
              <div className="hero-actions-row">
                <button 
                  className="btn-primary-explore"
                  onClick={() => onNavigateToCatalog()}
                >
                  <span>Explorar catálogo</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>

                <button 
                  className="btn-secondary-details"
                  onClick={() => onNavigateToCatalog()}
                >
                  <i className="fa-solid fa-cube"></i>
                  <span>Ver en 360°</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ESPECIFICACIONES & INGENIERÍA SUIZA */}
      <section className="craftsmanship-section">
        <div className="craftsmanship-container">
          <div className="craft-text-side">
            <span className="section-eyebrow">INGENIERÍA & MAESTRÍA</span>
            <h2 className="section-title">Perfección Mecánica sin Concesiones</h2>
            <p className="craft-p">
              Desde el legendario bisel estriado en oro de 18k hasta el calibre 3235 con espiral Parachrom azul antimagnética, cada componente representa la cumbre de la manufactura relojera.
            </p>

            <div className="specs-list-grid">
              {LUXURY_SPECS.map((spec, i) => (
                <div key={i} className="spec-card-item">
                  <div className="spec-icon-box">
                    <i className={`fa-solid ${spec.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="spec-title">{spec.title}</h4>
                    <p className="spec-desc">{spec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
