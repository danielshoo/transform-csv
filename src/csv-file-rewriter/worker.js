const {parentPort, workerData} = require("node:worker_threads");
const {rewriteFile, eventEmitter: rewriteFileEventEmitter} = require('./rewriteFile');

rewriteFile({}, workerData.srcFilePath, workerData.destFilePath, parentPort);

rewriteFileEventEmitter.on('complete', () => {
	parentPort.postMessage('complete');
});