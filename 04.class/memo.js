const fs = require("fs").promises;
const readline = require("readline");
const yargs = require("yargs");
const path = require("path");
const { Select } = require("enquirer");
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
  .alias("v", "version").argv;

const directoryPath = "./memolist";

if (argv.list) {
  async function get_fileData() {
    try {
      await fs.access(directoryPath, fs.constants.F_OK);
      const files = await fs.readdir(directoryPath);
      if (files.length === 0) {
        console.log("memoはありません");
      } else {
        for (let file of files) {
          const filePath = path.join(directoryPath, file);
          const text = await fs.readFile(filePath, { encoding: "utf8" });
          const firstLine = text.toString().split("\n")[0];
          console.log(firstLine);
        }
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("memoはありません");
      } else {
        console.log(err);
      }
    }
  }
  get_fileData();
} else if (argv.reference) {
  async function get_file_info() {
    const fileinfos = [];
    try {
      await fs.access(directoryPath, fs.constants.F_OK);
      const fileNames = await fs.readdir(directoryPath);
      if (fileNames.length === 0) {
        console.log("memoはありません");
      } else {
        for (let fileName of fileNames) {
          const filePath = path.join(directoryPath, fileName);
          const fileContent = await fs.readFile(filePath, { encoding: "utf8" });
          const firstLine = fileContent.split("\n")[0];
          fileinfos.push({ message: firstLine, value: fileName });
        }
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("memoはありません");
      } else {
        console.log(err);
      }
    }
    return fileinfos;
  }

  async function get_file_content(fileName) {
    try {
      const filePath = path.join(directoryPath, fileName);
      const fileContent = await fs.readFile(filePath, "utf8");
      return fileContent;
    } catch (err) {
      console.log(err);
    }
  }

  (async () => {
    const fileinfos = await get_file_info();
    if (fileinfos.length > 0) {
      const prompt = new Select({
        name: "file_name",
        message: "Choose a note you want to see:",
        choices: fileinfos,
      });
      prompt
        .run()
        .then((fileName) => {
          return get_file_content(fileName);
        })
        .then((fileContent) => {
          console.log(fileContent);
        })
        .catch(console.error);
    }
  })();
} else if (argv.delete) {
  async function get_file_info() {
    const fileinfos = [];
    try {
      await fs.access(directoryPath, fs.constants.F_OK);
      const fileNames = await fs.readdir(directoryPath);
      if (fileNames.length === 0) {
        console.log("memoはありません");
      } else {
        for (let fileName of fileNames) {
          const filePath = path.join(directoryPath, fileName);
          const file_content = await fs.readFile(filePath, {
            encoding: "utf8",
          });
          const firstLine = file_content.split("\n")[0];
          fileinfos.push({ message: firstLine, value: fileName });
        }
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("memoはありません");
      } else {
        console.log(err);
      }
    }
    return fileinfos;
  }

  async function delete_file(file_name) {
    try {
      const filePath = path.join(directoryPath, file_name);
      await fs.unlink(filePath);
    } catch (err) {
      console.log(err);
    }
  }

  (async () => {
    const fileinfo = await get_file_info();
    if (fileinfo.length > 0) {
      const prompt = new Select({
        name: "file_name",
        message: "Choose a note you want to see:",
        choices: fileinfo,
      });
      prompt
        .run()
        .then((filename) => {
          return delete_file(filename);
        })
        .catch(console.error);
    }
  })();
} else {
  const filename = Math.random().toString(32).substring(2);
  const data = [];
  async function checkDirectory(directoryPath) {
    try {
      await fs.access(directoryPath);
    } catch (err) {
      if (err.code === "ENOENT") {
        try {
          await fs.mkdir(directoryPath);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error(err);
      }
    }
  }

  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  reader.on("line", (line) => {
    data.push(line);
  });
  reader.on("close", () => {
    async function get_fileData() {
      try {
        await checkDirectory(directoryPath);
        const filePath = path.join(directoryPath, filename);
        await fs.writeFile(filePath, data.join("\n"));
      } catch (err) {
        console.error(err);
      }
    }
    get_fileData();
  });
}
