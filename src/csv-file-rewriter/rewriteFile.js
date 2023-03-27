const EventEmitter = require('node:events').EventEmitter;
const eventEmitter = new EventEmitter();
const fs = require('node:fs');
const {EOL} = require('node:os');

function rewriteFile(
	csvFileDescriptor,
	srcFilePath,
	destFilePath
) {
	const srcFileSize = fs.statSync(srcFilePath).size;
	const readStream = fs.createReadStream(srcFilePath, {
		flags: 'a+',
		encoding: 'utf-8',
	});
	const writeStream = fs.createWriteStream(destFilePath, {
		flags: 'w+',
		encoding: 'utf-8',
	});
	
	readStream.on('data', (chunk) => {
		
		const lineBuffer = chunk.split(EOL);
		
		readStream.pause();
		
		lineBuffer.forEach((csvLine) => {
			const transformedCsvLine = "rewritten";
			writeStream.write(transformedCsvLine + EOL);
		});
		
		const destFileSize = fs.statSync(destFilePath)?.size;
		
		eventEmitter.emit('chunk written', {
			percentageComplete: Math.floor((destFileSize / srcFileSize) * 100)
		});
		
		readStream.on('close', () => {
			eventEmitter.emit('complete');
		});
		
		readStream.resume();
	});
}

module.exports = {
	rewriteFile,
	eventEmitter,
};