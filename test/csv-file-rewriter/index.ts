import CsvFileDescriptor from '../../src/csv-file-descriptor/CsvFileDescriptor';
import readFirstLine from '../../src/csv-file-rewriter/readFirstLine';
import { afterEach, describe, it } from 'mocha';
import CsvFileRewriter from '../../src/csv-file-rewriter/CsvFileRewriter';
import CsvColumnDescriptor from '../../src/csv-column-descriptor/CsvColumnDescriptor';
import * as assert from 'node:assert';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { EOL } from 'node:os';

const inputTestFilePath = path.resolve(__dirname, 'test-in.csv');
const outputTestFilePath = path.resolve(__dirname, 'test-out.csv');
const expectedResultsFilePath = path.resolve(__dirname, 'test-expected-out.csv');


describe("CsvFileRewriter", function() {

    afterEach(function() {
        if (fs.existsSync(outputTestFilePath)) {
            fs.unlinkSync(outputTestFilePath);
        }
    });

    describe("#rewriteFile", function() {

        it("rewrite file works asynchronously with worker thread", async function () {

            const csvColumnDescriptors = getCsvColumnDescriptor(3);
            const csvFileDescriptor = new CsvFileDescriptor(csvColumnDescriptors);
            const csvFileRewriter = new CsvFileRewriter();

            await csvFileRewriter.rewriteFile(csvFileDescriptor, inputTestFilePath, outputTestFilePath);
            const actualFileContents = fs.readFileSync(outputTestFilePath, 'utf8');
            const expectedFileContents = fs.readFileSync(expectedResultsFilePath, 'utf8');

            const actualContents = actualFileContents.replaceAll(EOL, '');
            const expectedContent = expectedFileContents.replaceAll(EOL, '');

            assert.equal(actualContents, expectedContent);
        });
    });

    describe("#readFirstLine", function() {

        it("gets first line", async function() {

            const firstLine = await readFirstLine(inputTestFilePath)
            assert.equal(firstLine, 'Header 0, Header 1, Header 2')
        });
    });
});

function getCsvColumnDescriptor(count) {
    
    const csvColumnDescriptors = [];
        
    for (let i = 0; i < count; i++) {

        const csvColumnDescriptor = new CsvColumnDescriptor('Header ' + i, new RegExp(`Header\\s${i}`), /true|false/, (cellVal: string) => {
            return (cellVal === 'true' || cellVal === '1') ? '1' : '0';
        });

        csvColumnDescriptors.push(csvColumnDescriptor);
    }

    return csvColumnDescriptors;
}
