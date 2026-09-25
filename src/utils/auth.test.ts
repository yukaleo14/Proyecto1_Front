import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getUsuarioId,
  getEmpresaId,
  getPuntoVentaId,
  getPersonalId,
  getRoles,
  hasRole,
  getAuthData,
  getAuthDataWithPersonal,
} from './auth';

describe('auth helper utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns default values (0 or empty array) when no token is present', () => {
    expect(getUsuarioId()).toBe(0);
    expect(getEmpresaId()).toBe(0);
    expect(getPuntoVentaId()).toBe(0);
    expect(getPersonalId()).toBe(0);
    expect(getRoles()).toEqual([]);
    expect(hasRole(1)).toBe(false);
    expect(getAuthData()).toEqual({ usuarioId: 0, empresaId: 0, puntoVentaId: 0 });
    expect(getAuthDataWithPersonal()).toEqual({
      usuarioId: 0,
      empresaId: 0,
      personalId: 0,
      puntoVentaId: 0,
    });
  });

  it('returns default values when token is invalid', () => {
    localStorage.setItem('Token', 'invalid.jwt.token');
    expect(getUsuarioId()).toBe(0);
    expect(getRoles()).toEqual([]);
  });
});
