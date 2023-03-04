<script lang="ts">
	import { SpeechSettings, SpeechStore } from '../lib/store';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { speechCommand } from '$lib/execute';

	const isSpeechStarted = SpeechStore.isStarted;
	const context = SpeechStore.currentContext;
	const command = SpeechStore.currentCommand;

	onMount(() => {
		if (browser) {
			SpeechSettings.init();
		}
	});
</script>

{#if $isSpeechStarted}
	<button on:click={SpeechSettings.stop}>Stop Talk2Svelte</button>
{:else}
	<button on:click={SpeechSettings.start}>Start Talk2Svelte</button>
{/if}
<nav>
	<a href="/" use:speechCommand={'menu/home'}>Home</a>
	<a href="/about" use:speechCommand={'menu/about'}>About</a>
</nav>

<slot />

<p>Context: {$context}</p>
<p>Command: {$command}</p>
