
// null parser
function nullParser (input) {
  if (input.startsWith('null')) {
    return [null, input.slice(4)]
  }
  return null
}

// console.log('nullParser', nullParser('nullABC'))

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

// console.log('booleanParser', booleanParser('trueABC'))

// number parser
function numberParser (input) {
  const regex = /^-?(([1-9]\d*)|0)(\.\d+)?((e|E)[+-]?\d+)?/
  const numOutput = input.match(regex)
  if (numOutput === null) {
    return null
  }
  return [Number(numOutput[0]), input.slice(numOutput[0].length)]
}

// console.log('numberParser', numberParser('0x123'))

// string parser
function stringParser (input) {
  if (!input.startsWith('"')) { return null }
  const escapeCharacters = {
    '"': '"',
    '/': '/',
    b: '/b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    '\\': '\\',
    u: null
  }
  let i = 0
  let str = ''
  while (input[i + 1] !== undefined) {
    i += 1
    let char = input[i]
    if (char === '"') { // end of string?
      return [str, input.slice(i + 1)]
    }
    if (char === '\\') { // if back slash is encountered
      i += 1
      char = input[i]
      if (!escapeCharacters.hasOwnProperty(char)) {
        return null // else if (char === '"') {return [str, input.slice(i)]}
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

// console.log('String parser', stringParser('"..."'))

// comma parser
function commaParser (input) {
  if (!input.startsWith(',')) { return null }
  return [',', input.slice(1)]
}

// value parser
function valueParser (input) {
  let parser = null
  const num = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  if (input.startsWith('n')) { parser = nullParser }
  if (input.startsWith('t') || input.startsWith('f')) { parser = booleanParser }
  if (input.startsWith('"')) { parser = stringParser }
  if (num.includes(input[0])) { parser = numberParser }
  if (parser === null) { return null }
  const parsed = parser(input)
  if (parsed === null) { return null }
  return [parsed[0], parsed[1]]
}

// console.log(valueParser())

// Array parser
function arrayParser (input) {
  if (!input.startsWith('[')) { return null }
  input = input.slice(1)
  let arr = []
  while (input[0] !== undefined) {
    if (input[0] === ']') { return [arr, input.slice(1)] }
    let val = valueParser(input)
    if (val === null) { return null }
    arr.push(val[0])
    input = val[1]
    val = commaParser(input)
    if (val === null) {
      if (input[0] !== ']') { return null }
    } else {
      if (input[1] === ']') { return null }
      input = val[1]
    }
  }
  return null
}

const input = '[-123,"1",12,13,true,null]"abc"'
console.log(arrayParser(input))
