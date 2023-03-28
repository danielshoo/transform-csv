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

        // TODO: Migrate this from passing pieces of the column-descriptors piecemeal to sending the whole descriptor, prototype reconstituted within the worker:
        const columnMapping = await this.getColumnMapping(csvFileDescriptor, srcFilePath);
        const cellValueTransforms = csvFileDescriptor.csvColumnDescriptors.map(csvColumnDescriptor => {
            return csvColumnDescriptor.cellTransform
        });

        return new Promise((resolve, reject) => {

            const worker = new cfWorker(path.resolve(__dirname, 'worker.js'), {
                workerData: {
                    srcFilePath,
                    destFilePath,
                    columnMapping,
                    outputColumnHeaders: csvFileDescriptor.getColumnHeaders(),
                    valueTransforms: JSONfn.stringify(cellValueTransforms),
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

    async getColumnMapping(csvFileDescriptor, srcFilePath) {

        const columnMapping = {};
        const missingColumns = [];
        const firstLine = await this.readFirstLine(srcFilePath);
        const actualColumnHeaders = await this.parseLine(firstLine);
        const expectedColumnHeaders = csvFileDescriptor.getColumnHeaders();
        const expectedCsvColumnDescriptors = csvFileDescriptor.csvColumnDescriptors;

        for (let i = 0; i < expectedColumnHeaders.length; i++) {
            for (let j = 0; j < actualColumnHeaders.length; j++) {

                if (expectedCsvColumnDescriptors[i].validateHeader(actualColumnHeaders[j])) {

                    if (columnMapping.hasOwnProperty(i)) { // Already matched and mapped. A one-t-many mapping is not something this rewriter is set up to hande.
                        return Promise.reject(new Error('Ambiguous column name: ' + expectedColumnHeaders[i]));
                    }

                    columnMapping[i] = j;
                }
            }

            if (!columnMapping.hasOwnProperty(i) && expectedCsvColumnDescriptors[i].isOptional) {
                continue;
            }

            if (!columnMapping.hasOwnProperty(i) && expectedCsvColumnDescriptors[i].isRequired) {
                missingColumns.push(expectedColumnHeaders[i]);
            }
        }

        if (csvFileDescriptor.isHeaderRowOptional && missingColumns.length === expectedColumnHeaders.length) {
            columnMapping[0] = 0;
            return columnMapping;
        }

        if (missingColumns.length) {
            return Promise.reject(new Error('Invalid header: Columns [' + missingColumns.join(', ') + '] are missing'));
        }

        return columnMapping;
    }

    async readFirstLine(srcFilePath) {
        return readFirstLine(srcFilePath);
    }

    async parseLine(line: string) {
        return parseLine(line);
    }
}
