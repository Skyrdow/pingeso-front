<script lang="ts">
	import Ventana2 from './Ventana2.svelte';
	import DropdownColumn from './DropdownColumn.svelte';
	import type { ConstantData, OpcionUI, VentanaModel, VentanaUI } from '$lib/types';

	interface Props {
		convertirVentana: (ventana: VentanaUI) => VentanaModel;
		data: ConstantData;
		opcion: OpcionUI;
		index: number;
		mostrar_eliminar_opcion: boolean;
		eliminarOpcion: (index: number) => void;
		agregarVentana: () => void;
		eliminarVentana: (index: number) => void;
		ganancia_global?: number; // Añadir ganancia_global
	}

	let {
		convertirVentana,
		data,
		opcion = $bindable(),
		index,
		mostrar_eliminar_opcion,
		eliminarOpcion,
		agregarVentana,
		eliminarVentana,
		ganancia_global = 0 // Valor por defecto
	}: Props = $props();

	let showMaterialDropdown = $state(false);
	let showColorDropdown = $state(false);

	let materialesNombre: string[] = $derived(
		data.materiales.map((material) => material.nombre_material)
	);
	let coloresNombre: string[] = $derived(data.colores.map((color) => color.nombre_color));

	let sumaTotalConGanancia = $derived(
		opcion.ventanas.reduce(
			(acc, ventana) =>
				acc + ventana.precio_unitario * ventana.cantidad * (1 + ganancia_global / 100),
			0
		)
	);

	let mostrar_eliminar = $derived(opcion.ventanas.length > 1);

	function formatoChileno(valor: number) {
		const truncado = Math.trunc(valor); // Trunca el número
		return new Intl.NumberFormat('es-CL', {
			style: 'currency',
			currency: 'CLP',
			minimumFractionDigits: 0
		}).format(truncado);
	}
</script>

<section
	class="min-w-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
	<!-- Botón para agregar una nueva ventana -->
	<div class="flex w-full flex-row items-center justify-between gap-5">
		<div>
			<p class="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
				Alternativa {index + 1}
			</p>
			<h2 class="mt-1 text-lg font-bold text-slate-950">Configuración de ventanas</h2>
		</div>
		{#if index < 1}
			<button
				onclick={agregarVentana}
				class="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-900 px-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
				><span class="iconify mdi--plus size-5" aria-hidden="true"></span> Agregar ventana</button>
		{/if}
		{#if mostrar_eliminar_opcion && index >= 1}
			<button
				class="min-h-10 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
				onclick={() => eliminarOpcion(index)}>
				Eliminar Opción
			</button>
		{/if}
	</div>

	<!-- Lista de ventanas -->
	<div class="overflow-x-auto rounded-xl border border-slate-200">
		<table class="w-full min-w-[1180px] table-auto bg-white text-sm">
			<thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600">
				<tr class="items-center">
					<th scope="col" class="px-3 py-3">N°</th>
					<th scope="col" class="px-2 py-3">
						<DropdownColumn
							onSelectItem={(item) => {
								opcion.material = item;
								opcion.ventanas.forEach((ventana) => {
									ventana.material = opcion.material;
								});
							}}
							columna={opcion.material || 'Material'}
							items={materialesNombre}
							bind:showDropdown={showMaterialDropdown} />
					</th>
					<th scope="col" class="px-2 py-3"> Tipo </th>
					<th scope="col" class="px-2 py-3"> Cristal </th>
					<th scope="col" class="px-2 py-3">
						<DropdownColumn
							onSelectItem={(item) => {
								opcion.color = item;
								opcion.ventanas.forEach((ventana) => {
									ventana.color = opcion.color;
								});
							}}
							columna={opcion.color || 'Color'}
							items={coloresNombre}
							bind:showDropdown={showColorDropdown} />
					</th>
					<th scope="col" class="min-w-20 px-2 py-3">Cantidad</th>
					<th scope="col" class="min-w-20 px-2 py-3">Ancho (cm)</th>
					<th scope="col" class="min-w-20 px-2 py-3">Alto (cm)</th>
					<th scope="col" class="min-w-20 px-2 py-3">Margen</th>
					<th scope="col" class="w-32 min-w-32 px-2 py-3">Valor unitario</th>
					<th scope="col" class="w-32 min-w-32 px-2 py-3">Valor total</th>
					<th scope="col" class="px-2 py-3"><span class="sr-only">Acciones</span></th>
				</tr>
			</thead>
			<tbody>
				{#each opcion.ventanas as ventana, id (ventana)}
					<Ventana2
						{convertirVentana}
						{data}
						bind:ventana={opcion.ventanas[id]}
						{id}
						bind:ganancia_global
						{mostrar_eliminar}
						{eliminarVentana} />
				{/each}
				<tr>
					<td
						colspan="11"
						class="border-t border-slate-200 px-4 py-3 text-right font-bold text-slate-700">
						<!-- Mostrar total y total con ganancia -->
						<span class="">
							Total de esta alternativa: <span class="ml-2 text-lg tabular-nums text-teal-950"
								>{formatoChileno(sumaTotalConGanancia)}</span>
						</span>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</section>
