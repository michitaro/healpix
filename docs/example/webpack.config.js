const merge = require('webpack-merge')


const index = {
    entry: 'file-loader?name=index.html!./src/index.html',
    output: { filename: 'dummy.js' }
}


const examples = ['pixcoord2vec', 'query_disc'].map(name => ({
    entry: [
        `./src/${name}/main.ts`,
        `file-loader?name=${name}.html!./src/${name}/index.html`,
    ],
    output: {
        filename: `${name}.js`,
    },
}))


const base = {
    output: { path: `${__dirname}/dist` },
    resolve: { extensions: [".js", ".json", ".ts"] },
    module: { rules: [{ test: /\.ts$/, loader: 'ts-loader' }] }
}


module.exports = [...examples, index].map(m => merge(base, m))
