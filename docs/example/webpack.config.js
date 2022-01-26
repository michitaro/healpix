const CopyPlugin = require("copy-webpack-plugin")

const samples = ['pixcoord2vec', 'query_disc']

module.exports = {
    entry: Object.fromEntries(samples.map(name => [
        name,
        {
            import: `./src/${name}/main.ts`,
            filename: `${name}.js`,
        }
    ])),
    output: {
        path: `${__dirname}/dist`,
    },
    resolve: { extensions: [".js", ".json", ".ts"] },
    module: { rules: [{ test: /\.ts$/, loader: 'ts-loader' }] },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./src/index.html", to: "./index.html" },
                ...samples.map(name => (
                    { from: `./src/${name}/index.html`, to: `./${name}.html` }
                ))
            ],
        }),
    ],
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
    },
}
