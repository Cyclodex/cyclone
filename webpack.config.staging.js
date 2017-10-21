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
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const FileChanger = require('webpack-file-changer');

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
                'PRODUCTION': JSON.stringify(false),
                'FIREBASE_PRODUCTION': JSON.stringify(false)
            }
        }),
        new ngAnnotatePlugin({
            add: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true,
                drop_console: false,
                global_defs: {
                    PRODUCTION: false,
                    FIREBASE_PRODUCTION: false
                }
            },
            debug: true,
            minimize: true,
            comments: false,
            sourceMap: true,
            mangle: false, // was true - but fails because of injection issues since new components
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
