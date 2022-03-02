const fs = require("fs");
const readline = require("readline");
const XLSX = require("xlsx");

const INPUT_JSON_FILE = "assets/translation.json";
const OUTPUT_XLSX_FILE = "assets/translation.xlsx";
const TRANSLATED_XLSX_FILE = "assets/result.xlsx";
const OUTPUT_TRANSLATED_JSON_FILE = "assets/result.json";

// Main

(async () => {
  let values = [];
  let _error = null;

  if (!fs.existsSync(OUTPUT_XLSX_FILE)) {
    const ans1 = await askQuestion(
      `Have you placed the json you want to translate in this location |${INPUT_JSON_FILE}| (y/n)? `
    );
    switch (ans1) {
      case "n":
        console.log("Please perform this operation.");
        break;
      case "y":
        try {
          const obj = JSON.parse(fs.readFileSync(INPUT_JSON_FILE, "utf8"));
          values = getValues(obj);
          const ws = XLSX.utils.json_to_sheet(
            values.map((v) => {
              return { "[KEY_SHEET]": v.elm };
            })
          );
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Responses");
          XLSX.writeFile(wb, OUTPUT_XLSX_FILE);
          console.log(`XLSX |${OUTPUT_XLSX_FILE}| is saved.`);
        } catch (error) {
          _error = error;
          console.log("Generic error.");
        }
        break;
      default:
        console.log("Invalid response.");
        break;
    }

    if (ans1 !== "y" || _error) {
      return;
    }
    console.log("");
  }

  const ans2 = await askQuestion(
    `Did you translate with google translate the |${OUTPUT_XLSX_FILE}| and put in |${TRANSLATED_XLSX_FILE}| (y/n)? `
  );
  switch (ans2) {
    case "n":
      console.log("Please perform this operation.");
      break;
    case "y":
      try {
        const workbook = XLSX.readFile(TRANSLATED_XLSX_FILE);
        const sheetNames = workbook.SheetNames;
        const data = XLSX.utils
          .sheet_to_json(workbook.Sheets[sheetNames[0]])
          .map((v) => Object.values(v)[0].trim());
        const resultValues = [];
        for (let index = 0; index < values.length; index++) {
          const { key } = values[index];
          resultValues[key] = data[index];
        }
        const resultObj = createJSONStructure(resultValues);
        const resultData = JSON.stringify(resultObj, null, 2);
        fs.writeFile(OUTPUT_TRANSLATED_JSON_FILE, resultData, (err) => {
          if (err) {
            throw err;
          }
          console.log(`JSON |${OUTPUT_TRANSLATED_JSON_FILE}| is saved.`);
        });
      } catch (error) {
        console.log("Generic error.");
      }
      break;
    default:
      console.log("Invalid response.");
      break;
  }
})();

// Utils

function getValues(obj) {
  let values = [];
  function printValues(obj, prevK) {
    for (var k in obj) {
      const key = !prevK ? k : `${prevK}.${k}`;
      if (obj[k] instanceof Object) {
        printValues(obj[k], key);
      } else {
        values.push({ key, elm: obj[k] });
      }
    }
  }
  printValues(obj);
  return values;
}

function createJSONStructure(obj) {
  Object.keys(obj).forEach(function (k) {
    var prop = k.split(".");
    if (prop.length > 1) {
      var last = prop.pop();
      prop.reduce(function (o, key) {
        return (o[key] = o[key] || {});
      }, obj)[last] = obj[k];
      delete obj[k];
    }
  });
  return { ...obj };
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      console.log("");
      resolve(ans);
    })
  );
}
