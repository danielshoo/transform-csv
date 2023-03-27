const CsvFileDescriptor = require("../csv-file-descriptor/CsvFileDescriptor");
const {parse} = require('csv-parse/sync');
const fs = require('node:fs');
const {EOL} = require('os');
const {Worker: cfWorker} = require('node:worker_threads');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const {rewriteFile, eventEmitter: rewriteFileEventEmitter} = require('./rewriteFile');
const readFirstLine = require('./readFirstLine');

module.exports = class CsvFileRewriter extends EventEmitter {

    rewriteFile(
        csvFileDescriptor: any,
        srcFilePath: string,
        destFilePath: string,
    ) : Promise<any> {

        const columnMapping = this.getColumnMapping(srcFilePath);

        return new Promise((resolve, reject) => {

            const worker = new cfWorker(path.resolve(__dirname, 'worker.js'), {
                workerData: {
                    srcFilePath,
                    destFilePath,
                    columnMapping,
                }
            });

            worker.on('message', (message: string) => {

                // console.log('message: ', message);

                if (message === 'complete') {
                    resolve(message);
                }
            });
        });
    }

    getColumnMapping(srcFilePath) {
        return {};
    }

    readFirstLine(srcFilePath) {
        return readFirstLine(srcFilePath);
    }
}


