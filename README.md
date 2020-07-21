# KeySentryJS #

<blockquote style="background-color: yellow; color: red;">

**WARNING: This library is not yet feature complete, in fact it as of yet does not even work. A proof of concept has already been tested and it will work once fully implemented however right now the code needs to be written. The documentation for what the library will do is subject to change and feedback/feature requests are welcome.**

</blockquote>

Allows you to capture and respond to keyboard presses and sequences without browser features stealing them. If you've tried to set up keyboard based Easter Eggs on websites before (like the Konami Code), you're probably aware that most browsers have features like "TypeAheadFind" or "QuickFind" that intercepts your keyboard shortcuts and prevents your web application from receiving them.

KeySentryJS is the answer. It allows you to block some or even all of the keyboard events that the browser attempts to intercept so that your page can intercept them. You can even define your own shortcuts and sequences and assign them custom events that your web app can respond to.

It also allows you to somewhat selectively intercept and pass through different kinds of combinations. Check out the features and examples below:

## Konami Code ##

Capture someone typing in the Konami Code in Arrow Keys, A, B, and Enter

```javascript
var kb = new Keyboard();
window.addEventListener('konami', function () {
  // Easter Egg!
});
```

## Custom Event for Custom Sequence ##

Create a custom event for a custom sequence

```javascript
var kb = new Keyboard();
kb.registerSequence([UP, DOWN, LEFT, RIGHT, A, START], 'levelSelect');
window.addEventListener('levelSelect', function () {
  console.log('SONIC THE HEDGEHOG!');
});
```

## Make a Custom Shortcut ##

```javascript
var kb = new Keyboard({disableTAF: true, disableSC: true});

kb.onKey('Ctrl+Alt+S', function() {
  doc.save();
});
```

------------------

# Documentation #

## Classes ##

### Input ###

#### Description ####

This is the base class for both the `KeyboardInput` and `Sequence` classes and contains the shared code between them. The methods that are part of an `'input'` is described below.

------------------

```javascript
constructor(
  eventName: str,
  element: DOMElement,
  logging: bool
)
```

Shared constructor called by subclasses to initialize the shared functionality. The event object is created, the event name is saved, the element is normalized to an array of DOMElements and saved, and the logging is turned on or off depending on the last parameter.

Options:

`eventName`: The name of the event that the subclass will fire.

`element`: The element that will receive the event (defaults to document).

`logging`: Whether the subclass should log to `console.log()`.

------------------

```javascript
obj.assignPredicate(predicate: func(Event) -> bool)
```

Description: When a subclass of this class is created using the `on*` methods in `Keyboard`, the function that was created to set up the event handler needs to be specified to the method that removes it from the `element`. This method is called in those methods to save the `predicate` into the object so that it can be used later for removal if requested.

`predicate`: An event handler function that returns a bool and receives a DOM `Event` object which will handle the event.

------------------

```javascript
obj.enableLogging()
```

Description: Will cause events from objects of the subclass to be logged to the console.

------------------

```javascript
obj.disableLogging()
```

Description: Will cause events from objects of the subclass to no longer log to the console.

------------------

```javascript
obj.deregister()
```

Description: Causes the subclass to remove the event handler it set up if the predicate is defined. Otherwise it does nothing. This method is mainly for the use of the `Keyboard` class's deregister for events registered with the `Keybord` class's `on*` methods.

------------------

```javascript
obj.processKeyboardEvent(event: Event)
```

Default implementation forcing subclasses to redefine the method. Called when the `keydown` event is received by `window`. This prevents direct use of the `Input` class as well as preventing subclasses failing to implement this method. The event is ignored in the default implementation.

------------------

### Keyboard ###

#### Description ####

The Keyboard class is the interface to the entire library. It allows you to set up sequences, create ad hoc event handlers, remove event handlers and sequences, set up shortcuts, and remove them. Each method is described below. See the code for more details if a question is not answered by the documentation (and consider dropping me a note so I can add that detail to the documentation).

------------------

```javascript
constructor( options: dict )
```

Description: Initializes a Keyboard object and installs the event filter. By default, it will disable TypeAheadFind, but leave keyboard shortcuts and refresh enabled.

Options:

`disableTAF`: When `true`, disables the TypeAheadFind feature of most browsers. This will prevent the find bar from appearing when users type in printable characters. Otherwise, allows for TypeAheadFind

