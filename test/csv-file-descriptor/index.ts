import {describe, it} from "mocha";
import CsvColumnDescriptor from "../../src/csv-column-descriptor/CsvColumnDescriptor";
import CsvFileDescriptor from "../../src/csv-file-descriptor/CsvFileDescriptor";
const assert = require('node:assert');
const sinon = require('sinon');


describe("CsvFileDescriptor", function() {
    describe("#getColumnHeaders", function() {
       it("Can get headers", function () {
           const csvColumnDescriptor1 = sinon.createStubInstance(CsvColumnDescriptor);
           csvColumnDescriptor1.outputHeader = 'Header 1';
           const csvColumnDescriptor2 = sinon.createStubInstance(CsvColumnDescriptor);
           csvColumnDescriptor2.outputHeader = 'Header 2';
           const csvColumnDescriptor3 = sinon.createStubInstance(CsvColumnDescriptor);
           csvColumnDescriptor3.outputHeader = 'Header 3';
           const csvFileDescriptor = new CsvFileDescriptor([csvColumnDescriptor1, csvColumnDescriptor2, csvColumnDescriptor3]);
           assert.deepEqual(['Header 1', 'Header 2', 'Header 3'], csvFileDescriptor.getColumnHeaders());
       }); 
    });
});


