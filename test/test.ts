import * as Mocha from 'mocha';
import * as Path from 'path';
import * as Process from 'process';

const mocha = new Mocha();

mocha.addFile(Path.resolve(__dirname, 'csv-column-descriptor', 'index.ts'));
mocha.addFile(Path.resolve(__dirname, 'csv-file-rewriter', 'index.ts'));
mocha.addFile(Path.resolve(__dirname, 'csv-file-descriptor', 'index.ts'));


mocha.run((failures:any) => {
    Process.exit(failures ? 1 : 0);
});
