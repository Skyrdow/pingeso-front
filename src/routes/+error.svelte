<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} | Termoacústicos</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="grid min-h-screen place-items-center bg-[#f4f7f6] px-5 py-12">
	<section
		class="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
		<span class="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-100 text-teal-900">
			<span class="iconify mdi--window-shutter-open size-7" aria-hidden="true"></span>
		</span>
		<p class="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
			Termoacústicos · Cotizador
		</p>
		<h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
			{page.status === 404 ? 'No encontramos esa página' : 'No pudimos cargar esta página'}
		</h1>
		<p class="mt-3 text-sm leading-6 text-slate-600">
			{page.status === 404
				? 'Revisa la dirección o vuelve al inicio para continuar.'
				: 'Inténtalo de nuevo en unos momentos. Si el problema continúa, contacta a soporte.'}
		</p>
		<p class="mt-5 text-xs font-medium text-slate-400">Error {page.status}</p>
		<a
			href="/"
			class="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-900 px-5 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
			<span class="iconify mdi--arrow-left size-4" aria-hidden="true"></span>
			Volver al inicio
		</a>
	</section>
</main>
