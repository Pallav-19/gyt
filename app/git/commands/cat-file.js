const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

class CatFileCommand {
  constructor(flag, objectSHA) {
    this.flag = flag;
    this.objectSHA = objectSHA;
  }

  execute() {
    const flag = this.flag;
    const objectSHA = this.objectSHA;

    switch (flag) {
      case "-p":
        {
          const objectDirectory = objectSHA.slice(0, 2);
          const objectFileName = objectSHA.slice(2);

          const objectFilePath = path.join(
            process.cwd(),
            ".git",
            "objects",
            objectDirectory,
            objectFileName
          );

          if (!fs.existsSync(objectFilePath)) {
            throw new Error("File does not exists");
          }

          const compressedOjectContent = fs.readFileSync(objectFilePath);

          const uncompressedObjectContent = zlib.inflateSync(
            compressedOjectContent
          );

          const content = uncompressedObjectContent.toString().split("\x00")[1];

          process.stdout.write(content);
        }
        break;

      default:
        break;
    }
  }
}

module.exports = CatFileCommand;
