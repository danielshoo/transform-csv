const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

/*

// For the moment, we only care about worker.ts, demo.ts, and the dist file index.ts. Let's keep it simple until ES & CJS module resolution gets consolidated to one style.

const srcBasePath = path.resolve(projectRoot, 'src');
const testBasePath = path.resolve(projectRoot, 'test');

function readTsFilesInDir(dir, tsFiles = []) {

	fs.readdirSync(dir).forEach(file => {
		if (file.endsWith('.ts')) {
			tsFiles.push(path.resolve(dir, file));
		} else if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
			tsFiles = readTsFilesInDir(path.resolve(dir, file), tsFiles);
		}
	});

	return tsFiles;
}

const srcTsFiles = readTsFilesInDir(srcBasePath);
const testTsFiles = readTsFilesInDir(testBasePath);
const allTsFiles = srcTsFiles.concat(testTsFiles);
 */


const projectRoot = path.resolve(__dirname, '..');
const allTsFiles = [
	projectRoot + '/src/csv-file-rewriter/worker.ts',
	projectRoot + '/demo.ts',
	projectRoot + '/index.ts',
]

allTsFiles.forEach(tsFile => {
	esbuild.build({
		platform: 'node',
		keepNames: true,
		logLevel: 'info',
		entryPoints: [tsFile],
		outfile: tsFile.replace('.ts', '.js'),
		bundle: true,
		format: 'cjs',
		target: 'node16',
	});
});