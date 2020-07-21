/*
Keyboard Input System Override

Features: 
- [Future] Process joypad inputs as well?
- Redirect all keyboard actions to an element
*/

/*
Interface ideas!

keyboard.redirect($('#console'));
/// Redirect all keyboard events to this control while blocking default behavior
*/

const UP = 'ARROWUP'; const DOWN = 'ARROWDOWN'; const LEFT = 'ARROWLEFT'; const RIGHT = 'ARROWRIGHT';
const START = 'ENTER'; const ENTER = 'ENTER';
const SPACE = ' '; const SELECT = ' ';
const A = 'A'; const B = 'B'; const C = 'C'; const D = 'D'; const E = 'E'; const F = 'F'; const G = 'G'; const H = 'H'; const I = 'I'; const J = 'J'; const K = 'K'; const L = 'L'; const M = 'M'; const N = 'N'; const O = 'O'; const P = 'P'; const Q = 'Q'; const R = 'R'; const S = 'S'; const T = 'T'; const U = 'U'; const V = 'V'; const W = 'W'; const X = 'X'; const Y = 'Y'; const Z = 'Z';
const F1 = 'F1'; const F2 = 'F2'; const F3 = 'F3'; const F4 = 'F4'; const F5 = 'F5'; const F6 = 'F6'; const F7 = 'F7'; const F8 = 'F8'; const F9 = 'F9'; const F10 = 'F10'; const F11 = 'F11'; const F12 = 'F12';
const CTRL = 'CONTROL'; const ALT = 'ALT'; const META = 'META'; const SHIFT = 'SHIFT'; const MENU = 'CONTEXTMENU';
const BACKSPACE = 'BACKSPACE'; const ESC = 'ESCAPE'; const TAB = 'TAB';
const END = 'END'; const HOME = 'HOME'; const PGDOWN = 'PAGEDOWN'; const PGUP = 'PAGEUP'; const INSERT = 'INSERT'; const DELETE = 'DELETE';
const PLUS = '+'; const DASH = '-'; const TILDE = '~'; const BACKTICK = '`';
const BANG = '!'; const CARET = '^'; const UNDERSCORE = '_';
const EQUALSIGN = '='; const PIPE = '|'; const COMMA = ','; const QUESTION = '?';
const SEMICOLON = ';'; const COLON = ':';
const DOUBLEQUOTE = '"'; const QUOTE = '\'';
const AT = '@'; const ASPERAND = '@';
const POUND = '#'; const HASH = '#';
const DOLLAR = '$'; const SIGIL = '$';
const PERCENT = '%'; const MODULO = '%';
const AND = '&'; const AMPERSAND = '&';
const ASTERISK = '*'; const STAR = '*';
const LPAREN = '('; const RPAREN = ')';
const LCURLYBRACE = '{'; const RCURLYBRACE = '}';
const LBRACKET = '['; const RBRACKET = ']';
const LESSTHAN = '<'; const GREATERTHAN = '>';
const LANGLE = '<'; const RANGLE = '>';
const PERIOD = '.'; const DOT = '.';
const ZERO = '0'; const ONE = '1'; const TWO = '2'; const THREE = '3'; const FOUR = '4'; const FIVE = '5'; const SIX = '6'; const SEVEN = '7'; const EIGHT = '8'; const NINE = '9';
const BACKSLASH = '\\'; const SLASH = '/';

// TODO: List this in the documentation when the feature for it is implemented.
const KeyType = {
	Up: 'UP',
	Down: 'DOWN'
};

class Input {
	constructor(eventName, element = document, logging = false) {
		this.logging = logging;
		if (element.jquery) {
			if (this.logging) { console.log('JQuery element passed'); }
			var el = element.get();
			if (typeof(el) != typeof([])) {
				el = [ el ];
			}
			 this.element = el; // get dom element if a jquery element is passed.
		}
		else if (typeof (element) == typeof ([])) {
			if (this.logging) { console.log('Array of elements passed'); }
			 this.element = element;
		}
		else {
			if (this.logging) { console.log('Single Element passed'); }
			 this.element = [ element ];
		}
		this.eventName = eventName;
		if (this.logging) { console.log('Event Named: ' + eventName); }
		this.event = new Event(this.eventName);
		if (this.logging) { console.log('Input Constructor Finished.'); }
	}