`disableSC`: When `true`, disables all shortcut keys (Ctrl+A, Ctrl+S, etc). Only set this if you intend to define your own keyboard shortcuts in a web app. If `false`, it will keep shortcuts enabled including Ctrl+R and Ctrl+Shift+R

`disableRefresh`: When `true`, disables Ctrl+R and Ctrl+Shift+R to refresh the page. Your script can still force a refresh by doing `location.refresh()`

>Note: You do not have to disable the konami code event if you don't want to use it, it fires off an event which by default, nothing responds to.

------------------

```javascript
obj.enableLogging()
```

Description: Will cause events from the library to be logged to the console. Sequences are logged by recursing through the sequences and turning on logging for them.

------------------

```javascript
obj.disableLogging()
```

Description: Disables logging of all events from the library.

------------------

```javascript
obj.registerSequence(
  sequence: array[str],
  eventName: str,
  element: DOMObject = document
)
```

Description: Registers a new sequence to spawn an event whenever the sequence is performed. The element is the element that will be sent the event when the sequence is detected.

Parameters:

`sequence`: A list of `key`'s from the built-in `KeyboardEvent` class. Constants exist which allow one to use more intuitive names for the keys for this array.

`eventName`: A string name for the event. I recommend a lowercase named event prefixed with a unique name followed by a dot. E.g. `'easter.egg'`.

`element`: Default: `document`. The element that should receive the event triggered by this character sequence. If you want the event to fire globally, you can leave this value as its default.

------------------

```javascript
obj.onSequence(
  sequence: array[str],
  predicate: function(event)
)
```

Description: Create and install an event handler for a specified sequence. Basically, when a user types in that sequence, the predicate will be triggered.

`sequence`: A list of `key`'s from the built-in `KeyboardEvent` class. Constants exist which allow one to use more intuitive names for the keys for this array.

`predicate`: A function or lamba that will be called when the sequence is triggered by the user.

------------------

```javascript
obj.registerKey(
  keyDesc: str,
  eventName: str,
  element: DOMObject = document
)
```

Description: Sets a Key or Key combination to trigger a certain event.

`keyDesc`: This can be a single character or key, or a key combination seperated by '+', '-', or Spaces. E.g. `'+'`, `'Ctrl-Alt-D'`, `'Esc'`

`eventName`: This is the name of the event that will be fired if the key is pressed.

`element`: Default: `document`. The element that should receive the event triggered by this character sequence. If you want the event to fire globally, you can leave this value as its default.

------------------

```javascript
obj.onKey(
  keyDesc: str,
  predicate: function(event: KeyboardEvent)
)
```

Description: Create and install an event handler for a specified key or key combination. When the user types that key or key combination, the predicate will be triggered.

`keyDesc`: This can be a single character or key, or a key combination seperated by '+', '-', or Spaces. E.g. `'+'`, `'Ctrl-Alt-D'`, `'Esc'`

`predicate`: A function or lamba that will be called when the key or combo is triggered by the user.

------------------

```javascript
Keyboard.stringifyArray(arr: array[any])
```

*static*

Description: Replaces all items in array `arr` with the results of their `toString()` method.

`arr`: The array to modify.

> Note: This method does not return the array, it modifies it in place.

------------------

```javascript
Keyboard.describe(event: KeyboardEvent) -> str
```

*static*

Description: Transforms a keyboard event into a string describing the shortcut or key.

`event`: The KeyboardEvent object to be described as a human readable string.

Returns: a string description of the key. For example, if you press "Ctrl+Alt+Delete", you will get a description of `'Ctrl+Alt+Del'`

------------------

```javascript
Keyboard.parseShortcut(shortcut: str) -> KeyboardEvent
```

*static*

Description: Parses a description passed in the shortcut parameter into a KeyboardEvent object that reflects the key combination. Can be used for comparisons.

`shortcut`: A string description of the key or key combination.

Returns: a KeyboardEvent with an event of `'keydown'` with the various flags set for the key and modifiers.

Note: "Manually firing these events do _not_ generate the default action associated with that event... This is important for security reasons, as it prevents scripts from simulating user actions that interact with the browser itself." - From [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent "KeyboardEvent Javascript Documentation").

------------------

```javascript
Keyboard.compKeyEvents(
  event1: KeyboardEvent,
  event2: KeyboardEvent
) -> bool
```

*static*

Description: This static function assumes that both event objects are keyboard events and compares them. If they both have the same `event.key` value and reflect the same combination of supported modifier keys pressed (Ctrl, Meta, Shift, & Alt) then the two are equivalent and the method returns `true`, otherwise it returns `false`.

