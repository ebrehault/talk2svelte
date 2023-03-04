<script lang="ts">
	import { speechCommand } from '$lib/execute';
</script>

<h1>About</h1>

<button use:speechCommand={'about'}>Say "About"</button>
