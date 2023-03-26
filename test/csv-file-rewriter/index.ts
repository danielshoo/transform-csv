import {describe, it} from "mocha";
import CsvFileRewriter from "../../src/csv-file-rewriter/CsvFileRewriter";
import CsvFileDescriptor from "../../src/csv-file-descriptor/CsvFileDescriptor";
import CsvColumnDescriptor from "../../src/csv-column-descriptor/CsvColumnDescriptor";
const assert = require('node:assert');
const sinon = require("sinon");



describe("CsvFileRewriter", function() {
    
    describe("#rewriteRow", function () {

        // const csvColumnDescriptorMocks = getCsvColumnDescriptorMocks(3);
        const csvFileDescriptorMock = sinon.createStubInstance(CsvFileDescriptor);
        const csvFileRewriter = new CsvFileRewriter(csvFileDescriptorMock);
        
        sinon.stub(csvFileRewriter, 'parseRow').returns(['secretemail@govt.com', 'top-level-clearance', 'active']);
        
        const rs = csvFileRewriter.rewriteRow("");
        
        console.log(rs);
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
