<script lang="ts">
	interface Props {
		buttonName: string;
		icon: string;
		href?: string;
		onclick?: () => void;
		active?: boolean;
	}

	let { buttonName, icon, href, onclick, active = false }: Props = $props();
	const classes = $derived(
		`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
			active ? 'bg-teal-50 text-teal-950' : 'text-slate-600 hover:bg-slate-100 hover:text-teal-950'
		}`
	);
</script>

{#if href}
	<a {href} class={classes} aria-current={active ? 'page' : undefined}>
		{@render contenido()}
	</a>
{:else}
	<button type="button" {onclick} class={classes}>
		{@render contenido()}
	</button>
{/if}

{#snippet contenido()}
	<span class={'iconify size-5 shrink-0 ' + icon} aria-hidden="true"></span>
	<span>{buttonName}</span>
{/snippet}
