import { writable } from 'svelte/store';
import type { PresupuestoModel } from './types';

export const presupuesto = writable<PresupuestoModel | undefined>();
export const url = writable<string>();
export const editFromHistory = writable<number>(0);