`event1` && `event2`: The two event objects to compare.

Returns: `true` or `false`

------------------

### Sequence ###

```javascript
constructor(
  sequence: array[str],
  eventName: str,
  element: DOMObject,
  logging: bool
)
```

Description: Constructs a new `Sequence` object corresponding to the array of key codes in `sequence`. When this sequence of keys is pressed, the event `eventName` is dispatched to the `element` which defaults to `document`. If `logging` is `true`, then the object will log any method calls on it to the console. it defaults however to false.

`sequence`: An array of key codes which are just strings. The proper key codes are reflected in the table in the "Constants" section. Single digit numbers in the array will be automatically converted to strings in the internal representation. This allows for, as an example: 

```javascript
var seq = new Sequence([4, 1, 2, 6], "sonicCheat");
```

> **Note: Any number which is greater than a single digit will break the ability of the sequence to match up to keyboard events. This does not cause an exception of any kind, it just simply won't work for now. This may be changed in the future.**

`eventName`: The name of the event to dispatch when the sequence is matched.

`element`: The DOM Element to dispatch the message to for more directed messages.

`logging`: Whether or not the object should log events and method calls for debugging purposes.

------------------

```javascript
obj.enableLogging()
```

Description: Enables logging on the object. When any events or method calls are made, the object will emit a message to `console.log()`.

------------------

```javascript
obj.disableLogging()
```

Description: Disables logging on the object causing it to be silent to the console log.

------------------

```javascript
obj.processKeyboardEvent(
  event: KeyboardEvent
)
```

Description: Processes the event in `event`. If `event.key` matches the next character and none of the modifier keys are pressed, then the internal counter is incremented. Once this is determined, it then determines if the counter is equal to the length indicating that the correct combination has been fully inputted and emits the event assigned at the constructor. Otherwise, it resets the counter to 0 indicating that the combination has to be inputted from the beginning.

`event`: The KeyboardEvent to check against the sequence.

------------------

### KeyboardInput ###

```javascript
constructor(
  keyDesc: str,
  eventName: str,
  element: DOMElement,
  logging: bool
)
```

Description: Constructs a new KeyboardInput object. When the key or key combination (chord) is pressed by the user as described in `keyDesc`, the event `eventName` will be dispatched to the `element` (which by default is `document`). If `logging` is `true`, then initialization, events, and method calls will all be logged to `console.log()`, otherwise the object will be silent.

`keyDesc`: This is the same kind of Key Description processed by `Keyboard.parseShortcut()`. The constructor in fact uses that static method internally to process the keyDesc into an event it can then compare to the `keydown` event to determine if the key matches.

`eventName`: The event that should be emitted if the key or key combination is pressed.

`element`: The element that should receive the event. By default this is `document`.

`logging`: Whether or not the object should log to the console for debugging purposes; `false` by default.

------------------

```javascript
obj.enableLogging()
```

Description: Enables logging on the object. When any events or method calls are made, the object will emit a message to `console.log()`.

------------------

```javascript
obj.disableLogging()
```

Description: Disables logging on the object causing it to be silent to the console log.

------------------

```javascript
obj.processKeyboardEvent(
  event: KeyboardEvent
)
```

Description: Compare the incoming KeyboardEvent `event` with the processed `keyDesc` from the constructor and if matching, emit the event `eventName` in the constructor to the `element` in the constructor.

`event`: The keyboard event to evaluate.

------------------

## Constants ##

