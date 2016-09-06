/**
 * Cyclone webpack build.
 */
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
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }
        ]
    },
    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [
        new ExtractTextPlugin("cyclone.css")
    ]
};
