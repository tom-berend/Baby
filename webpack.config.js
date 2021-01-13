var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
const pkg = require('./node_modules/baby/package.json');


// from the console:  npm run build [filename]     // eg: npm run build test

// if filename omitted, then creates 'index.html' and 'index.js'  in the /dist directory
// if filename included then creates 'test.html' and 'test.js

let filename = 'index'  // default
let procsize = process.argv.length
for (let i = 0; i < procsize; i++) {
    if (process.argv[i] == '--env')
        if (i < procsize - 1) {
            filename = process.argv[i + 1]
        }
}

const consoleCyan = '\x1b[1m\x1b[37m\x1b[41m'
const consoleReset = '\x1b[0m'



module.exports = (env, argv) => {

    let outbase = ''
    let outfile = ''

    if(argv.mode=='production'){
        outbase = 'dist'
        outfile = filename
        console.log(`${consoleCyan}creating ${outbase}/${outfile}.html and ${outbase}/${outfile}.js from src/${filename}.ts${consoleReset}`)
    }else{
        outbase = ''
        outfile = 'index'
        console.log(`${consoleCyan}point your browser at 'localhost:8080'${consoleReset}`)
    }

    
    return {
        entry: `./src/${filename}.ts`,
        target: "web",
        resolve: {
            extensions: ['.ts', '.js']
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: ["ts-loader", {
                    loader: 'webpack-preprocessor-loader',
                    options: {
                        directives: {
                            debug: false,
                            secret: false,
                        },
                        params: {
                            unittest: false,
                        },
                    },
                },
                ],

            }]
        },
        output: {
            path: path.join(__dirname, outbase),
            filename: `${outfile}.js`,
        },
        devServer: {
            stats: {
                contentBase: path.join(__dirname, outbase),
                openPage: `${outfile}.html`,
                index: `${outfile}.html`,
                // publicPath: '/dist/',
                performance: false,
                excludeModules: true
            },
        },
        plugins: [new HtmlWebpackPlugin(
            {
                filename: `${outfile}.html`,
                templateContent:
                    `<!DOCTYPE html>
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>Local Testing</title>
                <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
                <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
                <script src="https://cdn.babylonjs.com/ammo.js"></script>
                <style>html,body {width: 100%;height: 100%;padding: 0;margin: 0;overflow: hidden;}
                       #renderCanvas {width: 100%;height: 100%;display: block;font-size: 0;}</style>
            </head>
            <body>
                <canvas id="renderCanvas" touch-action="none"></canvas>
                <!-- webpack will insert a script tag for the program here -->
            </body>
            </html>`
            }
        )]

    }
}