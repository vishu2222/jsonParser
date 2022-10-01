// trim spaces
function spaceTrim (input) { // use trim
  const trimRegex = /^[\s\r]*/ // matches ' '\n\r\t
  const match = input.match(trimRegex)
  if (match === null) { return input }
  return input.slice(match[0].length)
}
// console.log(spaceTrim(' \t\n\rabc'))

// null parser
function nullParser (input) {
  input = spaceTrim(input)
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
  input = spaceTrim(input)
  if (input[0] !== '"') { return null }
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
  let i = 0
  let str = ''
  let char = input[i]
  while (char !== undefined) {
    i += 1
    char = input[i]
    if (char === '"') { return [str, input.slice(i + 1)] }
    if (char === '\\') {
      i += 1
      char = input[i]
      if (!escapeCharacters.hasOwnProperty(char)) {
        return null
      }
      if (char !== 'u') {
        str += escapeCharacters[char]
      } else if (char === 'u') {
        const temp = input[i + 1] + input[i + 2] + input[i + 3] + input[i + 4] // input.slice(i+1,i+5)
        if (temp.match(/[a-f0-9]{4}/i) === null) { return null } // validate hexcode
        str += String.fromCharCode(parseInt(temp, 16))
        i += 4
      }
    } else { str += char }
  }
  return null
}
// console.log(stringParser('"abced\\nefgh\\"ijk"123'))

// comma parser
function commaParser (input) {
  input = spaceTrim(input)
  if (!input.startsWith(',')) { return null }
  return [',', input.slice(1)] // return only input.slice
}

// value parser
function valueParser (input) {
  let parser = null
  input = spaceTrim(input)
  const num = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  if (input.startsWith('n')) { parser = nullParser }
  if (input.startsWith('t') || input.startsWith('f')) { parser = booleanParser }
  if (input.startsWith('"')) { parser = stringParser }
  if (input.startsWith('[')) { parser = arrayParser }
  if (input.startsWith('{')) { parser = objectParser }
  if (num.includes(input[0])) { parser = numberParser }
  if (parser === null) { return null }
  const parsed = parser(input)
  if (parsed === null) { return null }
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

// const input = '[1, [2,3,4],null,"abc",true]xyz'
// console.log(arrayParser(input))

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
    if (parsed === null) { return null }
    const key = parsed[0] // key is objects property
    // input = parsed[1]
    input = spaceTrim(parsed[1])
    if (input[0] !== ':') { return null } // porperty should be followed by :
    // input = input.slice(1) // remove : from input
    parsed = valueParser(input.slice(1)) // parsing value after colon
    if (parsed === null) { return null }
    // const val = parsed[0] // val is properties value
    input = parsed[1]
    obj[key] = parsed[0]
    input = spaceTrim(input)
    if (input.startsWith('}')) { return [obj, input.slice(1)] }
    if (!input.startsWith(',')) { return null } // bad JSON
    input = input.slice(1) // remove , from input
    input = spaceTrim(input)
  }
  while (input[0] !== undefined)
}

// const input = '{ "a" :{ "1" :"val"},"b" :false, "c" :[1,null,3,["i","j"],{}], "d" :2}xyz'
// console.log(objectParser(input))

function jsonParser (input) {
  input = spaceTrim(input)
  if (input.length === 0) { return null }
  const output = valueParser(input)
  if (output !== null && output[1] !== '') { return null }
  return output[0]
}

const input = ' { "a" :{ "1" :"val"},"b" :false, "c" :[1,null,3,["i","j"],{}], "d" :2}'
// const input = '"abcd"'
console.log(jsonParser(input))
console.log(JSON.parse(input))

