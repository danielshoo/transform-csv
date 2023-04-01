import CsvColumnDescriptor from "../csv-column-descriptor/CsvColumnDescriptor";

export default class CsvFileDescriptor {

    csvColumnDescriptors: Array<CsvColumnDescriptor> = [];

    constructor(columnDescriptors: Array<CsvColumnDescriptor>) {
        this.csvColumnDescriptors = columnDescriptors;
    }

    get isHeaderRowRequired() {
        return this.csvColumnDescriptors.length > 1;
    }

    get isHeaderRowOptional() {
        return !this.isHeaderRowRequired;
    }

    getColumnHeaders() {
        return this.csvColumnDescriptors.map((columnDescriptor: CsvColumnDescriptor) => {
            return columnDescriptor.outputHeader;
        });
    }

    getCellTransforms() {
        return this.csvColumnDescriptors.map((columnDescriptor: CsvColumnDescriptor) => {
            return columnDescriptor.cellTransform;
        });
    }
}
