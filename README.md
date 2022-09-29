# jsonParser

* Input -> a string
* output -> parsed javaScript value

###  Null parser
    input -> string
    output -> [null, rest of the string] or null

### Boolean
    input -> string
    output -> [true/false, rest of the string] or null

### Number
    input -> string
    output-> [number, rest of the string] or null

### String
    input -> string
    output-> [sting, rest of the string] or null

### Array
    input -> string
    output-> [array, rest of the string] or null

### Object
    input -> string
    output-> [object, rest of the string] or null