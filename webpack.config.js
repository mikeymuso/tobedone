const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');


module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new MomentLocalesPlugin(),
    ],
}




