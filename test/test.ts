import * as Mocha from 'mocha';
import * as Path from 'path';
import * as Process from 'process';

const mochaObj = new Mocha();

mochaObj.run((failures:any) => {
    Process.exit(failures ? 1 : 0);
});