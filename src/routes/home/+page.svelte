<svelte:head>
	<title>Inicio | Termoacústicos</title>
	<meta name="description" content="Accesos rápidos al cotizador de Termoacústicos." />
</svelte:head>

<main class="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
	<section
		class="relative isolate overflow-hidden rounded-3xl bg-teal-950 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
		<div class="absolute -right-12 -top-24 -z-10 size-72 rounded-full border-[36px] border-white/5">
		</div>
		<div class="absolute -bottom-24 right-40 -z-10 size-48 rounded-full bg-amber-400/10 blur-2xl">
		</div>
		<p class="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
			Termoacústicos · Cotizador
		</p>
		<h1 class="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
			Cotizaciones claras, en menos pasos.
		</h1>
		<p class="mt-3 max-w-xl text-sm leading-6 text-teal-100 sm:text-base">
			Crea presupuestos de ventanas, consulta su estado y retoma trabajos anteriores desde un solo
			lugar.
		</p>
		<a
			href="/home/cotizar"
			class="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-amber-400 px-5 font-bold text-teal-950 shadow transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950">
			<span class="iconify mdi--plus-circle-outline size-5" aria-hidden="true"></span>
			Nueva cotización
		</a>
	</section>

	<section class="mt-8" aria-labelledby="accesos-title">
		<div class="mb-4">
			<h2 id="accesos-title" class="text-lg font-bold text-slate-900">¿Qué necesitas hacer?</h2>
			<p class="mt-1 text-sm text-slate-600">Elige una tarea para continuar.</p>
		</div>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<a
				href="/home/cotizar"
				class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700">
				<span class="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700"
					><span class="iconify mdi--file-document-edit-outline size-6" aria-hidden="true"></span
					></span>
				<h3 class="mt-4 font-bold text-slate-900 group-hover:text-teal-900">Crear cotización</h3>
				<p class="mt-1 text-sm leading-5 text-slate-600">
					Ingresa los datos del cliente y configura sus ventanas.
				</p>
				<span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-800"
					>Comenzar <span class="iconify mdi--arrow-right size-4" aria-hidden="true"></span></span>
			</a>
			<a
				href="/home/historial"
				class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700">
				<span class="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal-800"
					><span class="iconify mdi--history size-6" aria-hidden="true"></span></span>
				<h3 class="mt-4 font-bold text-slate-900 group-hover:text-teal-900">Ver historial</h3>
				<p class="mt-1 text-sm leading-5 text-slate-600">
					Busca presupuestos, revisa sus estados o vuelve a editarlos.
				</p>
				<span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-800"
					>Consultar <span class="iconify mdi--arrow-right size-4" aria-hidden="true"></span></span>
			</a>
			<div class="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2 lg:col-span-1">
				<span class="grid size-11 place-items-center rounded-xl bg-white text-slate-600 shadow-sm"
					><span class="iconify mdi--lightbulb-outline size-6" aria-hidden="true"></span></span>
				<h3 class="mt-4 font-bold text-slate-900">Un consejo</h3>
				<p class="mt-1 text-sm leading-5 text-slate-600">
					Completa los datos de contacto para que el presupuesto quede listo para compartir.
				</p>
			</div>
		</div>
	</section>
</main>
