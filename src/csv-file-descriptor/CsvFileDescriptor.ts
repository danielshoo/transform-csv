import ColumnDescriptor from "../csv-column-descriptor/CsvColumnDescriptor";

export default class CsvFileDescriptor {

    csvColumnDescriptors: Array<ColumnDescriptor> = [];

    constructor(columnDescriptors: Array<ColumnDescriptor>) {
        this.csvColumnDescriptors = columnDescriptors;
    }

    get isHeaderRowRequired() {
        return this.csvColumnDescriptors.length > 1;
    }

    get isHeaderRowOptional() {
        return !this.isHeaderRowRequired;
    }

    getColumnHeaders() {
        return this.csvColumnDescriptors.map((columnDescriptor: ColumnDescriptor) => {
            return columnDescriptor.outputHeader;
        });
    }

    getCellTransforms() {
        return this.csvColumnDescriptors.map((columnDescriptor: ColumnDescriptor) => {
            return columnDescriptor.cellTransform;
        });
    }
}
