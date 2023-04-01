import readFirstLine from './readFirstLine';
import parseLine from './parseLine';

export default async function getColumnMapping(csvFileDescriptor, srcFilePath) {

	const columnMapping = {};
	const missingColumns = [];
	const firstLine = await readFirstLine(srcFilePath);
	const actualColumnHeaders = await parseLine(firstLine);
	const expectedColumnHeaders = csvFileDescriptor.getColumnHeaders();
	const expectedCsvColumnDescriptors = csvFileDescriptor.csvColumnDescriptors;
	
	
	for (let i = 0; i < expectedColumnHeaders.length; i++) {
		for (let j = 0; j < actualColumnHeaders.length; j++) {
			
			if (expectedCsvColumnDescriptors[i].validateHeader(actualColumnHeaders[j])) {
				
				if (columnMapping.hasOwnProperty(i)) { // Already matched and mapped. A one-t-many mapping is not something this rewriter is set up to hande.
					return Promise.reject(new Error('Ambiguous column name: ' + expectedColumnHeaders[i]));
				}
				
				columnMapping[i] = j;
			}
		}
		
		if (!columnMapping.hasOwnProperty(i) && expectedCsvColumnDescriptors[i].isOptional) {
			continue;
		}
		
		if (!columnMapping.hasOwnProperty(i) && expectedCsvColumnDescriptors[i].isRequired) {
			missingColumns.push(expectedColumnHeaders[i]);
		}
	}
	
	if (csvFileDescriptor.isHeaderRowOptional && missingColumns.length === expectedColumnHeaders.length) {
		columnMapping[0] = 0;
		return columnMapping;
	}
	
	if (missingColumns.length) {
		return Promise.reject(new Error('Invalid header: Columns [' + missingColumns.join(', ') + '] are missing'));
	}
	
	return columnMapping;
}