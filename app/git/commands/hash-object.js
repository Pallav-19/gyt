const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");

class HashObjectCommand {
  constructor(flag, filePath) {
    this.flag = flag;
    this.filePath = filePath;
  }

  execute() {
    const filePath = this.filePath;
    const flag = this.flag;

    if (!filePath) throw new Error("Invaid file path");

    const unifiedFilePath = path.resolve(filePath);

    if (!fs.existsSync(unifiedFilePath))
      throw new Error(`cannot read file ${filePath}`);

    const fileContent = fs.readFileSync(unifiedFilePath);
    const fileContentLength = fileContent.length;

    const header = `blob ${fileContentLength}\0`;
    const blob = Buffer.concat([Buffer.from(header), fileContent]);

    const hash = crypto.createHash("sha1").update(blob).digest("hex");

    if (flag && flag === "-w") {
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

      const compressedContent = zlib.deflateSync(blob);

      fs.writeFileSync(
        path.join(folderPath, toWriteFileName),
        compressedContent
      );
    }

    process.stdout.write(hash);
  }
}

module.exports = HashObjectCommand;
