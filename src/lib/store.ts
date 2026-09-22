import { writable } from 'svelte/store';
import type { Cliente } from '@prisma/client';
import type { DatosAdicionales, PresupuestoModel } from './types';

export const presupuesto = writable<PresupuestoModel | undefined>();
export const url = writable<string>();
export const editFromHistory = writable<number>(0);
// Stores para los valores de los modales
export const tipoOptions = writable<string[]>([]);
export const cristalOptions = writable<string[]>([]);
export const cantidadOptions = writable<number[]>([]);
export const altoOptions = writable<number[]>([]);
export const anchoOptions = writable<number[]>([]);
export const gananciaOptions = writable<number[]>([]);
export const precioUnitarioOptions = writable<number[]>([]);
export const precioTotalOptions = writable<number[]>([]);

//Store datos cliente
export const cliente = writable<Cliente | undefined>();
export const datosAdicionales = writable<DatosAdicionales>();

// Store datos despacho e instalación

export const ganancia_global = writable<number>(undefined);

export function resetStores() {
	tipoOptions.set([]);
	cristalOptions.set([]);
	cantidadOptions.set([]);
	altoOptions.set([]);
	anchoOptions.set([]);
	gananciaOptions.set([]);
	precioUnitarioOptions.set([]);
	precioTotalOptions.set([]);
}
