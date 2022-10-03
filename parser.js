// null parser
function nullParser (input) {
  input = input.trim()
  if (input.startsWith('null')) {
    return [null, input.slice(4)]
  }
  return null
}

// booleanParser
function booleanParser (input) {
  input = input.trim()
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
  input = input.trim()
  const regex = /^-?([1-9]\d*|0)(\.\d+)?([eE][+-]?\d+)?/
  const regOutput = input.match(regex)
  if (regOutput === null) {
    return null
  }
  return [Number(regOutput[0]), input.slice(regOutput[0].length)]
}

// string parser
function stringParser (input) {
  let str = ''
  const escChars = {
    '"': '"',
    '\\': '\\',
    '/': '/',
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    u: null
  }
  input = input.trim()
  if (!input.startsWith('"')) { return null }
  input = input.slice(1)
  while (input[0]) {
    if (input.startsWith('"')) { return [str, input.slice(1)] }
    if (input[0].match(/[\u0000-\u001f]/i)) { return null } // control characters
    if (input[0] === '\\') {
      if (input[1] === 'u') {
        const temp = input.slice(2, 6)
        if (temp.match(/[a-f0-9]{4}/i) === null) { return null } // validate hexcode
        str += String.fromCharCode(parseInt(temp, 16))
        input = input.slice(6)
      } else if (Object.keys(escChars).includes(input[1])) {
        str += escChars[input[1]]
        input = input.slice(2)
      } else { return null } // anything else after \ is invalid?
    } else {
      str += input[0]
      input = input.slice(1)
    }
  }
  return null
}

// comma parser
function commaParser (input) {
  input = input.trim()
  if (!input.startsWith(',')) { return null }
  return [',', input.slice(1)] // return only input.slice
}

// value parser
function valueParser (input) {
  let parser = null
  input = input.trim()
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
  input = input.trim()
  if (!input.startsWith('[')) { return null }
  const arr = []
  input = input.slice(1).trim() // update input by removing '['
  if (input[0] === ']') { return [arr, input.slice(1)] } // empty array
  while (input[0] !== undefined) {
    const parsedVal = valueParser(input)
    if (parsedVal === null) { return null }
    arr.push(parsedVal[0])
    input = parsedVal[1].trim()
    const parsed = commaParser(input)
    if (parsed === null) {
      if (input[0] !== ']') { return null } // if no comma array should end
      if (input[0] === ']') { return [arr, input.slice(1)] }
    }
    input = parsed[1]
  }
  return null
}

// object parser
function objectParser (input) {
  input = input.trim()
  const obj = {}
  if (!input.startsWith('{')) { return null }
  input = input.slice(1).trim()
  if (input[0] === '}') { return [obj, input.slice(1)] }
  do {
    let parsed = stringParser(input)
    if (parsed === null) { return null }
    const key = parsed[0] // key is objects property
    input = parsed[1].trim()
    if (input[0] !== ':') { return null } // porperty should be followed by :
    input = input.slice(1) // remove : from input
    parsed = valueParser(input) // parsing value after colon
    if (parsed === null) { return null }
    obj[key] = parsed[0]
    input = parsed[1].trim()
    if (input.startsWith('}')) { return [obj, input.slice(1)] }
    if (!input.startsWith(',')) { return null } // bad JSON
    input = input.slice(1).trim() // remove , from input
  }
  while (input[0] !== undefined)
  return null
}

function JSONParser (input) {
  input = input.trim()
  const parsedValue = arrayParser(input) || objectParser(input)
  if (!parsedValue || parsedValue[1]) return null
  return parsedValue[0]
}

// fail cases
const fs = require('fs')
for (let i = 1; i <= 33; i++) {
  const data = fs.readFileSync(`./test/fail${i}.json`, 'utf8')
  console.log(`fail${i}`, JSONParser(data))
}

// pass cases
for (let i = 1; i <= 5; i++) {
  const data = fs.readFileSync(`./test/pass${i}.json`, 'utf8')
  console.log(`pass${i}`, JSONParser(data))
}
