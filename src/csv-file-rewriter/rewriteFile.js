const EventEmitter = require('node:events').EventEmitter;
const eventEmitter = new EventEmitter();
const fs = require('node:fs');
const {EOL} = require('node:os');
const parseLine = require('./parseLine');
const readFirstLine = require('./readFirstLine');


/**
 *
 * @param {object} columnMapping
 * @param {string} srcFilePath
 * @param {string} destFilePath
 * @param {[]} valueTransforms
 * @param {[]} outputHeaders
 */
async function rewriteFile(
	columnMapping,
	srcFilePath,
	destFilePath,
	valueTransforms,
	outputHeaders = []
) {
	
	// TODO: Convert this to using nodejs' native readline module. Potential issue exists with reading a data chunk and it fracturing a row with where it ends
	const csvInputHeaderLine = await readFirstLine(srcFilePath);
	const csvOutputHeaderLine = outputHeaders.length ? outputHeaders.join(',') : '';
	
	const writeStream = fs.createWriteStream(destFilePath, {
		flags: 'w+',
		encoding: 'utf-8',
	});
	
	if (csvOutputHeaderLine) {
		writeStream.write(csvOutputHeaderLine + EOL);
	}
	
	const srcFileSize = fs.statSync(srcFilePath).size;
	const readStream = fs.createReadStream(srcFilePath, {
		flags: 'a+',
		encoding: 'utf-8',
		start: parseInt(csvInputHeaderLine.length)
	});
	
	readStream.on('data', (chunk) => {
		
		const lineBuffer = chunk.split(EOL);
		
		readStream.pause();
		
		lineBuffer.forEach((csvLine) => {
			
			parseLine(csvLine).then(csvRow => {
				
				if (!csvRow) {
					return; // TODO: increment error count as the csvRow could not be parsed
				}
				
				const newCsvRow = [];
				
				for (const [outputColumnNum, srcFileColumnNum] of Object.entries(columnMapping)) {
					
					if (typeof srcFileColumnNum === "undefined" || srcFileColumnNum === "") { // Column isn't mapped. Assume it is an optional column:
						newCsvRow.push("");
					} else if (typeof csvRow[srcFileColumnNum] !== 'undefined') {
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