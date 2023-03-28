
import * as path from "node:path";

const CsvFileRewriter = require('./src/csv-file-rewriter/CsvFileRewriter');
const {default: CsvFileDescriptor} = require('./src/csv-file-descriptor/CsvFileDescriptor');
const {default: CsvColumnDescriptor} = require('./src/csv-column-descriptor/CsvColumnDescriptor');

function fnHashCellValue(cellValue) {
    const Crypto = require("node:crypto");
    const hash = Crypto.createHash('sha256');

    // In practice, this entire file would be client code and with a non-published salt pulled from a DB or environment file
    const hashSalt = 'always1 salt2. Rainbow tables are bad1@!#';

    return hash.update(hashSalt + cellValue).digest('hex');
}

// In practice, this entire file would be client code and with a non-published salt pulled from a DB or environment file
const hashSalt = 'always1 salt2. Rainbow tables are bad1@!#';

const userIdColumnDescriptor = new CsvColumnDescriptor(
    'userID',
    /user[ ]?id/i,
    /\d*/
);


const conditionColumnDescriptor = new CsvColumnDescriptor(
    'secret header 1',
    /state|condition/i,
    null,
    (cellVal) => {
        switch (cellVal) {
            case 'stable':
                return 'code 1';
            case 'critical':
                return 'code 2';
            default:
                return 'code 0';
        }
    }
);

const firstNameColumnDescriptor = new CsvColumnDescriptor(
    'secret header 2',
    /first[ ]?name/i,
    null,
    fnHashCellValue
);

const lastNameColumnDescriptor = new CsvColumnDescriptor(
    'secret header 3',
    /last[ ]?name/i,
    null,
    fnHashCellValue
);

// email validation regex copied from https://stackoverflow.com/a/201378
const emailColumnDescriptor = new CsvColumnDescriptor(
    'email',
    /email[ ]?address/i,
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    fnHashCellValue
)


const csvFileDescriptor = new CsvFileDescriptor(
    [
        userIdColumnDescriptor,
        firstNameColumnDescriptor,
        lastNameColumnDescriptor,
        emailColumnDescriptor,
        conditionColumnDescriptor,
    ]
);

const csvFileRewriter = new CsvFileRewriter();
csvFileRewriter.rewriteFile(csvFileDescriptor, path.resolve(__dirname, 'USER_PII.csv'), path.resolve(__dirname, 'USER_PII_share_ready.csv'))
.then(successMessage => {

})
.catch(errorMessage => {
    console.log(errorMessage);
})