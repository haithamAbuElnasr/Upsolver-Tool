const { CODEFORCES_TAGS } = require("./tags");
const { CONTESTS_TYPES } = require("./contestsTypes");
const config = {
  updateCache: true, // turn it on only when needed cuse feteching data take a long time
  doNotSpoilContests: true,
  handles: ["Haithom"], // List of handles
  outputFile: "all",
  minRate: 1900,
  maxRate: 2300,
  minContestId: 500,
  maxContestId: 2500,
  skipTags: [
    CODEFORCES_TAGS.stringSuffixStructures,
    CODEFORCES_TAGS.graphMatchings,
    CODEFORCES_TAGS.games,
    CODEFORCES_TAGS.flows,
    CODEFORCES_TAGS.fft,
    CODEFORCES_TAGS.chineseRemainderTheorem,
    CODEFORCES_TAGS.twoSat,
    ,
  ], //Problems with these tags will be skipped
  tagsOnly: [], // Must have only these tags (no more, no less)
  tagsOr: [CODEFORCES_TAGS.dp], // Must have at least one of these tags
  tagsAnd: [], // Must have all of these tags
  contestTypes: [CONTESTS_TYPES.EDUCATIONAL],
};

module.exports = config;
