<script lang="ts">
	import { speechCommand } from '$lib/execute';

	export let size = 'medium'; // small, medium, large
	export let aspect = 'solid'; // solid or basic
	export let kind = 'secondary'; // primary, secondary, destructive
	export let active = false;
	export let disabled = false;
	export let type = 'button';
	export let command = '';
	let label: any;
</script>

<button
	class="pa-button pa-{size} pa-{kind} pa-{aspect}"
	class:pa-active={active}
	{type}
	aria-label={label ? label.textContent : ''}
	tabindex="0"
	{disabled}
	on:click
	use:speechCommand={command}
>
	<span tabindex="-1" class="pa-button-wrapper">
		<span class="pa-button-label" bind:this={label}><slot /></span>
	</span>
</button>
