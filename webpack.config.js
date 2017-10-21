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
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

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
    resolve: {
        alias: {
            config: path.join(__dirname, '/js/config/config.js'),
        },
    },
    output: {
        path: __dirname + '/public/build/',
        filename: "cyclone.js"
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
    devtool: 'inline-source-map',
    plugins: [
        new ExtractTextPlugin("cyclone.css"),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js' }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            files: ["public/*.html"],
            ghostMode: false, // Don't sync events over different browsers
            server: { baseDir: ['public'] }
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify('development'),
            'PRODUCTION': JSON.stringify(false),
            'FIREBASE_PRODUCTION': JSON.stringify(false)
        }),
        new ngAnnotatePlugin({
            add: true
        }),
    ]
};
