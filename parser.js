function nullParser (input) {
  if (input.startsWith('null')) { return [null, input.slice(4)] }
  return null
}

function booleanParser (input) {
  if (input.startsWith('true')) { return [true, input.slice(4)] }
  if (input.startsWith('false')) { return [false, input.slice(5)] }
  return null
}

function numberParser (input) {
  const output = input.match(/^-?([1-9]\d*|0)(\.\d+)?([eE][+-]?\d+)?/)
  if (output === null) { return null }
  return [Number(output[0]), input.slice(output[0].length)]
}

function stringParser (input) {
  const output = input.match(/^"([^\\"\u0000-\u001f]|\\["\\bfnrt/]|\\u[0-9a-fA-F]{4})*"/)
  if (output !== null) { return [output[0], input.slice(output[0].length)] }
  return null
}

function valueParser (input) {
  input = input.trim()
  return nullParser(input) || booleanParser(input) || numberParser(input) || stringParser(input) || arrayParser(input) || objectParser(input)
}

function arrayParser (input) {
  input = input.trim()
  if (!input.startsWith('[')) { return null }
  input = input.slice(1).trim()
  const arr = []
  if (input[0] === ']') { return [arr, input.slice(1)] }

  while (input[0]) {
    const parsedVal = valueParser(input)
    if (parsedVal === null) { return null }
    arr.push(parsedVal[0])
    input = parsedVal[1].trim()
    if (input[0] === ']') { return [arr, input.slice(1)] }
    if (input[0] !== ',') { return null }
    input = input.slice(1)
  }

  return null
}

function objectParser (input) {
  input = input.trim()
  if (input[0] !== '{') { return null }
  const obj = {}
  input = input.slice(1).trim()
  if (input[0] === '}') { return [obj, input.slice(1)] }

  do {
    let parsed = stringParser(input)
    if (parsed === null) { return null }
    const key = parsed[0] // key is objects property
    input = parsed[1].trim()
    if (input[0] !== ':') { return null } // porperty should be followed by :
    parsed = valueParser(input.slice(1)) // parsing value after colon
    if (parsed === null) { return null }
    obj[key] = parsed[0]
    input = parsed[1].trim()
    if (input.startsWith('}')) { return [obj, input.slice(1)] }
    if (!input.startsWith(',')) { return null } // bad JSON
    input = input.slice(1).trim() // remove , from input
  }
  while (input[0])

  return null
}

function JSONParser (input) {
  input = input.trim()
  const parsedValue = arrayParser(input) || objectParser(input)
  if (parsedValue === null || parsedValue[1].length > 0) { return null }
  return parsedValue[0]
}

// fail cases
const fs = require('fs')
for (let i = 1; i <= 33; i++) {
  if (i !== 18) {
    const data = fs.readFileSync(`./test/fail${i}.json`, 'utf8')
    console.log(`fail${i}`, JSONParser(data))
  }
}

// pass cases
for (let i = 1; i <= 5; i++) {
  const data = fs.readFileSync(`./test/pass${i}.json`, 'utf8')
  console.log(`pass${i}`, JSONParser(data))
}

// const fs = require('fs')
// const data = fs.readFileSync('./test/test.json', 'utf8')
// console.log(JSONParser(data))

// const fs = require('fs')
// const data = fs.readFileSync('./test/test.json', 'utf8')
// console.log(JSONParser(data))
