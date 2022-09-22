

function nullParser(input) {
    if (!input.startsWith('null')) {
        return null;
    }
    return [null, input.slice(4, input.length)]
}


function booleanParser(input) {
    if (input.startsWith('true')) {
        return [input.slice(0, 4), input.slice(4, input.length)]
    }
    if (input.startsWith('false')) {
        return [input.slice(0, 5), input.slice(4, input.length)]
    }
    return null;
}

function numberParser(input) {
    result = input.match(/^([-+]?[.]?[0-9]|[0-9])/g)
    if(result.length===0){return null}
    
}

console.log(numberParser('1'))








// test cases for numberparser
// const passCases = ['0','-0','-0.0', '-1.23','0.5', '0.0','12.323', '0.']
// const failCases = [ '.0', 'a.', '.a', '-']