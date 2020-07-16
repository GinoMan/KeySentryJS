# KeySentryJS

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

### Keyboard ###

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

### Sequence ###

```javascript
constructor(
  sequence: array[str],
  eventName: str,
  element: DOMObject
)
```

------------------

```javascript
enableLogging()
```

------------------

```javascript
disableLogging()
```

------------------

```javascript
processKeyboardEvent(
  event: KeyboardEvent
)
```

------------------

## Constants ##

| Constant Name | String Value  | |  Constant Name | String Value    | | Constant Name | String Value   |
|--------------:|---------------|-|---------------:|-----------------|-|--------------:|----------------|
|        `A` =  | `'A'`         | |         `B` =  | `'B'`           | |        `C` =  | `'C'`          |
|        `D` =  | `'D'`         | |         `E` =  | `'E'`           | |        `F` =  | `'F'`          |
|        `G` =  | `'G'`         | |         `H` =  | `'H'`           | |        `I` =  | `'I'`          |
|        `J` =  | `'J'`         | |         `K` =  | `'K'`           | |        `L` =  | `'L'`          |
|        `M` =  | `'M'`         | |         `N` =  | `'N'`           | |        `O` =  | `'O'`          |
|        `P` =  | `'P'`         | |         `Q` =  | `'Q'`           | |        `R` =  | `'R'`          |
|        `S` =  | `'S'`         | |         `T` =  | `'T'`           | |        `U` =  | `'U'`          |
|        `V` =  | `'V'`         | |         `W` =  | `'W'`           | |        `X` =  | `'X'`          |
|        `Y` =  | `'Y'`         | |         `Z` =  | `'Z'`           | |       `UP` =  | `'ARROWUP'`    |
|     `DOWN` =  | `'ARROWDOWN'` | |      `LEFT` =  | `'ARROWLEFT'`   | |    `RIGHT` =  | `'ARROWRIGHT'` |
|    `START` =  | `'ENTER'`     | |     `ENTER` =  | `'ENTER'`       | |   `SELECT` =  | `' '`          |
|    `SPACE` =  | `' '`         | |        `F1` =  | `'F1'`          | |       `F2` =  | `'F2'`         |
|       `F3` =  | `'F3'`        | |        `F4` =  | `'F4'`          | |       `F5` =  | `'F5'`         |
|       `F6` =  | `'F6'`        | |        `F7` =  | `'F7'`          | |       `F8` =  | `'F8'`         |
|       `F9` =  | `'F9'`        | |       `F10` =  | `'F10'`         | |      `F11` =  | `'F11'`        |
|      `F12` =  | `'F12'`       | |      `CTRL` =  | `'CONTROL'`     | |      `ALT` =  | `'ALT'`        |
|     `META` =  | `'META'`      | |     `SHIFT` =  | `'SHIFT'`       | |      `ESC` =  | `'ESCAPE'`     |
|      `TAB` =  | `'TAB'`       | |      `HOME` =  | `'HOME'`        | |   `PGDOWN` =  | `'PAGEDOWN'`   |
|     `PGUP` =  | `'PAGEUP'`    | | `BACKSPACE` =  | `'BACKSPACE'`   | |   `INSERT` =  | `'INSERT'`     |
|   `DELETE` =  | `'DELETE'`    | |      `MENU` =  | `'CONTEXTMENU'` | |     `PLUS` =  | `'+'`          |
|               |               | |     `DASH` =  | `'-'`            | |               |                |

The constants above are used for the "sequences" to make them look more natural. Individual digits can be put in place and the `Sequence` Constructor will automatically transform them into the proper string values.

------------------
