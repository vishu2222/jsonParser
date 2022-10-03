# JSONParserJavaScript
* JSON strings have values that need to be parsed for a language to interpret it. Various types like numbers
strings, boolean, array and object are encoded inthe JSON string. 
* JSON structure is described at [json.org](https://www.json.org/json-en.html) and 
in detail at [link](https://www.ietf.org/rfc/rfc4627.txt).

## Json parser
* Input -> JSON string (array or object) 
* output -> parsed javaScript value or null for a bad JSON.

## Components
###  Null parser
    input -> string
    output -> [null, rest of the string] or null

### Boolean parser
    input -> string
    output -> [true/false, rest of the string] or null

### Number parser
    input -> string
    output-> [number, rest of the string] or null

### String parser
    input -> string
    output-> [sting, rest of the string] or null

### Array parser
    input -> string
    output-> [array, rest of the string] or null

### Object parser
    input -> string
    output-> [object, rest of the string] or null

#### References
1) https://wesleytsai.io/2015/06/13/a-json-parser/#comment-3466547787
2) https://www.json.org/json-en.html
3) https://www.ietf.org/rfc/rfc4627.txt
4) https://www.regular-expressions.info/nonprint.html
5) https://www.rfc-editor.org/rfc/rfc7159#page-8
