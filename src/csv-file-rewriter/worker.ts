import {parentPort, workerData} from "node:worker_threads";
import rewriteFile, {eventEmitter as rewriteFileEventEmitter} from "./rewriteFile";
// @ts-ignore
import process from 'node:process';
import CsvFileDescriptor from "./../csv-file-descriptor/CsvFileDescriptor";
import CsvColumnDescriptor from "./../csv-column-descriptor/CsvColumnDescriptor";
import getColumnMapping from "./getColumnMapping";

const csvColumnDescriptors = workerData.csvColumnDescriptorMementos.map(csvColumnDescriptorMemento => {
	return CsvColumnDescriptor.dehydrate(csvColumnDescriptorMemento);
});

const csvFileDescriptor = new CsvFileDescriptor(csvColumnDescriptors);

async function doJob(csvFileDescriptor) {
	
	const columnMapping = await getColumnMapping(csvFileDescriptor, workerData.srcFilePath);

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