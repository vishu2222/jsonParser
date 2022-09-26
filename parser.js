
// null parser
function nullParser (input) {
  if (input.startsWith('null')) {
    return [null, input.slice(4)]
  }
  return null
}

console.log(nullParser('nullABC'))

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

console.log(booleanParser('trueABC'))

// number parser
function numberParser (input) {
  const regex = /^-?(([1-9]\d*)|0)(\.\d+)?((e|E)[+-]?\d+)?/
  const output = input.match(regex)
  if (output === null) {
    return null
  }
  return [Number(output[0]), input.slice(output[0].length)]
}

console.log(numberParser('123abc'))

//