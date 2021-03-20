'use strict';

const path = require('path');

const babelOptions = {
	presets: ['@babel/preset-react']
};

module.exports = env => ({
        mode: env.mode ? env.mode : 'development',
        devtool: env.mode === 'production' ? 'source-map' : false,
	cache: false,
        optimization: {
		minimize: env.mode === 'production'
	},
	entry: {
		'uplot-react': ['./src/uplot-react.tsx'],
                'uplot-vue': ['./src/uplot-vue.tsx'],
	},
	output: {
		filename: `[name].${env.libraryTarget.split('js')[0]}${env.mode === 'production' ? '.min' : ''}.js`,
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
		},
                uplot: 'uplot',
                vue: 'vue'
	}
});
