<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		columna: string;
		items: string[];
		showDropdown: boolean;
		onSelectItem: (item: string) => void;
	}

	let { columna, items, showDropdown = $bindable(), onSelectItem }: Props = $props();
	let dropdownElement: HTMLElement;

	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!dropdownElement.contains(event.target as Node)) showDropdown = false;
		}

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<div
	class="relative z-20 my-auto flex h-fit w-full flex-row rounded-lg bg-inherit"
	bind:this={dropdownElement}>
	<button
		type="button"
		class="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold uppercase tracking-wide text-teal-900 transition hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
		aria-expanded={showDropdown}
		onclick={() => (showDropdown = !showDropdown)}>
		{columna}
		<span class="iconify mdi--chevron-down size-4" aria-hidden="true"></span>
	</button>
	{#if showDropdown}
		<div
			class="absolute left-0 top-full mt-1 flex max-h-60 min-w-44 flex-col overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 text-left shadow-lg">
			{#each items as item}
				<button
					type="button"
					class="px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-teal-50 hover:text-teal-950"
					aria-label={item}
					onclick={() => {
						showDropdown = false;
						onSelectItem(item);
					}}>{item}</button>
			{/each}
		</div>
	{/if}
</div>
