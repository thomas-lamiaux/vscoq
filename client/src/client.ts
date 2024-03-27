import * as vscode from 'vscode';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  integer
} from 'vscode-languageclient/node';

import {decorationsManual, decorationsContinuous} from './Decorations';

export default class Client extends LanguageClient {

	private static _channel: any = vscode.window.createOutputChannel('VsCoq');
    private _decorationsProcessed: Map<String, vscode.Range[]> = new Map<String, vscode.Range[]>();
    private _decorationsProcessing: Map<String, vscode.Range[]> = new Map<String, vscode.Range[]>();

	constructor(
        serverOptions: ServerOptions,
        clientOptions: LanguageClientOptions,
	) {
        super(
		    'vscoq-language-server',
		    'Coq Language Server',
		    serverOptions,
		    clientOptions
        );
		Client._channel.appendLine("VsCoq initialised");
	}


    public static writeToVscoq2Channel(message: string) {
        Client._channel.appendLine(message);
    }

    public saveHighlights(uri: String, processingRange: vscode.Range[], processedRange: vscode.Range[]) {
        this._decorationsProcessed.set(uri, processedRange);
        this._decorationsProcessing.set(uri, processingRange);
    }

    public updateHightlights() {
        for(let entry of this._decorationsProcessing.entries()) {
            this.updateDocumentEditors(entry[0], entry[1], "processing");
        }
        for(let entry of this._decorationsProcessed.entries()) {
            this.updateDocumentEditors(entry[0], entry[1]);
        }
    };

    public resetHighlights() {
        for(let entry of this._decorationsProcessed.entries()) {
            this.resetDocumentEditors(entry[0]);
        }
    }

    private getDocumentEditors(uri: String) {
        return vscode.window.visibleTextEditors.filter(editor => {
            return editor.document.uri.toString() === uri;
        });
    }

    private resetDocumentEditors(uri: String) {
        const editors = this.getDocumentEditors(uri);
        editors.map(editor => {
            editor.setDecorations(decorationsManual.processed, []);
            editor.setDecorations(decorationsContinuous.processed, []);
            editor.setDecorations(decorationsManual.processing, []);
            editor.setDecorations(decorationsContinuous.processing, []);
        });
    }

    private updateDocumentEditors(uri: String, ranges: vscode.Range[], type: String = "processed") {
        const config = vscode.workspace.getConfiguration('vscoq.proof');
        const editors = this.getDocumentEditors(uri);
        editors.map(editor => {
            if(config.mode === 0) {
                editor.setDecorations(type === "processed" ? decorationsManual.processed : decorationsManual.processing, ranges);
            } else {
                editor.setDecorations(type === "processed" ? decorationsContinuous.processed : decorationsContinuous.processing, ranges);
            }
        });
    }

}