|    Constant Name | String Value  | |    Constant Name | String Value    | |    Constant Name | String Value   |
|-----------------:|---------------|-|-----------------:|-----------------|-|-----------------:|----------------|
|           `A` =  | `'A'`         | |           `B` =  | `'B'`           | |           `C` =  | `'C'`          |
|           `D` =  | `'D'`         | |           `E` =  | `'E'`           | |           `F` =  | `'F'`          |
|           `G` =  | `'G'`         | |           `H` =  | `'H'`           | |           `I` =  | `'I'`          |
|           `J` =  | `'J'`         | |           `K` =  | `'K'`           | |           `L` =  | `'L'`          |
|           `M` =  | `'M'`         | |           `N` =  | `'N'`           | |           `O` =  | `'O'`          |
|           `P` =  | `'P'`         | |           `Q` =  | `'Q'`           | |           `R` =  | `'R'`          |
|           `S` =  | `'S'`         | |           `T` =  | `'T'`           | |           `U` =  | `'U'`          |
|           `V` =  | `'V'`         | |           `W` =  | `'W'`           | |           `X` =  | `'X'`          |
|           `Y` =  | `'Y'`         | |           `Z` =  | `'Z'`           | |          `UP` =  | `'ARROWUP'`    |
|        `DOWN` =  | `'ARROWDOWN'` | |        `LEFT` =  | `'ARROWLEFT'`   | |       `RIGHT` =  | `'ARROWRIGHT'` |
|       `START` =  | `'ENTER'`     | |       `ENTER` =  | `'ENTER'`       | |      `SELECT` =  | `' '`          |
|       `SPACE` =  | `' '`         | |          `F1` =  | `'F1'`          | |          `F2` =  | `'F2'`         |
|          `F3` =  | `'F3'`        | |          `F4` =  | `'F4'`          | |          `F5` =  | `'F5'`         |
|          `F6` =  | `'F6'`        | |          `F7` =  | `'F7'`          | |          `F8` =  | `'F8'`         |
|          `F9` =  | `'F9'`        | |         `F10` =  | `'F10'`         | |         `F11` =  | `'F11'`        |
|         `F12` =  | `'F12'`       | |        `CTRL` =  | `'CONTROL'`     | |         `ALT` =  | `'ALT'`        |
|        `META` =  | `'META'`      | |       `SHIFT` =  | `'SHIFT'`       | |         `ESC` =  | `'ESCAPE'`     |
|         `TAB` =  | `'TAB'`       | |        `HOME` =  | `'HOME'`        | |      `PGDOWN` =  | `'PAGEDOWN'`   |
|        `PGUP` =  | `'PAGEUP'`    | |   `BACKSPACE` =  | `'BACKSPACE'`   | |      `INSERT` =  | `'INSERT'`     |
|      `DELETE` =  | `'DELETE'`    | |        `MENU` =  | `'CONTEXTMENU'` | |        `PLUS` =  | `'+'`          |
|        `DASH` =  | `'-'`         | |       `TILDE` =  | `'~'`           | |    `BACKTICK` =  | ``'`'``        |
|        `BANG` =  | `'!'`         | |          `AT` =  | `'@'`           | |    `ASPERAND` =  | `'@'`          |
|       `CARET` =  | `'^'`         | |       `POUND` =  | `'#'`           | |        `HASH` =  | `'#'`          |
|  `UNDERSCORE` =  | `'_'`         | |      `DOLLAR` =  | `'$'`           | |       `SIGIL` =  | `'$'`          |
|   `EQUALSIGN` =  | `'='`         | |     `PERCENT` =  | `'%'`           | |      `MODULO` =  | `'%'`          |
|        `PIPE` =  | `'\|'`        | |         `AND` =  | `'&'`           | |   `AMPERSAND` =  | `'&'`          |
|   `SEMICOLON` =  | `';'`         | |    `ASTERISK` =  | `'*'`           | |        `STAR` =  | `'*'`          |
|       `COLON` =  | `':'`         | |      `LPAREN` =  | `'('`           | |      `RPAREN` =  | `')'`          |
|       `COMMA` =  | `','`         | | `LCURLYBRACE` =  | `'{'`           | | `RCURLYBRACE` =  | `'}'`          |
|    `QUESTION` =  | `'?'`         | |    `LBRACKET` =  | `'['`           | |    `RBRACKET` =  | `']'`          |
| `DOUBLEQUOTE` =  | `'"'`         | |    `LESSTHAN` =  | `'<'`           | | `GREATERTHAN` =  | `'>'`          |
|       `QUOTE` =  | `"'"`         | |      `LANGLE` =  | `'<'`           | |      `RANGLE` =  | `'>'`          |
|      `PERIOD` =  | `'.'`         | |         `DOT` =  | `'.'`           | |        `ZERO` =  | `'0'`          |
|         `ONE` =  | `'1'`         | |         `TWO` =  | `'2'`           | |       `THREE` =  | `'3'`          |
|        `FOUR` =  | `'4'`         | |        `FIVE` =  | `'5'`           | |         `SIX` =  | `'6'`          |
|       `SEVEN` =  | `'7'`         | |       `EIGHT` =  | `'8'`           | |        `NINE` =  | `'9'`          |
|   `BACKSLASH` =  | `'\'`         | |       `SLASH` =  | `'/'`           | |                  |                |

The constants above are used for the "sequences" to make them look more natural. Individual digits can be put in place and the `Sequence` Constructor will automatically transform them into the proper string values.

------------------
