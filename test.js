const input = 'a\x15'
console.log(input)
const escRegex = /.*\\x{1}.*/g
console.log(input.match(escRegex))

// console.log(JSON.parse('"a\x1111"')) // \b \f \n  \r \t \v
