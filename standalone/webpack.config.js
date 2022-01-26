const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: [
        "../src",
    ],
    output: {
        path: `${__dirname}/dist`,
        filename: 'healpix.js',
        library: 'healpix',
        libraryTarget: 'var',
    },
    resolve: {
        extensions: ['.ts'],
    },
    module: {
        rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./index.html", to: "./" },
            ],
        }),
    ],
}