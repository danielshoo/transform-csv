import {parse} from 'csv-parse/sync';

export default function(line) {
		
	try {
		const parsedLine = parse(line, {
			trim: true,
			delimiter: ',',
			quote: false,
		});

		return parsedLine[0];
	} catch (e) {
		return "";
	}
}