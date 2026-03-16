/**
 * Git Exclude - Local Extension Main Module
 *
 * VS Code extension for adding files and folders to the local Git exclude file
 * (.git/info/exclude) via the Explorer context menu. Keeps personal ignore
 * rules private without affecting the shared .gitignore.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.2 [16-03-2026]
 * @version 1.1.4
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Activates the extension.
 * Registers the `gitExclude.addToExclude` command which is triggered from
 * the Explorer context menu to append a file or folder path to .git/info/exclude.
 *
 * @param {vscode.ExtensionContext} context - The VS Code extension context
 * @returns {void}
 * @version 1.1.2
 */
export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    'gitExclude.addToExclude',
    async (uri: vscode.Uri | undefined) => {
      if (!uri) {
        vscode.window.showErrorMessage(
          'Git Exclude - Local: Run this command from the file explorer context menu.'
        );
        return;
      }

      const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
      if (!workspaceFolder) {
        vscode.window.showErrorMessage(
          'Git Exclude - Local: File is not inside an open workspace.'
        );
        return;
      }

      const workspaceRoot = workspaceFolder.uri.fsPath;
      const excludeFile = path.join(workspaceRoot, '.git', 'info', 'exclude');

      if (!fs.existsSync(path.join(workspaceRoot, '.git'))) {
        vscode.window.showErrorMessage(
          'Git Exclude - Local: No .git directory found in the workspace root.'
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
          `Git Exclude - Local: '${relativePath}' is already in .git/info/exclude.`
        );
        return;
      }

      const separator = existingContent.endsWith('\n') ? '' : '\n';
      fs.appendFileSync(excludeFile, `${separator}${relativePath}\n`, 'utf8');

      vscode.window.showInformationMessage(
        `Git Exclude - Local: Added '${relativePath}' to .git/info/exclude.`
      );
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * Deactivates the extension.
 * No cleanup is required — subscriptions are disposed automatically by VS Code.
 *
 * @returns {void}
 * @version 1.1.2
 */
export function deactivate(): void {}
