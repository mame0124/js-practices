const fs = require("fs").promises;
const readline = require("readline");
const yargs = require("yargs");
const path = require("path");
const { Select } = require("enquirer");
const argv = yargs
  .locale("en")
  .usage("Save and view memos.")
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

class Memo {
  constructor() {
    this.text = [];
  }
  add(addText) {
    this.text.push(addText);
  }
  async save(directoryPath) {
    try {
      await this.checkDirectory(directoryPath);
      const filePath = path.join(
        directoryPath,
        Math.random().toString(32).substring(2)
      );
      fs.writeFile(filePath, this.text.join("\n"));
    } catch (err) {
      console.error(err);
    }
  }
  async checkDirectory(directoryPath) {
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
}

class File {
  constructor(filePath) {
    this.path = filePath;
    this.fileName = path.basename(filePath);
  }
  async get_firstLine_and_fileName() {
    const content = await fs.readFile(this.path, { encoding: "utf8" });
    const firstLine = content.split("\n")[0];
    return { message: firstLine, value: this.fileName };
  }
  async get_content() {
    try {
      const content = await fs.readFile(this.path, "utf8");
      return content;
    } catch (err) {
      console.log(err);
    }
  }
  async delete_file() {
    try {
      await fs.unlink(this.path);
    } catch (err) {
      console.log(err);
    }
  }
}

class MemoDirectory {
  constructor(directoryPath) {
    this.path = directoryPath;
  }
  async getFileinfo() {
    const fileinfos = [];
    try {
      await fs.access(this.path, fs.constants.F_OK);
      const fileNames = await fs.readdir(this.path);
      if (fileNames.length === 0) {
        console.log("memoはありません");
      } else {
        for (let fileName of fileNames) {
          const filePath = path.join(this.path, fileName);
          const file = new File(filePath);
          fileinfos.push(file);
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
}

if (argv.list) {
  (async () => {
    const memolistDirectory = new MemoDirectory(directoryPath);
    const files = await memolistDirectory.getFileinfo();
    if (files.length > 0) {
      for (let file of files) {
        const content = await file.get_content();
        const firstLine = content.toString().split("\n")[0];
        console.log(firstLine);
      }
    }
  })();
} else if (argv.reference) {
  (async () => {
    const memolistDirectory = new MemoDirectory(directoryPath);
    const files = await memolistDirectory.getFileinfo();
    if (files.length > 0) {
      const firstLine_and_fileName = files.map(async (file) => {
        return await file.get_firstLine_and_fileName();
      });

      const prompt = new Select({
        name: "file_name",
        message: "Choose a note you want to see:",
        choices: firstLine_and_fileName,
      });
      prompt
        .run()
        .then((fileName) => {
          return new File(path.join(directoryPath, fileName)).get_content();
        })
        .then((fileContent) => {
          console.log(fileContent);
        })
        .catch(console.error);
    }
  })();
} else if (argv.delete) {
  (async () => {
    const memolistDirectory = new MemoDirectory(directoryPath);
    const files = await memolistDirectory.getFileinfo();
    if (files.length > 0) {
      if (files.length > 0) {
        const firstLine_and_fileName = files.map(async (file) => {
          return await file.get_firstLine_and_fileName();
        });
        const prompt = new Select({
          name: "file_name",
          message: "Choose a note you want to see:",
          choices: firstLine_and_fileName,
        });
        prompt
          .run()
          .then((filename) => {
            const memo = new File(path.join(directoryPath, filename));
            return memo.delete_file();
          })
          .catch(console.error);
      }
    }
  })();
} else {
  const memo = new Memo();
  const reader = readline.createInterface({
    input: process.stdin,
  });
  reader.on("line", (line) => {
    memo.add(line);
  });
  reader.on("close", () => {
    (async () => {
      await memo.save(directoryPath);
    })();
  });
}
