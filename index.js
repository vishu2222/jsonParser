// requiring path and fs modules
const fs = require('fs')
const path = require('path')
const jsp = require('./parser.js')
// console.log(parser)
// joining path of directory
const directoryPath = path.join('test')
// passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  if (err) {
    console.log(err)
  } else {
    files.forEach(file => {
      const filePath = path.join('test', file)
      fs.readFile(filePath, 'utf-8', function (err, data) {
        if (err) { console.log('error', err) }
        else { console.log(file, jsp.parser(data)) }
      })
    })
  }
})

// const input = ' { "a" :{ "1" :"val"},"b" :false, "c" :[1,null,3,["i","j"],{}], "d" :2}'
// // const input = '"abcd"'
// console.log(jsonParser(input))
// console.log(JSON.parse(input))

// let filePath = path.join('test', 'fail1.json')
// // console.log(filePath)
// fs.readFile(filePath, 'utf-8', function (err, data) {
//   if (err) {
//     console.log(err)
//   } else { console.log(data) }
// })


module.exports = {
  parser: function (input) {
    input = spaceTrim(input)
    if (input.length === 0) { return null }
    const output = valueParser(input)
    if (output === null) { return null }
    if (output !== null && output[1] !== '') { return null }
    return output[0]
  }
}
// https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
