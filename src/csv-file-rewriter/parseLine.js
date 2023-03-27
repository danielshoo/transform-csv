const {parse} = require('csv-parse/sync');

module.exports = function(line) {
	
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