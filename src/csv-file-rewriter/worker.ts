const fs = require('node:fs');
const {parentPort, workerData} = require("node:worker_threads");
const {rewriteFile, eventEmitter: rewriteFileEventEmitter} = require('./rewriteFile');
const process = require('node:process');
const JSONfn = require('jsonfn').JSONfn;
import CsvFileDescriptor from "./../csv-file-descriptor/CsvFileDescriptor";
import CsvColumnDescriptor from "./../csv-column-descriptor/CsvColumnDescriptor";
const getColumnMapping = require('./getColumnMapping');

const csvColumnDescriptors = workerData.csvColumnDescriptorMementos.map(csvColumnDescriptorMemento => {
	return CsvColumnDescriptor.dehydrate(csvColumnDescriptorMemento);
});


const csvFileDescriptor = new CsvFileDescriptor(csvColumnDescriptors);

async function doJob(csvFileDescriptor) {
	
	const columnMapping = await getColumnMapping(csvFileDescriptor, workerData.srcFilePath);

	// parentPort.postMessage('file error1: ' + JSONfn.stringify(columnMapping));

	rewriteFile(csvFileDescriptor, columnMapping, workerData.srcFilePath, workerData.destFilePath).catch(error => {
		parentPort.postMessage('file error1: ' + error);
	});
}

doJob(csvFileDescriptor);


process.on('uncaughtException', (error) => {
	parentPort.postMessage(`file error2 (${error.stack}): ` + error.message);
});

rewriteFileEventEmitter.on('complete', () => {
	parentPort.postMessage('complete');
});

rewriteFileEventEmitter.on('percentage update', (percentage) => {
	parentPort.postMessage('percentage update: ' + percentage);
});