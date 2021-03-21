'use strict';

const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = env => ({
    mode: env.mode ? env.mode : 'development',
    devtool: env.mode === 'production' ? 'source-map' : false,
    cache: false,
    optimization: {
        minimize: env.mode === 'production'
    },
    entry: {
        'uplot-react': ['./src/uplot-react.tsx'],
-       'uplot-vue': ['./src/uplot-vue.tsx'],
        'test-react': ['./src/test-react.tsx'],
        'test-vue': ['./src/test-vue.tsx'],
    },
    output: {
        filename: `[name].${env.libraryTarget.split('js')[0]}${env.mode === 'production' ? '.min' : ''}.js`,
        libraryTarget: env.libraryTarget
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {presets: ['@babel/preset-react']}
                },
                {
                    loader: 'ts-loader'
                }
            ]
        }]
    },
    plugins: [new ESLintPlugin({extensions: ['ts', 'tsx']})],
    resolve: {
        extensions: ['.ts', '.tsx']
    },
    externals: {
        react: {
            amd: 'react',
            commonjs: 'react',
            commonjs2: 'react',
            root: 'React'
        },
        'react-dom': {
            amd: 'react-dom',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            root: 'ReactDOM'
        },
        uplot: {
            amd: 'uplot',
            commonjs: 'uplot',
            commonjs2: 'uplot',
            root: 'uPlot'
        },
        vue: {
            amd: 'vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            root: 'Vue'
        },
    }
});
