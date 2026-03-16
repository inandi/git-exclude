# Git Exclude

A streamlined VS Code utility for managing local Git ignore rules. Add files and folders to your repository's private exclude file (`.git/info/exclude`) with a single right-click — keeping your local environment clean without touching the shared `.gitignore`.

## The Problem it Solves

Most developers have personal files (scratchpads, local DB dumps, custom IDE configs) that don't belong in the team's shared `.gitignore`. Manually navigating to the hidden `.git/info/` folder to edit the exclude file is a friction point that most skip — leading to messy `git status` outputs. Git Exclude turns this multi-step process into a single right-click.

## Features

- **Context Menu Shortcut** — Adds a "Add to .git/exclude" option to the file explorer.
- **Automatic Path Resolution** — Calculates the correct relative path from the workspace root.
- **Directory Awareness** — Appends a trailing slash for folders so Git treats them correctly.
- **Cross-Platform Normalization** — Converts Windows backslashes (`\`) to Git-standard forward slashes (`/`).
- **Duplicate Prevention** — Skips appending if the path is already present in the exclude file.

## How to Use

1. Right-click any file or folder in the Explorer panel.
2. Select **Add to .git/exclude**.
3. The path is appended to `.git/info/exclude` — the file immediately disappears from your untracked list.

## How it Differs from `.gitignore`

| | `.gitignore` | `.git/info/exclude` |
|---|---|---|
| Tracked in repo | Yes | No |
| Shared with team | Yes | No |
| Use case | Project-wide rules | Personal/local rules |

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (recompiles on save)
npm run watch
```

Press `F5` in VS Code to launch the Extension Development Host and test the extension.

## License

MIT
