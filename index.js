// requiring path and fs modules
const fs = require('fs')
const path = require('path')
const jsp = require('./parser.js')
const directoryPath = path.join('test')
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

// check fails 15 17 18 28 26
// check pass 1 5
// https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files

