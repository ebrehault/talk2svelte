import { take } from 'rxjs';
import { SpeechStore } from './store';

export const speak = (text: string, lang?: string) => {
	SpeechStore.lang.pipe(take(1)).subscribe((defaultLang) => {
		if (window.speechSynthesis) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.rate = 1;
			lang = lang || defaultLang;
			// fix weird default lang settings
			if (lang.split('-')[0] === 'en') {
				lang = 'en-GB';
			}
			if (lang.split('-')[0] === 'fr') {
				const voice = window.speechSynthesis
					.getVoices()
					.find((voice) => voice.voiceURI === 'Marie');
				if (voice) {
					utterance.voice = voice;
				}
			}
			utterance.lang = lang;
			window.speechSynthesis.speak(utterance);
		}
	});
};
