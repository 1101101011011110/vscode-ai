// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	//Refactor command: call refactor function
	context.subscriptions.push(vscode.commands.registerCommand('js-ai.refactor', refactor));
}

// This method is called when your extension is deactivated
function deactivate() {}

function refactor() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	vscode.window.showInformationMessage('Refactoring code with AI...');

	const selection = editor.selection;
	const text = editor.document.getText(selection);

	refactorAI(text).then (aicode => {
		editor.edit(editBuilder => {
			editBuilder.replace(selection, aicode);
		});
		vscode.window.showInformationMessage('Code refactored with AI!');
	}	
	);
}

//function to get OpenAI to refactor the code
async function refactorAI(code) {
    const input = `Modify the code between the tags <code> ... </code>
    following the instruction provided in the code itself in the comments.
    Return the entire code with modification, without enclosing tags.
	Update doxygen comments as well, if present.
    <code>${code}</code>    
    `

	const { Configuration, OpenAIApi } = require("openai");

	const configuration = new Configuration({
	  apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);
	
	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: input,
		temperature: 0,
		max_tokens: 2048,
		top_p: 1,
		// frequency_penalty: 0,
		// presence_penalty: 0,
	});
	  
	return response.data.choices[0].text;
}

module.exports = {
	activate,
	deactivate
}
