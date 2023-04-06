const fs = require("fs");
const readline = require("readline");
const yargs = require("yargs");
const argv = yargs
  .locale("en")
  .usage("$0 checks whether the year is a leap year or not.")
  .option("list", {
    alias: "l",
  })
  .option("reference", {
    description: "Choose a note you want to see:",
    alias: "r",
  })
  .option("delete", {
    description: "Choose a note you want to delete:",
    alias: "d",
  })
  .alias("h", "help")
  .alias("v", "version")
  .example(
    "$0 -y 2022 -f short",
    'Show message such as "22 is NOT a Leap Year". "22" is formatted year as you specified by -f parameter, and tell whether the year is leap year or not.'
  )
  .epilog("Copyright 2022 Masa all Rights Reserved.").argv;

//console.log(`l=${argv.list},r=${argv.reference},d=${argv.delete}`);

function getFileList() {
  const files = fs.readdirSync(`./memolist`);
  return files.map((fileName) => {
    const filePath = `./memolist/${fileName}`;
    const firstLine = fs.readFileSync(filePath, "utf8").split("\n")[0];
    return { message: firstLine, value: fileName };
  });
}

if (argv.list) {
  const files = fs.readdirSync("./memolist");
  for (let file of files) {
    const text = fs.readFileSync(`./memolist/${file}`, "utf8");
    const lines = text.toString().split("\n");
    console.log(lines[0]);
  }
} else if (argv.reference) {
  const { Select } = require("enquirer");
  const prompt = new Select({
    name: "file_name",
    message: "Choose a note you want to see:",
    choices: getFileList(),
  });
  prompt
    .run()
    .then((answer) => {
      console.dir(answer);
      const fileContent = fs.readFileSync(`./memolist/${answer}`, "utf8");
      console.log(fileContent);
    })
    .catch(console.error);
} else if (argv.delete) {
  const { Select } = require("enquirer");
  const prompt = new Select({
    name: "file_name",
    message: "Choose a note you want to delete:",
    choices: getFileList(),
  });
  prompt
    .run()
    .then((answer) => {
      fs.unlinkSync(`./memolist/${answer}`);
      console.log("text was deleted");
    })
    .catch(console.error);
} else {
  let filename = Math.random().toString(32).substring(2);
  const data = [];

  let reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  reader.on("line", (line) => {
    data.push(line);
  });
  reader.on("close", () => {
    fs.writeFile(
      `./memolist/${filename}.txt`,
      data.join("\n"),
      function (error) {
        console.log("エラーが発生しました。" + error);
      }
    );
  });
}
