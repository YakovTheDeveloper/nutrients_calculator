const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    webpack = require('webpack');

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
            '@forms': path.resolve(__dirname, 'src/components/forms/'),
            '@layout': path.resolve(__dirname, 'src/components/layout/'),
            '@assets': path.resolve(__dirname, 'src/assets/'),
            '@api': path.resolve(__dirname, 'src/api/'),
            // '@api': path.resolve(__dirname, 'src/api/index.ts'),
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
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets',
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
                include: path.resolve(__dirname, 'src'), // Make sure to include the 'src' directory
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
        open: true,
        static: './dist',
        hot: true,
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
