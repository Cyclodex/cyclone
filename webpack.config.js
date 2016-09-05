//const webpack = require("webpack");

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
            { test: /\.less$/, loader: "style!css!less" }
        ]
    }
};
