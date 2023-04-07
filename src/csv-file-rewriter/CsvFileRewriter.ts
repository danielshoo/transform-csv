import {Worker} from "node:worker_threads";
import {EventEmitter} from "node:events";
import * as path from 'node:path';

export default class CsvFileRewriter extends EventEmitter {

    async rewriteFile(
        csvFileDescriptor: any,
        srcFilePath: string,
        destFilePath: string,
    ) : Promise<any> {

        const csvColumnDescriptorMementos = csvFileDescriptor.csvColumnDescriptors.map(csvColumnDescriptor => {
            return csvColumnDescriptor.hydrate();
        });

        return new Promise((resolve, reject) => {


            const worker = new Worker(path.resolve(process.cwd(), 'src', 'csv-file-rewriter', 'worker.js'), {
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
