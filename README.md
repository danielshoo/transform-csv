## Transform CSV

This project is currently under development and is not ready to be published or forked.

###  Summary
Transform CSV's goal is to provide fast efficient CSV parsing with the ability to:
<ol>
 <li>Modify cell values</li>
 <li>Validate cell values</li>
 <li>Validate column headers</li>
 <li>Count cell values matching any number of patterns and</li>
 <li>Reorder columns</li>
</ol>

### Why?
Over my years as a LAMP  developer and now again as a Full Stack Frontend developer,
one thing has always been true. That is that companies and developers alike love CSVs. 
What they don't like is when those CSV are so massive that opening/modifying them brings their PC to a halt. 
What Transform CSV enables developers to do is take their precise expertise, which may not even be in Excel/Sheets.
and apply it to CSVs as they know how to do and to do it quickly with minimal memory overhead.


### Demo
To see the demo in action, please:

Clone the repo:
> git clone git@github.com:danielshoo/transform-csv.git

Run npm ci
> npm run ci

Run npm run demo
> npm run demo


This will output a USER_PII_share_ready.csv file where each column having PII
is hashed. The userID is retained. The person's condition has also been obfuscated
from being plain text description to being a status code.