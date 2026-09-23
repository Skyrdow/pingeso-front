<script lang="ts">
	import type { ImageGroup, PresupuestoModel } from '$lib/types';
	import type {
		Color,
		Constantes,
		Cristal,
		Imagen,
		Material,
		Perfil,
		Quincalleria,
		Tipo
	} from '@prisma/client';
	import type { PageData } from './$types';
	import { untrack } from 'svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const initialData = untrack(() => data);
	const dialogBackdropClass =
		'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4';
	const dialogPanelClass =
		'relative max-h-[calc(100dvh_-_2rem)] w-full overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6';
	const dialogLabelClass = 'mb-1 block text-sm font-medium text-slate-700';
	const dialogInputClass =
		'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20';
	const dialogCancelClass =
		'rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700';
	const dialogSaveClass =
		'rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2';

	let constantSelected = $state('Materiales');

	let successModal = $state(false);
	let errorMessage = $state('');
	let editMaterialModal = $state(false);
	let editTipoModal = $state(false);
	let editCristalModal = $state(false);
	let editPerfilModal = $state(false);
	let addCristalModal = $state(false);
	let editColorModal = $state(false);
	let addColorModal = $state(false);
	let editQuincalleriaModal = $state(false);

	let materialSelected: Material = $state({
		id_material: 0,
		nombre_material: '',
		texto_libre: '',
		texto_calidad: '',
		texto_termopanel: ''
	});

	let tipoSelected: Tipo = $state({
		id_tipo: 0,
		descripcion_tipo: '',
		id_material: 0,
		formula_ancho: '',
		formula_alto: '',
		cantidad_cristal: '',
		porcentaje_quinc: 0,
		largo_perfil: 0,
		minimo: 0,
		maximo: 0,
		ganancia: 0
	});

	let cristalSelected: Cristal = $state({
		id_cristal: 0,
		desc_cristal: '',
		precio_cristal: 0
	});

	let newCristal: Cristal = $state({
		id_cristal: -1,
		desc_cristal: '',
		precio_cristal: 0
	});

	let colorSelected: Color = $state({
		id_color: 0,
		nombre_color: ''
	});

	let newColor: Color = $state({
		id_color: -1,
		nombre_color: ''
	});

	let perfilSelected: Perfil = $state({
		id_perfil: -1,
		codigo_per: -1,
		formula_dim: '',
		formula_cant: '',
		kg_ml_per: -1,
		valor: -1
	});

	let quincalleriaSelected: Quincalleria = $state({
		id_quincalleria: -1,
		desc_quin: '',
		formula_quin: '',
		precio_quin: -1
	});

	let materiales: Material[] = $state(initialData.materiales);
	let tipos: Tipo[] = $state(initialData.tipos);
	let cristales: Cristal[] = $state(initialData.cristales);
	let colores: Color[] = $state(initialData.colores);
	let imagenes: ImageGroup[] = $state(initialData.imagenes);
	let imagenNueva: Imagen = $state({ bytes: '', id_imagen: 0, img_group: 1, height: 0 });
	let perfiles: Perfil[] = $state(initialData.perfiles);
	let quincallerias: Quincalleria[] = $state(initialData.quincallerias);
	let constantes_pdf: Constantes = $state(initialData.constantes_pdf);
	const seccionesCatalogo = $derived([
		{ nombre: 'Materiales', icono: 'mdi--layers-outline', cantidad: materiales.length },
		{ nombre: 'Cristales', icono: 'mdi--view-agenda-outline', cantidad: cristales.length },
		{ nombre: 'Tipos', icono: 'mdi--window-open-variant', cantidad: tipos.length },
		{
			nombre: 'Imágenes',
			icono: 'mdi--image-multiple-outline',
			cantidad: imagenes.reduce((total, grupo) => total + grupo.imagenes.length, 0)
		},
		{ nombre: 'Colores', icono: 'mdi--palette-outline', cantidad: colores.length },
		{ nombre: 'Perfiles', icono: 'mdi--ruler-square', cantidad: perfiles.length },
		{ nombre: 'Quincallerías', icono: 'mdi--tools', cantidad: quincallerias.length }
	]);

	let textoIzq = $state(constantes_pdf.texto_izquierda);
	let margenIzq = $state(constantes_pdf.margen_texto_izquierda ?? 0);
	// svelte-ignore non_reactive_update
	let textareaIzq: HTMLTextAreaElement;

	let textoDer = $state(constantes_pdf.texto_derecha ?? '');
	// svelte-ignore non_reactive_update
	let textareaDer: HTMLTextAreaElement;
	let margenDer = $state(constantes_pdf.margen_texto_derecha ?? 0);

	let textoCliente = $state(constantes_pdf.texto_cliente ?? '');
	// svelte-ignore non_reactive_update
	let textareaCliente: HTMLTextAreaElement;

	function formatoChileno(valor: number) {
		return new Intl.NumberFormat('es-CL', {
			style: 'currency',
			currency: 'CLP',
			minimumFractionDigits: 0
		}).format(valor);
	}

	function openEditMaterialModal(material: Material) {
		editMaterialModal = true;
		materialSelected = { ...material };
	}

	function closeEditMaterialModal() {
		editMaterialModal = false;
	}

	function openEditTipoModal(tipo: Tipo) {
		editTipoModal = true;
		tipoSelected = { ...tipo };
	}

	function closeEditTipoModal() {
		editTipoModal = false;
	}

	function openEditCristalModal(cristal: Cristal) {
		editCristalModal = true;
		cristalSelected = { ...cristal };
	}

	function closeEditCristalModal() {
		editCristalModal = false;
	}

	function openAddCristalModal() {
		addCristalModal = true;

		newCristal = {
			id_cristal: -1,
			desc_cristal: '',
			precio_cristal: 0
		};
		errorMessage = '';
	}

	function closeAddCristalModal() {
		addCristalModal = false;
		errorMessage = '';
	}

	function openEditColorModal(color: Color) {
		editColorModal = true;
		colorSelected = { ...color };
	}

	function closeEditColorModal() {
		editColorModal = false;
	}

	function openAddColorModal() {
		addColorModal = true;

		newColor = {
			id_color: -1,
			nombre_color: ''
		};
		errorMessage = '';
	}

	function closeAddColorModal() {
		addColorModal = false;
		errorMessage = '';
	}

	function cerrarSuccessModal() {
		successModal = false;
	}

	function openEditPerfilModal(perfil: Perfil) {
		editPerfilModal = true;
		perfilSelected = { ...perfil };
	}

	function closeEditPerfilModal() {
		editPerfilModal = false;
	}

	function openEditQuincalleriaModal(quincalleria: Quincalleria) {
		editQuincalleriaModal = true;
		quincalleriaSelected = { ...quincalleria };
	}

	function closeEditQuincalleriaModal() {
		editQuincalleriaModal = false;
	}

	async function editMaterial() {
		let bodyReq = {
			id: materialSelected.id_material,
			materialData: materialSelected
		};

		await fetch('/api/material', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bodyReq)
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
				}
				return response.json();
			})
			.then(() => {
				materiales = materiales.map((item) =>
					item.id_material === materialSelected.id_material ? materialSelected : item
				);
				editMaterialModal = false;
				successModal = true;
			})
			.catch((error) => {
				console.error('Error durante la solicitud:', error);
			});
	}

	function editTipo() {
		let bodyReq = {
			id: tipoSelected.id_tipo,
			tipo: tipoSelected
		};

		fetch('/api/tipo', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bodyReq)
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
				}
				return response.json();
			})
			.then(() => {
				tipos = tipos.map((item) => (item.id_tipo === tipoSelected.id_tipo ? tipoSelected : item));
				editTipoModal = false;
				successModal = true;
			})
			.catch((error) => {
				console.error('Error durante la solicitud:', error);
			});
	}

	function editCristal() {
		let bodyReq = {
			id: cristalSelected.id_cristal,
			cristalData: cristalSelected
		};

		fetch('/api/cristal', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bodyReq)
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
				}
				return response.json();
			})
			.then(() => {
				cristales = cristales.map((item) =>
					item.id_cristal === cristalSelected.id_cristal ? cristalSelected : item
				);
				editCristalModal = false;
				successModal = true;
			})
			.catch((error) => {
				console.error('Error durante la solicitud:', error);
			});
	}

	function addCristal() {
		if (!newCristal.desc_cristal.trim()) {
			errorMessage = 'La descripción del cristal es requerida';
			return;
		}

		if (newCristal.precio_cristal <= 0) {
			errorMessage = 'El precio debe ser mayor a 0';
			return;
		}

		fetch('/api/cristal', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ cristalData: newCristal })
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
				}
				return response.json();
			})
			.then((data) => {
				// Update the crystals list with the new data
				cristales = [...cristales, data as Cristal];
				addCristalModal = false;
				successModal = true;
			})
			.catch((error) => {
				errorMessage = 'Error al agregar el cristal. Por favor intente nuevamente.';
				console.error('Error durante la solicitud:', error);
			});
	}

	function editColor() {
		let bodyReq = {
			id: colorSelected.id_color,
			colorData: colorSelected
		};

		fetch('/api/color', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bodyReq)
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
				}
				return response.json();
			})
			.then(() => {
				colores = colores.map((item) =>
					item.id_color === colorSelected.id_color ? colorSelected : item
				);
				editColorModal = false;
				successModal = true;
			})
			.catch((error) => {
				console.error('Error durante la solicitud:', error);
			});
	}

	function addColor() {
		if (!newColor.nombre_color.trim()) {
			errorMessage = 'El nombre del color es requerido';
			return;
		}

		fetch('/api/color', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ colorData: newColor })
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
				}
				return response.json();
			})
			.then((data) => {
				// Update the colors list with the new data
				colores = [...colores, data as Color];
				addColorModal = false;
				successModal = true;
			})
			.catch((error) => {
				errorMessage = 'Error al agregar el color. Por favor intente nuevamente.';
				console.error('Error durante la solicitud:', error);
			});
	}

	function editPerfil() {
		let bodyReq = {
			id: perfilSelected.id_perfil,
			perfilData: perfilSelected
		};

		fetch('/api/perfil', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bodyReq)
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
				}
				return response.json();
			})
			.then(() => {
				perfiles = perfiles.map((item) =>
					item.id_perfil === perfilSelected.id_perfil ? perfilSelected : item
				);
				editPerfilModal = false;
				successModal = true;
			})
			.catch((error) => {
				console.error('Error durante la solicitud:', error);
			});
	}

	function editQuincalleria() {
		let bodyReq = {
			id: quincalleriaSelected.id_quincalleria,
			quincalleriaData: quincalleriaSelected
		};

		fetch('/api/quincalleria', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bodyReq)
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
				}
				return response.json();
			})
			.then(() => {
				quincallerias = quincallerias.map((item) =>
					item.id_quincalleria === quincalleriaSelected.id_quincalleria
						? quincalleriaSelected
						: item
				);
				editQuincalleriaModal = false;
				successModal = true;
			})
			.catch((error) => {
				console.error('Error durante la solicitud:', error);
			});
	}

	const handleImageUpload = async (event: Event) => {
		const files = (event.target as HTMLInputElement)?.files;
		if (!files) return;

		for (const file of Array.from(files)) {
			if (!file.type.startsWith('image/')) continue; // Filtra solo imágenes

			const reader = new FileReader();

			reader.onload = async (e) => {
				if (!e.target?.result) return;

				const img = new Image();
				img.src = e.target.result.toString();
				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					if (!ctx) return;

					// Define el tamaño del canvas según la imagen
					canvas.width = img.width;
					canvas.height = img.height;

					// Dibuja la imagen en el canvas
					ctx.drawImage(img, 0, 0);

					// Si es JPG, conviértelo a PNG y guarda los bytes
					if (file.type === 'image/jpeg') {
						canvas.toBlob((blob) => {
							if (blob) {
								const readerBlob = new FileReader();
								readerBlob.onloadend = () => {
									if (readerBlob.result) {
										imagenNueva.bytes = readerBlob.result.toString(); // Guarda los bytes convertidos
									}
								};
								readerBlob.readAsDataURL(blob); // Lee los bytes del PNG
							}
						}, 'image/png');
					} else {
						// Si ya es PNG o cualquier otro formato, guarda los bytes originales
						imagenNueva.bytes = e.target?.result?.toString() ?? '';
					}
				};
			};

			reader.readAsDataURL(file);
		}
	};

	async function handleImagePost(img_group: number, height: number) {
		if (imagenNueva.bytes === '') {
			alert('Error al subir la imagen');
			return;
		}

		imagenNueva.img_group = img_group;
		// CAMBIAR POR INPUT
		imagenNueva.height = height;

		await fetch('/api/imagenes', {
			method: 'POST',
			body: JSON.stringify(imagenNueva)
		}).then((response) => {
			return response.json();
		});
		imagenNueva.bytes = '';
		imagenes = await fetch('/api/imagenes', {
			method: 'GET'
		}).then((response) => {
			return response.json();
		});
	}

	async function handleImageDelete(idx: number, imgIdx: number) {
		await fetch('/api/imagenes', {
			method: 'DELETE',
			body: JSON.stringify({ id_imagen: imagenes[idx].imagenes[imgIdx].id_imagen })
		}).then((response) => {
			return response.json();
		});
		imagenes = await fetch('/api/imagenes', {
			method: 'GET'
		}).then((response) => {
			return response.json();
		});
	}

	async function previewPDF() {
		const previewPresupuesto: PresupuestoModel = {
			Cliente: {
				nombre: 'Cliente de prueba',
				direccion: '',
				email: '',
				rut_cliente: '',
				telefono: ''
			},
			estado: 'prueba',
			fecha: new Date().toString(),
			ganancia_global: 0,
			id_usuario: 0,
			nombre_cliente: 'Cliente de prueba',
			Opciones: [
				{
					Ventanas: [
						{
							alto: 1000,
							ancho: 1000,
							cantidad: 1,
							ganancia: 0,
							id_color: 1,
							id_cristal: 1,
							id_material: 1,
							id_tipo: 1,
							item: '',
							precio_total: 100000,
							precio_unitario: 100000,
							id_ventana: 0
						}
					],
					id_opcion: 0
				}
			],
			texto_libre: '',
			valor_despacho: 10000,
			valor_instalacion: 10000,
			id_presupuesto: 0
		};
		const { generatePDF } = await import('$lib/services/pdf_generator');
		const url = await generatePDF(previewPresupuesto, imagenes, data);
		window.open(url);
	}

	async function handleTextoPDFSubmit() {
		const newConstantes: Constantes = {
			id_constantes: 0,
			margen_texto_derecha: margenDer,
			margen_texto_izquierda: margenIzq,
			texto_cliente: textoCliente,
			texto_derecha: textoDer,
			texto_izquierda: textoIzq
		};

		await fetch('/api/constantes', {
			method: 'PUT',
			body: JSON.stringify(newConstantes)
		});
		location.reload();
	}

	function adjustHeight(textarea: HTMLTextAreaElement) {
		textarea.style.height = 'auto'; // Reiniciar altura para recalcular
		textarea.style.height = textarea.scrollHeight + 'px'; // Ajustar a contenido
	}
