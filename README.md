
# Upsolver Tool

**Upsolver Tool** helps filter and select Codeforces problems based on various configurations and outputs them in a format ready for creating contests on **VJudge**.

## Features
- A variety of customization options to tailor your training or that of your trainees, optimizing the learning process by focusing on specific problem tags and difficulty ranges.
- Flexible options to train individually or in groups by ensuring no one in the group has solved the selected problems.
- Ensure no spoilers by avoiding contests you may want to participate in virtually.
- Filter problems by tags, rating, and contest types.


## Setup

### 1. Clone the repository
```bash
git clone https://github.com/haithamAbuElnasr/Upsolver-Tool.git

cd Upsolver-Tool
```
## Configure Settings
Edit the config.js file to set up your preferences. Each option is explained below:
```javascript
const { CODEFORCES_TAGS } = require("./tags");
const { CONTESTS_TYPES } = require("./contestsTypes");
const config = {
  updateCache: false,
  doNotSpoilContests: true,
  handles: ["Haithom"],
  outputFile: "upsolving",
  minRate: 1700,
  maxRate: 2000,
  minContestId: 500,
  maxContestId: 2500,
  skipTags: [CODEFORCES_TAGS.flows, CODEFORCES_TAGS.fft],
  tagsOnly: [],
  tagsOr: [CODEFORCES_TAGS.dp],
  tagsAnd: [],
  contestTypes: [CONTESTS_TYPES.EDUCATIONAL],
};

module.exports = config;

```


### updateCache:
Set this to true when you first use the tool to fetch the latest data from Codeforces. It is **required to run this at least once initially**. Additionally, whenever you update the handles list, you should set updateCache: true to refresh the data. Once the cache is updated, you can set it back to false for faster runs.


### doNotSpoilContests: 
When set to true, the tool will avoid selecting problems from contests that you haven't solved any problems from, ensuring you can participate virtually without spoilers.

### handles:
A list of Codeforces handles that the tool tracks. It checks which problems have already been solved by these handles and avoids selecting them. This option is useful for both solo training and group collaboration.



### outputFile:
The name of the file where the filtered problems will be saved. This file will be formatted and ready to be used directly in creating a VJudge contest.

### Tags Filters (tagsOr, tagsAnd, tagsOnly, skipTags):

tagsOr: The tool will include problems that have at least one of the tags specified.

tagsAnd: The tool will only include problems that contain all of the tags listed.

tagsOnly: Limits the results to problems that have only the specified tags (no extra tags).

skipTags: Problems that have any of these tags will be excluded from the results.

These filters help customize problem selection based on your focus areas, allowing you to focus on certain algorithms or techniques, or avoid specific types of problems.


## Run
```bash
 npm start
```










