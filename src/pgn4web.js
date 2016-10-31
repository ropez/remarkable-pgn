// Javascript implementation of
// http://pgn4web-board.casaschi.net/board-generator.html

import qs from 'querystring'
import EncodePGN from './pgn-encoder'

export const PIECESIZE_DEFAULT = 'default'

export const AUTOPLAY_MODE_GAME = 'g'
export const AUTOPLAY_MODE_LOOP = 'l'
export const AUTOPLAY_MODE_NONE = 'n'

export const PIECE_FONT_DEFAULT = 'd'
export const PIECE_FONT_ALPHA   = 'a'
export const PIECE_FONT_MERIDA  = 'm'
export const PIECE_FONT_USCF    = 'u'
export const PIECE_FONT_RANDOM  = 'r'

export const HIGHLIGHT_BORDER   = 'b'
export const HIGHLIGHT_SQUARE   = 's'
export const HIGHLIGHT_NONE     = 'n'

export const BUTTONSDISPLAY_HIDDEN    = 'h'
export const BUTTONSDISPLAY_STANDARD  = 's'
export const BUTTONSDISPLAY_CUSTOM    = 'c'

export const HEADERDISPLAY_CENTERED   = 'c'
export const HEADERDISPLAY_JUSTIFIED  = 'j'
export const HEADERDISPLAY_HIDDEN     = 'h'
export const HEADERDISPLAY_LIVE       = 'l'
export const HEADERDISPLAY_VARIATIONS = 'v'

export const MOVESDISPLAY_FIGURINE    = 'f'
export const MOVESDISPLAY_TEXT        = 't'
export const MOVESDISPLAY_PUZZLE      = 'p'
export const MOVESDISPLAY_HIDDEN      = 'h'

export const COMMENTSDISPLAY_INLINE   = 'i'
export const COMMENTSDISPLAY_NEWLINE  = 'n'
export const COMMENTSDISPLAY_HIDDEN   = 'h'

const defaults = {
  autoplayMode: AUTOPLAY_MODE_GAME,
  delay: 3000,
  initialGame: null,
  initialVariation: null,
  initialHalfmove: null,
  squareSize: 50,
  pieceSize: PIECESIZE_DEFAULT,
  pieceFont: PIECE_FONT_DEFAULT,
  lightColor: 'E8E8E8',
  darkColor: 'C2C9D1',
  boardBorderColor: 'C2C9D1',
  boardShadowColor: 'C2C9D1',
  backgroundColor: 'E8E8E8',
  highlightMode: HIGHLIGHT_BORDER,
  highlightColor: '7496AD',
  buttonsDisplay: BUTTONSDISPLAY_CUSTOM,
  controlBackgroundColor: 'D3DAE3',
  controlTextColor: '585B5E',
  headerDisplay: HEADERDISPLAY_JUSTIFIED,
  movesDisplay: MOVESDISPLAY_FIGURINE,
  textMargin: 25,
  fontHeaderColor: '000000',
  fontHeaderSize: 19,
  fontMovesColor: '000000',
  fontCommentsColor: '808080',
  fontVariationsColor: null,  // default: fontCommentsColor
  highlightMoveColor: 'C7FFFF',
  fontMovesSize: 19,
  fontCommentsSize: null,  // default: fontMovesSize
  fontVariationsSize: null, // default: fontCommentsSize
  commentsDisplay: COMMENTSDISPLAY_INLINE,
  framePadding: 25,
  horizontal: true,
  frameHeight: 'b',  // TODO implement
  frameWidth: 'p',  // TODO implement
}

var sexEncodingCharSet = "$0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";

const hex2sex = (hex) => {
  var sex = "";
  var dec = parseInt(hex, 16);
  while (dec>0) {
    sex = sexEncodingCharSet.charAt(dec % 64) + sex;
    dec >>= 6;
  }
  while (sex.length < 4) {
    sex = sexEncodingCharSet.charAt(0) + sex;
  }
  return sex;
}

const percentFixForUrl = (text) => (
  (text + '').replace(/%$/,'p')
)

export const generate = (pgn, options = {}) => {
  var cfg = {...defaults, ...options};
  var boardWidth = 8 * cfg.squareSize + 6;
  var boardHeight = boardWidth;

  var multiGamesRegexp = /\s*\[\s*\w+\s*"[^"]*"\s*\]\s*[^\s\[\]]+[\s\S]*\[\s*\w+\s*"[^"]*"\s*\]\s*/m;
  var selectDropdownShown = multiGamesRegexp.test(pgn);

  if (cfg.buttonsDisplay != BUTTONSDISPLAY_HIDDEN) {
    if (cfg.buttonsDisplay == BUTTONSDISPLAY_STANDARD) {
      // in this case control padding grows with squareSize
      // while the size of the controls cant be predicted, so a safe number is set
      boardHeight += selectDropdownShown ?
        2 * (25 + cfg.squareSize / 2) :
        25 + cfg.squareSize / 2;
    } else {
      // in this case both control size and control padding grow with squareSize
      boardHeight += selectDropdownShown ?
        2 * (5 + 1.1 * cfg.squareSize) :
        5 + 1.1 * cfg.squareSize;
    }
  }
  boardHeight = Math.floor(boardHeight);

  let frameWidth = boardWidth + 2 * cfg.framePadding;
  let frameHeight = boardHeight + 2 * cfg.framePadding;

  // XXX
  frameWidth = '100%';

  let query = qs.stringify({
    am: cfg.autoplayMode,
    d: cfg.delay,
    ig: cfg.initialGame,
    iv: cfg.initialVariation,
    ih: cfg.initialHalfmove,
    ss: cfg.squareSize,
    ps: (cfg.pieceSize == PIECESIZE_DEFAULT) ? 'd' : cfg.pieceSize,
    pf: cfg.pieceFont,
    lcs: hex2sex(cfg.lightColor),
    dcs: hex2sex(cfg.darkColor),
    bbcs: hex2sex(cfg.boardBorderColor),
    bscs: cfg.boardShadowColor && hex2sex(cfg.boardShadowColor),
    hm: cfg.highlightMode,
    hcs: hex2sex(cfg.highlightColor),
    bd: cfg.buttonsDisplay,
    cbcs: hex2sex(cfg.controlBackgroundColor),
    ctcs: hex2sex(cfg.controlTextColor),
    hd: cfg.headerDisplay,
    md: cfg.movesDisplay,
    tm: cfg.textMargin,
    fhcs: hex2sex(cfg.fontHeaderColor),
    fhs: percentFixForUrl(cfg.fontHeaderSize),
    fmcs: hex2sex(cfg.fontMovesColor),
    fccs: hex2sex(cfg.fontCommentsColor),
    fvcs: cfg.fontVariationsColor && hex2sex(cfg.fontVariationsColor),
    hmcs: hex2sex(cfg.highlightMoveColor),
    fms: percentFixForUrl(cfg.fontMovesSize),
    fcs: cfg.fontCommentsSize && percentFixForUrl(cfg.fontCommentsSize),
    fvs: cfg.fontVariationsSize && percentFixForUrl(cfg.fontVariationsSize),
    cd: cfg.commentsDisplay,
    bcs: cfg.backgroundColor ? hex2sex(cfg.backgroundColor) : 't',
    fp: cfg.framePadding,
    hl: cfg.horizontal ? 't' : 'f',
    pe: EncodePGN(pgn),
  })

  let url = `http://pgn4web-board.casaschi.net/?${query}`

  return {
    frameHeight, frameWidth, url
  }
}
