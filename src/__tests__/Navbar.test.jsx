import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar/Navbar';

const defaultProps = {
  activeTab: 'inicio',
  setActiveTab: vi.fn(),
  cartCount: 0,
  onOpenCart: vi.fn(),
  accentColor: '#00C853'
};

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el logo NEXORA', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText('NEXORA')).toBeTruthy();
  });

  it('renderiza los items de navegación', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText('Inicio')).toBeTruthy();
    expect(screen.getByText('Catálogo')).toBeTruthy();
    expect(screen.getByText('Artesanía')).toBeTruthy();
    expect(screen.getByText('Contacto')).toBeTruthy();
  });

  it('llama a setActiveTab al hacer clic en un item', () => {
    render(<Navbar {...defaultProps} />);
    fireEvent.click(screen.getByText('Catálogo'));
    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('catalogo');
  });

  it('muestra el badge del carrito cuando hay items', () => {
    render(<Navbar {...defaultProps} cartCount={3} />);
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('no muestra el badge del carrito cuando está vacío', () => {
    render(<Navbar {...defaultProps} cartCount={0} />);
    expect(screen.queryByText('0')).toBeNull();
  });

  it('llama a onOpenCart al hacer clic en el botón del carrito', () => {
    render(<Navbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Ver carrito'));
    expect(defaultProps.onOpenCart).toHaveBeenCalled();
  });
});
