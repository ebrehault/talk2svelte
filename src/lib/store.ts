import { BehaviorSubject, debounceTime, Subject } from 'rxjs';

let recognition: any;
let lang = 'en-US';
const DEFAULT_GRAMMAR = `#JSGF V1.0; grammar Digits;
public <Digits> = ( <digit> ) + ;
<digit> = ( zero | one | two | three | four | five | six | seven | eight | nine );`;
const commands: { [context: string]: boolean } = {};
const refreshGrammar = new Subject<void>();
const _isStarted = new BehaviorSubject(false);
const _message = new BehaviorSubject<Message>({ message: '' });
const _context = new BehaviorSubject<string>('');
const _command = new BehaviorSubject<string>('');

export const SpeechStore = {
	isStarted: _isStarted.asObservable(),
	message: _message.asObservable(),
	currentContext: _context.asObservable(),
	currentCommand: _command.asObservable()
};

interface Message {
	error?: boolean;
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
		let msg: Message = { message: '' };
		let word = '';
		if (event.results) {
			const result = event.results[event.resultIndex];
			if (result.isFinal) {
				if (result[0].confidence < 0.3) {
					msg = { error: true, message: 'Cannot recognize' };
				} else {
					word = result[0].transcript.trim().toLowerCase();
					msg = { success: true, message: word };
				}
			}
		}
		_message.next(msg);
		if (!msg.error) {
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
					}
				}
			}
		}
	};

	recognition.onerror = (error: any) => {
		console.log('Error', error);
		_message.next({ error: true });
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
	setLang: (newLang: string) => (lang = newLang),
	start: () => recognition.start(),
	stop: () => recognition.stop(),
	init,
	declareCommand,
	removeCommand
};
