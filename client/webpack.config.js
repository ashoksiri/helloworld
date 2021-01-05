const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');
const mode = process.env.NODE_ENV !== 'production';

const SRC_DIR = __dirname + '/src';
const DIST_DIR = __dirname + '/static';

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src/app/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },

            // workaround for warning: System.import() is deprecated and will be removed soon. Use import() instead.
            {
                test: /[\/\\]@angular[\/\\].+\.js$/,
                parser: { system: true }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
        }),
        new webpack.DefinePlugin({
            // global app config object
            config: JSON.stringify({
                apiUrl: 'http://localhost:4000'
            })
        }),

        // workaround for warning: Critical dependency: the request of a dependency is an expression
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)fesm5/,
            path.resolve(__dirname, 'src')
        )
    ],
    optimization: {
        splitChunks: {
            // minChunks: 5,

            // cacheGroups: {
            //     defaultVendors: {
            //         filename: '[name].bundle.js'
            //     }
            // },
            chunks: 'all',
            // maxSize: 200,
        },
        runtimeChunk: true
    },
    performance: {
      hints: false
    },
    output:{
        path: path.resolve( __dirname,'../', "templates"),
        filename: './static/[name].bundle.js'
    },
    devServer: {
        hot: true,
        // http2: true,
        writeToDisk: true,
        compress: true,
        watchContentBase: true
    },
    devtool: (mode === 'development') ? 'inline-source-map' : false,
}

