const CodeforcesSolver = require("./codeforcesSolver");
const config = require("./config");
const cache = require("./cache");

async function main() {
  await cache(config);
  const solver = new CodeforcesSolver(config);
  await solver.run();
}

main();
