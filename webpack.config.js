const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const CopyPlugin = require("copy-webpack-plugin");

const path = require("path");

module.exports = {
    entry: {
        app: './src/js/main.js',
        sw: './src/js/sw.js',
        onlineHandler: './src/js/onlineHandler.js'
    },
    output:
        {
            filename: "bundle[name].js",
            path: path.resolve(__dirname, "dist"),
        },
    devServer: { contentBase: "./dist", },
    module: {
        rules: [
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.ts$/, use: 'ts-loader' }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({template: './index.html'}),
        new CopyPlugin({
            patterns: [
                { from: "src", to: "src" },
            ],
        }),
    ]
};
