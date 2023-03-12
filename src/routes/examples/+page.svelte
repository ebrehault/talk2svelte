<script lang="ts">
	import { speechCommand } from '$lib/execute';
	import { SpeechStore } from '$lib/store';

	let origin = '';
	let destination = '';
	const context = SpeechStore.currentContext;
</script>

<h1>Examples</h1>

<h2>Click on links or buttons</h2>
<p>
	To associate a speech command to the <code>click</code> event of any HTML element, you need to use
	the <code>speechCommand</code> directive:
</p>
<blockquote>
	<code>&lt;script&gt;</code><br />
	<code>&nbsp;&nbsp;import &#123; speechCommand } from 'talk2svelte';</code><br />
	<code>&nbsp;&nbsp;function doStart() &#123;…}</code><br />
	<code>&lt;/script&gt;</code><br />
	<code
		>&lt;button <strong>use:speechCommand="start"</strong> on:click=&#123;doStart()}&gt;Say "start"&lt;/button&gt;</code
	>
</blockquote>

<p>
	By doing <code>use:speechCommand="start"</code>, you are telling Talk2Svelte to listen for the
	command "start" and to trigger the <code>click</code> event on the button when the command is recognized.
</p>
<p>It works the same with links:</p>
<blockquote>
	<code
		>&lt;a <strong>use:speechCommand="about"</strong> href="/about"&gt;About this project&lt;/a&gt;</code
	>
</blockquote>
<p>The default event is <code>click</code>, but you can trigger a different one like this:</p>
<blockquote>
	<code
		>&lt;button <strong>use:speechCommand=&#123;command: 'start', event: 'mouseover'}</strong> on:click=&#123;doStart()}&gt;Say
		"start"&lt;/button&gt;</code
	>
</blockquote>

<h2>Define contexts</h2>
<p>
	Since commands are easier to use if they are short, it is possible that there will be overlaps
	between the different commands declared in your application.
</p>
<p>
	To avoid that, you can use contexts. Defining contexts allows to group some commands together.
</p>
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

<p>
	A context is declared by prefixing the command, like <code
		>use:speechCommand=&#123;destination/paris}</code
	> will declare "destination" as a context where "paris" is one of the possible commands.
</p>

<p>
	As you can see, the current context is highlighted. It is usually helpful to make the context
	visible. It can be achieve using <code>SpeechStore.currentContext</code>
</p>
<blockquote>
	<code>&lt;script&gt;</code><br />
	<code>&nbsp;&nbsp;import &#123; SpeechStore } from 'talk2svelte';</code><br />
	<code>&nbsp;&nbsp;const context = SpeechStore.currentContext;</code><br />
	<code>&lt;/script&gt;</code><br />
	<code>&lt;div class:is-context=&#123;$context === 'origin'}&gt;…&lt;/div&gt;</code>
</blockquote>

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
</style>
