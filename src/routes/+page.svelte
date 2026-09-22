<script lang="ts">
	import { goto } from '$app/navigation';
	let usuario = $state('');
	let password = $state('');
	let error = $state('');
	let enviando = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		error = '';

		if (!usuario || !password) {
			error = 'Por favor, complete todos los campos.';
			return;
		}

		enviando = true;
		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: usuario, password })
			});

			if (!response.ok) {
				const { error: serverError } = (await response.json()) as { error: string };
				error = serverError || 'Error en el inicio de sesión.';
				return;
			}

			// const { token } = (await response.json()) as { token: string };
			// localStorage.setItem('authToken', token);
			goto('/home/historial'); // Redirige al usuario a la página principal
		} catch {
			error = 'Hubo un problema con la solicitud.';
		} finally {
			enviando = false;
		}
	}
</script>

<svelte:head>
	<title>Ingresar | Termoacústicos</title>
	<meta name="description" content="Ingresa al cotizador de ventanas de Termoacústicos." />
</svelte:head>

<div class="grid min-h-screen bg-[#f4f7f6] lg:grid-cols-[1.1fr_0.9fr]">
	<section
		class="relative hidden min-h-screen overflow-hidden bg-teal-950 lg:block"
		aria-label="Ventanas Termoacústicos">
		<img
			class="absolute inset-0 size-full object-cover opacity-60"
			src="/termopaneles.png"
			alt="Ventanas de alta eficiencia térmica" />
		<div class="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/30 to-teal-950/20">
		</div>
		<div class="absolute inset-x-0 bottom-0 p-12 xl:p-16">
			<div
				class="mb-6 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-teal-950/40 p-3 text-white backdrop-blur">
				<span class="grid size-12 place-items-center rounded-xl bg-amber-400 text-teal-950"
					><span class="iconify mdi--window-shutter-open size-7" aria-hidden="true"></span></span>
				<span class="text-sm font-bold tracking-[0.12em]">TERMOACÚSTICOS</span>
			</div>
			<p
				class="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
				Confort que se nota. Calidad que permanece.
			</p>
			<p class="mt-4 max-w-lg text-base leading-7 text-teal-50">
				Soluciones en ventanas pensadas para hacer cada espacio más eficiente y acogedor.
			</p>
		</div>
	</section>

	<main class="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
		<div class="w-full max-w-md animate-fade-up">
			<a
				href="/"
				class="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 lg:hidden">
				<span class="grid size-11 place-items-center rounded-xl bg-teal-900 text-amber-300"
					><span class="iconify mdi--window-shutter-open size-6" aria-hidden="true"></span></span>
				<span class="text-sm font-bold tracking-[0.12em] text-teal-950">TERMOACÚSTICOS</span>
			</a>
			<p class="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
				Portal de clientes y cotizaciones
			</p>
			<h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Bienvenido</h1>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Ingresa con tu cuenta para administrar presupuestos.
			</p>

			<form
				class="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8"
				onsubmit={handleSubmit}>
				<div>
					<label class="mb-2 block text-sm font-semibold text-slate-700" for="usuario"
						>Usuario o correo</label>
					<input
						class="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
						bind:value={usuario}
						id="usuario"
						type="text"
						autocomplete="username"
						required
						placeholder="nombre@empresa.cl" />
				</div>
				<div>
					<label class="mb-2 block text-sm font-semibold text-slate-700" for="password"
						>Contraseña</label>
					<input
						class="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
						bind:value={password}
						id="password"
						type="password"
						autocomplete="current-password"
						required
						placeholder="Tu contraseña" />
				</div>
				{#if error}
					<p class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800" role="alert">
						{error}
					</p>
				{/if}
				<button
					type="submit"
					disabled={enviando}
					class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-900 px-4 font-bold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
					{#if enviando}<span class="iconify mdi--loading size-5 animate-spin" aria-hidden="true"
						></span
						>{/if}
					{enviando ? 'Ingresando…' : 'Ingresar'}
				</button>
			</form>
			<p class="mt-6 text-center text-xs text-slate-500">
				© {new Date().getFullYear()} Termoacústicos
			</p>
		</div>
	</main>
</div>
