<script lang="ts">
	import DatosCotizacion from '$lib/components/DatosCotizacion.svelte';
	import OpcionVentanas from '$lib/components/OpcionVentanas.svelte';
	import { generatePDF } from '$lib/services/pdf_generator';
	import { url, presupuesto, editFromHistory } from '$lib/store';
	import type {
		ClienteUI,
		ConstantData,
		DatosAdicionales,
		OpcionModel,
		OpcionUI,
		PresupuestoModel,
		VentanaModel,
		VentanaUI
	} from '$lib/types';
	import type { Color, Cristal, Material, Tipo } from '@prisma/client';
	import { onMount } from 'svelte';

	const { data }: { data: ConstantData } = $props();

	let successModal = $state(false);
	let errorModal = $state(false);
	let enviandoCotizacion = $state(false);
	let errorFormulario = $state('');

	let imagenes = $derived(data.imagenes);
	let materiales: Material[] = $derived(data.materiales);
	let colores: Color[] = $derived(data.colores);
	let tipos: Tipo[] = $derived(data.tipos);
	let cristales: Cristal[] = $derived(data.cristales);

	let materialesNombre: string[] = $derived(materiales.map((material) => material.nombre_material));
	let coloresNombre: string[] = $derived(colores.map((color) => color.nombre_color));

	let editarPresupuesto = $editFromHistory;

	let mostrarAgregarOpcion = $state(false);
	let materialModal = $state('');
	let colorModal = $state('');
	let texto_libre = $state('');

	let cliente: ClienteUI = $state({
		nombre: '',
		rut_cliente: '',
		direccion: '',
		email: '',
		telefono: ''
	});

	let opciones: OpcionUI[] = $state([
		{
			material: '',
			color: '',
			ventanas: [
				{
					material: '',
					tipo: '',
					cantidad: 1,
					cristal: '',
					color: '',
					alto: undefined,
					ancho: undefined,
					precio_unitario: 0,
					precio_total: 0,
					ganancia: undefined,
					item: ''
				}
			]
		}
	]);

	let datosAdicionales: DatosAdicionales = $state({
		costo_despacho: undefined,
		costo_instalacion: undefined,
		ganancia_global: undefined
	});

	let mostrar_eliminar_opcion = $derived(opciones.length > 1);

	onMount(() => {
		if (editarPresupuesto === 1) {
			const presupuestoHistorial = $presupuesto;
			actualizarStoresDesdePresupuesto(presupuestoHistorial);
			editarPresupuesto = 0;
			editFromHistory.set(0);
		}
	});

	function actualizarStoresDesdePresupuesto(presupuestoCargado: PresupuestoModel | undefined) {
		if (!presupuestoCargado || !presupuestoCargado.Opciones.length) return;

		cliente = presupuestoCargado.Cliente;
		datosAdicionales.costo_despacho = presupuestoCargado.valor_despacho;
		datosAdicionales.costo_instalacion = presupuestoCargado.valor_instalacion;
		datosAdicionales.ganancia_global = presupuestoCargado.ganancia_global;
		opciones = presupuestoCargado.Opciones.map((opcion) => {
			const ventanasUI = opcion.Ventanas.map((ventana) => ({
				material:
					materiales.find((m) => m.id_material === ventana.id_material)?.nombre_material ?? '',
				tipo: tipos.find((t) => t.id_tipo === ventana.id_tipo)?.descripcion_tipo ?? '',
				cantidad: ventana.cantidad,
				cristal: cristales.find((c) => c.id_cristal === ventana.id_cristal)?.desc_cristal ?? '',
				color: colores.find((c) => c.id_color === ventana.id_color)?.nombre_color ?? '',
				alto: ventana.alto,
				ancho: ventana.ancho,
				precio_unitario: ventana.precio_unitario,
				precio_total: ventana.precio_total,
				ganancia: ventana.ganancia,
				item: ventana.item
			}));

			return {
				material: ventanasUI[0]?.material ?? '',
				color: ventanasUI[0]?.color ?? '',
				ventanas: ventanasUI
			};
		});
	}

	function resetFormValues() {
		cliente = {
			nombre: '',
			rut_cliente: '',
			direccion: '',
			email: '',
			telefono: ''
		};

		opciones = [
			{
				material: '',
				color: '',
				ventanas: [
					{
						material: '',
						tipo: '',
						cantidad: 1,
						cristal: '',
						color: '',
						alto: undefined,
						ancho: undefined,
						precio_unitario: 0,
						precio_total: 0,
						ganancia: undefined,
						item: ''
					}
				]
			}
		];

		datosAdicionales = {
			costo_despacho: undefined,
			costo_instalacion: undefined,
			ganancia_global: undefined
		};
	}

	function cerrarSuccessModal() {
		resetFormValues();
		successModal = !successModal;
	}

	function visualizarCotizacion() {
		window.open($url);
		resetFormValues();
		successModal = !successModal;
	}

	function cerrarErrorModal() {
		errorModal = !errorModal;
	}

	function cambiarAgregarOpcion() {
		mostrarAgregarOpcion = !mostrarAgregarOpcion;
	}

	function agregarOpcion() {
		let nuevas_ventanas = opciones[0].ventanas.map((ventana) => ({
			...ventana,
			material: materialModal,
			color: colorModal,
			tipo: '',
			ganancia: undefined,
			precio_unitario: 0,
			precio_total: 0
		}));

		// Crear una nueva opción
		const nuevaOpcion = {
			material: materialModal,
			color: colorModal,
			ventanas: nuevas_ventanas
		};

		opciones.push(nuevaOpcion);

		// Reiniciar los valores del modal
		materialModal = '';
		colorModal = '';
		mostrarAgregarOpcion = false;
	}

	function eliminarOpcion(index: number) {
		opciones = opciones.filter((_, i) => i !== index);
	}

	// Función para convertir la lista de VentanaUI a VentanaModel
	function convertirVentana(ventana: VentanaUI, gananciaGlobal = 0): VentanaModel {
		// Buscar el id del material, tipo, color y cristal en sus respectivas listas
		const id_material =
			materiales.find((m) => m.nombre_material === ventana.material)?.id_material ?? 0;
		const id_tipo =
			tipos.find((t) => t.descripcion_tipo === ventana.tipo && t.id_material === id_material)
				?.id_tipo ?? 0;
		const id_color = colores.find((c) => c.nombre_color === ventana.color)?.id_color ?? 0;
		const id_cristal = cristales.find((c) => c.desc_cristal === ventana.cristal)?.id_cristal ?? 0;

		// Devolver el objeto convertido a VentanaModel
		return {
			cantidad: ventana.cantidad,
			id_material,
			id_tipo,
			id_color,
			id_cristal,
			item: ventana.item,
			alto: ventana.alto ?? 0,
			ancho: ventana.ancho ?? 0,
			precio_unitario: ventana.precio_unitario * (1 + gananciaGlobal / 100),
			precio_total: ventana.precio_total * (1 + gananciaGlobal / 100),
			ganancia: ventana.ganancia ?? 0
		};
	}

	// Función para convertir la lista de VentanaUI a VentanaModel
	function convertirVentanas(ventanas: VentanaUI[]): VentanaModel[] {
		return ventanas.map((ventana) =>
			convertirVentana(ventana, datosAdicionales.ganancia_global ?? 0)
		);
	}

	function crearOpcionesModel(opciones: OpcionUI[]): { Ventanas: VentanaModel[] }[] {
		return opciones.map((opcion) => ({
			Ventanas: convertirVentanas(opcion.ventanas)
		}));
	}

	async function crearCotizacion() {
		if (enviandoCotizacion) return;
		if (!validarOpciones(opciones)) {
			errorFormulario =
				'Completa material, tipo, color, cristal, medidas, cantidad y margen para cada ventana.';
			return;
		}
		errorFormulario = '';
		enviandoCotizacion = true;
		try {
			const opcionesModel: OpcionModel[] = crearOpcionesModel(opciones);
			const cotizacion: PresupuestoModel = {
				id_usuario: 0,
				fecha: '',
				valor_despacho: datosAdicionales.costo_despacho ?? 0,
				valor_instalacion: datosAdicionales.costo_instalacion ?? 0,
				texto_libre: texto_libre,
				nombre_cliente: cliente.nombre,
				estado: 'Creado',
				Cliente: {
					nombre: cliente.nombre,
					rut_cliente: cliente.rut_cliente,
					direccion: cliente.direccion,
					email: cliente.email,
					telefono: cliente.telefono
				},
				ganancia_global: datosAdicionales.ganancia_global ?? 0,
				Opciones: opcionesModel
			};
			const response = await fetch('/api/presupuesto', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(cotizacion)
			});
			if (!response.ok) {
				throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
			}
			await response.json();
			const urlLocal = await generatePDF(cotizacion, imagenes, data);
			presupuesto.set(cotizacion);
			url.set(urlLocal);
			successModal = true;
		} catch (error) {
			errorModal = true;
			console.error('Error al crear la cotización:', error);
		} finally {
			enviandoCotizacion = false;
		}
	}

	function eliminarVentana(ventanaIndex: number) {
		opciones = opciones.map((opcion) => {
			return {
				...opcion,
				ventanas: opcion.ventanas.filter((_, i) => i !== ventanaIndex)
			};
		});
	}

	function aplicarGananciaGlobal(gananciaGlobal: number) {
		if (gananciaGlobal) {
			opciones = opciones.map((opcion) => ({
				...opcion,
				ventanas: opcion.ventanas.map((ventana) => {
					const nuevoPrecioTotal =
						ventana.precio_unitario * ventana.cantidad * (1 + gananciaGlobal / 100);
					return {
						...ventana,
						precio_total: nuevoPrecioTotal
					};
				})
			}));
		}
	}

	function validarVentana(ventana: VentanaUI): boolean {
		if (!ventana.material || ventana.material.trim() === '') return false;
		if (!ventana.tipo || ventana.tipo.trim() === '') return false;
		if (!ventana.cristal || ventana.cristal.trim() === '') return false;
		if (!ventana.color || ventana.color.trim() === '') return false;

		if (!ventana.cantidad || ventana.cantidad <= 0) return false;
		if (!ventana.ancho || ventana.ancho <= 0) return false;
		if (!ventana.alto || ventana.alto <= 0) return false;

		// Adjust logic depending on your requirement for local vs. global ganancia
		if (ventana.ganancia === undefined || ventana.ganancia <= 0) return false;

		return true;
	}

	function validarOpciones(opciones: OpcionUI[]): boolean {
		for (const opcion of opciones) {
			for (const ventana of opcion.ventanas) {
				if (!validarVentana(ventana)) {
					return false;
				}
			}
		}
		return true;
	}
