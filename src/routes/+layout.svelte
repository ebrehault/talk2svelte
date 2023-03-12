<script lang="ts">
	import { SpeechSettings, SpeechStore } from '../lib/store';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { speechCommand } from '$lib/execute';
	import Icon from '../components/icon.svelte';
	import { page } from '$app/stores';

	const isSpeechStarted = SpeechStore.isStarted;
	const context = SpeechStore.currentContext;
	const command = SpeechStore.currentCommand;
	const error = SpeechStore.error;
	const lang = SpeechStore.lang;

	onMount(() => {
		if (browser) {
			SpeechSettings.init();
		}
	});
</script>

<div class="page">
	<header>
		{#if $isSpeechStarted}
			<Icon size="large" clickable icon="volume" on:click={SpeechSettings.stop} />
			<span>{$lang}</span>
		{:else}
			<Icon size="large" clickable icon="volume-off" on:click={SpeechSettings.start} />
		{/if}
		{#if $error}
			{#if $error === 'not_recognized'}
				<strong class="pa-chip">Sorry, I do not understand, could you repeat please?</strong>
			{:else}
				<span><strong class="pa-chip error">Error</strong> {$error}</span>
			{/if}
		{:else}
			<span class="pa-chip">Current context: {$context || '–'}</span>
			<span class="pa-chip"> Current command: {$command || '–'}</span>
		{/if}
		<nav class:is-context={$context === 'menu'}>
			<a href="/" use:speechCommand={'menu/home'} class:active={$page.url.pathname === '/'}>Home</a>
			<a
				href="/examples"
				use:speechCommand={'menu/examples'}
				class:active={$page.url.pathname === '/examples'}>Examples</a
			>
			<a href="/languages" use:speechCommand={'menu/languages'}>Languages</a>
			<a href="/about" use:speechCommand={'menu/about'}>About</a>
		</nav>
	</header>

	<slot />
</div>

<style>
	.page {
		margin: 0 2em 2em 2em;
	}
	.error {
		color: var(--color-neutral-primary-lightest);
		background-color: var(--color-accent-secondary-darker);
	}
	header {
		position: sticky;
		top: 0;
		margin: 2em 0;
		background-color: white;
	}
	nav a {
		display: inline-block;
		padding: 1em;
	}
	nav .active {
		font-weight: bold;
	}
</style>
