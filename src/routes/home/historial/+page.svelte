<script lang="ts">
	import type { PresupuestoModel, OpcionModel } from '$lib/types';
	import { editFromHistory, presupuesto, url } from '$lib/store';
	import { goto } from '$app/navigation';
	import { generatePDF } from '$lib/services/pdf_generator';
	import { get } from 'svelte/store';
	import { untrack } from 'svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const constantData = $derived(data);

	let images = $derived(data.imagenes);
	let pageSize = 12;
	let currentPage = $state(1);

	let searchQuery = $state(''); // Estado para almacenar el término de búsqueda

	let fechaSortDirection = $state<'asc' | 'desc'>('desc');
	let errorEstado = $state('');

	let cotizaciones = $state<PresupuestoModel[]>(untrack(() => data.presupuestos));

	function getNombreMaterial(id_material: number) {
		const material = constantData.materiales.find((m) => m.id_material === id_material);
		return material ? material.nombre_material : 'Material no encontrado';
	}

	function calcularTotalOpcion(opcion: OpcionModel) {
		return opcion.Ventanas.reduce((total, ventana) => {
			return total + ventana.precio_total;
		}, 0);
	}

	function formatoChileno(valor: number) {
		const truncado = Math.trunc(valor); // Trunca el número
		return new Intl.NumberFormat('es-CL', {
			style: 'currency',
			currency: 'CLP',
			minimumFractionDigits: 0
		}).format(truncado);
	}

	function sortByDate() {
		// Alternar la dirección de orden
		fechaSortDirection = fechaSortDirection === 'asc' ? 'desc' : 'asc';

		// Ordenar las cotizaciones por la fecha
		cotizaciones = [...cotizaciones].sort((a, b) => {
			const difference = Date.parse(a.fecha) - Date.parse(b.fecha);
			return fechaSortDirection === 'asc' ? difference : -difference;
		});
	}

	// Filtrar las cotizaciones en función del término de búsqueda
	let filteredCotizaciones = $derived.by(() => {
		return cotizaciones.filter((cotizacion) => {
			const nombreCliente = cotizacion.Cliente?.nombre.toLowerCase();
			const rut = cotizacion.Cliente?.rut_cliente.toLowerCase();
			const query = searchQuery.toLowerCase();

			// Comprobar si el término de búsqueda está en materiales, colores, nombreCliente o rut
			return nombreCliente?.includes(query) || rut?.includes(query);
		});
	});

	// Calcular el índice de las cotizaciones para la página actual
	let paginatedCotizaciones = $derived.by(() => {
		return filteredCotizaciones.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	});

	// Número total de páginas
	let totalPages = $derived(Math.ceil(filteredCotizaciones.length / pageSize));

	// Funciones para navegar a la siguiente y anterior página
	function goToNextPage() {
		if (currentPage < totalPages) {
			currentPage += 1;
		}
	}

	function goToPreviousPage() {
		if (currentPage > 1) {
			currentPage -= 1;
		}
	}

	function searchPresupuestoByID(idPresupuesto: number) {
		const cotizacion = cotizaciones.find((c) => c.id_presupuesto === idPresupuesto);
		return cotizacion;
	}

	async function actualizarCotizacion(idPresupuesto: number, estadoNuevo: string) {
		const cotizacion = searchPresupuestoByID(idPresupuesto);
		if (!cotizacion) return;
		const estadoAnterior = cotizacion.estado;
		cotizacion.estado = estadoNuevo;
		errorEstado = '';

		try {
			const response = await fetch('/api/presupuesto', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(cotizacion)
			});
			if (!response.ok) {
				throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			cotizacion.estado = estadoAnterior;
			errorEstado = 'No se pudo actualizar el estado. Inténtalo nuevamente.';
			console.error('Error al actualizar la cotización:', error);
		}
	}
</script>

<svelte:head>
	<title>Historial | Termoacústicos</title>
</svelte:head>

