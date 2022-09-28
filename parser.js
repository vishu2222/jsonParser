
// null parser
function nullParser (input) {
  if (input.startsWith('null')) {
    return [null, input.slice(4)]
  }
  return null
}

console.log('nullParser', nullParser('nullABC'))

// booleanParser
function booleanParser (input) {
  if (input.startsWith('true')) {
    return [true, input.slice(4)]
  }
  if (input.startsWith('false')) {
    return [false, input.slice(5)]
  }
  return null
}

console.log('booleanParser', booleanParser('trueABC'))

// number parser
function numberParser (input) {
  const numRegex = /^-?(([1-9]\d*)|0)(\.\d+)?((e|E)[+-]?\d+)?/
  const numOutput = input.match(numRegex)
  if (numOutput === null) {
    return null
  }
  return [Number(numOutput[0]), input.slice(numOutput[0].length)]
}

console.log('numberParser', numberParser('0x123'))

// string parser
function strParser (input) {
  let i = 0
  let str = ''
  const escapeCharacters = {
    '"': '\"',
    '\\': '\\',
    '/': '\/',
    'b': '/b',
    'f': '/f',
    'n': '\n',
    'r': '\r',
    't': '\t',
    'u':''
  }
  let char = input[i]
  if (char !== '"') {
    return null
  }
  while (input[i + 1] !== undefined) {
    i += 1
    char = input[i]
    if (char === '"') { // check for end of string?
      return [str, input.slice(i + 1)]
    }
    if (char === '\\') { // if back slash is encountered
      i += 1
      char = input[i]
      if (!escapeCharacters.hasOwnProperty(char)) {
        return null
      } else if (char !== 'u') {
        str += escapeCharacters[char]
      } else if (char === 'u') {
        const temp = input[i + 1] + input[i + 2] + input[i + 3] + input[i + 4]
        str += String.fromCharCode(parseInt(temp, 16))
        i += 4
      }
    } else {
      str += char // if not a \ or "
    }
  }
  return null
}

console.log('String parser', strParser('"..."'))
