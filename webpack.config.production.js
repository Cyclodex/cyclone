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

module.exports = {
    entry: {
        app: [
            "./less/cyclone.less",
            "./js/cyclone.js"
            ],
        vendors: [
            'angular', 'angular-route', 'angular-animate', 'angular-aria', 'angular-messages', 'angular-material', 'angular-clipboard', 'angular-moment',
            'firebase/auth', 'firebase/database', 'angularfire'
        ]
    },
    output: {
        path: __dirname + '/public/build/',
        filename: "cyclone.js"
    },
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
            },
            {
                test: /\.tpl\.html$/,
                loader: 'raw-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        new ExtractTextPlugin("cyclone.css"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ngAnnotatePlugin({
            add: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false
            },
            debug: true,
            minimize: true,
            comments: false,
            sourceMap: false,
            mangle: true
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    ]
};
