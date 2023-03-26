import CsvFileDescriptor from "../csv-file-descriptor/CsvFileDescriptor";
const worker = require('node:worker_threads');

export default class CsvFileRewriter {
    
    constructor(csvFileDescriptor: CsvFileDescriptor) {
        
    }
    
    rewriteFile(srcFilePath: string, destFilePath:string) {
        
    }

    parseRow(): Array<string> {
        return []
    }
    
    rewriteRow(rowText:string): string {
        const parsedRow = this.parseRow();
        return "rewritten";
    }
    
}
