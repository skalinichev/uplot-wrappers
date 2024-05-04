'use strict';

const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sveltePreprocess = require('svelte-preprocess');

module.exports = (env) => {
    const { framework, example, frameworkVersion = '' } = env;
    const vue3 = frameworkVersion == '3';
    const svelte = framework === 'svelte';
    const entry = {
        [`uplot-${framework}`]: `./${framework}/uplot-${framework}`,
    };
    if (example) {
        entry[`uplot-${framework}-example`] = `./${framework}/uplot-${framework}${frameworkVersion}-example`;
    }
    const targets = example || svelte ? 'last 1 chrome version' : ['ie 11', 'last 1 chrome version'];
    const webpackPluginConfig = example
        ? [new HtmlWebpackPlugin({ scriptLoading: 'defer', template: `${framework}/uplot-${framework}-example.html` })]
        : [];
    const svelteFilesToCopy = svelte
        ? [
              { from: `${framework}/uplot-svelte.svelte`, force: true },
              { from: `${framework}/index.js`, force: true },
          ]
        : [];

    return {
        mode: env.mode ? env.mode : 'development',
        devtool: 'source-map',
        cache: false,
        optimization: {
            minimize: env.mode === 'production',
        },
        entry,
        output: {
            filename: `[name]${env.mode === 'production' ? '.min' : ''}.js`,
            libraryTarget: 'umd',
            path: path.join(__dirname, framework, 'dist'),
            library: `Uplot${framework[0].toUpperCase()}${framework.slice(1)}`,
            libraryExport: 'default',
            globalObject: 'this',
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: [/node_modules/, path.join(__dirname, 'vue')],
                    use: [
                        {
                            loader: 'babel-loader',
                            options: { presets: ['@babel/preset-react', ['@babel/preset-env', { targets }]] },
                        },
                        {
                            loader: 'ts-loader',
                            options: { configFile: path.join(__dirname, 'react', 'tsconfig.json'), context: __dirname },
                        },
                    ],
                },
                {
                    test: /\.tsx/,
                    exclude: [/node_modules/, path.join(__dirname, 'react')],
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', { targets }],
                                    ...(!vue3 ? ['@vue/babel-preset-jsx'] : []),
                                ],
                                plugins: vue3 ? ['@vue/babel-plugin-jsx'] : [],
                            },
                        },
                        {
                            loader: 'ts-loader',
                            options: { configFile: path.join(__dirname, 'vue', 'tsconfig.json'), context: __dirname },
                        },
                    ],
                },
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [['@babel/preset-env', svelte ? { exclude: ['transform-regenerator'] } : {}]],
                                plugins: ['@babel/plugin-proposal-class-properties'],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },

                {
                    test: /\.svelte$/,
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            preprocess: sveltePreprocess({
                                babel: {
                                    presets: [
                                        [
                                            '@babel/preset-env',
                                            {
                                                loose: true,
                                                modules: false,
                                                targets,
                                            },
                                        ],
                                    ],
                                },
                            }),
                        },
                    },
                },
            ],
        },
        plugins: [
            new ESLintPlugin({ extensions: ['ts', 'tsx'] }),
            new CopyPlugin({
                patterns: [
                    { from: `${framework}/types/index.d.ts`, force: true },
                    { from: `${framework}/package.json`, force: true },
                    { from: 'README.md', force: true },
                    { from: 'LICENSE', force: true },
                    ...svelteFilesToCopy,
                ],
            }),
            ...webpackPluginConfig,
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.svelte'],
            alias: {
                vue: vue3 ? 'vue3/dist/vue.esm-bundler.js' : 'vue/dist/vue.js',
                svelte: path.resolve('node_modules', 'svelte/src/runtime'),
            },
            conditionNames: ['svelte', 'browser', 'import'],
        },
        devServer: {
            static: {
                directory: path.join(__dirname, framework, 'dist'),
            },
            compress: true,
            historyApiFallback: true,
            hot: true,
            open: true,
            port: 8080,
        },
        externals: example
            ? {}
            : {
                  react: {
                      amd: 'react',
                      commonjs: 'react',
                      commonjs2: 'react',
                      root: 'React',
                  },
                  'react-dom': {
                      amd: 'react-dom',
                      commonjs: 'react-dom',
                      commonjs2: 'react-dom',
                      root: 'ReactDOM',
                  },
                  uplot: {
                      amd: 'uplot',
                      commonjs: 'uplot',
                      commonjs2: 'uplot',
                      root: 'uPlot',
                  },
                  vue: {
                      amd: 'vue',
                      commonjs: 'vue',
                      commonjs2: 'vue',
                      root: 'Vue',
                  },
              },
    };
};
