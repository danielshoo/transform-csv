import {parse} from 'csv-parse/sync';

export default function(line) {
	
	return new Promise((resolve) => {
		
		try {
			const parsedLine = parse(line, {
				trim: true,
				delimiter: ',',
				quote: false,
			});
			
			resolve(parsedLine[0]);
		} catch (e) {
			resolve("");
		}
		
	});
}