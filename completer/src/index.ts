import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ContextConnector,
  ICompletionManager,
  KernelConnector
} from '@jupyterlab/completer';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import { CompletionConnector } from './connector';
import { CustomConnector } from './customconnector';

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
  export const invoke = 'completer:invoke';

  export const invokeNotebook = 'completer:invoke-notebook';

  export const select = 'completer:select';

  export const selectNotebook = 'completer:select-notebook';
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'completer',
  autoStart: true,
  requires: [ICompletionManager, INotebookTracker],
  activate: async (
    app: JupyterFrontEnd,
    completionManager: ICompletionManager,
    notebooks: INotebookTracker
  ) => {
    console.log('JupyterLab custom completer extension is activated!');

    // Modelled after completer-extension's notebooks plugin
    notebooks.widgetAdded.connect(
      (sender: INotebookTracker, panel: NotebookPanel) => {
        let editor = panel.content.activeCell?.editor ?? null;
        const session = panel.sessionContext.session;
        let options = { session, editor };
        const connector = new CompletionConnector([]);
        const handler = completionManager.register({
          connector,
          editor,
          parent: panel
        });

        const updateConnector = () => {
          editor = panel.content.activeCell?.editor ?? null;
          options.session = panel.sessionContext.session;
          options.editor = editor;
          handler.editor = editor;

          const kernel = new KernelConnector(options);
          const context = new ContextConnector(options);
          const custom = new CustomConnector(options);
          handler.connector = new CompletionConnector([
            kernel,
            context,
            custom
          ]);
        };

        // Update the handler whenever the prompt or session changes
        panel.content.activeCellChanged.connect(updateConnector);
        panel.sessionContext.sessionChanged.connect(updateConnector);
      }
    );

    // Add notebook completer command.
    app.commands.addCommand(CommandIDs.invokeNotebook, {
      execute: () => {
        const panel = notebooks.currentWidget;
        if (panel && panel.content.activeCell?.model.type === 'code') {
          return app.commands.execute(CommandIDs.invoke, { id: panel.id });
        }
      }
    });

    // Add notebook completer select command.
    app.commands.addCommand(CommandIDs.selectNotebook, {
      execute: () => {
        const id = notebooks.currentWidget && notebooks.currentWidget.id;

        if (id) {
          return app.commands.execute(CommandIDs.select, { id });
        }
      }
    });

    // Set enter key for notebook completer select command.
    app.commands.addKeyBinding({
      command: CommandIDs.selectNotebook,
      keys: ['Enter'],
      selector: `.jp-Notebook .jp-mod-completer-active`
    });
  }
};

export default extension;
