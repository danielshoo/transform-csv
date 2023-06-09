import * as Crypto from "node:crypto";
import CsvColumnDescriptor, {Cell} from "../../src/csv-column-descriptor/CsvColumnDescriptor";
import * as assert from 'assert';
import * as sinon from 'sinon';

describe('CSV Column Descriptor', function () {
    describe('#validateHeader', function () {

        it('Returns true when the header validation regex matches', function () {
            const testColumnDescriptor = new CsvColumnDescriptor('Is A Cat Parent', /is\sa\scat\sparent/i, /true|false|1|0/i);
            assert.strictEqual(testColumnDescriptor.validateHeader("is a cat parent"), true);
        });

        it('Returns false when the header validation regex does not match', function () {
            const testColumnDescriptor = new CsvColumnDescriptor('Has a pet', /is\sa\sdog\sparent/i, /true|false|1|0/i);
            assert.strictEqual(testColumnDescriptor.validateHeader("is a cat parent"), false)
        });

        it('Returns true when the header validation is null', function () {
            const testColumnDescriptor = new CsvColumnDescriptor('Is A Cat Parent', null, /true|false|1|0/i);
            assert.strictEqual(testColumnDescriptor.validateHeader('could be anything'), true);
        });

        it('Bad input throws an exception', function () {
            const obviouslyBadDoublyTypeAssertion = { headerText: 'test 123 ' } as any as string;
            const testColumnDescriptor = new CsvColumnDescriptor('Is A Cat Parent', /is\sa\scat\sparent/i, /true|false|1|0/i);
            assert.throws(() => {
                testColumnDescriptor.validateHeader(obviouslyBadDoublyTypeAssertion)
            });
        });
    });

    describe('#validateCell', function () {

        it('Returns true when the cell validation regex matches', function () {
            const testColumnDescriptor = new CsvColumnDescriptor('Is A Cat Parent', null, /true|false|1|0/i);
            assert.strictEqual(testColumnDescriptor.validateCell("true"), true);
        });

        it('Returns false when the cell validation regex does not match', function () {
            const testColumnDescriptor = new CsvColumnDescriptor('Has a pet', null, /true|false|1|0/i);
            assert.strictEqual(testColumnDescriptor.validateCell("cat"), false)
        });

        it('Returns true when the cell validation is null', function () {
            const testColumnDescriptor = new CsvColumnDescriptor('Is A Cat Parent');
            assert.strictEqual(testColumnDescriptor.validateCell('could be anything'), true);
        });

        it('Bad input throws an exception', function () {
            const obviouslyBadDoublyTypeAssertion = { cellText: 'test 123 ' } as any as string;
            const testColumnDescriptor = new CsvColumnDescriptor('Has a pet', null, /true|false|1|0/i);
            assert.throws(() => {
                testColumnDescriptor.validateCell(obviouslyBadDoublyTypeAssertion)
            });
        });
    });

    describe("#transformCell", function () {

        it ("Transforms the cell value into a new string", function () {
            const hash = Crypto.createHash('sha256');
            const srcCell = new Cell("(P)ersonally (I)dentifying (I)nformation");
            const testColumnDescriptor = new CsvColumnDescriptor('Has a pet', null, null, (cellValue) => hash.update(cellValue).digest('hex'));
            const hashedCell = testColumnDescriptor.transformCell(srcCell);
            assert.ok(hashedCell.value.match(/^[a-fA-F0-9]{64}$/gm));
        });

        it ("Transform does nothing to the src-cell's value", function () {
            const srcCell = new Cell("yes");
            const testColumnDescriptor = new CsvColumnDescriptor('Has a pet');
            const newCell = testColumnDescriptor.transformCell(srcCell)
            assert.equal(newCell.value, srcCell.value);
        });

        it ("Bad input throws an exception", function () {
            const srcCell = { badValueKey: 'abc123' } as any as Cell;
            const testColumnDescriptor = new CsvColumnDescriptor('Has a pet', null, null, (cellValue) => cellValue.toUpperCase());
            assert.throws(() => {
                testColumnDescriptor.transformCell(srcCell)
            });
        });
    });

    describe("#hydrate/#dehydrate", function () {

        it ("CsvColumDescriptor.hydrate() returns a string from which a new CsvColumnDescriptor instance can be dehydrated from", function () {

            const testColumnDescriptor = new CsvColumnDescriptor('Has a pet', /test/, /123/, (cellValue) => cellValue.toUpperCase());
            const hydratedColumnDescriptor = testColumnDescriptor.hydrate();

            const reconstitutedColumnDescriptor = CsvColumnDescriptor.dehydrate(hydratedColumnDescriptor);
            const transformCellSpy = sinon.spy(reconstitutedColumnDescriptor, 'transformCell');

            const testCell = new Cell("yes");
            reconstitutedColumnDescriptor.transformCell(testCell);

            assert.ok('test'.match(reconstitutedColumnDescriptor.headerValidationRegex));
            assert.ok('123'.match(reconstitutedColumnDescriptor.cellValidationRegexp));

            assert.ok(transformCellSpy.calledOnce);
        });
    });
});
