<script>
	import Button from '../components/button.svelte';
	import Icon from '../components/icon.svelte';

	let counter = 0;
	function click() {
		counter++;
	}
</script>

<h1>Talk2Svelte</h1>

<p>
	Talk2Svelte is a library integrating the <a
		href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition"
		target="_new">SpeechRecognition API</a
	> in Svelte.
</p>
<p>It allows to interact with a web application using voice commands.</p>

<h2>Start the demo</h2>
<p>
	To enable speech recognition, you first have to click on the greyed <Icon icon="microphone" /> icon
	at the top of the page.
</p>
<p>
	If the SpeechRecognition API is supported on your navigator, you will be prompted to accept the
	usage of your microphone and the icon will turn black.
</p>
<p>
	Note: make sure to be in a relatively quite environment or the demo might be relatively
	disappointing.
</p>

<h2>Let's voice-click this button!</h2>
<p>Here is a button:</p>
<p>
	<Button on:click={click} command="click">Counter: {counter}</Button>
</p>
<p>
	You can click on the button to increase the counter, but you can obtain the same result by saying
	"Click".
</p>

<h2>More examples?</h2>
<p>Just go to the <i>Examples</i> section in the top navigation menu.</p>
<p>Hey, but wait a minute… Why should you click on the actual menu entry? That's boring!</p>
<p>Just say "Menu", and then "Examples"</p>
