<script lang="ts">
	import type { ConstantData, VentanaModel, VentanaUI } from '$lib/types';
	import type { Tipo } from '@prisma/client';

	interface Props {
		convertirVentana: (ventana: VentanaUI) => VentanaModel;
		data: ConstantData;
		ventana: VentanaUI;
		ganancia_global: number;
		id: number;
		mostrar_eliminar: boolean;
		eliminarVentana: (id: number) => void;
	}

	let {
		convertirVentana,
		data,
		ventana = $bindable(),
		id,
		ganancia_global = $bindable(),
		mostrar_eliminar,
		eliminarVentana
	}: Props = $props();

	let tiposFiltrados = $state<Tipo[]>([]);
	// Mensajes para mostrar si alto/ancho quedan fuera de los rangos
	let msgAlto = $state('');

	//Reactividad para obtener los tipos de acuerdo al material seleccionado
	$effect(() => {
		const materialSeleccionado = data.materiales.find(
			(m) => m.nombre_material === ventana.material
		);
		if (!materialSeleccionado) {
			tiposFiltrados = [];
		} else {
			// Filtra solo los tipos que tengan el mismo id_material
			tiposFiltrados = data.tipos.filter((t) => t.id_material === materialSeleccionado.id_material);
		}
	});

	// Valida los rangos cada vez que cambien alto, ancho o el tipo
	$effect(() => {
		// Limpia mensajes antes de recalcular
		msgAlto = '';

		const tipoSeleccionado = data.tipos.find((t) => t.descripcion_tipo === ventana.tipo);
		if (!tipoSeleccionado) return;

		const { minimo, maximo } = tipoSeleccionado;

		// Validar ALTO
		if (ventana.alto === undefined || ventana.alto === null) {
			msgAlto = '';
		} else if (minimo !== null && maximo !== null) {
			if (ventana.alto < minimo) {
				msgAlto = `El alto mínimo para "${ventana.tipo}" es ${minimo} cm`;
			} else if (ventana.alto > maximo) {
				msgAlto = `El alto máximo para "${ventana.tipo}" es ${maximo} cm`;
			} else {
				msgAlto = '';
			}
		}
	});

	function formatoChileno(valor: number) {
		const truncado = Math.trunc(valor); // Trunca el número
		return new Intl.NumberFormat('es-CL', {
			style: 'currency',
			currency: 'CLP',
			minimumFractionDigits: 0
		}).format(truncado);
	}

	async function handleCalcularCosto(ventana: VentanaUI) {
		const response = await fetch('/api/calculadora', {
			method: 'POST',
			body: JSON.stringify(convertirVentana(ventana))
		});
		const data: {
			resultado: {
				costoTotal: number;
				costoUnitario: number;
			};
		} = await response.json();

		ventana.precio_unitario = data.resultado.costoUnitario;
		ventana.precio_total = data.resultado.costoTotal;
	}
	/*function calculateTotal() {
		ventana.precio_total = ventana.cantidad * ventana.precio_unitario;
	}
	*/

	$effect(() => {
		if (ventana.alto !== undefined && ventana.ancho !== undefined) {
			handleCalcularCosto(ventana);
		}
	});
</script>

<tr class="border-b border-slate-100 align-middle last:border-0">
	<td class="px-3 py-2 font-semibold tabular-nums text-slate-500">{id + 1}</td>

	<!-- Material Selector -->
	<td class="px-1 py-1">
		<p
			class="w-44 truncate overflow-hidden rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-700">
			{ventana.material}
		</p>
	</td>

	<!-- Tipo Selector -->
	<td class="px-1 py-1">
		<select
			bind:value={ventana.tipo}
			aria-label="Tipo de ventana {id + 1}"
			onchange={() => {
				const ganancia = tiposFiltrados.find(
					(tipo) => tipo.descripcion_tipo === ventana.tipo
				)?.ganancia;
				if (ganancia !== null) {
					ventana.ganancia = ganancia;
				}
			}}
			class="min-h-10 w-44 truncate overflow-hidden whitespace-nowrap rounded-lg border border-slate-300 bg-white px-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20">
			<option selected disabled value="">Selecciona un tipo</option>
			{#each tiposFiltrados as option}
				<option class="w-auto">{option.descripcion_tipo}</option>
			{/each}
		</select>
	</td>

	<!-- Cristal Selector -->
	<td class="px-1 py-1">
		<select
			bind:value={ventana.cristal}
			aria-label="Cristal de ventana {id + 1}"
			class="min-h-10 w-32 truncate overflow-hidden whitespace-nowrap rounded-lg border border-slate-300 bg-white px-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20">
			<option selected disabled value="">Selecciona un tipo</option>
			{#each data.cristales as option}
				<option class="w-auto">{option.desc_cristal}</option>
			{/each}
		</select>
	</td>

	<!-- Color Input -->
	<td class="px-1 py-1">
		<p
			class="w-24 truncate rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-700">
			{ventana.color}
		</p>
	</td>

	<!-- Cantidad Input -->
	<td class="px-1 py-1">
		<input
			type="number"
			bind:value={ventana.cantidad}
			aria-label="Cantidad de ventana {id + 1}"
			min="1"
			class="min-h-10 w-full rounded-lg border border-slate-300 px-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20" />
	</td>

	<!-- Dimensiones Alto y Ancho -->
	<td class="px-1 pr-2 py-1">
		<input
			type="number"
			bind:value={ventana.ancho}
			aria-label="Ancho de ventana {id + 1} en centímetros"
			class="min-h-10 w-full rounded-lg border border-slate-300 px-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
			placeholder="0" />
	</td>
	<td class="px-1 py-1">
		<div class="relative">
			<input
				type="number"
				bind:value={ventana.alto}
				aria-label="Alto de ventana {id + 1} en centímetros"
				class="min-h-10 w-full rounded-lg border border-slate-300 px-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
				placeholder="0" />
			<!-- Tooltip si hay msgAlto -->
			<!-- Mensaje Amarillo -->
			{#if msgAlto}
				<div
					class="absolute left-1/2 top-full z-10 mt-1 w-max -translate-x-1/2 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-950 shadow-md">
					{msgAlto}
				</div>
			{/if}
		</div>
	</td>

	<!-- Ganancia -->
	<td class="px-1 py-1">
		<input
			type="number"
			bind:value={ventana.ganancia}
			aria-label="Margen de ventana {id + 1}"
			class="min-h-10 w-full rounded-lg border border-slate-300 px-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
			placeholder="0" />
	</td>

	<!-- Precio Unitario -->
	<td class="px-1 py-1">
		<p
			class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm font-medium tabular-nums text-slate-800">
			{formatoChileno(ventana.precio_unitario * (1 + ganancia_global / 100))}
		</p>
	</td>

	<!-- Precio Total -->
	<td class="px-1 py-1">
		<p
			class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm font-semibold tabular-nums text-teal-950">
			{formatoChileno(ventana.precio_total * (1 + ganancia_global / 100))}
		</p>
	</td>

	<!-- Delete Button -->
	<td class="px-1 pr-2 py-1">
		{#if mostrar_eliminar}
			<button
				class="grid size-10 place-items-center rounded-lg text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
				aria-label="Eliminar ventana {id + 1}"
				onclick={() => eliminarVentana(id)}>
				<span class="size-8 iconify mdi--delete align-middle"></span>
			</button>
		{:else}
			<span class="size-8 iconify mdi--delete opacity-30 align-middle"></span>
		{/if}
	</td>
</tr>
