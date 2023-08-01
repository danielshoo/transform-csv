## Transform CSV

This project is currently under development and is not ready to be published or forked.

###  Summary
Transform CSV's goal is to provide fast efficient CSV parsing with the ability to:
<ol>
 <li>Modify cell values</li>
 <li>Validate cell values</li>
 <li>Validate column headers</li>
 <li>Count cell values matching any number of patterns</li>
 <li>Reorder columns</li>
</ol>

### Why?
Over my years as a LAMP  developer and now again as a Full Stack Frontend developer,
one thing has always been true. That is that companies and developers alike love CSVs. 
What they don't like is when those CSV are so massive that opening/modifying them brings their PC to a halt. 
Transform CSV enables developers to programmatically alter CSVs en masse with minimal memory usage and multi-threading for speed.


### Demo
To see the demo in action, please:

Clone the repo:
> git clone git@github.com:danielshoo/transform-csv.git

Install packages to their last known stable versions:
> npm ci

Run npm run demo
> npm run demo


This will output a USER_PII_share_ready.csv file where each column having PII
is hashed. The userID is retained. The person's condition has also been obfuscated
from being a plain text description to being a status code.
