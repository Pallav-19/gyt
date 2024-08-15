const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

function writeFileBlob(directoryContentPath) {
  const fileContent = fs.readFileSync(directoryContentPath);

  const fileContentLength = fileContent.length;

  const header = `blob ${fileContentLength}\0`;

  const blob = Buffer.concat([Buffer.from(header), fileContent]);

  const hash = crypto.createHash("sha1").update(blob).digest("hex");

  const toWriteFolderName = hash.slice(0, 2);
  const toWriteFileName = hash.slice(2);

  const folderPath = path.join(
    process.cwd(),
    ".git",
    "objects",
    toWriteFolderName
  );

  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const compressedContent = zlib.deflateSync(blob);

  fs.writeFileSync(path.join(folderPath, toWriteFileName), compressedContent);

  return hash;
}

class WriteTreeCommand {
  execute() {
    function recursiveCreateTree(currentDirectory) {
      const directoryContents = fs.readdirSync(currentDirectory);

      const resultTreeArray = [];

      for (const directoryContent of directoryContents) {
        if (directoryContent.includes(".git")) continue;

        const directoryContentPath = path.join(
          currentDirectory,
          directoryContent
        );

        const stat = fs.statSync(directoryContentPath);

        if (stat.isDirectory()) {
          const sha = recursiveCreateTree(directoryContentPath);
          if (sha)
            resultTreeArray.push({
              mode: "40000",
              name: path.basename(directoryContentPath),
              sha,
            });
        } else if (stat.isFile()) {
          const sha = writeFileBlob(directoryContentPath);

          resultTreeArray.push({
            mode: "100644",
            name: path.basename(directoryContentPath),
            sha,
          });
        }
      }
      if (directoryContents.length === 0 || resultTreeArray.length === 0)
        return null;

      const treeData = resultTreeArray.reduce((acc, current) => {
        const { mode, name, sha } = current;
        return Buffer.concat([
          acc,
          Buffer.from(`${mode} ${name}\0`),
          Buffer.from(sha, "hex"),
        ]);
      }, Buffer.alloc(0));

      const tree = Buffer.concat([
        Buffer.from(`tree ${treeData.length}\0`),
        treeData,
      ]);

      const hash = crypto.createHash("sha1").update(tree).digest("hex");

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

      const compressedContent = zlib.deflateSync(tree);

      fs.writeFileSync(
        path.join(folderPath, toWriteFileName),
        compressedContent
      );

      return hash;
    }

    const sha = recursiveCreateTree(process.cwd());
    process.stdout.write(sha);
  }
}

module.exports = WriteTreeCommand;
