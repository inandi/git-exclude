<div align="center">
  <h1>Git Exclude - Local [Beta]</h1>
  <p><strong>Local Git Ignore Rules, One Right-Click Away</strong></p>
</div>

Tired of messy `git status` outputs from personal files you can't commit to `.gitignore`? `Git Exclude - Local` makes it effortless to hide files and folders from Git locally — without affecting the shared `.gitignore` — with just one right-click!

## What is `Git Exclude - Local`?

`Git Exclude - Local` is a simple yet necessary extension that lets you append files and folders to your repository's private exclude file (`.git/info/exclude`) directly from the Explorer context menu.

## Why Use `Git Exclude - Local`?

- **Save Time**: No more manually navigating to `.git/info/` to edit the exclude file
- **Stay Clean**: Personal files (scratchpads, DB dumps, local configs) vanish from your untracked list instantly
- **Team-Safe**: Nothing is added to the shared `.gitignore` — your ignores stay local and private
- **Directory-Aware**: Automatically appends a trailing slash for folders so Git treats them correctly
- **Cross-Platform**: Converts Windows backslashes (`\`) to Git-standard forward slashes (`/`)
- **Duplicate-Safe**: Skips writing if the path is already present in the exclude file

## Getting Started

### Installation

1. Open VS Code or Cursor
2. Go to the Extensions view
3. Search for **Git Exclude - Local**
4. Click Install

### First Steps

1. **Open your project** in VS Code or Cursor
2. **Right-click** any file or folder in the Explorer panel
3. Select **Add to .git/exclude**
4. The file or folder immediately disappears from your untracked list in Git

## How It Works

### The Difference from `.gitignore`

| | `.gitignore` | `.git/info/exclude` |
|---|---|---|
| Tracked in repo | Yes | No |
| Shared with team | Yes | No |
| Use case | Project-wide rules | Personal/local rules only |

### What Happens Under the Hood

When you right-click and select **Add to .git/exclude**, the extension:

1. **Resolves the path**: Calculates the relative path from your workspace root to the selected file or folder
2. **Normalizes slashes**: Converts any Windows backslashes (`\`) to forward slashes (`/`) for Git compatibility
3. **Detects directories**: Appends a trailing `/` automatically if the selected item is a folder
4. **Checks for duplicates**: Reads the existing exclude file and skips writing if the path is already present
5. **Appends the entry**: Writes the path to `.git/info/exclude` (creating the file with a standard Git header if it doesn't exist yet)

### Storage Location

`Git Exclude - Local` writes to the standard Git exclude file inside your repository:

- **Location**: `.git/info/exclude` at the root of your workspace
- **Private by default**: This file is never tracked or committed — it exists only on your machine
- **Manually editable**: You can open and edit the file directly at any time if needed

## Tips & Tricks

- **Use for generated files**: Local build artifacts or tool outputs that shouldn't be in `.gitignore` are perfect candidates
- **Works on folders**: Right-click a whole folder (like `tmp/` or `scratch/`) to exclude everything inside it at once
- **Safe to re-run**: Running the command on an already-excluded path does nothing — no duplicate entries

## Support the Project

If `Git Exclude - Local` has made your workflow easier, consider supporting (No Pressure):

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/igobinda)

## Need Help?

- **Issues**: Found a bug or have a feature request? Open an issue on GitHub
- **Repository**: [github.com/inandi/git-exclude](https://github.com/inandi/git-exclude)

## License

This project is licensed under the MIT License - feel free to use it however you'd like!

---

**Made with ❤️ by Gobinda Nandi**
