(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.brack = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const $type=Symbol("Type"),$sumT=Symbol("SumType"),$schema=Symbol("Schema"),$cons=Symbol("Constructors"),tfrom=function(a){return this(...this.prototype[$schema].map(b=>a[b]))},tis=function(a){return a instanceof this},tctoString=function(){return this.prototype[$type]},titoString=function(){return`${this[$type]}(${this[$schema].map(a=>this[a]).join(",")})`},sis=function(a){return this.prototype[$cons].reduce((b,c)=>b||this[c].is(a),!1)},cata=function(a){return this[$cons].reduce((b,c)=>b?b:this[$sumT][c].is(this)?a[c](this):b,null)},nis=function(a){return a==this},ntoString=function(){return this[$type]};function tagged(a,b){if(!b.length)return{[$type]:a,is:nis,toString:ntoString};const c=function(...a){if(a.length<b.length)throw new TypeError(`This constructor requires ${b.length} values`);let d=Object.create(c.prototype);return b.forEach((b,c)=>d[b]=a[c]),Object.freeze(d)};return Object.assign(c.prototype,{[$type]:a,[$schema]:b,toString:titoString}),Object.assign(c,{from:tfrom,is:tis,toString:tctoString}),c}function sum(a,b){let c={is:sis};return c.prototype={[$sumT]:c,[$cons]:Object.keys(b),cata:cata},c.prototype[$cons].forEach(d=>{c[d]=tagged(`${a}.${d}`,b[d]),Object.setPrototypeOf(b[d].length?c[d].prototype:c[d],c.prototype)}),c}const styp=Object.freeze({tagged:tagged,sum:sum});"undefined"!=typeof module&&(module.exports=styp);
},{}],2:[function(require,module,exports){
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

function parseI(str,delim=["(",")"]) {
    let curr = str[0];
    if(isWhite(curr)) {
        str.shift();
        curr = str[0];
        while(isWhite(curr)) {
            str.shift();
            curr = str[0];
        }
    }
    if(curr === delim[1]) return;
    if(curr === delim[0]) {
        str.shift();
        const out = [];
        curr = str[0];
        while(curr && curr !== delim[1]) {
            let temp = parseI(str,delim);
            if(temp) out.push(temp);
            curr = str[0];
        }
        curr = str.shift();
        if(curr !== delim[1]) throw new Error(`Expected ${delim[1]}`);
        return out;
    }
    if(curr === "'") {
        str.shift();
        return Literals.Quote(parseI(str,delim));
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
        let buff = str.shift();
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
        let buff = str.shift();
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

function parse(str,delim=["(",")"]) {
    if(typeof str === "string") str = str.split("");
    const final = [];
    while(str.length > 0) {
        const out = parseI(str,delim);
        if(out) final.push(out);
    }
    return final;
}

module.exports = {
    parse,
    Literals
};
},{"styp":1}]},{},[2])(2)
});
