'use strict';
/* jshint esversion: 6 */
/* jshint node: true */

/**
 * Cyclone webpack production build.
 * Build by running `npm run build`
 */
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
      "./less/cyclone.less",
      "./js/cyclone.js"
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
    devtool: 'cheap-module-source-map',
    plugins: [
        new ExtractTextPlugin("cyclone.css")
    ]
};
