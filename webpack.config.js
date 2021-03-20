'use strict';

const path = require('path');

const babelOptions = {
	presets: ['@babel/preset-react']
};

module.exports = {
        mode: 'development',
        devtool: false,
	cache: true,
	entry: {
		main: ['./src/index.tsx']
	},
	output: {
		filename: '[name].js',
	},
	module: {
		rules: [
                        {
                                test: /\.tsx?$/,
                                exclude: /node_modules/,
                                use: [
                                        {
                                                loader: 'babel-loader',
                                                options: babelOptions
                                        },
                                        {
                                                loader: 'ts-loader'
                                        }
                                ]
                        },
                        {
                                test: /\.jsx?$/,
                                exclude: /node_modules/,
                                use: [
                                        {
                                                loader: 'babel-loader',
                                                options: babelOptions
                                        }
                                ]
                        }
		]
	},
	plugins: [
	],
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
		}
	},
};
