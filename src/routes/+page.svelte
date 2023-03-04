<script>
	import { speechCommand } from '$lib/execute';

	let clicked = false;
	function click() {
		clicked = true;
	}
</script>

<h1>Welcome to your library project</h1>

{#if !clicked}
	<button on:click={click} use:speechCommand={'click'}>Say "Click"</button>
{/if}
{#if clicked}
	<p>Clicked!</p>
{/if}
