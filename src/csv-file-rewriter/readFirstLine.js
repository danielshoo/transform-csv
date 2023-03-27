const fs = require("node:fs")
const {EOL} = require("node:os")

module.exports = function(srcFilePath) {
	
	return new Promise((resolve, reject) => {
		
		const readStream = fs.createReadStream(srcFilePath, {
			flags: 'a+',
			encoding: 'utf-8',
		});
		
		readStream.on('data', (chunk) => {
			
			const lineBuffer = chunk.split(EOL);
			
			readStream.close();
			
			resolve(lineBuffer[0]);
		});
	});
}