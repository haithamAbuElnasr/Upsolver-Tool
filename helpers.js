const fs = require("fs");

async function updateLocalData(url, fileName) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
  }
}

module.exports = {
  updateLocalData,
};
