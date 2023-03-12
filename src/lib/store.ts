import { BehaviorSubject, debounceTime, map, Subject } from 'rxjs';

let recognition: any;
let lang = 'en-US';
const DEFAULT_GRAMMAR = `#JSGF V1.0;`;
const commands: { [context: string]: boolean } = {};
const refreshGrammar = new Subject<void>();
const _isStarted = new BehaviorSubject(false);
const _message = new BehaviorSubject<string>('');
const _error = new BehaviorSubject<Error>({ error: false, message: '' });
const _context = new BehaviorSubject<string>('');
const _command = new BehaviorSubject<string>('');
const _lang = new BehaviorSubject<string>(lang);

export const SpeechStore = {
	isStarted: _isStarted.asObservable(),
	message: _message.asObservable(),
	currentContext: _context.asObservable(),
	currentCommand: _command.asObservable(),
	error: _error.pipe(map((m) => (m.error ? m.message : ''))),
	lang: _lang.asObservable()
};

interface Error {
	error: boolean;
	message?: string;
}

const init = () => {
	const SpeechRecognition = window['SpeechRecognition'] || window['webkitSpeechRecognition'];
	recognition = new SpeechRecognition();
	recognition.lang = lang;
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;
	recognition.continuous = true;

	recognition.onresult = (event: any) => {
		let msg = '';
		let error: Error = { error: false, message: '' };
		let word = '';
		if (event.results) {
			const result = event.results[event.resultIndex];
			if (!result.isFinal) {
				_message.next(event.results.map((r: any) => r[0].transcript).join(' '));
			} else {
				if (result[0].confidence < 0.3) {
					error = { error: true, message: 'not_recognized' };
				} else {
					word = result[0].transcript.trim().toLowerCase();
					msg = word;
					error = { error: false };
				}
				if (!error.error) {
					const ctx = getContext(word);
					if (ctx) {
						_context.next(ctx);
						_command.next('');
					} else {
						const command = getCommand(word);
						if (command) {
							_command.next(command);
						} else {
							const globalCommand = getGlobalCommand(word);
							if (globalCommand) {
								_command.next(globalCommand);
								_context.next('');
							} else {
								_command.next('');
								_message.next(msg);
							}
						}
					}
				}
			}
		}
	};

	recognition.onerror = (error: any) => {
		console.error('Error', error);
		_error.next({
			error: true,
			message:
				error.error === 'network'
					? 'Your browser cannot use the SpeechRecognition API'
					: error.error
		});
	};
	recognition.onstart = () => {
		console.log('Voice recognition started');
		_isStarted.next(true);
		refreshGrammar.next();
	};
	recognition.onend = () => _isStarted.next(false);

	refreshGrammar.pipe(debounceTime(500)).subscribe(() => setGrammar());
};

function declareCommand(command: string): void {
	commands[command] = true;
	refreshGrammar.next();
}

function removeCommand(command: string): void {
	delete commands[command];
	refreshGrammar.next();
}

function setGrammar() {
	const SpeechGrammarList = window['SpeechGrammarList'] || window['webkitSpeechGrammarList'];
	if (!!SpeechGrammarList && !!recognition) {
		const words: { [word: string]: boolean } = {};
		Object.keys(commands).forEach((context) => {
			context.split('/').forEach((word) => {
				words[word] = true;
			});
		});
		const grammar =
			DEFAULT_GRAMMAR + ' public <command> = ' + Object.keys(words).join(' | ') + ' ;';
		const speechRecognitionList = new SpeechGrammarList();
		speechRecognitionList.addFromString(grammar, 1);
		recognition.grammars = speechRecognitionList;
		console.log('Grammar set', grammar);
	}
}

function getContext(word: string): string {
	const context = getContextualPath(word);
	const contextualMatch = Object.keys(commands).some((c) => c.startsWith(`${context}/}`));
	if (contextualMatch) {
		return context;
	} else {
		return Object.keys(commands).some((c) => c.startsWith(`${word}/`)) ? word : '';
	}
}

function getCommand(word: string): string | undefined {
	const command = getContextualPath(word);
	return Object.keys(commands).find((c) => c === command);
}

function getGlobalCommand(word: string): string | undefined {
	return Object.keys(commands).find((c) => c === word);
}

function getContextualPath(word: string): string {
	const currentContext = _context.getValue();
	return currentContext ? `${currentContext}/${word}` : `${word}`;
}

export const SpeechSettings = {
	setLang: (newLang: string) => {
		lang = newLang;
		recognition.stop();
		init();
		setTimeout(() => {
			recognition.start();
			_lang.next(lang);
		}, 500);
	},
	start: () => recognition.start(),
	stop: () => recognition.stop(),
	init,
	declareCommand,
	removeCommand
};
