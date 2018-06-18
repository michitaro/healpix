module.exports = {
    entry: [
        "file-loader?name=index.html!./index.html",
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
        rules: [{ test: /\.ts$/, loader: 'ts-loader', options: { compilerOptions: { "declarationDir": './dist' } } }],
    },
}