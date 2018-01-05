'use strict';
/* jshint esversion: 6 */
/* jshint node: true */

/**
 * Cyclone webpack development build.
 * Build by running `npm run dev`
 * For development use `npm start`
 */
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        app: [
            "./js/cyclone.js"
        ],
        vendors: [
            'angular', 'angular-route', 'angular-animate', 'angular-aria', 'angular-messages', 'angular-material', 'angular-clipboard', 'angular-moment',
            'firebase', 'firebaseui', 'firebase/auth', 'firebase/database', 'angularfire', 'angular-ui-router', 'angular-loading-bar',
            'angulartics', 'randomcolor', 'angulartics-google-analytics'
        ]
    },
    resolve: {
        alias: {
            config: __dirname + '/js/config/config.js',
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
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "less-loader", options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.tpl\.html$/,
                use: [{
                    loader: "raw-loader", options: {
                        exclude: /node_modules/
                    }
                }],
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src', to: __dirname + '/public/' },
        ]),
        // // new ExtractTextPlugin("cyclone.css"),
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
            'FIREBASE_DB_INSTANCE': JSON.stringify('v1')
        }),
    ]
};
