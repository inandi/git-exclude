# Git Exclude - Technical Documentation

## Overview

Git Exclude - Local is a VS Code extension built with TypeScript that provides a context menu shortcut for appending files and folders to a repository's local `.git/info/exclude` file. It operates entirely through the VS Code file explorer and has no UI panels or status bar elements — the entire interaction is a single command invoked from a right-click.

## Architecture

### File Structure

```
git-exclude/
├── src/
│   └── extension.ts          # Main extension entry point and all command logic
├── out/                      # Compiled JavaScript files
├── doc/                      # Documentation
├── media/                    # Extension icon and assets
├── package.json              # Extension manifest
└── tsconfig.json             # TypeScript configuration
```

### Core Components

#### Extension Entry Point (`extension.ts`)

- **Activation**: Extension activates on demand when the command `gitExclude.addToExclude` is invoked
- **Command Registration**: Registers the single command handler during `activate()`
- **File Operations**: All read/write operations against `.git/info/exclude` happen inside the command handler
- **Cleanup**: `deactivate()` is a no-op — the registered disposable is managed via `context.subscriptions`

## Command Handler Logic

### `gitExclude.addToExclude`

The command is triggered from the Explorer context menu and receives a `vscode.Uri` for the selected resource.

**Step-by-step execution:**

1. **Guard: URI presence**  
   If `uri` is undefined (e.g. invoked from the command palette), an error message is shown and execution stops.

2. **Guard: Workspace resolution**  
   `vscode.workspace.getWorkspaceFolder(uri)` locates the workspace root containing the selected resource. If none is found, an error is shown.

3. **Guard: Git repository check**  
   Verifies that a `.git/` directory exists at the workspace root. If not, an error is shown.

4. **Path computation**  
   `path.relative(workspaceRoot, uri.fsPath)` produces the relative path. All backslashes are replaced with forward slashes using `replace(/\\/g, '/')`.

5. **Directory detection**  
   `vscode.workspace.fs.stat(uri)` checks the resource type. If `FileType.Directory` is set, a trailing `/` is appended to the relative path.

6. **Exclude file initialization**  
   If `.git/info/exclude` does not exist:
   - The `.git/info/` directory is created if needed
   - A standard Git exclude file header is written

7. **Duplicate check**  
   The existing file content is split into lines and trimmed. If the relative path is already present, an informational message is shown and nothing is written.

8. **Append**  
   The relative path is appended to the exclude file with a trailing newline, ensuring proper line separation regardless of the file's current ending.

9. **Notification**  
   A success message is shown: `"Git Exclude - Local: Added '<path>' to .git/info/exclude."`

## Storage

### `.git/info/exclude`

- **Location**: `<workspace-root>/.git/info/exclude`
- **Private by default**: Never tracked or committed — local to the developer's machine
- **Format**: Plain text, one pattern per line, same syntax as `.gitignore`
- **Created automatically**: If the file doesn't exist when the command runs, it is created with a standard Git header

### Exclude File Header (auto-generated)

```
# git ls-files --others --exclude-from=.git/info/exclude
# Lines that start with '#' are comments.
# For a project mostly in C, the following would be a good set of
# exclude patterns (uncomment them if you want to use them):
# *.[oa]
# *~
```

## API Reference

### `activate(context: vscode.ExtensionContext): void`

Called by VS Code when the extension is activated. Registers the `gitExclude.addToExclude` command and pushes the disposable to `context.subscriptions`.

### `deactivate(): void`

Called by VS Code when the extension is deactivated. No cleanup is needed beyond what `context.subscriptions` handles automatically.

### Command Handler

```typescript
async (uri: vscode.Uri | undefined): Promise<void>
```

| Parameter | Type | Description |
|---|---|---|
| `uri` | `vscode.Uri \| undefined` | URI of the selected file or folder from the Explorer |

**Behaviour summary:**

| Condition | Result |
|---|---|
| No URI | Error message shown, exits |
| File outside workspace | Error message shown, exits |
| No `.git/` directory | Error message shown, exits |
| Path already in exclude file | Info message shown, no write |
| File selected | Relative path appended |
| Folder selected | Relative path with trailing `/` appended |

## User Interface

### Context Menu

- **Location**: Explorer panel right-click menu
- **Label**: `$(diff-ignored) Add to .git/exclude`
- **Group**: `7_modification` (appears in the modification group, after standard file operations)
- **When clause**: `explorerResourceIsFolder || resourceScheme == file` (visible for both files and folders)

### Notifications

All feedback is delivered through VS Code's standard notification API:

- **Error**: `vscode.window.showErrorMessage()` — for unrecoverable conditions (no URI, no workspace, no `.git/`)
- **Info**: `vscode.window.showInformationMessage()` — for success and duplicate-skip cases

## Extension Manifest (`package.json`)

Key properties:

- **activationEvents**: `onCommand:gitExclude.addToExclude` — Extension only loads when the command is first invoked
- **main**: `./out/extension.js` — Compiled entry point
- **engines.vscode**: `^1.85.0` — Minimum VS Code version required

## Development

### Prerequisites

- Node.js (v20.x or higher)
- VS Code (v1.85.0 or higher)
- TypeScript (v5.3.0 or higher)

