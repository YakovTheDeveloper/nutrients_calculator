const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

const CSSModuleLoader = {
    loader: 'css-loader',
    options: {
        modules: {
            localIdentName: '[folder]__[local]--[hash:base64:5]',
        },
        importLoaders: 2,
        sourceMap: false, // turned off as causes delay
    }
}

const CSSLoader = {
    loader: 'css-loader',
    options: {
        modules: "global",
        importLoaders: 2,
        sourceMap: false, // turned off as causes delay
    }
}

module.exports = {
    mode: 'development',
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[fullhash].js',
        clean: true,
    },
    resolve: {
        alias: {
            '@ui': path.resolve(__dirname, 'src/components/ui/'),
            '@common': path.resolve(__dirname, 'src/components/common/'),
            '@': path.resolve(__dirname, 'src/'),
            '@data': path.resolve(__dirname, 'src/data/'),
            '@pages': path.resolve(__dirname, 'src/pages/'),
            '@hooks': path.resolve(__dirname, 'src/hooks/'),
            '@constants': path.resolve(__dirname, 'src/constants/'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /\.module\.(sa|sc|c)ss$/,

                use: ['style-loader', CSSLoader, "sass-loader"]
            },
            {
                test: /\.module\.(sa|sc|c)ss$/,
                use: ['style-loader', CSSModuleLoader, "sass-loader"]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets',
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        open: true,
        static: './dist',
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
            favicon: './public/favicon.ico'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        runtimeChunk: 'single',
    },
};