</script>

<svelte:head>
	<title>Nueva cotización | Termoacústicos</title>
</svelte:head>

<main
	class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-screen-2xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<p class="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Presupuestos</p>
		<h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-950">Nueva cotización</h1>
		<p class="mt-1 text-sm text-slate-600">
			Completa los datos del cliente y agrega una o más opciones de ventanas.
		</p>
	</div>
	<DatosCotizacion
		bind:cliente
		bind:datos_adicionales={datosAdicionales}
		onAplicarGananciaGlobal={aplicarGananciaGlobal} />
	<!-- Ventanas -->
	<div class="space-y-6 w-full">
		{#each opciones as opcion, opcionIndex (opcion)}
			<OpcionVentanas
				{convertirVentana}
				{data}
				agregarVentana={() => {
					for (const opc of opciones) {
						opc.ventanas = [
							...opc.ventanas,
							{
								material: opc.material,
								tipo: '',
								cantidad: 1,
								cristal: '',
								color: opc.color,
								alto: undefined,
								ancho: undefined,
								precio_unitario: 0,
								precio_total: 0,
								ganancia: undefined,
								item: ''
							}
						];
					}
				}}
				{eliminarVentana}
				bind:opcion={opciones[opcionIndex]}
				index={opcionIndex}
				{eliminarOpcion}
				{mostrar_eliminar_opcion}
				ganancia_global={datosAdicionales.ganancia_global} />
			<!-- Totales de la opción 
		<div class="flex justify-end mt-2 text-lg">
			<p class="font-semibold">Total:</p>
			<p class="ml-2">
				${opcion.ventanas.reduce((total, ventana) => total + ventana.precio_total, 0).toLocaleString()}
			</p>
			<p class="ml-6 font-semibold text-green-600">Total con Ganancia:</p>
			<p class="ml-2 text-green-600">
				${calcularTotalConGanancia(opcion, datosAdicionales.ganancia_global).toLocaleString()}
			</p>
		</div>-->
		{/each}

		<div
			class="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<label for="texto_libre" class="font-bold text-slate-900"
				>Notas adicionales <span class="font-normal text-slate-500">(opcional)</span></label>
			<textarea
				name="texto_libre"
				bind:value={texto_libre}
				placeholder="Detalles que quieras incluir en el presupuesto…"
				class="min-h-24 w-full resize-y rounded-lg border border-slate-300 p-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
			></textarea>
		</div>

		<!-- Botón para agregar nueva ventana -->
		<div
			class="sticky bottom-0 z-10 -mx-4 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:flex-row sm:justify-end sm:gap-3 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
			<button
				type="button"
				class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-800 px-5 font-bold text-teal-900 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
				onclick={cambiarAgregarOpcion}>
				<span class="iconify mdi--plus size-5" aria-hidden="true"></span> Agregar otra opción
			</button>
			<button
				type="button"
				disabled={enviandoCotizacion}
				class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-900 px-6 font-bold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
				onclick={crearCotizacion}>
				{#if enviandoCotizacion}<span
						class="iconify mdi--loading size-5 animate-spin"
						aria-hidden="true"></span
					>{:else}<span class="iconify mdi--check-circle-outline size-5" aria-hidden="true"></span
					>{/if}
				{enviandoCotizacion ? 'Creando…' : 'Crear presupuesto'}
			</button>
		</div>
		{#if errorFormulario}<p
				class="rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
				role="alert">
				{errorFormulario}
			</p>{/if}
	</div>

	{#if successModal}
		<div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-xl w-96 p-8">
				<!-- Botón de cierre -->
				<div class="flex justify-end">
					<button
						onclick={cerrarSuccessModal}
						class="text-gray-500 hover:text-gray-800 font-bold text-lg iconify mdi--close size-6"
						aria-label="X">
					</button>
				</div>

				<div class="w-full iconify mdi--success-circle bg-teal-500 size-16"></div>

				<!-- Contenido del modal -->
				<div class="flex flex-col gap-2 text-center mt-2 items-center">
					<h2 class="text-2xl font-extrabold text-gray-800">¡Éxito!</h2>
					<p class="text-gray-700">Presupuesto creado correctamente</p>

					<!-- Botón para realizar otra acción o cerrar -->
					<button
						onclick={cerrarSuccessModal}
						class="bg-transparent text-gray-700 mt-2 w-fit font-medium py-2 px-4 rounded hover:underline">
						Cerrar
					</button>
					<button
						onclick={visualizarCotizacion}
						class="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600">
						Visualizar cotización
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if errorModal}
		<div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-xl w-96 p-8">
				<!-- Botón de cierre -->
				<div class="flex justify-end">
					<button
						onclick={cerrarErrorModal}
						class="text-gray-500 hover:text-gray-800 font-bold text-lg iconify mdi--close size-6"
						aria-label="X">
					</button>
				</div>

				<div class="w-full iconify mdi--error bg-red-500 size-16"></div>

				<!-- Contenido del modal -->
				<div class="flex flex-col gap-2 text-center mt-2 items-center">
					<h2 class="text-2xl font-extrabold text-gray-800">Error</h2>
					<p class="text-gray-700">Algo sucedió. Intente nuevamente.</p>

					<!-- Botón para realizar otra acción o cerrar -->
					<button
						onclick={cerrarErrorModal}
						class="w-full mt-2 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
						Cerrar ventana
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if mostrarAgregarOpcion}
		<div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-xl w-96 p-6">
				<!-- Botón de cierre -->
				<div class="flex justify-end">
					<button
						onclick={cambiarAgregarOpcion}
						class="text-gray-500 hover:text-gray-800 font-bold text-lg">
						X
					</button>
				</div>

				<!-- Contenido del modal -->
				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-gray-800">Nueva Opción</h2>

					<!-- Select para material -->
					<div>
						<label for="material" class="block text-gray-600 font-medium mb-1">Material</label>
						<select
							id="material"
							bind:value={materialModal}
							class="w-full border rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-teal-500">
							<option value="" disabled>Selecciona un material</option>
							{#each materialesNombre as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</div>

					<!-- Select para color -->
					<div>
						<label for="color" class="block text-gray-600 font-medium mb-1">Color</label>
						<select
							id="color"
							bind:value={colorModal}
							class="w-full border rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-teal-500">
							<option value="" disabled>Selecciona un color</option>
							{#each coloresNombre as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</div>

					<!-- Botón de Crear Opción -->
					<div class="flex justify-center">
						<button
							onclick={agregarOpcion}
							class="bg-teal-600 hover:bg-teal-500 transition-all text-white px-4 py-2 rounded font-bold"
							disabled={materialModal == '' || colorModal == ''}>
							Crear Opción
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>
