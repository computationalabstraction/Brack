const { sum } = require("styp");

const Literals = sum("Literals", {
    Number: ["v"],
    String: ["v"],
    Bool: ["v"],
    Quote: ["v"]
});

const white = [" ", "\n", "\b", "\t", "\r"];
function isWhite(c) {
    return white.includes(c);
}

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
function isNumber(c) {
    return digits.includes(c);
}

function isAlphabet(c) {
    if (c) {
        const av = c.charCodeAt(0);
        return av >= "a".charCodeAt(0) && av <= "z".charCodeAt(0) ||
            av >= "A".charCodeAt(0) && av <= "Z".charCodeAt(0);
    }
    return false;
}

function isBool(s) {
    return s == "true" || s == "false";
}

function parseI(str,brackets=["(",")"]) {
    let curr = str[0];
    if(isWhite(curr)) {
        str.shift();
        curr = str[0];
        while(isWhite(curr)) {
            str.shift();
            curr = str[0];
        }
    }
    if(curr === brackets[1]) return;
    if(curr === brackets[0]) {
        str.shift();
        const out = [];
        let curr = str[0];
        while(curr !== brackets[1]) {
            let temp = parseI(str,brackets);
            if(temp) out.push(temp);
            curr = str[0];
        }
        curr = str.shift();
        if(curr !== brackets[1]) throw new Error(`Expected ${brackets[1]}`);
        return out;
    }
    if(curr === "'") {
        str.shift();
        return Literals.Quote(parseI(str,brackets));
    }
    if(curr === '"') {
        str.shift();
        curr = str[0];
        let buff = ""
        while(curr && curr !== '"') {
            buff += curr;
            str.shift();
            curr = str[0];
        }
        str.shift();
        if(curr !== '"') throw new Error('Required `"`');
        return Literals.String(buff);
    }
    if(isAlphabet(curr) || curr === "_") {
        buff = str.shift();
        curr = str[0]; 
        while(isAlphabet(curr) || isNumber(curr) || curr === "_") {
            str.shift();
            buff += curr;
            curr = str[0];
        }
        if(isBool(buff)) return Literals.Bool(buff == "true"?true:false);
        return buff;
    }
    if(isNumber(curr)) {
        let dot = false;
        buff = str.shift();
        curr = str[0];
        if(curr === ".") {
            buff += (str.shift());
            dot = true;
            curr = str[0];
        }
        while(isNumber(curr) || curr === ".") {
            if(curr === "." && dot) throw new Error("two dots not allowed");
            str.shift();
            buff += curr;
            if(curr === ".") dot = true;
            curr = str[0];
        }
        if(dot) return Literals.Number(parseFloat(buff));
        return Literals.Number(parseInt(buff));
    }
    return str.shift();
}

function parse(str,brackets=["(",")"]) {
    if(typeof str === "string") str = str.split("");
    const final = [];
    while(str.length > 0) {
        const out = parseI(str,brackets);
        if(out) final.push(out);
    }
    return final;
}

module.exports = {
    parse,
    Literals
};

// const temp = parse(`
// (f2 (f1 10 20 30 5.3333) true)
// (print "archan patkar")
// (+ - * -)
// ('archan '(10 20 30)) 
// `);

// console.log(temp.map(e => e.toString()).join("\n")); 