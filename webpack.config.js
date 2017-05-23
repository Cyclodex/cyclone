'use strict';
/* jshint esversion: 6 */
/* jshint node: true */

/**
 * Cyclone webpack development build.
 * Build by running `npm run dev`
 * For development use `npm start`
 */
const path = require("path");
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

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
    devtool: 'inline-source-map',
    plugins: [
        new ExtractTextPlugin("cyclone.css"),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            files: ["public/*.html"],
            ghostMode: false, // Don't sync events over different browsers
            server: { baseDir: ['public'] }
        })
    ]
};
