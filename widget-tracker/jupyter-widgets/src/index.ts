"use strict";

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { ILauncher } from "@jupyterlab/launcher";

import { IMainMenu } from "@jupyterlab/mainmenu";

import { Menu } from "@phosphor/widgets";

import { ICommandPalette } from "@jupyterlab/apputils";

import { INotebookTracker } from "@jupyterlab/notebook";

import { TutorialPanel } from "./panel";

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
  export const create = "Ex4b:create";

  export const execute = "Ex4b:execute";
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "jupyter-widgets",
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker, ILauncher, IMainMenu],
  activate: activate
};

function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  tracker: INotebookTracker,
  launcher: ILauncher,
  mainMenu: IMainMenu
) {
  const manager = app.serviceManager;
  const { commands, shell } = app;
  let category = "Tutorial";

  // build panel
  let panel: TutorialPanel;
  function createPanel() {
    let current = tracker.currentWidget;
    if (!current) {
      return;
    }

    console.log(current.content.rendermime);

    return manager.ready
      .then(() => {
        if (!current) {
          return;
        }
        panel = new TutorialPanel(manager, current.content.rendermime);
        return panel.session.ready;
      })
      .then(() => {
        shell.add(panel, "main");
        return panel;
      });
  }

  // add menu tab
  let tutorialMenu: Menu = new Menu({ commands });
  tutorialMenu.title.label = "Tutorial";
  mainMenu.addMenu(tutorialMenu);

  // add commands to registry
  let command = CommandIDs.create;
  commands.addCommand(command, {
    label: "Ex4b: open Panel",
    caption: "Open the Labtutorial Extension",
    execute: createPanel
  });

  // Add launcher
  launcher.add({
    command,
    category: category
  });

  let code = "widget";
  command = CommandIDs.execute;
  commands.addCommand(command, {
    label: "Ex4b: show widget",
    caption: "show ipython widget",
    execute: () => {
      panel.execute(code);
    }
  });

  // add items in command palette and menu
  [CommandIDs.create, CommandIDs.execute].forEach(command => {
    palette.addItem({ command, category });
    tutorialMenu.addItem({ command });
  });
}

export default extension;
