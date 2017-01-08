'use strict';
/* jshint esversion: 6 */
/* jshint node: true */

/**
 * Cyclone webpack build.
 * Build by running `npm run build`
 * For development use `npm start`
 */
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


module.exports = {
    entry: [
      "./less/cyclone.less",
      "./js/cyclone.js",
    ],
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
            },
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new ExtractTextPlugin("cyclone.css"),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            files: ["public/*.html"],
            server: { baseDir: ['public'] }
        })

    ]
};
