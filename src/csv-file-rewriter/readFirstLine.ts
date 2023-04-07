import * as fs from 'node:fs';
import * as readline from "node:readline";

export default function(srcFilePath) {
	
	return new Promise((resolve) => {
		
		const readStream = fs.createReadStream(srcFilePath, {
			flags: 'a+',
			encoding: 'utf-8',
		});

		const rl = readline.createInterface({
			'input': readStream,
		});

		rl.on('line', (line) => {

			readStream.close();

			resolve(line);
		});

		rl.on('close', () => {
			resolve(null);
		});
	});
}