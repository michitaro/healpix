module.exports = {
    entry: [
        './src/main.ts',
        'file-loader?name=index.html!./src/index.html'
    ],
    output: {
        path: `${__dirname}/dist`, filename: 'bundle.js',
    },
    resolve: {
        extensions: [".js", ".json", ".ts"]
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}