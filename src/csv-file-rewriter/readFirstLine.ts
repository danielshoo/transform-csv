import * as fs from 'node:fs';
import { EOL } from "node:os";

export default function(srcFilePath) {
	
	return new Promise((resolve) => {
		
		const readStream = fs.createReadStream(srcFilePath, {
			flags: 'a+',
			encoding: 'utf-8',
		});
		
		readStream.on('data', (chunk: string) => {
			
			const lineBuffer = chunk.split(EOL);
			
			readStream.close();
			
			resolve(lineBuffer[0]);
		});
	});
}