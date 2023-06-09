# Talk2Svelte

This library provides voice recognition and voice synthesis for Svelte.

It uses the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).

Check the [demo](https://talk2svelte.vercel.app/)!

## Why?

- Accessibility matters, and voice recognition is a great way to make your app more accessible in many contexts (e.g. if you have difficulties with your hands and/or fingers, if you are driving, etc.).
- Websites are primarily used on smartphones, and although we tend to forget this for years, phones were originally designed to be used by voice (yes, for real, and in fact, phone comes from the Greek phōnē "sound, voice").
- Web Speech API is fun!

More seriously about accessibility: obviously voice recognition may be not accessible in many contexts, e.g. if you are mute, if you have difficulties with pronunciation in a given language (I am French, I know what I am talking about), if you are in a noisy environment, etc. Remember there is no one-fit-all solution to make your website accessible, and voice recognition is not a replacement for other accessibility features, but it is a great addition to them.

## What does it do?

Usual interactions like clicking on buttons or links or filling in text inputs can be done by speaking to the browser.

Moreover, your app can speak to the user.

## Usage

### Install

```bash
npm install talk2svelte
```

### Initialize / start / stop

To use Talk2Svelte, you need to initialize it with `SpeechSettings.init()`.

Then you can start and stop the recognition with `SpeechSettings.start()` and `SpeechSettings.stop()`.:

```js
import { SpeechSettings } from 'talk2svelte';
import { onMount } from 'svelte';
import { browser } from '$app/environment';

onMount(() => {
  if (browser) {
    SpeechSettings.init();
  }
});

start() {
  SpeechSettings.start();
}

stop() {
  SpeechSettings.stop();
}
```

### Click on links or buttons

To associate a speech command to the `click` event of any HTML element, you need to use the `speechCommand directive:

```html
<script>
  import { speechCommand } from 'talk2svelte';
  function doLogin() {...}
</script>

<button use:speechCommand={'login'} on:click={doLogin}>Say "login"</button>
```

By doing `use:speechCommand="login"`, you are telling Talk2Svelte to listen for the command "login" and to trigger the `click` event on the button when the command is recognized.

It works the same with links:

```html
<a use:speechCommand="about" href="/about">About this project</a>
```

The default event is `click`, but you can trigger a different one like this:

```html
<button use:speechCommand={ command: 'expand', event: 'mouseover'} on:mouseover={ doExpand }>Say "expand"</button>
```

### Define contexts

Since commands are easier to use if they are short, it is possible that there will be overlaps between the different commands declared in your application.

To avoid that, you can use contexts. A context is declared by prefixing the command. In this example, you need to say "menu" first, then "home" or "about":

```html
<nav>
	<a use:speechCommand="menu/home" href="/">Home</a>
	<a use:speechCommand="menu/about" href="/about">About this project</a>
</nav>
```

If you want to render visually the context, so users are aware of what they are doing, you can set a class on the element corresponding to the context:

```html
<script>
  import { SpeechStore, speechCommand } from 'talk2svelte';
  const context = SpeechStore.currentContext;
</script>
<nav class:is-context={$context === 'menu'}>
  <a use:speechCommand="menu/home" href="/">Home</a>
  <a use:speechCommand="menu/about" href="/about">About this project</a>
</nav>
<style>
.is-context {
	border: 2px dashed blue;
}
</style>
```

### Fill in text inputs

The `SpeechStore` provides commands but also the full message recognized by the browser. You can use it to fill in text inputs:

```html
<script>
	import { SpeechSettings, SpeechStore } from 'talk2svelte';
	import { filter } from 'rxjs';
	import { onMount } from 'svelte';

	let inputValue = '';
	let recording = false;

	onMount(() => {
		SpeechSettings.declareCommand('record');
		SpeechSettings.declareCommand('stop');
		const subscriptions = [
			SpeechStore.currentCommand.pipe(filter((command) => command === 'record')).subscribe(() => {
				inputValue = '';
				recording = true;
			}),
			SpeechStore.currentCommand.pipe(filter((command) => command === 'stop')).subscribe(() => {
				recording = false;
			}),
			SpeechStore.message
				.pipe(filter(() => recording === true))
				.subscribe((message) => (inputValue = message))
		];
		return () => {
			SpeechSettings.removeCommand('record');
			SpeechSettings.removeCommand('stop');
			subscriptions.map((sub) => sub.unsubscribe());
		};
	});
</script>
<textarea>{inputValue}</textarea>
```

Note: as you do not want the browser to fill in the text input with whatever the user is saying, you need to declare the commands "record" and "stop" to start and stop the recording.
Declaring commands programmatically can be done with `SpeechSettings.declareCommand()`. And when the component is unmounted, you need to remove the commands with `SpeechSettings.removeCommand()` to make sure we do not interfere with commands declared in next pages.

### Speak

You can make your app speak with `speak.speak()`:

```js
import { speak } from 'talk2svelte';
speak.speak('Hello world!');
```

### Set the language

By default, the language is set to `en-US`. You can change it with `SpeechSettings.setLang`:

```js
SpeechSettings.setLang('fr-FR');
```

## Caveats

- The Web Speech API is not supported by all browsers, it is not supported by Firefox or Edge. Also on non-Chrome Chromium based browsers, the speech recognition might not work as expected (for example on Brave).

- If you get an error like `ReferenceError: window is not defined`, it means you are trying to use Talk2Svelte in a server-side rendered app. Talk2Svelte is not compatible with SSR. You must check you are in a browser environment before initializing Talk2Svelte (as shown in the example above).

- On some mobiles, it seems the speech recognition service stops unexpectedly. Speak2Svelte restarts it automatically, but it can be annoying because the phone will do a small notification sound everytime. If you have a solution to this problem, please let me know!
