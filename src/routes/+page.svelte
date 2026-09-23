<script lang="ts">
	import { goto } from '$app/navigation';
	let usuario = $state('');
	let password = $state('');
	let error = $state('');
	let enviando = $state(false);

	async function login(email: string, password: string) {
		error = '';

		if (!email || !password) {
			error = 'Por favor, complete todos los campos.';
			return;
		}

		enviando = true;
		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
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

	async function handleSubmit(event: Event) {
		event.preventDefault();
		await login(usuario, password);
	}

	async function handleDemoLogin() {
		usuario = 'demo@demo.test';
		password = 'demo';
		await login('demo@demo.test', 'demo');
	}
</script>

<svelte:head>
	<title>Ingresar | Termoacústicos</title>
	<meta name="description" content="Ingresa al cotizador de ventanas de Termoacústicos." />
</svelte:head>

<main class="grid min-h-screen place-items-center bg-[#f4f7f6] px-5 py-10 sm:px-8">
	<div class="w-full max-w-md animate-fade-up">
		<a
			href="/"
			class="inline-flex items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-teal-700">
			<span class="grid size-11 place-items-center rounded-xl bg-teal-900 text-amber-300">
				<span class="iconify mdi--window-shutter-open size-6" aria-hidden="true"></span>
			</span>
			<span class="leading-tight">
				<span class="block text-sm font-bold tracking-[0.12em] text-teal-950">TERMOACÚSTICOS</span>
				<span class="mt-1 block text-xs text-slate-500">Cotizador interno</span>
			</span>
		</a>

		<section class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<p class="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
				Cotizador de ventanas
			</p>
			<h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Iniciar sesión</h1>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Ingresa con tu cuenta o explora la herramienta con la cuenta de demostración.
			</p>

			<form class="mt-7 space-y-5" onsubmit={handleSubmit}>
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
				<button
					type="button"
					disabled={enviando}
					onclick={handleDemoLogin}
					class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-teal-800 px-4 font-bold text-teal-900 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
					<span class="iconify mdi--play-circle-outline size-5" aria-hidden="true"></span>
					Entrar con cuenta demo
				</button>
			</form>
		</section>

		<p class="mt-6 text-center text-xs text-slate-500">
			© {new Date().getFullYear()} Termoacústicos
		</p>
	</div>
</main>
