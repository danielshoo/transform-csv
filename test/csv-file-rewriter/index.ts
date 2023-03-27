import CsvFileDescriptor from "../../src/csv-file-descriptor/CsvFileDescriptor";
const {afterEach, describe, it} = require("mocha");
const CsvFileRewriter = require("../../src/csv-file-rewriter/CsvFileRewriter");
const CsvColumnDescriptor = require("../../src/csv-column-descriptor/CsvColumnDescriptor");
const assert = require('node:assert');
const sinon = require("sinon");
const nodePath = require("node:path");
const fs = require("node:fs");
const {EOL} = require('node:os')

const inputTestFilePath = nodePath.resolve(__dirname, 'test.csv');
const outputTestFilePath = nodePath.resolve(__dirname, 'out.csv');

describe("CsvFileRewriter", function() {

    afterEach(function() {
        if (fs.existsSync(outputTestFilePath)) {
            fs.unlinkSync(outputTestFilePath);
        }
    });

    describe("#rewriteFile", function() {

        it("rewrite file works asynchronously with worker thread", function (done) {
            const csvFileDescriptorMock = sinon.createStubInstance(CsvFileDescriptor);
            const csvFileRewriter = new CsvFileRewriter();

            csvFileRewriter.rewriteFile(csvFileDescriptorMock, inputTestFilePath, outputTestFilePath).then(() => {

                fs.readFile(outputTestFilePath, 'utf8', (err, data) => {

                    const actualContents = data.replaceAll(EOL, '');
                    const expectedContent = 'rewritten'.repeat(22);

                    assert.equal(actualContents, expectedContent);

                    done();
                });
            });
        });
    });

    describe("#readFirstLine", function() {

        it("gets first line", function(done) {
            const csvFileDescriptorMock = sinon.createStubInstance(CsvFileDescriptor);
            const csvFileRewriter = new CsvFileRewriter();
            csvFileRewriter.readFirstLine(inputTestFilePath).then(firstLine => {
                assert.equal(firstLine, 'test, 123, sadasf');
                done();
            });
        });
    });
});

function getCsvColumnDescriptorMocks(count) {
    
    const mocks = [];
        
    for (let i = 0; i < count; i++) {
        const csvColumnDescriptor = sinon.createStubInstance(CsvColumnDescriptor);
        csvColumnDescriptor.outputHeader = 'Header '+ i.toString();
        mocks.push(csvColumnDescriptor);
    }

    return mocks;
}
