const fs = require("fs");

class CodeforcesSolver {
  constructor(config) {
    this.handles = config.handles;
    this.outputFile = config.outputFile;
    this.minRate = config.minRate;
    this.maxRate = config.maxRate;
    this.minContestId = config.minContestId;
    this.skipTags = config.skipTags;
    this.tagsOr = config.tagsOr;
    this.tagsAnd = config.tagsAnd;
    this.tagsOnly = config.tagsOnly;
    this.contestTypes = config.contestTypes;
    this.maxContestId = config.maxContestId;
    this.doNotSpoilContests = config.doNotSpoilContests;
    this.counter = 1;
    this.sumOfRates = {};
    this.solved = {};
  }

  // Adjust calcAvarageRate to track by user
  calcAvarageRate(rating, handle) {
    if (!rating) return;
    if (!this.sumOfRates[handle])
      this.sumOfRates[handle] = { total: 0, count: 0 };
    this.sumOfRates[handle].total += rating;
    this.sumOfRates[handle].count++;
  }
  checkTags(tags) {
    // If skipTags has any tag that matches the problem's tags, skip the problem
    if (this.skipTags.length > 0 && this.skipTags.some((tag) => tags.includes(tag))) {
      return false;
    }
  
    // If tagsAnd is provided, all of those tags must be present in the problem's tags
    if (this.tagsAnd.length > 0 && !this.tagsAnd.every((tag) => tags.includes(tag))) {
      return false;
    }
  
    // If tagsOr is provided, at least one tag must be present in the problem's tags
    if (this.tagsOr.length > 0 && !this.tagsOr.some((tag) => tags.includes(tag))) {
      return false;
    }
  
    // If tagsOnly is provided, the problem's tags must exactly match those in tagsOnly
    if (
      this.tagsOnly.length > 0 &&
      (tags.length !== this.tagsOnly.length || !this.tagsOnly.every((tag) => tags.includes(tag)))
    ) {
      return false;
    }
  
    // If none of the above conditions trigger a false, return true
    return true;
  }
  

  async markSolved() {
    for (const handle of this.handles) {
      let problems = JSON.parse(
        fs.readFileSync(`statusData_${handle}.json`, "utf-8")
      );
      problems = problems.result;
      problems.forEach((element) => {
        if (element.verdict === "OK") {
          this.calcAvarageRate(element.problem.rating, handle);

          // Initialize the solved structure if it doesn't exist
          if (!this.solved[element.contestId]) {
            this.solved[element.contestId] = {};
          }

          // Mark the problem as solved if any user has solved it
          this.solved[element.contestId][element.problem.index] = true;
        }
      });
    }
  }

  checkProblem({ rating, contestId, index, tags }) {
    // Ensure the contestId is greater than the minimum allowed contest ID
    if (contestId < this.minContestId || contestId > this.maxContestId)
      return false;

    // Ensure the index length is exactly 1 (e.g., A, B, C)
    if (index.length !== 1) return false;

    if (this.doNotSpoilContests && !this.solved[contestId]) return false;
    // Check if the contest has no solved problems or the specific problem is already solved
    if (this.solved[contestId]?.[index]) return false;

    // Check if the problem has a valid rating
    if (!rating || rating < this.minRate || rating > this.maxRate) return false;

    return this.checkTags(tags);
  }

  getProblems(problemSetData) {
    let output = "";
    problemSetData.reverse().forEach((problem) => {
      if (this.checkProblem(problem)) {
        output += `CodeForces | ${problem.contestId}${problem.index} | 1 |\n`;
      }
    });
    fs.writeFileSync(`./${this.outputFile}.txt`, output);
  }

  skipContests(contestsData) {
    contestsData.forEach((contest) => {
      if (!this.solved[contest.id]) return;
      let ok = this.contestTypes.length === 0;
      this.contestTypes.forEach((type) => {
        ok |= contest.name.includes(type);
      });

      if (!ok || contest.id < this.minContestId) {
        delete this.solved[contest.id]; // Delete the entry instead of setting it to false
      }
    });
  }

  async run() {
    try {
      await this.markSolved();
      const contestsData = JSON.parse(
        fs.readFileSync("contestsData.json", "utf-8")
      ).result;

      this.skipContests(contestsData);

      const problemSetData = JSON.parse(
        fs.readFileSync("problemSetData.json", "utf-8")
      ).result.problems;

      this.getProblems(problemSetData);

      // Print statistics
      for (const handle of this.handles) {
        const avgRate =
          this.sumOfRates[handle]?.total / this.sumOfRates[handle]?.count || 0;
        console.log(
          `Number of solved problems by ${handle}: ${this.sumOfRates[handle]?.count}`
        );
        console.log(`Average rate for ${handle}: ${avgRate}\n`);
      }
    } catch (error) {
      console.error("Error in processing:", error);
    }
  }
}

module.exports = CodeforcesSolver;
