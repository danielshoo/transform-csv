const EventEmitter = require('node:events').EventEmitter;
const eventEmitter = new EventEmitter();
const fs = require('node:fs');
const {EOL} = require('node:os');
const parseLine = require('./parseLine');

/**
 *
 * @param {object} columnMapping
 * @param {string} srcFilePath
 * @param {string} destFilePath
 * @param {[]} valueTransforms
 */
function rewriteFile(
	columnMapping,
	srcFilePath,
	destFilePath,
	valueTransforms
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
			
			parseLine(csvLine).then(csvRow => {
				
				const newCsvRow = [];
				
				for (const [outputColumnNum, srcFileColumnNum] of Object.entries(columnMapping)) {
					
					if (typeof srcFileColumnNum === "undefined" || srcFileColumnNum === "") { // Column isn't mapped. Assume it is an optional column:
						newCsvRow.push("");
					} else {
						const newCsvValue = valueTransforms[outputColumnNum](csvRow[srcFileColumnNum]);
						newCsvRow.push(newCsvValue);
					}
				}
				
				const transformedCsvLine = newCsvRow.join(',');
				
				writeStream.write(transformedCsvLine + EOL);
			});
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