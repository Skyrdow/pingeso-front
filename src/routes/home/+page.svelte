<script lang="ts">
	const metricas = [
		{
			titulo: 'Cotizaciones del mes',
			valor: '24',
			detalle: '+12% frente al mes anterior',
			icono: 'mdi--file-document-multiple-outline',
			color: 'bg-teal-50 text-teal-800'
		},
		{
			titulo: 'Pendientes',
			valor: '6',
			detalle: 'Por revisar o enviar',
			icono: 'mdi--clock-outline',
			color: 'bg-amber-50 text-amber-800'
		},
		{
			titulo: 'Aprobadas',
			valor: '18',
			detalle: '75% de las cotizaciones',
			icono: 'mdi--check-circle-outline',
			color: 'bg-emerald-50 text-emerald-800'
		},
		{
			titulo: 'Monto cotizado',
			valor: '$8,4 MM',
			detalle: 'Total referencial del mes',
			icono: 'mdi--cash-multiple',
			color: 'bg-slate-100 text-slate-700'
		}
	];
</script>

<svelte:head>
	<title>Inicio | Termoacústicos</title>
	<meta name="description" content="Panel de trabajo del cotizador de Termoacústicos." />
</svelte:head>

<main class="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
	<header
		class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Espacio de trabajo</p>
			<h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-950">Cotizaciones</h1>
			<p class="mt-1 text-sm text-slate-600">Crea presupuestos y consulta los que ya preparaste.</p>
		</div>
		<a
			href="/home/cotizar"
			class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-900 px-4 font-bold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
			<span class="iconify mdi--plus size-5" aria-hidden="true"></span>
			Nueva cotización
		</a>
	</header>

	<section class="mt-6" aria-labelledby="resumen-title">
		<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
			<h2 id="resumen-title" class="text-base font-bold text-slate-900">Resumen</h2>
			<span
				class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900">
				<span class="iconify mdi--flask-outline size-4" aria-hidden="true"></span>
				Datos de muestra
			</span>
		</div>
		<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
			{#each metricas as metrica (metrica.titulo)}
				<article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
					<div class="flex items-start justify-between gap-3">
						<div>
							<p class="text-sm font-medium text-slate-600">{metrica.titulo}</p>
							<p class="mt-2 text-2xl font-bold tracking-tight text-slate-950">{metrica.valor}</p>
						</div>
						<span class={`grid size-10 shrink-0 place-items-center rounded-xl ${metrica.color}`}>
							<span class={`iconify ${metrica.icono} size-5`} aria-hidden="true"></span>
						</span>
					</div>
					<p class="mt-2 text-xs text-slate-500">{metrica.detalle}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="mt-7" aria-labelledby="tareas-title">
		<h2 id="tareas-title" class="text-base font-bold text-slate-900">Tareas</h2>
		<div class="mt-3 grid gap-4 sm:grid-cols-2 lg:max-w-4xl">
			<a
				href="/home/cotizar"
				class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700">
				<span class="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
					<span class="iconify mdi--file-document-edit-outline size-5" aria-hidden="true"></span>
				</span>
				<h3 class="mt-4 font-bold text-slate-900 group-hover:text-teal-900">Crear cotización</h3>
				<p class="mt-1 text-sm leading-5 text-slate-600">
					Ingresa los datos del cliente y configura sus ventanas.
				</p>
				<span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-800">
					Comenzar <span class="iconify mdi--arrow-right size-4" aria-hidden="true"></span>
				</span>
			</a>
			<a
				href="/home/historial"
				class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700">
				<span class="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-800">
					<span class="iconify mdi--history size-5" aria-hidden="true"></span>
				</span>
				<h3 class="mt-4 font-bold text-slate-900 group-hover:text-teal-900">Ver historial</h3>
				<p class="mt-1 text-sm leading-5 text-slate-600">
					Busca presupuestos, revisa sus estados o vuelve a editarlos.
				</p>
				<span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-800">
					Consultar <span class="iconify mdi--arrow-right size-4" aria-hidden="true"></span>
				</span>
			</a>
		</div>
	</section>
</main>
