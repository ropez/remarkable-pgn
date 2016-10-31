import { generate } from './pgn4web';

const getLine = (state, line) => {
  var pos = state.bMarks[line] + state.blkIndent,
      max = state.eMarks[line];

  return state.src.substr(pos, max - pos);
}

const pgnRule = (state, startLine, endLine, checkMode) => {
  if (getLine(state, startLine) == '[PGN]') {
    let startPgn = startLine + 1;
    let nextLine = startPgn;
    while (nextLine < endLine) {
      if (getLine(state, nextLine) == '[/PGN]') {
        state.tokens.push({
          type: 'pgn',
          content: state.getLines(startPgn, nextLine, state.blkIndent, true),
          block: true,
          lines: [ startLine, nextLine ],
          level: state.level
        });
        state.line = nextLine + 1;
        return true;
      }
      nextLine ++;
    }
  }
  return false
}

const render_pgn4web = (tokens, idx, options) => {
  let { url, frameHeight, frameWidth } = generate(tokens[idx].content, options.pgn)
  return `<iframe
      height="${frameHeight}" width="${frameWidth}" src="${url}"
      scrolling='no' frameBorder='0'
      marginHeight='0' marginWidth='0'>
    Your web browser do not support iframes as required to display the chessboard
  </iframe>`
}

export default (md, options) => {
  md.set({pgn: options})
  md.block.ruler.before('code', 'pgn', pgnRule, {})
  md.renderer.rules.pgn = render_pgn4web
}
