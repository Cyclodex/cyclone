'use strict';
/* jshint esversion: 6 */
/* jshint node: true */

/**
 * Cyclone webpack production build.
 * Build by running `npm run build`
 */
const path = require("path");
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const FileChanger = require('webpack-file-changer');

module.exports = {
    entry: {
        app: [
            "./less/master.less",
            "./js/cyclone.js"
            ],
        vendors: [
            'angular', 'angular-route', 'angular-animate', 'angular-aria', 'angular-messages', 'angular-material', 'angular-clipboard', 'angular-moment',
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
                    use: [
                        "css-loader",
                        "less-loader"
                    ]
                    // publicPath: "/dist"
                })
            },
            {
                test: /\.tpl\.html$/,
                use: [
                    'raw-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        new ExtractTextPlugin("cyclone.css"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'PRODUCTION': JSON.stringify(true),
                'FIREBASE_PRODUCTION': JSON.stringify(true)
            }
        }),
        new ngAnnotatePlugin({
            add: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
                global_defs: {
                    PRODUCTION: true,
                    FIREBASE_PRODUCTION: true
                }
            },
            debug: true,
            minimize: true,
            comments: false,
            sourceMap: false,
            mangle: true
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js' }),
        new webpack.optimize.DedupePlugin(),
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
