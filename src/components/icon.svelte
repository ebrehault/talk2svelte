<script lang="ts">
	export let size = 'medium'; // small, medium, or large
	export let icon = '';
	export let clickable = false;
</script>

<pa-icon>
	<svg class="pa-{size}" class:clickable on:click>
		<use xlink:href="/pastanaga/icons.svg#{icon}" />
	</svg>
</pa-icon>

<style>
	.clickable {
		cursor: pointer;
	}
</style>
