const JSONfn = require('jsonfn').JSONfn;

export class Cell {

    value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export default class CsvColumnDescriptor {

    outputHeader: string;
    headerValidationRegex?: RegExp;
    cellValidationRegexp?: RegExp;
    cellTransform?: (cellValue: string) => string;
    isRequired = true;

    constructor(
        outputHeader: string,
        headerValidationRegex: RegExp = /.*/,
        cellValidationRegex: RegExp = /.*/,
        cellTransform: ((val: string) => string) = (cellVal:string) => { return cellVal},
    ) {
        this.outputHeader = outputHeader;
        this.headerValidationRegex = headerValidationRegex;
        this.cellValidationRegexp = cellValidationRegex;
        this.cellTransform = cellTransform;
    }

    get isOptional() {
        return !this.isRequired;
    }

    validateHeader(header: string): boolean {
        return this.headerValidationRegex ? !!header.match(this.headerValidationRegex) : true;
    }

    validateCell(cellValue: string): boolean {
        return this.cellValidationRegexp ? !!cellValue.match(this.cellValidationRegexp) : true;
    }

    transformCell(cell: Cell): Cell {
        const srcCellVal = cell.value;
        const newCellVal = this.cellTransform ? this.cellTransform(srcCellVal) : srcCellVal;
        return new Cell(newCellVal);
    }

    hydrate() {
        const dto = {
            outputHeader: this.outputHeader,
            headerValidationRegex: this.headerValidationRegex?.source,
            cellValidationRegexp: this.cellValidationRegexp?.source,
            cellTransform: this.cellTransform?.toString(),
        };
        return JSONfn.stringify(dto);
    }

    static dehydrate(json: string) {

        const csvColumnDescriptorProperties = JSONfn.parse(json);

        return new CsvColumnDescriptor(
            csvColumnDescriptorProperties.outputHeader,
            new RegExp(csvColumnDescriptorProperties.headerValidationRegex),
            new RegExp(csvColumnDescriptorProperties.cellValidationRegexp),
            eval(csvColumnDescriptorProperties.cellTransform)
        );
    }
}
