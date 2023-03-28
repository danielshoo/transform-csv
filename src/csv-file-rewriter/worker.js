const {parentPort, workerData} = require("node:worker_threads");
const {rewriteFile, eventEmitter: rewriteFileEventEmitter} = require('./rewriteFile');
const JSONfn = require('jsonfn').JSONfn;
const process = require('node:process');


const valueTransforms = JSONfn.parse(workerData.valueTransforms);

rewriteFile(workerData.columnMapping, workerData.srcFilePath, workerData.destFilePath, valueTransforms, workerData.outputColumnHeaders).catch(error => {
	parentPort.postMessage('file error: ' + error);
});

process.on('uncaughtException', (error) => {
	parentPort.postMessage('file error: ' + error.message);
});

rewriteFileEventEmitter.on('complete', () => {
	parentPort.postMessage('complete');
});