const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

class LSTreeCommand {
  constructor(flag, hash) {
    this.flag = flag;
    this.hash = hash;
  }

  execute() {
    const flag = this.flag;
    const hash = this.hash;

    const folder = hash.slice(0, 2);
    const file = hash.slice(2);

    const folderPath = path.join(process.cwd(), ".git", "objects", folder);
    const filePath = path.join(folderPath, file);

    if (!fs.existsSync(filePath))
      throw new Error(`No file with hash ${hash} exists`);

    if (!fs.existsSync(folderPath))
      throw new Error(`No file with hash ${hash} exists`);

    const compressedContent = fs.readFileSync(filePath);

    const output = zlib.inflateSync(compressedContent).toString().split("\0");

    const treeContent = output.slice(1).filter((o) => o.includes(" "));

    const names = treeContent.map(
      (content) => content.split(" ")[content?.split(" ").length - 1]
    );

    names.forEach((name) => process.stdout.write(name + "\n"));
  }
}

module.exports = LSTreeCommand;
