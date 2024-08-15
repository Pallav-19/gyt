const fs = require("fs");
const path = require("path");

const GitClient = require("./git/client");

const {
  CatFileCommand,
  HashObjectCommand,
  LSTreeCommand,
  WriteTreeCommand,
  CommitTreeCommand,
} = require("./git/commands");

const gitClient = new GitClient();

// Uncomment this block to pass the first stage
const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;

  case "cat-file":
    handleCatFileCommand();
    break;

  case "hash-object":
    handleHashObjectCommand();
    break;

  case "ls-tree":
    handleLSTreeCommand();
    break;

  case "write-tree":
    handleWriteTreeCommand();
    break;

  case "commit-tree":
    handleCommitTreeCommand();
    break;

  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(
    path.join(process.cwd(), ".git", "HEAD"),
    "ref: refs/heads/main\n"
  );
  console.log("Initialized git directory");
}

function handleCatFileCommand() {
  const flag = process.argv[3];
  const objectSHA = process.argv[4];

  const catFileCommand = new CatFileCommand(flag, objectSHA);

  gitClient.run(catFileCommand);
}

function handleHashObjectCommand() {
  const flag = process.argv[3];
  let filePath = process.argv[4];

  if (!filePath) {
    filePath = flag;
  }

  const hashObjectCommand = new HashObjectCommand(flag, filePath);

  gitClient.run(hashObjectCommand);
}

function handleLSTreeCommand() {
  const flag = process.argv[3];
  let hash = process.argv[4];

  if (!hash) {
    hash = flag;
  }

  const lsTreeCommand = new LSTreeCommand(flag, hash);

  gitClient.run(lsTreeCommand);
}

function handleWriteTreeCommand() {
  const writeTreeCommand = new WriteTreeCommand();

  gitClient.run(writeTreeCommand);
}

function handleCommitTreeCommand() {
  const tree = process.argv[3];
  const firstFlag = process.argv[4];
  let parent = process.argv[5];
  let message = process.argv[7];

  if (firstFlag === "-m") {
    message = parent;
    parent = null;
  }

  const commitTreeCommand = new CommitTreeCommand(tree, message, parent);

  gitClient.run(commitTreeCommand);
}
