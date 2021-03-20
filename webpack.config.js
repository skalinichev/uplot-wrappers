'use strict';

const path = require('path');

const babelOptions = {
	presets: ['@babel/preset-react']
};

module.exports = env => ({
        mode: env.mode ? env.mode : 'development',
        devtool: env.mode === 'production' ? 'source-map' : false,
	cache: true,
        optimization: {
		minimize: env.mode === 'production'
	},
	entry: {
		main: ['./src/index.tsx']
	},
	output: {
		filename: `uplot-react.${env.libraryTarget.split('js')[0]}${env.mode === 'production' ? '.min' : ''}.js`,
                libraryTarget: env.libraryTarget
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
});
