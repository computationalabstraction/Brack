const {parse, Literals} = require("../src/parser");

test('parsing literals', () => {
    expect(parse("10")).toEqual([Literals.Number(10)]);
    expect(parse("123421344")).toEqual([Literals.Number(123421344)]);
    expect(parse("5.2244244")).toEqual([Literals.Number(5.2244244)]);
    expect(parse("325.2244244")).toEqual([Literals.Number(325.2244244)]);
    expect(() => {
        parse('5.22.3');
    }).toThrow();
    expect(parse("true")).toEqual([Literals.Bool(true)]);
    expect(parse("false")).toEqual([Literals.Bool(false)]);
    expect(parse('"this is a test"')).toEqual([Literals.String("this is a test")]);
    expect(parse('"this is test number 2"')).toEqual([Literals.Bool("this is test number 2")]);
    expect(() => {
        parse('"this is test number 3');
    }).toThrow();
    expect(parse("'10")).toEqual([Literals.Quote(Literals.Number(10))]);
    expect(parse("'3.142")).toEqual([Literals.Quote(Literals.Number(3.142))]);
    expect(parse("'true")).toEqual([Literals.Quote(Literals.Bool(true))]);
    expect(parse("'false")).toEqual([Literals.Quote(Literals.Bool(false))]);
    expect(parse("'(10 20 30 40)")).toEqual([Literals.Quote([Literals.Number(10),Literals.Number(20),Literals.Number(30),Literals.Number(40)])]);
});

test('parsing sexpressions', () => {
    expect(parse("(10 20 30 40)")).toEqual([[Literals.Number(10),Literals.Number(20),Literals.Number(30),Literals.Number(40)]]);
    expect(parse('(print "archan patkar")')).toEqual([["print",Literals.String("archan patkar")]]);
    expect(parse('(+ - * -)')).toEqual([["+","-","*","-"]]);
    expect(parse("('archan '(10 20 30))")).toEqual([[Literals.Quote("archan"),Literals.Quote([Literals.Number(10),Literals.Number(20),Literals.Number(30)])]]); 
    expect(parse('(f1 10 20 30 5.3333)')).toEqual([["f1",Literals.Number(10),Literals.Number(20),Literals.Number(30),Literals.Number(5.3333)]]);
    expect(parse('(f2 (f1 10 20 30 5.3333) true)')).toEqual([["f2", ["f1",Literals.Number(10),Literals.Number(20),Literals.Number(30),Literals.Number(5.3333)], Literals.Bool(true)]]);
    expect(() => {
        parse('(temp');
    }).toThrow();
    expect(parse('(    f1    whitespace   test  )')).toEqual([["f1","whitespace","test"]]);
    expect(parse('(CAPS LETTERS TEST)')).toEqual([["CAPS","LETTERS","TEST"]]);
    expect(parse('((CAPS () ()) () (LETTERS TEST () ()) ((())))')).toEqual([[["CAPS",[],[]],[],["LETTERS","TEST",[],[]],[[[]]]]]);
    expect(parse(`
        {10 20 30 40}
        {CAPS LETTERS TEST} 
        {    f1    whitespace   test  } 
        {'archan '{10 20 30}}
    `,["{","}"])).toEqual([
        [Literals.Number(10),Literals.Number(20),Literals.Number(30),Literals.Number(40)],
        ["CAPS","LETTERS","TEST"],
        ["f1","whitespace","test"],
        [Literals.Quote("archan"),Literals.Quote([Literals.Number(10),Literals.Number(20),Literals.Number(30)])]
    ]);
});