<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { LayoutData } from './$types';

	interface Props {
		children: Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();
</script>

<div class="relative flex min-h-screen flex-col overflow-x-clip bg-[#f4f7f6]">
	<Sidebar is_admin={data.is_admin} />
	{@render children()}
</div>
