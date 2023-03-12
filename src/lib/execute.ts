import { filter } from 'rxjs';
import { SpeechStore, SpeechSettings } from '../lib/store';

export function speechCommand(node: Node, params: string | { command: string; event: string }) {
	const command = typeof params === 'string' ? params : params.command;
	const event = typeof params === 'string' ? 'click' : params.event;
	if (!command) {
		return;
	}
	SpeechSettings.declareCommand(command);
	const subscription = SpeechStore.currentCommand
		.pipe(filter((c) => c === command))
		.subscribe(() => {
			if ((node as any)[event]) {
				(node as any)[event]();
			} else {
				node.dispatchEvent(new Event(event));
			}
		});
	return {
		destroy() {
			SpeechSettings.removeCommand(command);
			subscription.unsubscribe();
		}
	};
}