### Building

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile on changes)
npm run watch
```

### Testing

1. Open the project folder in VS Code
2. Press `F5` to launch the Extension Development Host
3. Open any folder that is a Git repository in the new window
4. Right-click a file or folder in the Explorer and select **Add to .git/exclude**
5. Verify the path appears in `.git/info/exclude`

### TypeScript Configuration

- **module**: `commonjs` — Required for VS Code extension host
- **target**: `ES2020`
- **strict**: `true` — Full strict type checking enabled
- **outDir**: `./out`
- **rootDir**: `./src`
- **sourceMap**: `true` — Source maps generated for debugging

## Publishing

The extension can be published to two marketplaces:

1. **VS Code Marketplace** — Official Microsoft marketplace for VS Code extensions
2. **Open VSX Registry** — Open-source alternative marketplace (used by VSCodium, Eclipse Theia, etc.)

### Prerequisites

Before publishing, ensure you have:

- **vsce** (Visual Studio Code Extensions CLI) - Install globally:
  ```bash
  npm install -g @vscode/vsce
  ```
- **ovsx** (Open VSX CLI) - Install globally:
  ```bash
  npm install -g ovsx
  ```

### Pre-Publishing Checklist

Before publishing any version, ensure:

- [ ] All code changes are committed
- [ ] `package.json` version is updated (follow [Semantic Versioning](https://semver.org/))
- [ ] `release.md` is updated with release notes
- [ ] Extension is tested and working
- [ ] `npm run compile` runs without errors
- [ ] `out/` directory contains compiled files
- [ ] `README.md` is up to date
- [ ] No sensitive information in code
- [ ] All dependencies are listed in `package.json`

### Publishing to VS Code Marketplace

#### Initial Setup (One-time)

1. **Create a Publisher Account**:
   - Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
   - Sign in with your Microsoft/GitHub account
   - Create a publisher account if you don't have one

2. **Get Personal Access Token**:
   - Go to [Azure DevOps](https://dev.azure.com)
   - Create a Personal Access Token (PAT) with Marketplace management permissions
   - Save the token securely

3. **Login to vsce**:
   ```bash
   vsce login <your-publisher-name>
   ```

#### Publishing Process

```bash
# Option A: Publish with specific version
vsce publish 1.0.0

# Option B: Auto-increment version
vsce publish patch    # 1.0.0 -> 1.0.1
vsce publish minor    # 1.0.0 -> 1.1.0
vsce publish major    # 1.0.0 -> 2.0.0

# Option C: Use version from package.json
vsce publish
```

### Publishing to Open VSX Registry

#### Initial Setup (One-time)

1. Go to [Open VSX Registry](https://open-vsx.org/) and sign in with GitHub
2. Create a namespace (e.g. your GitHub username)
3. Generate a Personal Access Token from your profile settings

#### Publishing Process

```bash
# Publish with token
ovsx publish -p <your-personal-access-token>

# Or set token as environment variable
export OVSX_PAT=<your-personal-access-token>
ovsx publish
```

### Publishing to Both Marketplaces (Automated)

The `release.sh` script handles both marketplaces automatically:

1. **Set up publishing secrets** (one-time):
   ```bash
   cp .publish-secrets.sample .publish-secrets
   # Edit .publish-secrets and add your tokens
   ```

2. **Run the release script**:
   ```bash
   ./release.sh 1.0.0
   ```

   This will automatically:
   - Update version information in `version.md`
   - Copy `release.md` to the top of `CHANGELOG.md`
   - Reset `release.md` from the sample template
   - Commit, push, and tag the release
   - Publish to VS Code Marketplace
   - Publish to Open VSX Registry

**Manual fallback:**
```bash
source .publish-secrets
vsce publish -p "$VSCE_PAT"
ovsx publish -p "$OVSX_PAT"
```

### Version Management

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Error Handling

### File Operations

- Missing `.git/info/` directory is created automatically before writing
- File read errors (e.g. permissions) surface as native Node.js exceptions — not currently caught; the extension will show an unhandled error notification
- Duplicate entries are caught by a pre-write line scan

### Input Validation

- URI presence: checked before any processing
- Workspace membership: checked via `vscode.workspace.getWorkspaceFolder`
- Git repository presence: checked via `fs.existsSync` on `.git/`
- Directory vs file: determined via `vscode.workspace.fs.stat`

## Troubleshooting Publishing Issues

**Issue: `vsce publish` fails with authentication error**
- Solution: Run `vsce login <publisher-name>` again and verify your PAT

**Issue: `ovsx publish` fails with authentication error**
- Solution: Verify your Open VSX token and namespace exist

**Issue: Publishing fails due to version conflict**
- Solution: Ensure the version in `package.json` is higher than the last published version

**Issue: Build errors during publish**
- Solution: Run `npm run compile` manually and fix any TypeScript errors

**Issue: Missing files in published package**
- Solution: Check `.vscodeignore` to ensure required files like `out/` are not excluded

**Issue: Automatic publishing fails during release script**
- Solution: Verify `.publish-secrets` exists and contains valid tokens for both `VSCE_PAT` and `OVSX_PAT`

## Future Enhancements

Potential improvements:

- Support for multi-selection (exclude multiple files in one action)
- Command palette support with a file picker fallback when no URI is provided
- View/open `.git/info/exclude` command
- Undo last exclude entry
- Status bar indicator showing number of locally excluded files

## License

MIT License — See LICENSE file for details

---

**Author**: Gobinda Nandi  
**Version**: 0.0.1  
**Last Updated**: March 2026
