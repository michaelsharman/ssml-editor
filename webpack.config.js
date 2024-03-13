const webpack = require('webpack');

module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
        fallback: {
            fs: false,
            http: false,
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
        },
    },
};
