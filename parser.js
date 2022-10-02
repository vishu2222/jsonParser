// trim spaces
function spaceTrim (input) { // use trim
  const trimRegex = /^[\s\r]*/ // matches ' '\n\r\t
  const match = input.match(trimRegex)
  if (match === null) { return input }
  return input.slice(match[0].length)
}

// null parser
function nullParser (input) {
  input = spaceTrim(input)
  // input = input.trim()
  if (input.startsWith('null')) {
    return [null, input.slice(4)]
  }
  return null
}

// booleanParser
function booleanParser (input) {
  input = spaceTrim(input)
  if (input.startsWith('true')) {
    return [true, input.slice(4)]
  }
  if (input.startsWith('false')) {
    return [false, input.slice(5)]
  }
  return null
}

// number parser
function numberParser (input) {
  input = spaceTrim(input)
  const regex = /^-?([1-9]\d*|0)(\.\d+)?([eE][+-]?\d+)?/
  const regOutput = input.match(regex)
  if (regOutput === null) {
    return null
  }
  return [Number(regOutput[0]), input.slice(regOutput[0].length)]
}

// string parser
function stringParser (input) {
  input = input.trim()
  if (!input.startsWith('"')) { return null } // string should start with "
  input = input.slice(1)
  const escapeCharacters = {
    '"': '"',
    '\\': '\\',
    '/': '/',
    b: '/b',
    f: '/f',
    n: '\n',
    r: '\r',
    t: '\t',
    u: null
  }
  let str = ''
  const illegalEscReg = /[\n\t\b\f\r\u0000-\u001f]/ // \n\t\b\f\r may be removed
  while (input[0] !== undefined) {
    if (input[0] === '"') { return [str, input.slice(1)] }
    if (input[0] !== '\\' && input[0].match(illegalEscReg) !== null) { return null } // they should be followed by a https://www.ietf.org/rfc/rfc4627.txt
    if (input[0] === '\\') {
      if (input[1] === 'u') {
        const temp = input.slice(2, 6)
        if (temp.match(/[a-f0-9]{4}/i) === null) { return null }
        str += String.fromCharCode(parseInt(temp, 16))
        input = input.slice(6)
      } else if (escapeCharacters.hasOwnProperty(input[1])) {
        str += escapeCharacters[input[1]]
        input = input.slice(2)
      } else { // if not " or illegal char or escape char
        str += input[1]
        input = input.slice(2)
      }
    }
    str += input[0]
    input = input.slice(1)
  }
  return null
}
// const input = '"Illegal backslash escape: \\15"'
// console.log(stringParser(input))

// comma parser
function commaParser (input) {
  input = spaceTrim(input)
  if (!input.startsWith(',')) { return null }
  return [',', input.slice(1)] // return only input.slice
}

// value parser
function valueParser (input) {
  // console.log(input) //
  let parser = null
  input = spaceTrim(input)
  const num = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  if (input.startsWith('n')) { parser = nullParser }
  if (input.startsWith('t') || input.startsWith('f')) { parser = booleanParser }
  if (input.startsWith('"')) { parser = stringParser }
  if (input.startsWith('[')) { parser = arrayParser }
  if (input.startsWith('{')) { parser = objectParser }
  if (num.includes(input[0])) { parser = numberParser }
  // console.log(parser, input) //
  if (parser === null) { return null }
  const parsed = parser(input)
  if (parsed === null) { return null }
  // console.log(input, parser, parsed, [parsed[0], parsed[1]]) //
  return [parsed[0], parsed[1]]
}

// Array parser
function arrayParser (input) {
  input = spaceTrim(input)
  if (!input.startsWith('[')) { return null }
  const arr = []
  input = input.slice(1) // update input by removing '['
  input = spaceTrim(input)
  if (input[0] === ']') { return [arr, input.slice(1)] } // empty array
  while (input[0] !== undefined) {
    // if (input[0] === ']') { return [arr, input.slice(1)] }
    const parsedVal = valueParser(input)
    if (parsedVal === null) { return null }
    arr.push(parsedVal[0])
    input = parsedVal[1]
    const parsed = commaParser(input)
    if (parsed === null) {
      input = spaceTrim(input)
      if (input[0] !== ']') { return null } // if no comma array should end
      if (input[0] === ']') { return [arr, input.slice(1)] }
    }
    input = parsed[1]
  }
  return null
}

// object parser
function objectParser (input) {
  input = spaceTrim(input)
  const obj = {}
  if (!input.startsWith('{')) { return null }
  input = input.slice(1)
  input = spaceTrim(input)
  if (input[0] === '}') { return [obj, input.slice(1)] }
  do {
    if (input[0] !== '"') { return null } // porperty is a string //not required
    let parsed = stringParser(input)
    // console.log('parsed', parsed) //
    if (parsed === null) { return null }
    const key = parsed[0] // key is objects property
    input = parsed[1]
    input = spaceTrim(input)
    if (input[0] !== ':') { return null } // porperty should be followed by :
    // console.log(input) //
    input = input.slice(1) // remove : from input
    parsed = valueParser(input) // parsing value after colon
    if (parsed === null) { return null }
    // const val = parsed[0] // val is properties value
    input = parsed[1]
    obj[key] = parsed[0]
    input = spaceTrim(input)
    // console.log(input)
    if (input.startsWith('}')) { return [obj, input.slice(1)] }
    if (!input.startsWith(',')) { return null } // bad JSON
    // input = input.slice(1) // remove , from input
    input = spaceTrim(input)
  }
  while (input[0] !== undefined)
}

function jsonParser (input) {
  input = spaceTrim(input)
  if (input.length === 0) { return null }
  const output = valueParser(input)
  if (output === null) { return null }
  if (output !== null && output[1] !== '') { return null }
  return output[0]
}

// const input = '{"pass3": {"The": "must.","In": "It ."}}'
// console.log(input)
// console.log(jsonParser(input))
// console.log(JSON.parse(input))
// fail cases 15, 17, 18(working for JSON.parse), 26, 27, 28
