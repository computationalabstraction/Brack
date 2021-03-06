const fs = require("fs");
const gzip = require('zlib').createGzip();
const babel = require("@babel/core");
const util = require('util');
const browserify = require('browserify');
const { argv } = require("process");

const transform = util.promisify(babel.transformFile);

// Dist Gen
function distGen(filename) {
    transform(`${__dirname}/src/${filename}.js`,{"presets":["minify"],"comments":false})
    .then(result => {
        fs.writeFileSync(`${__dirname}/dist/${filename}.min.js`,result.code);
        fs.createReadStream(`${__dirname}/dist/${filename}.min.js`)
        .pipe(gzip)
        .pipe(fs.createWriteStream(`${__dirname}/dist/${filename}.min.js.gz`));
    });
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
if (!fs.existsSync(`${__dirname}/dist`)) fs.mkdirSync(`${__dirname}/dist`);
if(!fs.existsSync(`${__dirname}/dist/browser`)) fs.mkdirSync(`${__dirname}/dist/browser`);
argv.slice(3).forEach(distGen);