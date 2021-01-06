const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
                parser: {system: true}
            },
            {
                test: /\.(jpg|jpeg|gif|png)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=1024&name=images/[name].[ext]'
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html'
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
        ),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: mode ? '[name].css' : '[name].[hash].css',
            chunkFilename: mode ? '[id].css' : '[id].[hash].css',
        }),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from:  "static/**" ,
                        // to: `${path.resolve(__dirname, '../', 'templates', 'static')}`,
                        to({ context, absoluteFilename }) {
                            const dirName = path.dirname(absoluteFilename).split(path.sep).pop();
                            return Promise.resolve(`${path.resolve(__dirname,'../', 'templates','static')}/${dirName}/[name].[ext]`);
                        },
                    }
                ]
            },
        ),
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
    output: {
        path: path.resolve(__dirname, '../', "templates"),
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

