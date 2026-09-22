import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCristalById } from '$lib/repositories/cristal';
import { getMaterialById } from '$lib/repositories/material';
import { getPerfilesTipo, getQuincalleriasTipo, getTipoById } from '$lib/repositories/tipo';
import type { VentanaModel } from '$lib/types';
import { calcularCostoVentana } from './calculadora';

vi.mock('$lib/repositories/cristal', () => ({ getCristalById: vi.fn() }));
vi.mock('$lib/repositories/material', () => ({ getMaterialById: vi.fn() }));
vi.mock('$lib/repositories/tipo', () => ({
	getPerfilesTipo: vi.fn(),
	getQuincalleriasTipo: vi.fn(),
	getTipoById: vi.fn()
}));

describe('calcularCostoVentana', () => {
	beforeEach(() => {
		vi.mocked(getTipoById).mockResolvedValue({
			id_tipo: 1,
			id_material: 1,
			cantidad_cristal: '1',
			formula_ancho: 'X',
			formula_alto: 'Y',
			ganancia: 0
		} as never);
		vi.mocked(getMaterialById).mockResolvedValue({ id_material: 1 } as never);
		vi.mocked(getPerfilesTipo).mockResolvedValue([
			{ codigo_per: 1, formula_dim: 'X', formula_cant: 'Z', kg_ml_per: 0.5, valor: 100 }
		] as never);
		vi.mocked(getQuincalleriasTipo).mockResolvedValue([
			{ formula_quin: 'Z', precio_quin: 10 }
		] as never);
		vi.mocked(getCristalById).mockResolvedValue({ precio_cristal: 100 } as never);
	});

	it('calcula materiales, cantidades, ganancia y actualiza los precios de la ventana', async () => {
		const ventana: VentanaModel = {
			id_tipo: 1,
			id_cristal: 1,
			id_color: 1,
			id_material: 1,
			ancho: 1000,
			alto: 1000,
			cantidad: 2,
			item: '',
			ganancia: 10,
			precio_total: 0,
			precio_unitario: 0
		};

		const resultado = await calcularCostoVentana(ventana);
		expect(resultado.costoTotal).toBeCloseTo(242);
		expect(resultado.costoUnitario).toBeCloseTo(121);
		expect(ventana.precio_total).toBeCloseTo(242);
		expect(ventana.precio_unitario).toBeCloseTo(121);
	});
});
