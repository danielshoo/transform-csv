const {parentPort, workerData} = require("node:worker_threads");
const {rewriteFile, eventEmitter: rewriteFileEventEmitter} = require('./rewriteFile');
const JSONfn = require('jsonfn').JSONfn;

const valueTransforms = JSONfn.parse(workerData.valueTransforms);

rewriteFile(workerData.columnMapping, workerData.srcFilePath, workerData.destFilePath, valueTransforms);

rewriteFileEventEmitter.on('complete', () => {
	parentPort.postMessage('complete');
});