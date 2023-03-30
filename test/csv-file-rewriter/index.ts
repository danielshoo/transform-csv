import CsvFileDescriptor from "../../src/csv-file-descriptor/CsvFileDescriptor";
const {afterEach, describe, it} = require("mocha");
const CsvFileRewriter = require("../../src/csv-file-rewriter/CsvFileRewriter");
const {default: CsvColumnDescriptor} = require("../../src/csv-column-descriptor/CsvColumnDescriptor");
const assert = require('node:assert');
const nodePath = require("node:path");
const fs = require("node:fs");
const {EOL} = require('node:os')

const inputTestFilePath = nodePath.resolve(__dirname, 'test-in.csv');
const outputTestFilePath = nodePath.resolve(__dirname, 'test-out.csv');
const expectedResultsFilePath = nodePath.resolve(__dirname, 'test-expected-out.csv');

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

            const csvFileRewriter = new CsvFileRewriter();

            const firstLine = await csvFileRewriter.readFirstLine(inputTestFilePath)
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
