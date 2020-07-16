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

const UP 	= 'ARROWUP';
const DOWN 	= 'ARROWDOWN';
const LEFT 	= 'ARROWLEFT';
const RIGHT = 'ARROWRIGHT';
const START = 'ENTER';
const ENTER = 'ENTER';
const A = 'A';
const B = 'B';
const C = 'C';
const D = 'D';
const E = 'E';
const F = 'F';
const G = 'G';
const H = 'H';
const I = 'I';
const J = 'J';
const K = 'K';
const L = 'L';
const M = 'M';
const N = 'N';
const O = 'O';
const P = 'P';
const Q = 'Q';
const R = 'R';
const S = 'S';
const T = 'T';
const U = 'U';
const V = 'V';
const W = 'W';
const X = 'X';
const Y = 'Y';
const Z = 'Z';
const SPACE = ' ';
const F1 = 'F1';
const F2 = 'F2';
const F3 = 'F3';
const F4 = 'F4';
const F5 = 'F5';
const F6 = 'F6';
const F7 = 'F7';
const F8 = 'F8';
const F9 = 'F9';
const F10 = 'F10';
const F11 = 'F11';
const F12 = 'F12';
const CTRL = 'CONTROL';
const ALT = 'ALT';
const META = 'META';
const SHIFT = 'SHIFT';
const SELECT = ' ';
const ESC = 'ESCAPE';
const TAB = 'TAB';
const END = 'END';
const HOME = 'HOME';
const PGDOWN = 'PAGEDOWN';
const PGUP = 'PAGEUP';
const BACKSPACE = 'BACKSPACE';
const INSERT = 'INSERT';
const DELETE = 'DELETE';
const MENU = 'CONTEXTMENU';
const PLUS = '+';
const DASH = '-';


class Sequence {
	constructor(sequence, eventName, element = document) {
		if (element.jquery) {
			this.element = element.get(); // get dom element if a jquery element is passed.
		}
		else if (typeof(element) == typeof([])) {
			this.element = element;
		}
		else {
			this.element = [ element ];
		}

		this.sequence = sequence;
		this.eventName = eventName;
		this.index = 0;
		this.event = new Event(eventName);
		this.isLogging = false;
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
		
		// override the keyboard handler with our custom handler

	}

	registerSequence(sequence, eventName, element = document) {
		this.events += new Sequence(sequence, eventName, element);
	}

	onSequence(sequence, predicate) {
		
	}

	registerKey(keyDesc, eventName, element = document) {

	}

	onKey(keyDesc, predicate) {

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
		var event = KeyboardEvent('keydown');
		event.ctrlKey = false;
		event.altKey = false;
		event.shiftKey = false;
		event.metaKey = false;
		event.key = '';
		
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
			arr[index] = item.replace('PLUS', '+');
			arr[index] = item.replace('DASH', '-');
			arr[index] = item.replace('SPACE', ' ');

			if (control.includes(item.toUpperCase())) {
				event.ctrlKey = true;
			}
			else if (alt.includes(item.toUpperCase())) {
				event.altKey = true;
			}
			else if (shift.includes(item.toUpperCase())) {
				event.shiftKey = true;
			}
			else if (meta.includes(item.toUpperCase())) {
				event.metaKey = true;
			}
			else {
				event.key = item.toUpperCase();
			}
		});

		return event;
	}
}
