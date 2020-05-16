const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const {InjectManifest} = require("workbox-webpack-plugin");

module.exports = {
    mode: "production",
    entry: ["./src/client/index.js"],
    output: {
        libraryTarget: "var",
        library: "Client"
    },
    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCssAssetsWebpackPlugin({})]
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/view/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({filename: 'main.css'}),
        new InjectManifest({
            swSrc: "./src/sw.js",
            swDest: "./service-worker.js",
            exclude: ["/node_modules"]
        })
    ],
}