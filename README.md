
# Gyt VCS

A spoof of the popular VCS Git, in its initial stage.


## Commands Description

### git cat-file -p <sha>
#### Prints the content of a object file inside .git/objects directory.


```
  gyt cat-file -p <sha>
```

| Argument | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `-p` | `flag` | **Required**. Tells gyt to print |
| `<sha>` | `sha hash` | **Required**. The hash of the object you want  to access |

### git hash-object [-w] <filepath>
#### prints a hash of a blob object of a file, additionally writes the blob into the file if -w flag is provided

```
 gyt hash-object [-w] <filepath>
```

| Argument | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `-w`      | `flag` | **Optional**. writes the blob object into the hash path |

### git ls-tree --name-only <sha>
#### used to inspect a tree object.

```
 gyt ls-tree --name-only <sha>
```

| Argument | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `--name-only`      | `flag` | **Required**. Indicates to print names only. |
| `sha`      | `sha hash` | **Required**. The sha hash of a tree object. |

### git write-tree
#### used to write a tree object ad return its hash from the current working directory

```
 gyt write-tree
```

### git commit-tree <tree_sha> -p <commit_sha> -m <message>
#### used to create a commit object.

```
 gyt ls-tree --name-only <sha>
```

| Argument | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `<tree_sha>`      | `sha hash` | **Required**. Hash of a tree object. |
| `-p`      | `flag` | **Optional**. Indicates whether the commit has a parent commit object hash or not. |
| `<commit_sha>`      | `sha hsh` | **Required if -p flag is present**. Parent commit object hash. |
| `-m`      | `flag` | **Required**. The message flag. |
| `<message>`      | `sha hash` | **Required**. The commit message. |