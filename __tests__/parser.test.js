const {parse, Literals} = require("../src/parser");

test('parsing literals', () => {
    expect(parse("10")).toEqual([Literals.Number(10)]);
    expect(parse("123421344")).toEqual([Literals.Number(123421344)]);
    expect(parse("5.2244244")).toEqual([Literals.Number(5.2244244)]);
    expect(parse("325.2244244")).toEqual([Literals.Number(325.2244244)]);
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