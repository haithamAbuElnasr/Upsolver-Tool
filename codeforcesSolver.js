const fs = require("fs");

class CodeforcesSolver {
  constructor(config) {
    this.config = config;
    this.sumOfRates = {};
    this.solved = {};
    this.badContest = {};
  }

  calcAverageRate(rating, handle) {
    if (!rating) return;
    const sum = (this.sumOfRates[handle] ||= { total: 0, count: 0 });
    sum.total += rating;
    sum.count++;
  }

  checkTags(tags) {
    const { skipTags, tagsAnd, tagsOr, tagsOnly } = this.config;
    if (
      (skipTags.length && skipTags.some((tag) => tags.includes(tag))) ||
      (tagsAnd.length && !tagsAnd.every((tag) => tags.includes(tag))) ||
      (tagsOr.length && !tagsOr.some((tag) => tags.includes(tag))) ||
      (tagsOnly.length && (tags.length !== tagsOnly.length || !tagsOnly.every((tag) => tags.includes(tag))))
    ) {
      return false;
    }
    return true;
  }

  async markSolved() {
    for (const handle of this.config.handles) {
      const problems = JSON.parse(fs.readFileSync(`statusData_${handle}.json`, "utf-8")).result;
      problems.forEach(({ verdict, problem: { rating, contestId, index } }) => {
        if (verdict === "OK") {
          this.calcAverageRate(rating, handle);
          (this.solved[contestId] ||= {})[index] = true;
        }
      });
    }
  }

  checkContest(contestId) {
    const { minContestId, maxContestId } = this.config;
    return contestId >= minContestId && contestId <= maxContestId && !this.badContest[contestId];
  }

  checkProblem({ rating, contestId, index, tags }) {
    const { minRate, maxRate } = this.config;
    return (
      index.length === 1 &&
      !this.solved[contestId]?.[index] &&
      rating >= minRate &&
      rating <= maxRate &&
      this.checkContest(contestId) &&
      this.checkTags(tags)
    );
  }

  getProblems(problemSetData) {
    const output = problemSetData
      .filter((problem) => this.checkProblem(problem))
      .map(({ contestId, index }) => `CodeForces | ${contestId}${index} | 1 |\n`)
      .join("");
    fs.appendFileSync(`./${this.config.outputFile}.txt`, output);
  }

  skipContests(contestsData) {
    const { doNotSpoilContests, contestTypes } = this.config;
    contestsData.forEach(({ id, name }) => {
      const isBad = doNotSpoilContests && !this.solved[id];
      this.badContest[id] = isBad || (contestTypes.length && !contestTypes.some((type) => name.includes(type)));
    });
  }

  async run() {
    try {
      await this.markSolved();
      const contestsData = JSON.parse(fs.readFileSync("contestsData.json", "utf-8")).result;
      this.skipContests(contestsData);
      const problemSetData = JSON.parse(fs.readFileSync("problemSetData.json", "utf-8")).result.problems;
      this.getProblems(problemSetData);
      this.config.handles.forEach((handle) => {
        const avgRate = this.sumOfRates[handle]?.total / this.sumOfRates[handle]?.count || 0;
        console.log(`Number of solved problems by ${handle}: ${this.sumOfRates[handle]?.count}`);
        console.log(`Average rate for ${handle}: ${avgRate}\n`);
      });
    } catch (error) {
      console.error("Error in processing:", error);
    }
  }
}

module.exports = CodeforcesSolver;