</script>

<svelte:head>
	<title>Catálogo | Termoacústicos</title>
	<meta name="description" content="Administra los materiales y parámetros del cotizador." />
</svelte:head>

<main
	class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-screen-2xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<p class="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Administración</p>
		<h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-950">Catálogo y configuración</h1>
		<p class="mt-1 text-sm text-slate-600">
			Mantén actualizados los productos, fórmulas e imágenes del cotizador.
		</p>
	</div>
	<nav
		aria-label="Secciones del catálogo"
		class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7">
		{#each seccionesCatalogo as seccion (seccion.nombre)}
			<button
				type="button"
				aria-pressed={constantSelected === seccion.nombre}
				onclick={() => (constantSelected = seccion.nombre)}
				class={`flex min-h-14 items-center gap-2 rounded-xl border px-3 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${constantSelected === seccion.nombre ? 'border-teal-900 bg-teal-900 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50'}`}>
				<span
					class={`iconify ${seccion.icono} size-5 shrink-0 ${constantSelected === seccion.nombre ? 'text-amber-300' : 'text-teal-800'}`}
					aria-hidden="true"></span>
				<span class="min-w-0 flex-1 truncate">{seccion.nombre}</span>
				<span
					class={`rounded-full px-2 py-0.5 text-xs tabular-nums ${constantSelected === seccion.nombre ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'}`}
					>{seccion.cantidad}</span>
			</button>
		{/each}
	</nav>

	{#if constantSelected == 'Materiales'}
		<table class="w-full table-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
			<thead class="w-full bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
				<tr>
					<th class="py-2 px-2 text-left">ID</th>
					<th class="py-2 px-2 text-left">Nombre Material</th>
					<th class="py-2 px-2 text-left">Texto libre PDF</th>
					<th class="py-2 px-2 text-left">Texto 1</th>
					<th class="py-2 px-2 text-left">Texto 2</th>
				</tr>
			</thead>
			<tbody class="w-full">
				{#each materiales as material}
					<tr
						onclick={() => {
							openEditMaterialModal(material);
						}}
						class="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50">
						<td class="py-1 px-2 text-left">{material.id_material}</td>
						<td class="py-1 px-2 text-left">{material.nombre_material}</td>
						<td class="py-1 px-2 text-left">{material.texto_libre}</td>
						<td class="py-1 px-2 text-left">{material.texto_calidad}</td>
						<td class="py-1 px-2 text-left">{material.texto_termopanel}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<!--editMaterial Modal-->
	{#if editMaterialModal}
		<div class={dialogBackdropClass}>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="edit-material-title"
				class={`${dialogPanelClass} max-w-xl`}>
				<header class="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
					<div>
						<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
							Material · ID {materialSelected.id_material}
						</p>
						<h2 id="edit-material-title" class="mt-1 text-xl font-bold text-slate-950">
							Modificar material
						</h2>
					</div>
					<button
						type="button"
						onclick={closeEditMaterialModal}
						class="iconify mdi--close size-5 rounded-md text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
						aria-label="Cerrar edición de material">
					</button>
				</header>

				<form
					class="grid gap-4 sm:grid-cols-2"
					onsubmit={(event) => {
						event.preventDefault();
						editMaterial();
					}}>
					<label class="sm:col-span-2">
						<span class={dialogLabelClass}>Nombre del material</span>
						<input
							class={dialogInputClass}
							type="text"
							bind:value={materialSelected.nombre_material} />
					</label>
					<label class="sm:col-span-2">
						<span class={dialogLabelClass}>Texto libre para el PDF</span>
						<input class={dialogInputClass} type="text" bind:value={materialSelected.texto_libre} />
					</label>
					<label>
						<span class={dialogLabelClass}>Texto de calidad</span>
						<input
							class={dialogInputClass}
							type="text"
							bind:value={materialSelected.texto_calidad} />
					</label>
					<label>
						<span class={dialogLabelClass}>Texto de termopanel</span>
						<input
							class={dialogInputClass}
							type="text"
							bind:value={materialSelected.texto_termopanel} />
					</label>
					<footer class="mt-2 flex justify-end gap-3 border-t border-slate-200 pt-4 sm:col-span-2">
						<button type="button" class={dialogCancelClass} onclick={closeEditMaterialModal}
							>Cancelar</button>
						<button type="submit" class={dialogSaveClass}>Guardar cambios</button>
					</footer>
				</form>
			</section>
		</div>
	{/if}

	{#if constantSelected == 'Cristales'}
		<table class="w-full table-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
			<thead class="w-full bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600">
				<tr>
					<th class="py-2 px-2 text-left">ID</th>
					<th class="py-2 px-2 text-left">Descripción Cristal</th>
					<th class="py-2 px-2 text-left">Precio</th>
				</tr>
			</thead>
			<tbody class="w-full">
				{#each cristales as cristal}
					<tr
						onclick={() => {
							openEditCristalModal(cristal);
						}}
						class="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50">
						<td class="py-1 px-2 text-left">{cristal.id_cristal}</td>
						<td class="py-1 px-2 text-left">{cristal.desc_cristal}</td>
						<td class="py-1 px-2 text-left">{formatoChileno(cristal.precio_cristal)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<button
			onclick={() => {
				openAddCristalModal();
			}}
			class="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold">
			Agregar Cristal</button>
	{/if}

	<!-- editCristal Modal -->
	{#if editCristalModal}
		<div class={dialogBackdropClass}>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="edit-cristal-title"
				class={`${dialogPanelClass} max-w-xl`}>
				<header class="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
					<div>
						<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
							Cristal · ID {cristalSelected.id_cristal}
						</p>
						<h2 id="edit-cristal-title" class="mt-1 text-xl font-bold text-slate-950">
							Modificar cristal
						</h2>
					</div>
					<button
						type="button"
						onclick={closeEditCristalModal}
						class="iconify mdi--close size-5 rounded-md text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
						aria-label="Cerrar edición de cristal">
					</button>
				</header>

				<form
					class="grid gap-4 sm:grid-cols-2"
					onsubmit={(event) => {
						event.preventDefault();
						editCristal();
					}}>
					<label class="sm:col-span-2">
						<span class={dialogLabelClass}>Descripción del cristal</span>
						<input class={dialogInputClass} type="text" bind:value={cristalSelected.desc_cristal} />
					</label>
					<label class="sm:col-span-2">
						<span class={dialogLabelClass}>Precio</span>
						<input
							class={dialogInputClass}
							type="number"
							bind:value={cristalSelected.precio_cristal} />
					</label>
					<footer class="mt-2 flex justify-end gap-3 border-t border-slate-200 pt-4 sm:col-span-2">
						<button type="button" class={dialogCancelClass} onclick={closeEditCristalModal}
							>Cancelar</button>
						<button type="submit" class={dialogSaveClass}>Guardar cambios</button>
					</footer>
				</form>
			</section>
		</div>
	{/if}

	<!-- addCristal Modal -->
	{#if addCristalModal}
		<div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
			<div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-[500px]">
				<!-- Close button -->
				<div class="flex justify-end">
					<button
						onclick={closeAddCristalModal}
						class="text-gray-500 hover:text-gray-800 font-bold text-lg iconify mdi--close size-6"
						aria-label="X">
					</button>
				</div>

				<p class="w-full text-xl text-center font-bold mb-6">Agregar Nuevo Cristal</p>

				<!-- Form container -->
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-2">
						<label for="desc_cristal" class="font-medium text-gray-700"
							>Descripción del Cristal</label>
						<input
							type="text"
							id="desc_cristal"
							bind:value={newCristal.desc_cristal}
							placeholder="Ingrese la descripción"
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
					</div>

					<div class="flex flex-col gap-2">
						<label for="precio_cristal" class="font-medium text-gray-700">Precio</label>
						<input
							type="number"
							id="precio_cristal"
							bind:value={newCristal.precio_cristal}
							placeholder="Ingrese el precio"
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
					</div>

					<!-- Error message -->
					{#if errorMessage}
						<p class="text-red-500 text-sm">{errorMessage}</p>
					{/if}

					<!-- Save button -->
					<button
						onclick={addCristal}
						class="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-500 transition-colors mt-4">
						Agregar Cristal
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if constantSelected == 'Tipos'}
		<table class="w-full table-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
			<thead class="w-full bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
				<tr>
					<th class="px-2 py-2 text-left">ID</th>
					<th class="px-2 py-2 text-left">Descripción</th>
					<th class="px-2 py-2 text-left">Material</th>
					<th class="px-2 py-2 text-left">Ancho</th>
					<th class="px-2 py-2 text-left">Alto</th>
					<th class="px-2 py-2 text-left">Cantidad cristal</th>
					<th class="px-2 py-2 text-left">% Quincallería</th>
					<th class="px-2 py-2 text-left">Largo perfil</th>
					<th class="px-2 py-2 text-left">Mínimo</th>
					<th class="px-2 py-2 text-left">Máximo</th>
					<th class="px-2 py-2 text-left">Ganancia</th>
				</tr>
			</thead>
			<tbody class="w-full">
				{#each tipos as tipo}
					<tr
						onclick={() => {
							openEditTipoModal(tipo);
						}}
						class="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50">
						<td class="px-2 py-1">{tipo.id_tipo}</td>
						<td class="px-2 py-1">{tipo.descripcion_tipo}</td>
						<td class="px-2 py-1">{tipo.id_material}</td>
						<td class="px-2 py-1">{tipo.formula_ancho}</td>
						<td class="px-2 py-1">{tipo.formula_alto}</td>
						<td class="px-2 py-1">{tipo.cantidad_cristal}</td>
						<td class="px-2 py-1">{tipo.porcentaje_quinc}</td>
						<td class="px-2 py-1">{tipo.largo_perfil}</td>
						<td class="px-2 py-1">{tipo.minimo}</td>
						<td class="px-2 py-1">{tipo.maximo}</td>
						<td class="px-2 py-1">{tipo.ganancia}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<!-- editTipo Modal -->
	{#if editTipoModal}
		<div class={dialogBackdropClass}>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="edit-tipo-title"
				class={`${dialogPanelClass} max-w-3xl`}>
				<header class="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
					<div class="min-w-0">
						<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
							Tipo · ID {tipoSelected.id_tipo} · Material {tipoSelected.id_material}
						</p>
						<h2 id="edit-tipo-title" class="mt-1 text-xl font-bold text-slate-950">
							{tipoSelected.descripcion_tipo}
						</h2>
					</div>
					<button
						type="button"
						onclick={closeEditTipoModal}
						class="iconify mdi--close size-5 shrink-0 rounded-md text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
						aria-label="Cerrar edición de tipo">
					</button>
				</header>

				<form
					class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
					onsubmit={(event) => {
						event.preventDefault();
						editTipo();
					}}>
					<label>
						<span class={dialogLabelClass}>Fórmula de ancho</span>
						<input class={dialogInputClass} type="text" bind:value={tipoSelected.formula_ancho} />
					</label>
					<label>
						<span class={dialogLabelClass}>Fórmula de alto</span>
						<input class={dialogInputClass} type="text" bind:value={tipoSelected.formula_alto} />
					</label>
					<label>
						<span class={dialogLabelClass}>Cantidad de cristales</span>
						<input
							class={dialogInputClass}
							type="text"
							bind:value={tipoSelected.cantidad_cristal} />
					</label>
					<label>
						<span class={dialogLabelClass}>Porcentaje de quincallería</span>
						<input
							class={dialogInputClass}
							type="number"
							bind:value={tipoSelected.porcentaje_quinc} />
					</label>
					<label>
						<span class={dialogLabelClass}>Largo de perfil</span>
						<input class={dialogInputClass} type="number" bind:value={tipoSelected.largo_perfil} />
					</label>
					<label>
						<span class={dialogLabelClass}>Mínimo</span>
						<input class={dialogInputClass} type="number" bind:value={tipoSelected.minimo} />
					</label>
					<label>
						<span class={dialogLabelClass}>Máximo</span>
						<input class={dialogInputClass} type="number" bind:value={tipoSelected.maximo} />
					</label>
					<label>
						<span class={dialogLabelClass}>Ganancia</span>
						<input class={dialogInputClass} type="number" bind:value={tipoSelected.ganancia} />
					</label>
					<footer
						class="mt-2 flex justify-end gap-3 border-t border-slate-200 pt-4 sm:col-span-2 lg:col-span-3">
						<button type="button" class={dialogCancelClass} onclick={closeEditTipoModal}
							>Cancelar</button>
						<button type="submit" class={dialogSaveClass}>Guardar cambios</button>
					</footer>
				</form>
			</section>
		</div>
	{/if}

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
					<p class="text-gray-700">Modificación realizada correctamente</p>

					<!-- Botón para realizar otra acción o cerrar -->
					<button
						onclick={cerrarSuccessModal}
						class="bg-transparent text-gray-700 mt-2 w-fit font-medium py-2 px-4 rounded hover:underline">
						Cerrar
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if constantSelected == 'Colores'}
		<table class="w-full table-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
			<thead class="w-full bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
				<tr>
					<th class="py-2 px-2 text-left">ID</th>
					<th class="py-2 px-2 text-left">Nombre Color</th>
				</tr>
			</thead>
			<tbody class="w-full">
				{#each colores as color}
					<tr
						onclick={() => {
							openEditColorModal(color);
						}}
						class="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50">
						<td class="py-1 px-2 text-left">{color.id_color}</td>
						<td class="py-1 px-2 text-left">{color.nombre_color}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<button
			onclick={() => {
				openAddColorModal();
			}}
			aria-label="Agregar Color"
			class="w-full bg-teal-600 hover:bg-teal-500 transition-all text-white rounded-lg font-bold">
			Agregar Color</button>
	{/if}

	<!-- editColor Modal -->
	{#if editColorModal}
		<div class={dialogBackdropClass}>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="edit-color-title"
				class={`${dialogPanelClass} max-w-md`}>
				<header class="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
					<div>
						<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
							Color · ID {colorSelected.id_color}
						</p>
						<h2 id="edit-color-title" class="mt-1 text-xl font-bold text-slate-950">
							Modificar color
						</h2>
					</div>
					<button
						type="button"
						onclick={closeEditColorModal}
						class="iconify mdi--close size-5 rounded-md text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
						aria-label="Cerrar edición de color">
					</button>
				</header>

				<form
					class="space-y-4"
					onsubmit={(event) => {
						event.preventDefault();
						editColor();
					}}>
					<label class="block">
						<span class={dialogLabelClass}>Nombre del color</span>
						<input class={dialogInputClass} type="text" bind:value={colorSelected.nombre_color} />
					</label>
					<footer class="flex justify-end gap-3 border-t border-slate-200 pt-4">
						<button type="button" class={dialogCancelClass} onclick={closeEditColorModal}
							>Cancelar</button>
						<button type="submit" class={dialogSaveClass}>Guardar cambios</button>
					</footer>
				</form>
			</section>
		</div>
	{/if}

	<!-- addColor Modal -->
	{#if addColorModal}
		<div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
			<div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-[500px]">
				<!-- Close button -->
				<div class="flex justify-end">
					<button
						onclick={closeAddColorModal}
						class="text-gray-500 hover:text-gray-800 font-bold text-lg iconify mdi--close size-6"
						aria-label="X">
					</button>
				</div>

				<p class="w-full text-xl text-center font-bold mb-6">Agregar Nuevo Color</p>

				<!-- Form container -->
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-2">
						<label for="desc_cristal" class="font-medium text-gray-700">Nombre del color</label>
						<input
							type="text"
							id="desc_cristal"
							bind:value={newColor.nombre_color}
							placeholder="Ingrese el nombre"
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
					</div>

					<!-- Error message -->
					{#if errorMessage}
						<p class="text-red-500 text-sm">{errorMessage}</p>
					{/if}

					<!-- Save button -->
					<button
						onclick={addColor}
						class="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-500 transition-colors mt-4">
						Agregar Color
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if constantSelected == 'Imágenes'}
		<div class="space-y-8">
			<button class="bg-white p-4 shadow-md" onclick={previewPDF}>Previsualizar PDF</button>
			<div class="w-full flex flex-col">
				<h2>
					{'Palabras especiales: {nombre} - Nombre del cliente {numero} - Número de presupuesto'}
				</h2>
				<label>
					Texto Izquierdo
					<textarea
						class="w-full resize-none"
						bind:value={textoIzq}
						oninput={() => adjustHeight(textareaIzq)}
						onfocus={() => adjustHeight(textareaIzq)}
						bind:this={textareaIzq}></textarea>
				</label>
				<label>
					Margen Texto Izquierdo
					<input type="number" bind:value={margenIzq} />
				</label>
				<label
					>Texto Derecha
					<textarea
						class="w-full resize-none"
						bind:value={textoDer}
						oninput={() => adjustHeight(textareaDer)}
						onfocus={() => adjustHeight(textareaDer)}
						bind:this={textareaDer}></textarea>
				</label>
				<label
					>Margen Texto Derecha
					<input type="number" bind:value={margenDer} />
				</label>
				<label
					>Texto Cliente
					<textarea
						class="w-full resize-none"
						oninput={() => adjustHeight(textareaCliente)}
						onfocus={() => adjustHeight(textareaCliente)}
						bind:this={textareaCliente}
						bind:value={textoCliente}></textarea>
				</label>

				<button onclick={handleTextoPDFSubmit}>Guardar cambios</button>
			</div>

			{#each imagenes as grupo, idx}
				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-xl font-semibold text-gray-800">Imágenes cabezal {idx + 1}</h2>
					</div>

					<!-- Grid de imágenes -->
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						{#each grupo.imagenes as img, imgIdx}
							<div class="relative group">
								<div class="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
									<img
										src={img.bytes}
										alt={`Imagen cabezal ${idx + 1}-${imgIdx}`}
										class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
								</div>
								<button
									aria-label="eliminar imagen"
									onclick={() => handleImageDelete(idx, imgIdx)}
									class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<div class="iconify mdi--delete size-5"></div>
								</button>
							</div>
						{/each}
					</div>

					<!-- Sección para agregar nueva imagen -->
					<div class="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
						<div class="flex flex-col items-center gap-4">
							<div class="iconify mdi--cloud-upload text-gray-400 size-12"></div>
							<h3 class="text-lg font-medium text-gray-700">Agregar imagen nueva</h3>
							<p class="text-sm text-gray-500 text-center">
								Arrastra y suelta una imagen aquí o haz clic para seleccionar
							</p>
							<input
								type="file"
								accept="image/*"
								onchange={async (e) => {
									await handleImageUpload(e);
									setTimeout(async () => {
										await handleImagePost(idx + 1, 80);
									}, 1000);
								}}
								class="block w-full text-sm text-gray-500
						file:mr-4 file:py-2 file:px-4
						file:rounded-full file:border-0
						file:text-sm file:font-semibold
						file:bg-teal-50 file:text-teal-700
						hover:file:bg-teal-100
						cursor-pointer
					" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!--Tabla perfiles-->
	{#if constantSelected == 'Perfiles'}
		<table class="w-full table-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
			<thead class="w-full bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
				<tr>
					<th class="py-2 px-2 text-left">ID</th>
					<th class="py-2 px-2 text-left">Código Perfil</th>
					<th class="py-2 px-2 text-left">Dimensión</th>
					<th class="py-2 px-2 text-left">Cantidad</th>
					<th class="py-2 px-2 text-left">Kg/ml</th>
					<th class="py-2 px-2 text-left">Precio</th>
				</tr>
			</thead>
			<tbody class="w-full">
				{#each perfiles as perfil}
					<tr
						onclick={() => {
							openEditPerfilModal(perfil);
						}}
						class="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50">
						<td class="py-1 px-2 text-left">{perfil.id_perfil}</td>
						<td class="py-1 px-2 text-left">{perfil.codigo_per}</td>
						<td class="py-1 px-2 text-left">{perfil.formula_dim}</td>
						<td class="py-1 px-2 text-left">{perfil.formula_cant}</td>
						<td class="py-1 px-2 text-left">{perfil.kg_ml_per}</td>
						<td class="py-1 px-2 text-left">{formatoChileno(perfil.valor)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<!-- editPerfil Modal -->
	{#if editPerfilModal}
		<div class={dialogBackdropClass}>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="edit-perfil-title"
				class={`${dialogPanelClass} max-w-xl`}>
				<header class="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
					<div>
						<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
							Perfil · Código {perfilSelected.codigo_per} · ID {perfilSelected.id_perfil}
						</p>
						<h2 id="edit-perfil-title" class="mt-1 text-xl font-bold text-slate-950">
							Modificar perfil
						</h2>
					</div>
					<button
						type="button"
						onclick={closeEditPerfilModal}
						class="iconify mdi--close size-5 rounded-md text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
						aria-label="Cerrar edición de perfil">
					</button>
				</header>

				<form
					class="grid gap-4 sm:grid-cols-2"
					onsubmit={(event) => {
						event.preventDefault();
						editPerfil();
					}}>
					<label>
						<span class={dialogLabelClass}>Fórmula de dimensión</span>
						<input class={dialogInputClass} type="text" bind:value={perfilSelected.formula_dim} />
					</label>
					<label>
						<span class={dialogLabelClass}>Fórmula de cantidad</span>
						<input class={dialogInputClass} type="text" bind:value={perfilSelected.formula_cant} />
					</label>
					<label>
						<span class={dialogLabelClass}>Peso (kg/ml)</span>
						<input class={dialogInputClass} type="number" bind:value={perfilSelected.kg_ml_per} />
					</label>
					<label>
						<span class={dialogLabelClass}>Precio por metro</span>
						<input class={dialogInputClass} type="number" bind:value={perfilSelected.valor} />
					</label>
					<footer class="mt-2 flex justify-end gap-3 border-t border-slate-200 pt-4 sm:col-span-2">
						<button type="button" class={dialogCancelClass} onclick={closeEditPerfilModal}
							>Cancelar</button>
						<button type="submit" class={dialogSaveClass}>Guardar cambios</button>
					</footer>
				</form>
			</section>
		</div>
	{/if}

	<!--Tabla quincallerias-->
	{#if constantSelected == 'Quincallerías'}
		<table class="w-full table-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
			<thead class="w-full bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
				<tr>
					<th class="py-3 px-4 text-left">ID</th>
					<th class="py-3 px-4 text-left">Descripción</th>
					<th class="py-3 px-4 text-left">Fórmula</th>
					<th class="py-3 px-4 text-left">Precio</th>
				</tr>
			</thead>
			<tbody class="w-full">
				{#each quincallerias as quincalleria}
					<tr
						onclick={() => {
							openEditQuincalleriaModal(quincalleria);
						}}
						class="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50">
						<td class="py-2 px-4 text-left">{quincalleria.id_quincalleria}</td>
						<td class="py-2 px-4 text-left">{quincalleria.desc_quin}</td>
						<td class="py-2 px-4 text-left">{quincalleria.formula_quin}</td>
						<td class="py-2 px-4 text-left">{formatoChileno(quincalleria.precio_quin)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
	{#if editQuincalleriaModal}
		<div class={dialogBackdropClass}>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="edit-quincalleria-title"
				class={`${dialogPanelClass} max-w-xl`}>
				<header class="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
					<div>
						<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
							Quincallería · ID {quincalleriaSelected.id_quincalleria}
						</p>
						<h2 id="edit-quincalleria-title" class="mt-1 text-xl font-bold text-slate-950">
							Modificar quincallería
						</h2>
					</div>
					<button
						type="button"
						onclick={closeEditQuincalleriaModal}
						class="iconify mdi--close size-5 rounded-md text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
						aria-label="Cerrar edición de quincallería">
					</button>
				</header>

				<form
					class="space-y-4"
					onsubmit={(event) => {
						event.preventDefault();
						editQuincalleria();
					}}>
					<label class="block">
						<span class={dialogLabelClass}>Descripción</span>
						<input
							class={dialogInputClass}
							type="text"
							bind:value={quincalleriaSelected.desc_quin} />
					</label>
					<label class="block">
						<span class={dialogLabelClass}>Fórmula</span>
						<input
							class={dialogInputClass}
							type="text"
							bind:value={quincalleriaSelected.formula_quin} />
					</label>
					<label class="block">
						<span class={dialogLabelClass}>Precio</span>
						<input
							class={dialogInputClass}
							type="number"
							bind:value={quincalleriaSelected.precio_quin} />
					</label>
					<footer class="flex justify-end gap-3 border-t border-slate-200 pt-4">
						<button type="button" class={dialogCancelClass} onclick={closeEditQuincalleriaModal}>
							Cancelar
						</button>
						<button type="submit" class={dialogSaveClass}>Guardar cambios</button>
					</footer>
				</form>
			</section>
		</div>
	{/if}
</main>
