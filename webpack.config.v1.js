'use strict';
/* jshint esversion: 6 */
/* jshint node: true */

/**
 * Cyclone webpack staging build.
 */
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FileChanger = require('webpack-file-changer');

module.exports = {
    context: __dirname,
    entry: {
        app: [
            "./js/cyclone.js"
        ],
        vendors: [
            'angular', 'angular-animate', 'angular-aria', 'angular-messages', 'angular-material', 'angular-clipboard', 'angular-moment',
            'firebase', 'firebaseui', 'firebase/auth', 'firebase/database', 'angularfire', 'angular-ui-router', 'angular-loading-bar',
            'angulartics', 'randomcolor', 'angulartics-google-analytics', 'angular-logger'
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
                })
            },
            {
                test: /\.tpl\.html$/,
                use: 'raw-loader',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            }
        ]
    },
    devtool: 'cheap-module-source-map', // inline-source-map
    plugins: [
        new CleanWebpackPlugin(__dirname + '/public/'),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
        new CopyWebpackPlugin([
            { from: 'src', to: __dirname + '/public/' },
        ]),
        new ExtractTextPlugin("cyclone.css"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('staging'),
                'FIREBASE_DB_INSTANCE': JSON.stringify('v1')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true,
                drop_console: false,
                global_defs: {
                    PRODUCTION: false,
                    FIREBASE_DB_INSTANCE: 'v1'
                }
            },
            minimize: true, // Does this exist still?
            extractComments: false,
            sourceMap: false,
            mangle: true, // was true - but fails because of injection issues since new components
            // TODO: fix this, or update webpack builder to maybe include it directly automatically
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
