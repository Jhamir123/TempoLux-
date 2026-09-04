import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renderiza sin errores', () => {
    render(<App />);
    const nexoraElements = screen.getAllByText('NEXORA');
    expect(nexoraElements.length).toBeGreaterThanOrEqual(1);
  });

  it('muestra el navbar con las opciones de navegación', () => {
    render(<App />);
    const inicioButtons = screen.getAllByText('Inicio');
    expect(inicioButtons.length).toBeGreaterThanOrEqual(1);
    const catalogoButtons = screen.getAllByText('Catálogo');
    expect(catalogoButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('muestra el botón del carrito', () => {
    render(<App />);
    expect(screen.getByLabelText('Ver carrito')).toBeTruthy();
  });
});
