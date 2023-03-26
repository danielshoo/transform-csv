import ColumnDescriptor from "../csv-column-descriptor/CsvColumnDescriptor";

export default class CsvFileDescriptor {
    
    columnDescriptors: Array<ColumnDescriptor>;
    
    constructor(columnDescriptors: Array<ColumnDescriptor>) {
        this.columnDescriptors = columnDescriptors;
    }
    
    getColumnHeaders() {
        return this.columnDescriptors.map((columnDescriptor: ColumnDescriptor, i) => {
            return columnDescriptor.outputHeader;
        });
    }
}
