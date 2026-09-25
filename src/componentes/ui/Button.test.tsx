import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from './Button';

describe('Button component', () => {
  it('renders children text correctly', () => {
    render(<Button>Guardar Cambios</Button>);
    expect(screen.getByRole('button', { name: /Guardar Cambios/i })).toBeInTheDocument();
  });

  it('applies custom className and variants', () => {
    render(<Button variant="destructive" className="custom-class">Eliminar</Button>);
    const btn = screen.getByRole('button', { name: /Eliminar/i });
    expect(btn).toHaveClass('custom-class');
    expect(btn).toHaveClass('bg-destructive');
  });

  it('respects disabled prop', () => {
    render(<Button disabled>Deshabilitado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
