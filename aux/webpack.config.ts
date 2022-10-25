import path from 'path';
import {Configuration, LoaderContext} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import 'webpack-dev-server';

const PATH_ROOT = path.resolve(__dirname, '..');
const PATH_SRC = path.resolve(PATH_ROOT, 'src');
const PATH_DIST = path.resolve(PATH_ROOT, 'dist');
const PATH_ENTRY = path.resolve(PATH_SRC, 'index.ts');

function getMode(): Configuration['mode'] {
	const mode = process?.env?.NODE_ENV;
	switch (mode) {
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

const config: Configuration = {
	mode: getMode(),
	entry: PATH_ENTRY,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: 'ts-loader',
				},
				exclude: /node_modules/,
			},
			{
				test: /\.s?css$/i,
				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'lazyStyleTag',
							insert: (element: HTMLStyleElement, options: {target: HTMLElement}) => {
								const parent = options.target || document.head;
								parent.appendChild(element);
							},
						},
					},
					{
						loader: 'css-loader',
						options: {
							modules: {
								getLocalIdent: (context: LoaderContext<unknown>, _: string, localName: string) => {
									const {utils, resourcePath} = context;
									const relativeResourcePath = path.relative(PATH_ROOT, resourcePath);
									const content = Buffer.from(`${relativeResourcePath}${localName}`, 'utf8');
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
		// minimize: false,
		minimizer: [
			// This is only used in production mode
			new TerserPlugin({
				terserOptions: {
					module: true,
					parse: {
						// We want terser to parse ecma 8 code. However, we don't want it
						// to apply any minification steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 2020,
					},
					compress: {
						ecma: 5,
						arrows: true,
						unsafe: true,
						// warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false,
						// Disabled because of an issue with Terser breaking valid code:
						// https://github.com/facebook/create-react-app/issues/5250
						// Pending further investigation:
						// https://github.com/terser-js/terser/issues/120
						// inline: 2,
					},
					mangle: {
						safari10: true,
					},
					// Added for profiling in devtools
					keep_classnames: true,
					keep_fnames: true,
					// keep_classnames: isEnvProductionProfile,
					// keep_fnames: isEnvProductionProfile,
					output: {
						ecma: 5,
						beautify: true,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						// https://github.com/facebook/create-react-app/issues/2488
						ascii_only: true,
					},
				},
			}),
		],

	},
	resolve: {
		modules: ['node_modules', PATH_SRC],
		extensions: ['.ts', '.tsx', '.js'],
	},
	devServer: {
		hot: isDevelopment(),
	},
	plugins: [],
};

if (isDevelopment()) {
	config.plugins?.push(
		new HtmlWebpackPlugin({
			template: path.resolve(PATH_ROOT, 'assets', 'demo.html')
		})
	);
}

const config_cjs = Object.assign<Configuration, Configuration, Configuration>({}, config, {
	name: 'cjs',
	output: {
		filename: 'index.cjs.js',
		path: PATH_DIST,
		library: {
			type: 'commonjs-static',
		},
	},
	experiments: {
		outputModule: true,
	},
});

const config_es6 = Object.assign<Configuration, Configuration, Configuration>({}, config, {
	name: 'es6',
	output: {
		filename: 'index.es6.js',
		path: PATH_DIST,
		library: {
			type: 'module',
		},
	},
	experiments: {
		outputModule: true,
	},
});

const config_umd = Object.assign<Configuration, Configuration, Configuration>({}, config, {
	name: 'umd',
	output: {
		filename: 'index.umd.js',
		path: PATH_DIST,
		globalObject: 'this',
		library: {
			name: 'JSONViewer',
			type: 'umd2',
			umdNamedDefine: true
		},
	}
});

export default [config_cjs, config_es6, config_umd];
