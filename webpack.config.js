const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
    return {
        entry: './src/index.js',
        output: { path: path.resolve(__dirname, 'build'), filename: '[name].[hash].js' },
        performance: { hints: false },
        module: {
            rules: [
                { test: /\.html$/, loader: 'html-loader' },
                {
                    test: /\.m?js$/, exclude: /(node_modules|bower_components)/, loader: "babel-loader",
                    query: { cacheDirectory: true, presets: ['@babel/preset-react'] }
                },
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        'style-loader', { loader: MiniCssExtractPlugin.loader, options: { esModule: false,},},
                        //MiniCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { sourceMap: true } },
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ]
                },
                {
                    test: /\.css$/i,
                    exclude: /node_modules/,
                    loader: 'css-loader',
                    options: { modules: { localIdentName: './img--./img' } }
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use: [{ loader: 'file-loader', options: { name: './img/[name].[ext]' } }]
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file-loader',
                    options: { name: '[name].[hash].[ext]' }
                }
            ]
        },
        resolve: { extensions: ['.js', '.jsx'] },
        devtool: argv.mode === 'development' ? 'eval-source-map' : '',
        devServer: {
            contentBase: path.resolve(__dirname, 'public'),
            compress: true, hot: true, inline: true, open: true
        },

        plugins: [
            //new Dotenv(),
            //new BundleAnalyzerPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),

            new LodashModuleReplacementPlugin,
            new MiniCssExtractPlugin({ filename: "[name].[hash].css" }),
            new HtmlWebpackPlugin({ title: 'Caching', inject: true, filename: 'index.html', template: './public/index.html' }),
            //(argv.mode === 'development' ? new LodashModuleReplacementPlugin : new BrotliPlugin({ asset: '[path].br[query]', test: /\.(js|css|html|svg)$/, threshold: 10240, minRatio: 0.8 })),
        ],
        optimization: {
            runtimeChunk: 'single',
            splitChunks: { cacheGroups: { vendor: { test: /[\\\/]node_modules[\\\/]/, name: 'vendors', chunks: 'all' } } }
        }
    };
};