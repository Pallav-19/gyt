const CatFileCommand = require("./cat-file");
const CommitTreeCommand = require("./commit-tree");
const HashObjectCommand = require("./hash-object");
const LSTreeCommand = require("./ls-tree");
const WriteTreeCommand = require("./write-tree");

module.exports = {
  CatFileCommand,
  HashObjectCommand,
  LSTreeCommand,
  WriteTreeCommand,
  CommitTreeCommand,
};