	assignPredicate(predicate) {
		this.predicate = predicate;
		if (this.logging) { console.log('Predicate assigned.'); }
	}

	enableLogging() {
		this.logging = true;
		if (this.logging) { console.log('Enabling logging'); }
	}

	disableLogging() {
		if (this.logging) { console.log('Disabling logging'); }
		this.logging = false;
	}

	deregister() {
		if (this.logging) { console.log('Deregister called'); }
		if ('predicate' in this) {
			if (this.logging) { console.log('Predicate found.'); }
			this.element.forEach(function (item) {
				if (this.logging) { console.log('removing listeners'); }
				item.removeEventListener(this.eventName, this.predicate);
			});
		}
	}

	// TODO: Add this method to the documentation.
	dispatchEvent(eventToEval, element) {
		if (eventToEval.type == 'keydown') {
			this.event.repeat = eventToEval.repeat;
			this.event.state = KeyType.Down;
			element.dispatchEvent(this.event);
		}
		else if (eventToEval.type == 'keyup') {
			this.event.state = KeyType.Up;
			element.dispatchEvent(this.event);
		}
	}

	processKeyboardEvent(event) {
		throw "Not Implemented!";
	}
}

// TODO: Consider changing the names of Sequence, KeyboardInput, and their parent: Input.
// TODO: Use Keyboard's static methods to make sure that key descriptions are consistent in deregister comparisons
// TODO: Refactor documentation so that methods in subclasses refer to the superclass.
// TODO: Add a feature to track whether the event is a keydown or keyup event.
// TODO: Add the ability to determine if a key is being held
// TODO: Add logging to all methods and classes.
class KeyboardInput extends Input {
	constructor(keyDesc, eventName, element = document, logging = false) {
		super(eventName, element, logging);
		
		this.keyDesc = keyDesc;
		this.keyboardEvent = Keyboard.parseShortcut(this.keyDesc);
		this.key = this.keyboardEvent.key;
		this.shiftKey = this.keyboardEvent.shiftKey;
		this.ctrlKey = this.keyboardEvent.ctrlKey;
		this.altKey = this.keyboardEvent.ctrlKey;
		this.metaKey = this.keyboardEvent.metaKey;
		
		if (this.logging) { console.log('Keyboard Shortcut Created: ' + keyDesc); }
	}

	processKeyboardEvent(event) {
		if (this.logging) { console.log('Processing Keyboard Event for ' + this.keyDesc + '.'); }
		if (Keyboard.compKeyEvents(event, this)) {
			this.element.forEach(function (item) { 
				this.dispatchEvent(event, item); 
			});
		}
	}
}

class Sequence extends Input {
	constructor(sequence, eventName, element = document, logging = false) {
		super(eventName, element, logging);

		this.sequence = Keyboard.stringifyArray(sequence); // renders numbers safe
		this.index = 0;

		if (this.isLogging) {
			console.log('Sequence ' + this.sequence.toString() + ' initialized for event ' + this.eventName + '.');
		}
	}

	processKeyboardEvent(event) {
		if (this.sequence[this.index] == event.key.toUpperCase()) {
			if (this.logging) { console.log('Sequence Success: ' + event.key.toUpperCase() + '.'); }
			this.index++;
		}
		else {
			if (this.logging) { console.log('Sequence Reset. ' + event.key.toUpperCase() + ' is not ' + this.sequence[this.index] + '.'); }
			this.index = 0; // reset if the sequence isn't followed.
		}

		if (this.index >= this.sequence.length) {
			if (this.logging) { console.log('Triggering Event; sequence complete! ' + this.sequence); }
			this.element.forEach(function (item) {
				this.dispatchEvent(event, item);
			});
			this.index = 0;
		}
	}
}

