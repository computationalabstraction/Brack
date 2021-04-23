const fs = require("fs");
const gzip = require('zlib').createGzip();
const babel = require("@babel/core");
const util = require('util');
const browserify = require('browserify');
const { argv } = require("process");

const transform = util.promisify(babel.transformFile);

// Dist Gen
function distGen(filename) {
    console.log(fs.readdirSync(`${__dirname}/dist`));
    console.log(fs.readdirSync(`${__dirname}/dist/browser`));
    transform(`${__dirname}/src/${filename}.js`,{"presets":["minify"],"comments":false})
    .then(result => {
        fs.writeFileSync(`${__dirname}/dist/${filename}.min.js`,result.code);
        fs.createReadStream(`${__dirname}/dist/${filename}.min.js`)
        .pipe(gzip)
        .pipe(fs.createWriteStream(`${__dirname}/dist/${filename}.min.js.gz`));
    });
    console.log(__dirname);
    console.log(filename);
    browserify([`${__dirname}/src/${filename}.js`], { standalone: 'brack' })
    .bundle()
    .pipe(fs.createWriteStream(`${__dirname}/dist/browser/${filename}.dist.js`))
    .on("finish", _ => {
        transform(`${__dirname}/dist/browser/${filename}.dist.js`, { "presets": ["@babel/preset-env", "minify"], "comments": false })
            .then(result => {
                fs.writeFileSync(`${__dirname}/dist/browser/${filename}.dist.min.js`, result.code);
                fs.createReadStream(`${__dirname}/dist/browser/${filename}.dist.min.js`)
                    .pipe(gzip)
                    .pipe(fs.createWriteStream(`${__dirname}/dist/browser/${filename}.dist.min.js.gz`));
            });
    });
}

if (!fs.existsSync(argv[2])) fs.mkdirSync(argv[2]);
argv.slice(3).forEach(distGen);
