## New Features
- Add files and folders to `.git/info/exclude` via a single right-click in the Explorer
- Context menu item "$(diff-ignored) Add to .git/exclude" appears for both files and folders
- Automatic relative path resolution from the workspace root
- Directory detection: trailing `/` appended automatically for folders
- Cross-platform slash normalization: Windows backslashes converted to forward slashes
- Duplicate prevention: skips writing if the path is already present in the exclude file
- Auto-creates `.git/info/exclude` with a standard Git header if the file does not exist yet

## Known Issues
- Command is only available from the Explorer context menu; invoking from the command palette shows an error message
