import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    'gitExclude.addToExclude',
    async (uri: vscode.Uri | undefined) => {
      if (!uri) {
        vscode.window.showErrorMessage(
          'Git Exclude: Run this command from the file explorer context menu.'
        );
        return;
      }

      const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
      if (!workspaceFolder) {
        vscode.window.showErrorMessage(
          'Git Exclude: File is not inside an open workspace.'
        );
        return;
      }

      const workspaceRoot = workspaceFolder.uri.fsPath;
      const excludeFile = path.join(workspaceRoot, '.git', 'info', 'exclude');

      if (!fs.existsSync(path.join(workspaceRoot, '.git'))) {
        vscode.window.showErrorMessage(
          'Git Exclude: No .git directory found in the workspace root.'
        );
        return;
      }

      let relativePath = path.relative(workspaceRoot, uri.fsPath);
      relativePath = relativePath.replace(/\\/g, '/');

      const stat = await vscode.workspace.fs.stat(uri);
      const isDirectory = (stat.type & vscode.FileType.Directory) !== 0;
      if (isDirectory && !relativePath.endsWith('/')) {
        relativePath += '/';
      }

      let existingContent = '';
      if (fs.existsSync(excludeFile)) {
        existingContent = fs.readFileSync(excludeFile, 'utf8');
      } else {
        const infoDir = path.join(workspaceRoot, '.git', 'info');
        if (!fs.existsSync(infoDir)) {
          fs.mkdirSync(infoDir, { recursive: true });
        }
        existingContent = [
          '# git ls-files --others --exclude-from=.git/info/exclude',
          '# Lines that start with \'#\' are comments.',
          '# For a project mostly in C, the following would be a good set of',
          '# exclude patterns (uncomment them if you want to use them):',
          '# *.[oa]',
          '# *~',
        ].join('\n');
        fs.writeFileSync(excludeFile, existingContent, 'utf8');
      }

      const lines = existingContent.split('\n').map((l) => l.trim());
      if (lines.includes(relativePath)) {
        vscode.window.showInformationMessage(
          `Git Exclude: '${relativePath}' is already in .git/info/exclude.`
        );
        return;
      }

      const separator = existingContent.endsWith('\n') ? '' : '\n';
      fs.appendFileSync(excludeFile, `${separator}${relativePath}\n`, 'utf8');

      vscode.window.showInformationMessage(
        `Git Exclude: Added '${relativePath}' to .git/info/exclude.`
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
