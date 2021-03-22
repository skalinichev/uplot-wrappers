'use strict';

const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = env => {
    const entry = {
        'react': ['./src/react/react.tsx'],
        'vue': ['./src/vue/vue.tsx']
    }
    if (env.mode !== 'production') {
        entry['test-react'] = ['./src/react/test-react.tsx'];
        entry['test-vue'] = ['./src/vue/test-vue.tsx'];
    }

    return ({
        mode: env.mode ? env.mode : 'development',
        devtool: 'source-map',
        cache: false,
        optimization: {
            minimize: env.mode === 'production'
        },
        entry,
        output: {
            filename: `[name]${env.mode === 'production' ? '.min' : ''}.js`,
            libraryTarget: 'umd'
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                exclude: [/node_modules/, path.join(__dirname, 'src', 'vue')],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {presets: ['@babel/preset-react']}
                    },
                    {
                        loader: 'ts-loader',
                        options: {configFile: path.join(__dirname, 'src', 'react', 'tsconfig.json'), context: __dirname}
                    }
                ]
            }, {
                test: /\.tsx/,
                exclude: [/node_modules/, path.join(__dirname, 'src', 'react')],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {presets: ['@vue/babel-preset-jsx']}
                    },
                    {
                        loader: 'ts-loader',
                        options: {configFile: path.join(__dirname, 'src', 'vue', 'tsconfig.json'), context: __dirname}
                    }
                ]
            },]
        },
        plugins: [
            new ESLintPlugin({extensions: ['ts', 'tsx']}),
            new CopyPlugin([
                {from: "src/**/*html", force: true, flatten: true},
                {from: "types/**", force: true, flatten: true},
                {from: "package.json", force: true, flatten: true},
                {from: "node_modules/uplot/dist/uPlot.iife.min.js", force: true, flatten: true},
                {from: "node_modules/uplot/dist/uPlot.min.css", force: true, flatten: true}
            ])
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
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
}
