<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Footer from '../lib/components/Footer.svelte';
	let { children } = $props();
</script>

{@render children()}
{#if page.url.pathname === '/home' || page.url.pathname.startsWith('/home/')}
	<Footer />
{/if}
