
// null parser
function nullParser (input) {
  if (input.startsWith('null')) {
    return [null, input.slice(4)]
  }
  return null
}

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

// number parser
function numberParser (input) {
  result = input.match(/^([-+]?[.]?[0-9]|[0-9])/g)
  if (result === null || result.length === 0) { return null }
  const reg = /^([-+]?[0-9]+[.]?[0-9]*)([eE][+-]?[0-9]+)?/
  const num = input.match(reg)
  const str = input.replace(reg, '')
  return [num[0], str]
}

const cases = ['0', '-0', '-0.0', '-1.23', '0.5', '0.0', '12.323', '0.', '-1', '.01e',
  '.0', '+0.', '+4', '00', '00.', '+0.05', '1.2Eabc', '1.2E2bc', '1.abc',
  '1e-5', '0e3', '0.1e1', '1.e9', '1e0', '2E256', '-12.e45', '2e+-4',
  'a.', '.a', '-', 'e1', '.', '-+', 'abc198'] // -01?  1.?

for (const input of cases) {
  console.log(input, '\t', numberParser(input))
}
