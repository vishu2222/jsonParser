// https://regexper.com/#%2F%5E-%3F%28%28%5B1-9%5D%5Cd*%29%7C0%29%28%5C.%5Cd%2B%29%3F%28%28e%7CE%29%5B%2B-%5D%3F%5Cd%2B%29%3F%2F
const numParserPassCases = ['0', '0a', '-0', '0.0', '2.3', '-0.0', '-1.23', '0.5', '12.323', '0.', '-1', '00',
  '00.', '1.2Eabc', '1.2E2bc', '1.abc', '1e-5', '0e3', '0.1e1', '0.e9', '1.e9',
  '1e0', '2E256', '-12.e45', '2e+-4', '123.456e-789']

const numParserfailCases = ['a.', '.a', '-', 'e1', '.', '-+', 'abc198', 'a0', '-', '.01e', '.0', '+0.', '+4',
  '+0.05']

console.log(numParserPassCases, numParserfailCases)
