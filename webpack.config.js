const path = require('path');

const clientConfig = {
    context: path.resolve(__dirname, './src'),
    entry: {
        main: { import: './index.tsx' },
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        modules: ['node_modules', 'src'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            '@babel/preset-typescript',
                        ],
                        plugins: ['babel-plugin-styled-components'],
                    },
                },
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        hot: true,
        port: 3001,
        historyApiFallback: true,
        client: { overlay: { warnings: false, errors: true } },
    },
    plugins: [],
    target: 'web',
    output: {
        filename: 'hass-solar-layout.js',
        path: path.resolve(__dirname, 'dist'),
        clean: false,
        publicPath: '',
    },
};

module.exports = (env) => {
    if (!env.WEBPACK_SERVE) {
        return [clientConfig];
    }

    return clientConfig;
};
