'use strict';
/* jshint esversion: 6 */
/* jshint node: true */

/**
 * Cyclone webpack production build. (FOR THE OLD RELEASE!!!)
 * Build by running `npm run build`
 */
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FileChanger = require('webpack-file-changer');

module.exports = {
    entry: {
        app: [
            "./less/master.less",
            "./js/cyclone.js"
            ],
        vendors: [
            'angulartics',
            'angular', 'angular-animate', 'angular-aria', 'angular-messages', 'angular-material', 'angular-clipboard', 'angular-moment',
            'firebase/auth', 'firebase/database', 'angularfire'
        ]
    },
    output: {
        path: __dirname + '/public/build/',
        filename: "cyclone.[chunkhash].js"
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'less-loader']
                    // publicPath: "/dist"
                })
            },
            {
                test: /\.tpl\.html$/,
                use: 'raw-loader',
            }
        ]
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src', to: __dirname + '/public/' },
        ]),
        new ExtractTextPlugin("cyclone.css"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'FIREBASE_DB_INSTANCE': JSON.stringify('v0')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
                global_defs: {
                    PRODUCTION: true,
                    FIREBASE_DB_INSTANCE: 'v0'
                }
            },
            debug: true,
            minimize: true,
            comments: false,
            sourceMap: false,
            mangle: true
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js' }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new FileChanger({
            change: [{
                file: "public/index.html",
                parameters: {
                    'cyclone\\.js': 'cyclone.[renderedHash:0].js',
                    'cyclone\\.css': 'cyclone.css?v=[renderedHash:0]' // makes the css reloaded on every release
                    // "\\$VERSION": package.version,
                    // "\\$BUILD_TIME": new Date()
                }
            },{
                file: "public/authentication.html",
                parameters: {
                    'cyclone\\.js': 'cyclone.[renderedHash:0].js',
                    'cyclone\\.css': 'cyclone.css?v=[renderedHash:0]'
                    // "\\$VERSION": package.version,
                    // "\\$BUILD_TIME": new Date()
                }
            }
            ]
        })

    ]
};
