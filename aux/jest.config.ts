import path from 'path';
import type {Config} from 'jest';

const PATH_ROOT = path.resolve(__dirname, '..');

const config: Config = {
	verbose: true,
	preset: 'ts-jest',
	rootDir: PATH_ROOT,
	testEnvironment: 'jest-environment-jsdom',
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)']
};

export default config;
