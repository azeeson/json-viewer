
import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';


function getMode(): webpack.Configuration['mode']{
    const mode = process?.env?.NODE_ENV;
    switch (mode){
        case 'development':
            return mode;
        case 'production':
            return mode;
        default:
            return 'none';
    }
}

function isDevelopment(): boolean {
    return getMode() !== 'production';
}

const config: webpack.Configuration = {
    mode: getMode(),
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        context: path.resolve(__dirname, 'src'),
                        configFile: path.resolve(__dirname, 'src', 'tsconfig.json'),
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/i,
                use: [
                    {
                        loader: "style-loader",
                        options: {
                            injectType: "lazyStyleTag",
                            insert: (element: HTMLStyleElement, options: {target: HTMLElement}) => {
                                const parent = options.target || document.head;
                                parent.appendChild(element);
                            },
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                getLocalIdent: (context: webpack.LoaderContext<unknown>, _: string, localName: string) => {
                                    const {utils, resourcePath} = context;
                                    const content = Buffer.from(resourcePath + localName, "utf8");
                                    const localIdentHash = utils.createHash('md4').update(content).digest('hex').toString();

                                    return `${localName.slice(0, 2)}_${localIdentHash.slice(0, 6)}`;
                                }
                            }
                        }
                    },
                    {
                        loader: require.resolve('sass-loader'),
                    }

                ],
            },
        ],
    },
    optimization: {
        minimize: !isDevelopment(),
    },
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'src')],
        extensions: ['.ts', '.tsx', '.js'],
    },
    devServer: {
        hot: true,
    },
    plugins: [],
};

if (isDevelopment()) {
    config.plugins?.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'assets', 'demo.html')
        })
    );
}

export default config;
