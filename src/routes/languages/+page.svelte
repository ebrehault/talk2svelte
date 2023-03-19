<script lang="ts">
	import { speak } from '$lib';
	import { speechCommand } from '$lib/execute';
	import { SpeechSettings } from '$lib/store';
	import { onMount } from 'svelte';

	let lang = '';
	let showDuck = false;
	let refreshed = false;

	const languages: { [key: string]: { code: string; label: string; word: string; help: string } } =
		{
			'en-GB': { code: 'en-GB', label: 'British English', word: 'duck', help: 'Say "duck"' },
			'fr-CA': { code: 'fr-CA', label: 'French', word: 'canard', help: 'Dites "canard"' },
			'it-IT': { code: 'it-IT', label: 'Italian', word: 'pattino', help: 'Dici "pattino"' },
			'ja-JP': { code: 'ja-JP', label: 'Japanese', word: 'カモ', help: "'カモ' 言う" },
			'es-ES': { code: 'es-ES', label: 'Spanish', word: 'pato', help: 'Diga "pato"' }
		};

	onMount(() => {
		lang = 'en-GB';
		setLang();
	});
	function setLang() {
		refreshed = false;
		showDuck = false;
		setTimeout(() => {
			SpeechSettings.setLang(lang);
			refreshed = true;
		}, 200);
	}
	function restore() {
		lang = 'en-US';
		SpeechSettings.setLang('en-US');
	}
	function help() {
		speak(languages[lang].word);
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
		{#each Object.values(languages) as { code, label }}
			<option value={code}>{label}</option>
		{/each}
	</select>
</div>
<div>
	{#if refreshed}
		<button use:speechCommand={languages[lang].word} on:click={() => (showDuck = true)}
			>{languages[lang].help}</button
		>
	{/if}
</div>

{#if showDuck}
	<div class="duck">🦆</div>
{/if}

<div>You don't know how to pronounce it? <button on:click={help}>Let me help</button></div>

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
