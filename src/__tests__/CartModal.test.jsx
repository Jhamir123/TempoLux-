import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartModal from '../components/CartModal/CartModal';

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  cartItems: [],
  onRemoveItem: vi.fn(),
  onClearCart: vi.fn(),
  accentColor: '#00C853'
};

const sampleItem = {
  name: 'Datejust 41',
  series: 'Oyster Perpetual',
  price: '$12,450',
  priceNum: 12450,
  colorHex: '#00c853',
  selectedColor: 'Verde Esmeralda'
};

describe('CartModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no se renderiza cuando isOpen es false', () => {
    render(<CartModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Tu Selección VIP')).toBeNull();
  });

  it('se renderiza cuando isOpen es true', () => {
    render(<CartModal {...defaultProps} />);
    expect(screen.getByText('Tu Selección VIP')).toBeTruthy();
  });

  it('muestra mensaje de carrito vacío cuando no hay items', () => {
    render(<CartModal {...defaultProps} />);
    expect(screen.getByText('Tu selección está vacía.')).toBeTruthy();
  });

  it('muestra los items del carrito', () => {
    render(<CartModal {...defaultProps} cartItems={[sampleItem]} />);
    expect(screen.getByText('Datejust 41')).toBeTruthy();
    expect(screen.getByText('$12,450')).toBeTruthy();
  });

  it('llama a onClose al hacer clic en el overlay', () => {
    render(<CartModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Tu Selección VIP').closest('.cart-modal-overlay'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('llama a onClose al hacer clic en el botón de cerrar', () => {
    render(<CartModal {...defaultProps} />);
    const closeBtn = screen.getByText('Tu Selección VIP').closest('.cart-modal-header').querySelector('.cart-close-btn');
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('muestra el total cuando hay items', () => {
    render(<CartModal {...defaultProps} cartItems={[sampleItem]} />);
    expect(screen.getByText('Total Estimado:')).toBeTruthy();
    expect(screen.getByText('$12,450 USD')).toBeTruthy();
  });

  it('llama a onClearCart al hacer clic en "Vaciar selección"', () => {
    render(<CartModal {...defaultProps} cartItems={[sampleItem]} />);
    fireEvent.click(screen.getByText('Vaciar selección'));
    expect(defaultProps.onClearCart).toHaveBeenCalled();
  });
});
