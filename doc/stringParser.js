// string parser regex
// function stringParserRegex (input) {
//   const strRegex = /^"[^"\\]*(\\["bfnrt\/]|\\u[a-fA-F\d]{4}|[^"\\]*)*"/
//   const strOutput = input.match(strRegex)
//   if (strOutput === null) {
//     return null
//   }
//   return [strOutput[0], input.slice(strOutput[0].length)]
// }

// console.log(stringParserRegex('"..."'))



// json.org documentation
// https://www.ietf.org/rfc/rfc4627.txt


// no-control-char  
// https://eslint.org/docs/latest/rules/no-control-regex
// https://deepsource.io/gl/blurt/blurt/issue/JS-0004/occurrences
// https://rules.sonarsource.com/javascript/RSPEC-6324


// string parsing regex
// https://bl.ocks.org/goodmami/02f344e8c9a22fc9ac879230a9b9e071
// /^"[^"\\]*(\\["bfnrt\/]|\\u[a-fA-F\d]{4}|[^"\\]*)*"/
// /"(\\.|[^"\\]*)*"/
// /"[^"\\]*(?:\\.|[^"\\]*)*"/
// /^\s*"((\\(["\\\/bfnrt]|u[a-fA-F0-9]{4})|[^"\\\0-\x1F\x7F]+)*)"\s*/


// regex visual
// https://regexper.com/


// regex tutorial
// https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285




// string parser
function strParser(input) {
    let i = 0
    let str = ''
    let escapeCharacters = {
        '"': '\"',
        '\\': '\\',
        '/': '\/',
        'b': '/b',
        'f': '/f',
        'n': '\n',
        'r': '\r',
        't': '\t',
        'u':''
    }
    let char = input[i]
    if (char !== '"') {
        return null
    }
    while (char !== undefined) {
        i += 1
        char = input[i]
        // console.log(char, '\t', str)                           //
        if (char === '"') {       //check for end of string?
            return [str,input.slice(i+1)]
        }
        if (char === '\\') {      // if back slash is encountered
            i += 1
            char = input[i] 
            if (!escapeCharacters.hasOwnProperty(char)) { return null 
            }else if (char === '"') {       //check for end of string?
                return [str, input.slice(i)]
            }else if (char !== 'u') { str += escapeCharacters[char] }
            else if (char === 'u') {
                const temp = input[i + 1] + input[i + 2] + input[i + 3] + input[i + 4]
                 //https://stackoverflow.com/questions/7063255/how-can-i-convert-a-string-into-a-unicode-character
                str+=String.fromCharCode(parseInt(temp, 16)) 
                i += 4;
            }
            
        }
        else {
            str += char                 // if not a \ or "
        }
    }
    return null
  }
  

// const input1 = '"abcdef\\t.1\\u006Fxyz\\\\abcd"efghabcd'
const input2 = '"abcdef\\t.1\\u006Fxyz\\\\abcdefghi\\\\"efghabcd"'
// const input3 = '"RT @TwitterDev: 1/ Today we’re sharing our vision for the future of the Twitter API platform!\nhttps://t.co/XweGngmxlP"'
// console.log(strParser(input1))
console.log(strParser(input2))
// console.log(strParser(input3))