class Keyboard {
	constructor(options = {}) {
		this.events = [];
		this.logging = ("logging" in options ? options.logging : false);
		this.disableTAF = ("disableTAF" in options ? options.disableTAF : true);
		this.disableSC = ("disableSC" in options ? options.disableSC : false);
		this.disableRefresh = ("disableRefresh" in options ? options.disableRefresh : false);

		// override the keyboard handler with our custom handler
		window.onkeydown = event => {
			var events = this.events;
			var logging = this.logging;
			var disableTAF = this.disableTAF;
			var disableSC = this.disableSC;
			var disableRefresh = this.disableRefresh;

			if (!disableRefresh && event.key.toUpperCase() == 'R' && event.ctrlKey) {
				if (logging) { console.log('refreshing page'); }
				location.refresh(event.shiftKey);
				return true;
			}
			else if (!disableSC && (event.ctrlKey || event.altKey || event.metaKey)) {
				if (logging) { console.log('keyboard shortcut passing through'); }
				return true;
			}
			else if (!disableTAF) {
				if (logging) { console.log('TypeAheadFind not disabled'); }
				return true;
			}
			else {
				// check key against event handlers and dispatch event if necessary
				events.forEach(function (item) {
					item.processKeyboardEvent(event);
				});
				if (logging) { console.log('Key Events processed by Keyboard class'); }
				return false;
			}
		};

		window.onkeyup = event => {
			var events = this.events;
			var logging = this.logging;
			var disableTAF = this.disableTAF;
			var disableSC = this.disableSC;
			var disableRefresh = this.disableRefresh;

			if (logging) { console.log('Key Up event'); }
			events.forEach(function (item) {
				item.processKeyboardEvent(event);
			});
		};
	}

	enableLogging() {
		if (!this.logging) {
			this.events.forEach(function (item, index, arr) {
				arr[index].enableLogging();
			});
		}
		this.logging = true;
		if (this.logging) { console.log('Enabling logging globally'); }
	}

	disableLogging() {
		if (this.logging) { 
			console.log('Disabling logging globally'); 
			this.events.forEach(function (item, index, arr){
				arr[index].disableLogging();
			});
		}
		this.logging = false;
	}

	registerSequence(sequence, eventName, element = document) {
		if (this.logging) { console.log('Registering Sequence: ' + sequence + '; for event ' + eventName); }
		this.events += new Sequence(sequence, eventName, element, this.logging);
	}

	onSequence(sequence, predicate) {
		var eventName = "internal_event_" + Math.round(Date.now() + (Math.random() * 123123123123123)).toString();
		if (this.logging) { console.log('Event named: ' + eventName); }
		var seq = new Sequence(sequence, eventName);
		seq.assignPredicate(predicate);
		this.events += seq;
		if (this.logging) { console.log('Adding Event Listener to Document'); }
		document.addEventListener(eventName, predicate);
	}

	deRegisterSequence(sequence) {
		this.events.forEach(function (item, index, arr) {
			if (typeof(item) == typeof(Sequence) && sequence == item.sequence) {
				if (this.logging) { console.log('Deregistering Sequence ' + item.sequence); }
				item.deregister();
				arr.splice(index, 1);
			}
		});
	}

	deRegisterKey(keyDesc) {
		this.events.forEach(function (item, index, arr) {
			if (typeof (item) == typeof (KeyboardInput) && keyDesc == item.keyDesc) {
				if (this.logging) { console.log('Deregistering Key ' + item.keyDesc); }
				item.deregister();
				arr.splice(index, 1);
			}
		});
	}

	registerKey(keyDesc, eventName, element = document) {
		if (this.logging) { console.log('Registering Key: ' + keyDesc + '; for event ' + eventName); }
		this.events += new KeyboardInput(keyDesc, eventName, element, this.logging);
	}

