import {EventEmitter} from 'node:events';
import * as fs from 'node:fs';
import {EOL} from 'node:os';
import parseLine from './parseLine';
import readFirstLine from './readFirstLine';


const eventEmitter = new EventEmitter();

export {eventEmitter};

export default async function rewriteFile(
	csvFileDescriptor,
	columnMapping,
	srcFilePath,
	destFilePath
) {
	
	const outputHeaders = csvFileDescriptor.getColumnHeaders();
	
	// TODO: Convert this to using nodejs' native readline module. Potential issue exists with reading a data chunk and it fracturing a row with where it ends
	const csvInputHeaderLine = await readFirstLine(srcFilePath) as string;
	const csvOutputHeaderLine = outputHeaders.join(',');
	
	const writeStream = fs.createWriteStream(destFilePath, {
		flags: 'w+',
		encoding: 'utf-8',
	});
	
	if (csvOutputHeaderLine) {
		writeStream.write(csvOutputHeaderLine + EOL);
	}
	
	// const srcFileSize = fs.statSync(srcFilePath).size;
	const readStream = fs.createReadStream(srcFilePath, {
		flags: 'a+',
		encoding: 'utf-8',
		start: csvInputHeaderLine.length
	});
	
	doRewrite(readStream, writeStream, columnMapping, csvFileDescriptor.getCellTransforms());
}

function doRewrite(readStream, writeStream, columnMapping, valueTransforms) {
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
					} else if (typeof srcFileColumnNum === 'number' && typeof csvRow[srcFileColumnNum] !== 'undefined') {
						const newCsvValue = valueTransforms[outputColumnNum](csvRow[srcFileColumnNum]);
						newCsvRow.push(newCsvValue);
					}
				}

				const transformedCsvLine = newCsvRow.join(',');
				
				writeStream.write(transformedCsvLine + EOL);
			});
		});
		
		readStream.on('close', () => {
			eventEmitter.emit('complete');
		});
		
		readStream.resume();
	});
}

