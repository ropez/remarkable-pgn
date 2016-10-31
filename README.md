# Remarkable plugin for parsing and displaying Chess games

This plugin is basically a Javascript implementation of the Chessboard
generator found on this page:
http://pgn4web-board.casaschi.net/board-generator.html

It extends markdown with PGN syntax, and inserts an `<iframe>` showing the
Chess game, including variations, commends, annotations etc.

Installation:

```
    npm install --save remarkable remarkable-pgn
```

Usage:

```javascript
import Remarkable from 'remarkable';
import RemarkablePGN from 'remarkable-pgn';


const remarkable = new Remarkable();

remarkable.use(RemarkablePGN, { /* options */ });
```

PGN syntax:

```markdown
# This is markdown

Include a PGN directly in the markdown text like this:

[PGN]
[Event "Chess Tournament"]
[Site "Chess Club"]
[Date "2016.01.01"]
[Round "1"]
[White "White Player"]
[Black "Black Player"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 
[/PGN]
```
