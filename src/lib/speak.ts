import { take } from 'rxjs';
import { SpeechStore } from './store';

export const speak = (text: string, lang?: string) => {
	SpeechStore.lang.pipe(take(1)).subscribe((defaultLang) => {
		if (window.speechSynthesis) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.rate = 1;
			utterance.lang = lang || defaultLang;
			window.speechSynthesis.speak(utterance);
		}
	});
};
