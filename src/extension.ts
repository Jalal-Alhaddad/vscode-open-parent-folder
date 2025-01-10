import * as vscode from "vscode";
import * as path from "node:path";

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "vscode-open-parent-folder" is now active.');

	const disposable = vscode.commands.registerCommand(
		"vscode-open-parent-folder.openParent",
		async () => {
			// Get the current workspace folder or active file path
			const workspaceFolders = vscode.workspace.workspaceFolders;
			const activeExplorerPath = workspaceFolders
				? workspaceFolders[0].uri.fsPath
				: vscode.window.activeTextEditor?.document.uri.fsPath;

			if (!activeExplorerPath) {
				vscode.window.showErrorMessage("No active folder or file detected.");
				return;
			}

			// Get the parent directory
			const parentPath = path.dirname(activeExplorerPath);

			// Handle case for Windows drive root (e.g., C:\) and Unix root (/)
			if (
				parentPath === activeExplorerPath ||
				parentPath === path.parse(activeExplorerPath).root
			) {
				vscode.window.showWarningMessage("Already at the root directory.");
				return;
			}

			// Attempt to open the parent directory as a workspace
			try {
				const success = await vscode.commands.executeCommand(
					"vscode.openFolder",
					vscode.Uri.file(parentPath),
					false,
				);
				if (!success) {
					vscode.window.showErrorMessage("Failed to open the parent folder.");
				}
			} catch (error) {
				vscode.window.showErrorMessage(`Error opening parent folder: ${error}`);
			}
		},
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
