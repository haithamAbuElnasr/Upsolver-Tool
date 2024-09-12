const fs = require("fs");

const HANDLE = "Haithom";
const outputFile = "A";
const MIN_RATE = 1200;
const MAX_RATE = 1300;
const MIN_CONTEST_ID = 1621;
let counter = 1,
  sumOfRate = 0,
  numberOfProblems = 0;
const SIKIP_TAGS = [
  // "math",
  // "constructive algorithms",
  // "combinatorics",
  // "probabilities",
  // "number theory",
  // "interactive",
  "games",
  "geometry",
  "chinese remainder theorem",
  "2-sat",
  "flows",
  "fft",
];
const FOCUS_TAGS = [
  "implementation",
  // "constructive algorithms",
  // "combinatorics",
  // "interactive",
  // "math",
  // "probabilities",
  // "number theory",
  // "greedy",
];
const CONTEST_TYPE = [
  //"Div. 2",
  //"Div. 4",
  //"Div. 3",
  //"Educational",
];

let solved = {};

function calcAvarageRate(rating) {
  if (!rating) return;
  (sumOfRate += rating), numberOfProblems++;
}
async function updateContestsLocalData() {
  let problems = await fetch(
    `https://codeforces.com/api/contest.list?gym=false`
  );

  problems = await problems.json();

  fs.writeFileSync(
    "contestsData.json",
    JSON.stringify(problems, null, 2),
    "utf-8"
  );
}
async function updateStatusLocalData() {
  let problems = await fetch(
    `https://codeforces.com/api/user.status?handle=${HANDLE}`
  );

  problems = await problems.json();

  fs.writeFileSync(
    "statusData.json",
    JSON.stringify(problems, null, 2),
    "utf-8"
  );
}

async function updateProblemSetLocalData() {
  let problems = await fetch("https://codeforces.com/api/problemset.problems");

  problems = await problems.json();

  fs.writeFileSync(
    "problemSetData.json",
    JSON.stringify(problems, null, 2),
    "utf-8"
  );
}

function markSolved() {
  let problems = JSON.parse(fs.readFileSync("statusData.json", "utf-8"));
  problems = problems.result;
  problems.forEach((element) => {
    if (element.verdict === "OK") {
      calcAvarageRate(element.problem.rating);
      if (!solved[element.contestId]) solved[element.contestId] = {};
      solved[element.contestId][element.problem.index] = true;
    }
  });
}

function check(element) {
  let { rating, contestId, index, tags } = element;

  if (!solved[contestId]) return false;
  if (solved[contestId][index]) return false;
  if (!rating) return false;
  if (rating > MAX_RATE) return false;
  if (rating < MIN_RATE) return false;
  if (index.length > 1) return false;

  let ok = true;
  SIKIP_TAGS.forEach((tag) => {
    if (tags.includes(tag)) {
      ok = false;
    }
  });
  if (!ok) return false;

  ok = FOCUS_TAGS.length == 0;
  FOCUS_TAGS.forEach((tag) => {
    if (tags.includes(tag)) {
      ok = true;
    }
  });

  return ok;
}

function getProblems() {
  let problems = JSON.parse(fs.readFileSync("problemSetData.json", "utf-8"));
  problems = problems.result.problems;
  problems.reverse();
  problems.forEach((problem) => {
    if (check(problem)) {
      fs.appendFileSync(
        `./${outputFile}.txt`,
        `CodeForces	|	${problem.contestId}${problem.index}	|	1	|\n`
      );
      if (counter % 5 == 0) {
        //fs.appendFileSync(`./${outputFile}.txt`, `\n`);
      }
      solved[problem.contestId][problem.index] = true;
      counter++;
    }
  });
}
function skipContests() {
  let contests = JSON.parse(fs.readFileSync("contestsData.json", "utf-8"));
  contests = contests.result;
  contests.forEach((contest) => {
    if (!solved[contest.id]) return;
    let ok = CONTEST_TYPE.length == 0;
    CONTEST_TYPE.forEach((type) => {
      ok |= contest.name.includes(type);
    });
    if (!ok || contest.id < MIN_CONTEST_ID) solved[contest.id] = false;
  });
}

async function main() {
  // await updateContestsLocalData();
  // await updateStatusLocalData();
  // await updateProblemSetLocalData();
  markSolved();
  skipContests();
  getProblems();
  console.log("Number of solved problems : ", numberOfProblems);
  console.log("Avarage rate : ", sumOfRate / numberOfProblems);
}

main();
