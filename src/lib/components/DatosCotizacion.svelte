<script lang="ts">
	import type { ClienteUI, DatosAdicionales } from '$lib/types';

	interface Props {
		cliente: ClienteUI;
		datos_adicionales: DatosAdicionales;
		onAplicarGananciaGlobal: (ganancia: number) => void;
	}

	let {
		cliente = $bindable(),
		datos_adicionales = $bindable(),
		onAplicarGananciaGlobal
	}: Props = $props();
</script>

<div class="grid w-full gap-4 lg:grid-cols-2">
	<div
		class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
		<div>
			<h2 class="text-lg font-bold text-slate-900">Datos del cliente</h2>
			<p class="mt-1 text-sm text-slate-600">Información de contacto del presupuesto.</p>
		</div>
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="sm:col-span-2">
				<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="cliente-nombre"
					>Nombre del cliente</label>
				<input
					type="text"
					id="cliente-nombre"
					placeholder="Nombre y apellido / razón social"
					class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
					bind:value={cliente.nombre} />
			</div>
			<div>
				<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="cliente-rut"
					>RUT</label>
				<input
					type="text"
					id="cliente-rut"
					placeholder="RUT (Ej: 12345678-9)"
					maxlength="10"
					class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
					bind:value={cliente.rut_cliente} />
			</div>
			<div>
				<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="cliente-telefono"
					>Teléfono</label>
				<input
					type="tel"
					id="cliente-telefono"
					autocomplete="tel"
					placeholder="+56 9 1234 5678"
					class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
					bind:value={cliente.telefono} />
			</div>
			<div class="sm:col-span-2">
				<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="cliente-email"
					>Correo electrónico</label>
				<input
					type="email"
					id="cliente-email"
					autocomplete="email"
					placeholder="nombre@correo.cl"
					class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
					bind:value={cliente.email} />
			</div>
			<div class="sm:col-span-2">
				<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="cliente-direccion"
					>Dirección</label>
				<input
					type="text"
					id="cliente-direccion"
					autocomplete="street-address"
					placeholder="Calle, número y comuna"
					class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
					bind:value={cliente.direccion} />
			</div>
		</div>
	</div>

	<div
		class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
		<div>
			<h2 class="text-lg font-bold text-slate-900">Costos y margen</h2>
			<p class="mt-1 text-sm text-slate-600">
				Agrega cargos adicionales y define el margen global.
			</p>
		</div>
		<div>
			<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="costo-despacho"
				>Despacho (CLP)</label>
			<input
				type="number"
				id="costo-despacho"
				min="0"
				placeholder="Ej: 15000"
				class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
				bind:value={datos_adicionales.costo_despacho} />
		</div>
		<div>
			<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="costo-instalacion"
				>Instalación (CLP)</label>
			<input
				type="number"
				id="costo-instalacion"
				min="0"
				placeholder="Ej: 25000"
				class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
				bind:value={datos_adicionales.costo_instalacion} />
		</div>
		<div>
			<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="ganancia-global"
				>Margen global (%)</label>
			<input
				type="number"
				id="ganancia-global"
				min="0"
				placeholder="Ej: 15"
				class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
				bind:value={datos_adicionales.ganancia_global}
				onchange={() => onAplicarGananciaGlobal(Number(datos_adicionales.ganancia_global))} />
		</div>
	</div>
</div>
