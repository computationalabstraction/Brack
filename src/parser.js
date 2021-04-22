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
    if(curr === brackets[0]) {
        str.shift();
        const out = [];
        let curr = str[0];
        while(curr !== brackets[1]) {
            out.push(parseI(str,brackets))
            curr = str[0];
        }
        str.shift();
        if(curr !== brackets[1]) throw new Error(`Expected ${brackets[1]}`);
        return out;
    }
    if(isAlphabet(curr) || curr === "_") {
        buff = str.shift();
        curr = str[0]; 
        while(isAlphabet(curr) || isNumber(curr) || curr === "_") {
            str.shift();
            buff += curr;
            curr = str[0];
        }
        if(isBool(buff)) return buff == "true"?true:false;
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
        while(isNumber(curr) || (curr === "." && !dot)) {
            if(curr === "." && dot) throw new Error("two dots not allowed");
            str.shift();
            buff += curr;
            curr = str[0];
        }
        if(dot) return parseFloat(buff);
        return parseInt(buff);
    }
    return curr;
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

console.log(parse("(f1 10 20 30)"))