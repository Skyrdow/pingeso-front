<script lang="ts">
	let correo = $state('');
	let contraseña = $state('');
	let contraseña_r = $state('');
	let mensaje = $state('');
	let creado = $state(false);
	let enviando = $state(false);

	async function handleCrear(event: SubmitEvent) {
		event.preventDefault();
		mensaje = '';
		creado = false;

		if (contraseña !== contraseña_r) {
			mensaje = 'Las contraseñas deben coincidir.';
			return;
		}

		enviando = true;
		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: correo, password: contraseña, id_usuario: 0, is_admin: 0 })
			});
			const result = (await response.json()) as { message?: string; error?: string };
			if (!response.ok) throw new Error(result.error || 'No se pudo crear el usuario.');

			creado = true;
			correo = '';
			contraseña = '';
			contraseña_r = '';
		} catch (error) {
			mensaje = error instanceof Error ? error.message : 'No se pudo crear el usuario.';
		} finally {
			enviando = false;
		}
	}
</script>

<svelte:head>
	<title>Usuarios | Termoacústicos</title>
	<meta name="description" content="Administra los accesos al cotizador de Termoacústicos." />
</svelte:head>

<main
	class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-screen-2xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<p class="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Administración</p>
		<h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-950">Usuarios</h1>
		<p class="mt-1 text-sm text-slate-600">
			Crea accesos para las personas que preparan cotizaciones.
		</p>
	</div>

	<form
		class="w-full max-w-xl space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
		onsubmit={handleCrear}>
		<div>
			<h2 class="text-lg font-bold text-slate-900">Agregar usuario</h2>
			<p class="mt-1 text-sm text-slate-600">La cuenta tendrá permisos de cotización.</p>
		</div>
		<div>
			<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="nuevo-email"
				>Correo electrónico</label>
			<input
				class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
				type="email"
				id="nuevo-email"
				autocomplete="email"
				bind:value={correo}
				required />
		</div>
		<div>
			<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="nueva-password"
				>Contraseña</label>
			<input
				class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
				id="nueva-password"
				type="password"
				autocomplete="new-password"
				bind:value={contraseña}
				required />
		</div>
		<div>
			<label class="mb-1.5 block text-sm font-semibold text-slate-700" for="confirmar-password"
				>Repetir contraseña</label>
			<input
				class="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
				id="confirmar-password"
				type="password"
				autocomplete="new-password"
				bind:value={contraseña_r}
				required />
		</div>
		{#if mensaje}
			<p class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800" role="alert">
				{mensaje}
			</p>
		{/if}
		{#if creado}
			<p
				class="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
				role="status">
				Usuario creado correctamente.
			</p>
		{/if}
		<button
			type="submit"
			disabled={enviando}
			class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-900 px-4 font-bold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
			{enviando ? 'Creando…' : 'Crear usuario'}
		</button>
	</form>
</main>