<main
	class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-screen-2xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<p class="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Presupuestos</p>
		<h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-950">Historial de cotizaciones</h1>
		<p class="mt-1 text-sm text-slate-600">
			Busca por cliente o RUT, actualiza estados y abre el PDF.
		</p>
	</div>

	<div
		class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
		<label for="buscar-cotizacion" class="sr-only">Buscar cotización por cliente o RUT</label>
		<div class="relative w-full sm:max-w-md">
			<span
				class="iconify mdi--magnify absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400"
				aria-hidden="true"></span>
			<input
				id="buscar-cotizacion"
				type="search"
				bind:value={searchQuery}
				oninput={() => (currentPage = 1)}
				placeholder="Buscar cliente o RUT…"
				class="min-h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20" />
		</div>
		<p class="text-sm text-slate-600" aria-live="polite">
			{filteredCotizaciones.length}
			{filteredCotizaciones.length === 1 ? 'presupuesto' : 'presupuestos'}
		</p>
	</div>
	{#if errorEstado}<p
			class="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
			role="alert">
			{errorEstado}
		</p>{/if}

	<div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
		<table class="w-full min-w-[780px] table-auto">
			<thead class="bg-gray-200 text-gray-700">
				<tr>
					<th class="py-3 px-4 text-left">Cliente</th>
					<th class="py-3 px-4 text-left min-w-48 w-52">Materiales</th>
					<th class="py-3 px-4 text-left"
						><button
							type="button"
							class="inline-flex items-center gap-1 font-semibold"
							onclick={sortByDate}
							aria-label="Ordenar por fecha {fechaSortDirection === 'asc'
								? 'descendente'
								: 'ascendente'}"
							>Fecha <span
								class="iconify {fechaSortDirection === 'asc'
									? 'mdi--arrow-up'
									: 'mdi--arrow-down'} size-4"
								aria-hidden="true"></span
							></button
						></th>
					<th class="py-3 px-4 text-left">Valor presupuesto</th>
					<!--<th>Despacho</th>
				<th>Instalación</th>-->
					<th class="py-3 px-4 min-w-28 w-32 text-center">Estado</th>
					<th class="py-3 px-6 text-right min-w-28 w-32">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedCotizaciones as cotizacion}
					<tr class="border-b border-gray-200 hover:bg-gray-100">
						<td class="py-3 px-4 truncate">{cotizacion.nombre_cliente}</td>
						<td class="py-3 px-4">
							<div class="w-80 truncate overflow-hidden whitespace-nowrap space-x-3">
								{#each cotizacion.Opciones as opcion, index}
									{getNombreMaterial(opcion.Ventanas[0]?.id_material ?? 0)}
									{index < cotizacion.Opciones.length - 1 ? ',' : ''}
								{/each}
							</div>
						</td>
						<!--<td class="py-3 px-4">{cotizacion.Cliente?.direccion}</td>
					<td class="py-3 px-4">{cotizacion.Cliente?.rut_cliente}</td> -->
						<td class="py-3 px-4">{new Date(cotizacion.fecha).toLocaleDateString()}</td>
						<!--<td class="py-3 px-4">{formatoChileno(cotizacion.valor_despacho)}</td>
					<td class="py-3 px-4">{formatoChileno(cotizacion.valor_instalacion)}</td>-->
						<td class="py-3 px-4 text-left">
							<div class=" space-x-3">
								{#each cotizacion.Opciones as opcion, index}
									<b>{index + 1}:</b>
									{formatoChileno(
										calcularTotalOpcion(opcion)
									)}{#if index < cotizacion.Opciones.length - 1},
									{/if}
								{/each}
							</div>
						</td>
						<td class="py-3 px-4">
							<select
								class="min-h-10 rounded-lg border border-slate-300 bg-white px-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
								aria-label="Estado de la cotización de {cotizacion.nombre_cliente}"
								bind:value={cotizacion.estado}
								onchange={() =>
									actualizarCotizacion(cotizacion.id_presupuesto ?? -1, cotizacion.estado)}>
								<option selected>Creado</option>
								<option value="Pendiente">Pendiente</option>
								<option value="Finalizado">Finalizado</option>
							</select>
						</td>
						<td class="py-3 px-4">
							<div class="flex gap-2 justify-end">
								<button
									type="button"
									class="grid size-10 place-items-center rounded-lg text-teal-800 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
									aria-label="Editar cotización de {cotizacion.nombre_cliente}"
									onclick={() => {
										editFromHistory.set(1);
										presupuesto.set(cotizacion);
										goto(`/home/cotizar`);
									}}>
									<span class="iconify mdi--pencil-outline size-5" aria-hidden="true"></span>
								</button>
								<button
									type="button"
									class="grid size-10 place-items-center rounded-lg text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
									aria-label="Abrir PDF de {cotizacion.nombre_cliente}"
									onclick={async () => {
										presupuesto.set(cotizacion);
										const urlLocal = await generatePDF(cotizacion, images, constantData);
										url.set(urlLocal);
										window.open(get(url));
									}}>
									<span class="iconify mdi--file-pdf-box size-5" aria-hidden="true"></span>
								</button>
							</div>
						</td>
					</tr>
				{/each}
				{#if paginatedCotizaciones.length === 0}
					<tr
						><td colspan="6" class="px-6 py-12 text-center"
							><span
								class="iconify mdi--file-search-outline mx-auto size-9 text-slate-400"
								aria-hidden="true"></span>
							<p class="mt-2 font-semibold text-slate-800">No encontramos cotizaciones</p>
							<p class="mt-1 text-sm text-slate-500">Prueba con otro nombre o RUT.</p></td
						></tr>
				{/if}
			</tbody>
		</table>
	</div>

	<div class="flex items-center justify-center gap-3">
		<button
			class="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
			onclick={goToPreviousPage}
			aria-label="Página anterior"
			disabled={currentPage === 1}>
			Anterior
		</button>
		<span class="text-sm tabular-nums text-slate-600"
			>{totalPages === 0 ? 0 : currentPage} de {totalPages}</span>
		<button
			class="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
			onclick={goToNextPage}
			aria-label="Página siguiente"
			disabled={currentPage === totalPages}>
			Siguiente
		</button>
	</div>
</main>
