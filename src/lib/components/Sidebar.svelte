<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import SidebarElement from '$lib/components/SidebarElement.svelte';

	const { is_admin } = $props<{ is_admin?: number }>();

	async function cerrarSesion() {
		await fetch('/api/login', { method: 'DELETE' });
		goto('/');
	}
</script>

<header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
	<div
		class="mx-auto flex min-h-16 max-w-screen-2xl flex-wrap items-center justify-between gap-2 px-4 sm:px-6">
		<a
			href="/home"
			class="group inline-flex items-center gap-3 rounded-lg py-2"
			aria-label="Termoacústicos, inicio">
			<span class="grid size-10 place-items-center rounded-xl bg-teal-900 text-amber-300 shadow-sm">
				<span class="iconify mdi--window-shutter-open size-6" aria-hidden="true"></span>
			</span>
			<span class="leading-tight">
				<span class="block text-sm font-bold tracking-wide text-teal-950">TERMOACÚSTICOS</span>
				<span class="block text-[11px] font-medium tracking-[0.16em] text-slate-500"
					>COTIZADOR</span>
			</span>
		</a>

		<nav
			aria-label="Navegación principal"
			class="order-3 flex w-full items-center gap-1 overflow-x-auto pb-2 sm:order-none sm:w-auto sm:pb-0">
			<SidebarElement
				href="/home"
				buttonName="Inicio"
				icon="mdi--home-outline"
				active={page.url.pathname === '/home'} />
			<SidebarElement
				href="/home/cotizar"
				buttonName="Cotizar"
				icon="mdi--file-document-edit-outline"
				active={page.url.pathname.startsWith('/home/cotizar')} />
			<SidebarElement
				href="/home/historial"
				buttonName="Historial"
				icon="mdi--history"
				active={page.url.pathname.startsWith('/home/historial')} />
			{#if is_admin}
				<SidebarElement
					href="/home/modificar"
					buttonName="Catálogo"
					icon="mdi--tune-variant"
					active={page.url.pathname.startsWith('/home/modificar')} />
				<SidebarElement
					href="/home/configurar"
					buttonName="Usuarios"
					icon="mdi--account-cog-outline"
					active={page.url.pathname.startsWith('/home/configurar')} />
			{/if}
		</nav>

		<button
			type="button"
			onclick={cerrarSesion}
			class="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-teal-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
			aria-label="Cerrar sesión">
			<span class="iconify mdi--logout size-5" aria-hidden="true"></span>
			<span class="hidden sm:inline">Salir</span>
		</button>
	</div>
</header>