	onKey(keyDesc, predicate) {
		var eventName = "internal_key_event_" + Math.round(Date.now() + (Math.random() * 123123123123123)).toString();
		if (this.logging) { console.log('Event named: ' + eventName); }
		var input = new KeyboardInput(keyDesc, eventName);
		input.assignPredicate(predicate);
		this.events += input;
		if (this.logging) { console.log('Adding Event Listener To Document'); }
		document.addEventListener(eventName, predicate);
	}

	static stringifyArray(arr) {
		arr.forEach(function (item, index, array) {
			array[index] = item.toString();
		});
	}

	static describe(event) {
		var keyCode = event.key.toUpperCase();
		if (['CONTROL', 'ALT', 'META', 'SHIFT'].includes(keyCode)) {
			if (this.logging) { console.log('Modifier Key: ' + keyCode); }
			return keyCode;
		}
		var str = (event.ctrlKey ? 'Ctrl+' : '') +
			(event.altKey ? 'Alt+' : '') +
			(event.shiftKey ? 'Shift+' : '') +
			(event.metaKey ? 'Meta+' : '') +
			(event.key == ' ' ? 'Space' : event.key.toUpperCase());
		if (this.logging) { console.log('Key Combo: ' + str); }
		return str;
	}

	static parseShortcut(shortcut) {
		var dict = {};
		dict.ctrlKey = false;
		dict.altKey = false;
		dict.shiftKey = false;
		dict.metaKey = false;
		dict.key = '';
		
		var safeShortcut = shortcut;
		
		safeShortcut = safeShortcut.replace('- ', '-SPACE');
		safeShortcut = safeShortcut.replace('+ ', '+SPACE');
		safeShortcut = safeShortcut.replace('+-', '+DASH');
		safeShortcut = safeShortcut.replace('-+', '-PLUS');
		safeShortcut = safeShortcut.replace('--', '-DASH');
		safeShortcut = safeShortcut.replace('++', '+PLUS');
		
		safeShortcut = safeShortcut.replace('-', '+');
		safeShortcut = safeShortcut.replace(' ', '+');
		
		var keys = safeShortcut.split('+');
		
		const control = ['CONTROL', 'CTRL', 'CON'];
		const alt = ['ALT', 'ALTGR', 'ALTERNATE', 'LALT', 'LEFTALT'];
		const shift = ['SHIFT', 'SH'];
		const meta = ['META', 'CMD', 'COMMAND', 'WIN', 'WINDOWS'];

		keys.forEach(function (item, index, arr) {
			// undoes the above parsing
			arr[index] = item.replace('PLUS', '+');
			arr[index] = item.replace('DASH', '-');
			arr[index] = item.replace('SPACE', ' ');

			// parses shortcut into keyboard event
			if (control.includes(item.toUpperCase())) {
				dict.ctrlKey = true;
			}
			else if (alt.includes(item.toUpperCase())) {
				dict.altKey = true;
			}
			else if (shift.includes(item.toUpperCase())) {
				dict.shiftKey = true;
			}
			else if (meta.includes(item.toUpperCase())) {
				dict.metaKey = true;
			}
			else {
				// TODO: use similar array membership method as above to parse spaces, tabs, directions, etc.
				dict.key = item.toUpperCase();
			}
		});
		
		var event = KeyboardEvent('keydown', dict);
		return event;
	}

	static compKeyEvents(event1, event2) {
		var isEqual = (
			event1.key == event2.key &&
			event1.ctrlKey == event2.ctrlKey &&
			event1.shiftKey == event2.shiftKey &&
			event1.altKey == event2.altKey &&
			event1.metaKey == event2.metaKey
		);
		if (this.logging) { console.log('Events ' + Keyboard.describe(event1) + ' & ' + Keyboard.describe(event2) + ' are ' + (isEqual ? 'equal' : 'not equal') + '.'); }
		return isEqual;
	}
}
