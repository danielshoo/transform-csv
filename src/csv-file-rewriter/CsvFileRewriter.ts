const CsvFileDescriptor = require("../csv-file-descriptor/CsvFileDescriptor");
const {parse} = require('csv-parse/sync');
const fs = require('node:fs');
const {EOL} = require('os');
const {Worker: cfWorker} = require('node:worker_threads');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const {rewriteFile, eventEmitter: rewriteFileEventEmitter} = require('./rewriteFile');

module.exports = class CsvFileRewriter extends EventEmitter {

    rewriteFile(
        csvFileDescriptor: any,
        srcFilePath: string,
        destFilePath: string,
    ) : Promise<any> {

        return new Promise((resolve, reject) => {

            const worker = new cfWorker(path.resolve(__dirname, 'worker.js'), {
                workerData: {
                    srcFilePath,
                    destFilePath,
                    testObj: {
                        test: 123,
                        test2: 456,
                    }
                }
            });


            worker.on('message', (message: string) => {
                if (message === 'complete') {
                    resolve(message);
                }
            });
        });
    }
}


