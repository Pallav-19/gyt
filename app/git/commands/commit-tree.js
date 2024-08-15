const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

class CommitTreeCommand {
  constructor(tree, message, parent) {
    this.treeSHA = tree;
    this.commitMessage = message;
    this.parentSHA = parent;
  }
  execute() {
    const tree = this.treeSHA;
    const parent = this.parentSHA;
    const message = this.commitMessage;

    const content = Buffer.concat([
      Buffer.from(`Tree SHA ${tree}\n`),
      Buffer.from(`Parent SHA ${parent ?? tree}\n`),
      Buffer.from(`Author Pallav-19 <pallavinvizag@gmail.com>\n`),
      Buffer.from(`Timestamp ${Date.now()}\n\n`),
      Buffer.from(`\u00A0\u00A0${message}`),
    ]);

    const header = Buffer.concat([Buffer.from(`commit ${content.length}\0`)]);

    const buffer = Buffer.concat([Buffer.from(header), content]);

    const hash = crypto.createHash("sha1").update(buffer).digest("hex");

    const toWriteFolderName = hash.slice(0, 2);
    const toWriteFileName = hash.slice(2);

    const folderPath = path.join(
      process.cwd(),
      ".git",
      "objects",
      toWriteFolderName
    );

    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath, { recursive: true });

    const compressedContent = zlib.deflateSync(buffer);

    fs.writeFileSync(path.join(folderPath, toWriteFileName), compressedContent);

    process.stdout.write(hash);
  }
}

module.exports = CommitTreeCommand;
