import {Worker} from "node:worker_threads";

const {Worker: cfWorker} = require('node:worker_threads');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const parseLine = require('./parseLine');
const readFirstLine = require('./readFirstLine');
const JSONfn = require('jsonfn').JSONfn;

module.exports = class CsvFileRewriter extends EventEmitter {

    async rewriteFile(
        csvFileDescriptor: any,
        srcFilePath: string,
        destFilePath: string,
    ) : Promise<any> {

        const csvColumnDescriptorMementos = csvFileDescriptor.csvColumnDescriptors.map(csvColumnDescriptor => {
            return csvColumnDescriptor.hydrate();
        });

        return new Promise((resolve, reject) => {

            const worker = new Worker('./src/csv-file-rewriter/worker.js', {
                workerData: {
                    srcFilePath,
                    destFilePath,
                    csvColumnDescriptorMementos
                }
            });

            worker.on('message', (message: string) => {

                if (message.includes('file error', 0)) {
                    reject('could not rewrite file: ' + message);
                }

                if (message === 'complete') {
                    resolve(message);
                }
            });
        });
    }
}
