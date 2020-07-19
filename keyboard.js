/*
Keyboard Input System Override

Features: 
- Automatically emits the Konami Code as an event
- Create Custom events for custom keyboard shortcuts or key sequences
- Turn keyboard events into descriptions that are human readable
- Block all/some/no inputs from keyboard to the browser
- [Future] Process joypad inputs as well?
- Redirect all keyboard actions to an element
*/

/*
Interface ideas!

var keyboard = new Keyboard({ disableTAF: true, disableSC: true, disableRefresh: false })

$(.logo).first().on('konami', function() {
	$_this.replace('<image class="logo" src="/easteregg.jpg" />');
});

keyboard.registerSequence([I, D, K, F, A], 'idkfa');
/// now, when the keyboard sequence IDKFA is inputted, the whole page gets the "idkfa" event.

keyboard.onSequence([I, D, K, F, A], function() {
	/// do stuff
});

keyboard.registerKey('Ctrl+Shift+I', 'csi');
/// when someone presses ctrl+shift+i, the whole document gets the csi event.

keyboard.onKey('Ctrl+Alt+Backspace', function () {
	location.reload(true);
})
/// Does a hard refresh on the page without caching upon the ctrl+alt+backspace key.

document.onkeydown = function (e) {
	var keyDesc = Keyboard.describe(e);
	console.log(keyDesc + ' key pressed!');
}

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

class KeyboardInput {
	constructor(keyDesc, eventName, element = document, logging = false) {
		this.keyboardEvent = Keyboard.parseShortcut(keyDesc);
		this.key = this.keyboardEvent.key;
		this.shiftKey = this.keyboardEvent.shiftKey;
		this.ctrlKey = this.keyboardEvent.ctrlKey;
		this.altKey = this.keyboardEvent.ctrlKey;
		this.metaKey = this.keyboardEvent.metaKey;
		this.eventName = eventName;
		this.logging = logging;

		if (element.jquery) {
			this.element = element.get(); // get dom element if a jquery element is passed.
		}
		else if (typeof(element) == typeof([])) {
			this.element = element;
		}
		else {
			this.element = [ element ];
		}
	}

	enableLogging() {
		this.logging = true;
	}

	disableLogging() {
		this.logging = false;
	}

	processKeyboardEvent(event) {
		if (event.key == this.key &&
			event.shiftKey == this.shiftKey &&
			event.ctrlKey == this.ctrlKey &&
			event.altKey == this.altKey &&
			event.metaKey == this.metaKey)
		{
			this.element.dispatchEvent(new Event(this.eventName));
		}
	}
}

class Sequence {
	constructor(sequence, eventName, element = document, logging = false) {
		if (element.jquery) {
			this.element = element.get(); // get dom element if a jquery element is passed.
		}
		else if (typeof(element) == typeof([])) {
			this.element = element;
		}
		else {
			this.element = [ element ];
		}

		this.sequence = Keyboard.stringifyArray(sequence);
		this.eventName = eventName;
		this.index = 0;
		this.event = new Event(eventName);
		this.isLogging = logging;
		if (this.isLogging) {
			console.log('Sequence ' + this.sequence.toString() + ' initialized for event ' + this.eventName + '.');
		}
	}

	enableLogging() {
		this.isLogging = true;
	}

	disableLogging() {
		this.isLogging = false;
	}

	processKeyboardEvent(event) {
		if (this.sequence[this.index] == event.key.toUpperCase()) {
			this.index++;
		}
		else {
			this.index = 0; // reset if the sequence isn't followed.
		}

		if (this.index >= this.sequence.length) {
			this.element.forEach(function (item) {
				item.dispatchEvent(this.event);
			});
		}
	}
}

class Keyboard {
	constructor(options = {}) {
		this.events = [];
		this.sequences = [];
		this.logging = ("logging" in options ? options.logging : false);
		this.disableTAF = ("disableTAF" in options ? options.disableTAF : true);
		this.disableSC = ("disableSC" in options ? options.disableSC : false);
		this.disableRefresh = ("disableRefresh" in options ? options.disableRefresh : false);

		// override the keyboard handler with our custom handler
		window.onkeydown = event => {
			// Custom handler here that responds to changes to the object.
			var events = this.events;
			var sequences = this.sequences;
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
				// send the key to all sequences
				sequences.forEach(function (item) {
					item.processKeyboardEvent(event);
				});
				if (logging) { console.log('Key Events processed by Keyboard class'); }
				return false;
			}
		};
	}

	registerSequence(sequence, eventName, element = document) {
		this.events += new Sequence(sequence, eventName, element, this.logging);
	}

	onSequence(sequence, predicate) {
		var eventName = "internal_event_" + (this.events.length + 10).toString();
		this.events += new Sequence(sequence, eventName);
		document.addEventListener(eventName, predicate);
	}

	registerKey(keyDesc, eventName, element = document) {
		this.keys += new KeyboardInput(keyDesc, eventName, element, this.logging);
	}

	onKey(keyDesc, predicate) {
		var eventName = "internal_key_event_" + keyDesc;
		this.keys += new KeyboardInput(keyDesc, eventName);
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
			return keyCode;
		}
		var str = (event.ctrlKey ? 'Ctrl+' : '') +
			(event.altKey ? 'Alt+' : '') +
			(event.shiftKey ? 'Shift+' : '') +
			(event.metaKey ? 'Meta+' : '') +
			(event.key == ' ' ? 'Space' : event.key.toUpperCase());
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
				dict.key = item.toUpperCase();
			}
		});
		
		var event = KeyboardEvent('keydown', dict);
		return event;
	}

	static compKeyEvents(event1, event2) {
		return (
			event1.key == event2.key &&
			event1.ctrlKey == event2.ctrlKey &&
			event1.shiftKey == event2.shiftKey &&
			event1.altKey == event2.altKey &&
			event1.metaKey == event2.metaKey
		);
	}
}
