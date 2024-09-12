const { updateLocalData } = require("./helpers");
const fs = require("fs");

async function updateStatusLocalData(handle) {
  try {
    let problems = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}`
    );
    problems = await problems.json();
    fs.writeFileSync(
      `statusData_${handle}.json`,
      JSON.stringify(problems, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error(`Error updating data for ${handle}:`, error);
  }
}

const cache = async function (config) {
  if (config.updateCache) {
    await updateLocalData(
      `https://codeforces.com/api/contest.list?gym=false`,
      "contestsData.json"
    );
    await updateLocalData(
      "https://codeforces.com/api/problemset.problems",
      "problemSetData.json"
    );
    // Update local data for each handle
    for (const handle of config.handles) {
      await updateStatusLocalData(handle);
    }
  }
};
module.exports = cache;
