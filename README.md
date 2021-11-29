# brack
A Friendly S-Expressions parser (pre-release)

## Installation

### `npm i brack`

## Documentation
> underconstruction

#### `parse(code: String, delim: Array[String,String] = ["(", ")"]) -> Array<Array<Literals | String>>`
This function takes *s expression* and optionally *custom expression delimiter* this will parse and return an Array of Arrays with the parsed structure.

```javascript
const { parse } = require("brack");

const s1 = parse("(print (temp archan))");

const s2 = parse("{print {temp archan}}",["{","}"]);

console.log(s1); // -> ["print", ["temp", "archan"]]
console.log(s2); // -> ["print", ["temp", "archan"]]
```

#### Literals
This library parses and wraps literal values in container called `Literals`. Every other symbol is returned in the parsed structure as string.

There are 4 types of Literals:
* `Number`
* `Bool`
* `String`
* `Quote`

```javascript
const { parse, Literals } = require("brack");

const s1 = parse(`(f1 'symbol 10 true "this is a string" )`);

console.log(s1.map(e => e.toString())); 

const s2 = parse(
`<<lambda 
        <r> 
        <* pi <square r>>> 
        2.4562>`
, ["<",">"]);

console.log(s1.map(e => e.toString())); 
// -> ["f1", Literal.Quote("symbol"), Literal.Number(10), Literal.Bool(true), Literal.String("this is a string")]

console.log(Literals.Number.is(s1[2])); // -> true
console.log(Literals.Quote.is(s1[1])); // -> true
console.log(Literals.is(s1[4])); // -> true
```
