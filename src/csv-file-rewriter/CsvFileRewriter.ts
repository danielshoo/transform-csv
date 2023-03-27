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

        const fnPromise = new Promise((resolve, reject) => {

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

        return fnPromise;

    }


    rewriteFileSync(
        csvFileDescriptor: any,
        srcFilePath: string,
        destFilePath: string,
        // columnMapping: { },
    ) {

        rewriteFile(csvFileDescriptor, srcFilePath, destFilePath);
        //
        // const srcFileSize = fs.statSync(srcFilePath).size;
        // const readStream = fs.createReadStream(srcFilePath, {
        //     flags: 'a+',
        //     encoding: 'utf-8',
        // });
        // const writeStream = fs.createWriteStream(destFilePath, {
        //     flags: 'w+',
        //     encoding: 'utf-8',
        // });
        //
        // readStream.on('data', (chunk: string) => {
        //
        //     const lineBuffer = chunk.split(EOL);
        //
        //     readStream.pause();
        //
        //     lineBuffer.forEach((csvLine) => {
        //         const transformedCsvLine = this.rewriteRow(csvLine);
        //         writeStream.write(transformedCsvLine + EOL);
        //     });
        //
        //     const destFileSize = fs.statSync(destFilePath).size;
        //
        //     this.emit('chunk written', {
        //         percentageComplete: Math.floor((destFileSize / srcFileSize) * 100)
        //     });
        //
        //     readStream.resume();
        // });
    }

    rewriteFileWithWorker(
        csvFileDescriptor: any,
        srcFilePath: string,
        destFilePath: string
    ) {

        const worker = new Worker(path.resolve(__dirname, 'CsvFileRewriterWorker.ts'), {
            // @ts-ignore
            workerData: {
                srcFilePath,
                csvFileDescriptor: { test: 123},
                destFilePath,
            }
        });

        // @ts-ignore
        worker.on('message', message => {
            console.log(`Received message from worker: ${message}`);
        });

    }
    
    // rewriteFile(srcFilePath: string, destFilePath:string, outputOrder: Array<string>) {
    //
    //     const worker = new Worker(path.resolve(__dirname, 'CsvFileRewriterWorker.js'), {
    //         workerData: {
    //             srcFilePath,
    //             destFilePath,
    //         }
    //     });
    //
    //     worker.on('message', function (message) {
    //         console.log('message: ', message);
    //     });
    //
    //     //
    //     // readStream.on('end', () => {
    //     //     this.emit('done');
    //     // });
    // }

    /**
     * Explicitly support CSVs only. No need for the performance hit of checking TSVs or others.
     * It's an option to try parsing the first row by different delimiters to see which works,
     * but YAGNI atm.
     *
     * @param row
     */
    parseRow(row: string): Array<string> {
        return parse(row, {
            delimiter: ',',
            quote: false,
        });
    }
    
    rewriteRow(rowText:string, inputOrder?: Array<string>, outputOrder?: Array<string>): string {

        return "rewritten";

        // try {
        //     const parsedRow = this.parseRow(rowText);
        // } catch (e) {
        //     return "";
        // }
        //
        // const columnHeaders = this.csvFileDescriptor.getColumnHeaders();
    }
    
}


