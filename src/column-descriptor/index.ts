export class Cell {

    value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export default class ColumnDescriptor {

    outputHeader: string;
    headerValidationRegex?: RegExp;
    cellValidationRegexp?: RegExp;
    cellTransform?: (cellValue: string) => string;

    constructor(
        outputHeader: string,
        headerValidationRegex?: RegExp,
        cellValidationRegex?: RegExp,
        cellTransform?: (val:string) => string
    ) {
        this.outputHeader = outputHeader;
        this.headerValidationRegex = headerValidationRegex;
        this.cellValidationRegexp = cellValidationRegex;
        this.cellTransform = cellTransform;
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
}
