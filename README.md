# Talk2Svelte

This library provides voice recognition for Svelte.

It uses the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).

## Why?

- Accessibility matters, and voice recognition is a great way to make your app more accessible in many contexts (e.g. if you have difficulties with your hands and/or fingers, if you are driving, etc.).
- Websites are primarily used on smartphones, and although we tend to forget this for years, phones were originally designed to be used by voice (yes, for real, and in fact, phone comes from the Greek phōnē "sound, voice").
- Web Speech API is fun!

More seriously about accessibility: obviously voice recognition may be not accessible in many contexts, e.g. if you are mute, if you have difficulties with pronunciation (I am French, I know what I am talking about), if you are in a noisy environment, etc. Remember there is no one-fit-all solution to make your website accessible, and voice recognition is not a replacement for other accessibility features, but it is a great addition to them.

## What does it do?

Usual interactions like clicking on buttons or links or using form controls can be done by speaking to the browser.

## How does it work?

You define a list of commands, and the library will listen to the user's voice and execute the corresponding command.
A Svelte component allows to declare new commands, and they can be grouped into contexts (like the "menu" context will give access to the commands defined in the menu).
