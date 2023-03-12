<script lang="ts">
	import { speechCommand } from '$lib/execute';
	import { SpeechSettings, SpeechStore } from '$lib/store';
	import { filter, skipUntil, takeUntil, tap } from 'rxjs';
	import { onMount } from 'svelte';

	let origin = '';
	let destination = '';
	let inputValue = '';
	let recording = false;
	let currentRow = 1;
	let currentCol = 1;
	const context = SpeechStore.currentContext;

	function up() {
		if (currentRow > 1) {
			currentRow--;
		}
	}
	function down() {
		if (currentRow < 4) {
			currentRow++;
		}
	}
	function left() {
		if (currentCol > 1) {
			currentCol--;
		}
	}
	function right() {
		if (currentCol < 4) {
			currentCol++;
		}
	}

	onMount(() => {
		SpeechSettings.declareCommand('record');
		SpeechSettings.declareCommand('stop');
		const subscription = SpeechStore.message
			.pipe(
				skipUntil(
					SpeechStore.currentCommand.pipe(
						filter((command) => command === 'record'),
						tap(() => (recording = true))
					)
				),
				takeUntil(
					SpeechStore.currentCommand.pipe(
						filter((command) => command === 'stop'),
						tap(() => (recording = false))
					)
				)
			)
			.subscribe((message) => (inputValue = message));
		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<h1>Examples</h1>

<h2>Click on buttons</h2>

<p>
	Move the selected cell by saying
	<button use:speechCommand={'up'} on:click={up}>Up</button>,
	<button use:speechCommand={'down'} on:click={down}>Down</button>,
	<button use:speechCommand={'left'} on:click={left}>Left</button>, or
	<button use:speechCommand={'right'} on:click={right}>Right</button>.
</p>
<table>
	{#each [1, 2, 3, 4] as row}
		<tr>
			{#each [1, 2, 3, 4] as col}
				<td class:selected={row === currentRow && col === currentCol} />
			{/each}
		</tr>
	{/each}
</table>

<h2>Define contexts</h2>
<p>
	In the following example, the 2 lists contain the same list of cities, but by saying "origin" or
	"destination" before saying the city name, you set the proper context.
</p>
<div class="container">
	<div class:is-context={$context === 'origin'}>
		<div>Origin</div>
		<ul>
			<li
				use:speechCommand={'origin/mexico'}
				on:click={() => (origin = 'Mexico')}
				class:selected={origin === 'Mexico'}
			>
				Mexico
			</li>
			<li
				use:speechCommand={'origin/paris'}
				on:click={() => (origin = 'Paris')}
				class:selected={origin === 'Paris'}
			>
				Paris
			</li>
			<li
				use:speechCommand={'origin/berlin'}
				on:click={() => (origin = 'Berlin')}
				class:selected={origin === 'Berlin'}
			>
				Berlin
			</li>
		</ul>
	</div>
	<div class:is-context={$context === 'destination'}>
		<div>Destination</div>
		<ul>
			<li
				use:speechCommand={'destination/mexico'}
				on:click={() => (destination = 'Mexico')}
				class:selected={destination === 'Mexico'}
			>
				Mexico
			</li>
			<li
				use:speechCommand={'destination/paris'}
				on:click={() => (destination = 'Paris')}
				class:selected={destination === 'Paris'}
			>
				Paris
			</li>
			<li
				use:speechCommand={'destination/berlin'}
				on:click={() => (destination = 'Berlin')}
				class:selected={destination === 'Berlin'}
			>
				Berlin
			</li>
		</ul>
	</div>
</div>

<h2>Free-text input</h2>
<p>You can also use Talk2Svelte to fill in a text input.</p>
<p>Say "record" to start entering text in this input, then say "stop" when you are done.</p>
<div class="textarea-container" class:is-context={recording}>
	{#if recording}
		<div>Recording…</div>
	{/if}
	<textarea>{inputValue}</textarea>
</div>

<style>
	.selected {
		background-color: var(--color-accent-primary-default);
	}
	.container {
		display: flex;
		flex-direction: row;
	}
	.container > div {
		width: 50%;
		padding: 1em;
	}
	.textarea-container {
		padding: 1em;
	}
	textarea {
		width: 100%;
		height: 100px;
	}
	td {
		padding: 1em;
		border: 1px solid var(--color-accent-primary-default);
	}
</style>
