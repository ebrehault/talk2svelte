<script lang="ts">
	import { speechCommand } from '$lib/execute';
	import { SpeechSettings } from '$lib/store';

	let lang = 'en-GB';
	let showDuck = false;

	function setLang() {
		SpeechSettings.setLang(lang);
		showDuck = false;
	}
	function restore() {
		lang = 'en-US';
		SpeechSettings.setLang('en-US');
	}
</script>

<h1>Languages</h1>
<p>
	Speak2Svelte supports many languages (the list mostly depends on your browser), by default it uses
	US English, but you can set a different language.
</p>
<div>
	<label for="lang">Language</label>
	<select id="lang" bind:value={lang} on:change={setLang}>
		<option value="en-GB">British English</option>
		<option value="fr-FR">French</option>
		<option value="it-IT">Italian</option>
		<option value="ja-JP">Japanese</option>
		<option value="es-ES">Spanish</option>
	</select>
</div>
<div>
	{#if lang === 'en-GB'}
		<button use:speechCommand={'duck'} on:click={() => (showDuck = true)}>Say "duck"</button>
	{/if}
	{#if lang === 'fr-FR'}
		<button use:speechCommand={'canard'} on:click={() => (showDuck = true)}>Dites "canard"</button>
	{/if}
	{#if lang === 'it-IT'}
		<button use:speechCommand={'pattino'} on:click={() => (showDuck = true)}>Dici "pattino"</button>
	{/if}
	{#if lang === 'ja-JP'}
		<button use:speechCommand={'カモ'} on:click={() => (showDuck = true)}>'カモ' 言う</button>
	{/if}
	{#if lang === 'es-ES'}
		<button use:speechCommand={'pato'} on:click={() => (showDuck = true)}>Diga "pato"</button>
	{/if}
</div>

{#if showDuck}
	<div class="duck">🦆</div>
{/if}

<div>
	Note: as the navigation menu expects <code>en-US</code> commands, it will not work if you have
	selected another language (well, I guess <code>en-GB</code> is close enough…), so you have to
	<a href="#" on:click={restore}>restore <code>en-US</code></a> if you want to use it by voice.
</div>

<style>
	.duck {
		font-size: 100px;
		line-height: 120px;
	}
	div {
		padding: 10px 0;
	}
</style>
