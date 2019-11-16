import {
    JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  IMainMenu
} from '@jupyterlab/mainmenu';

import {
  Menu
} from '@phosphor/widgets';

import {
    TutorialPanel
} from './panel';


/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
    export
    const create = 'Ex5:create';

    export
    const closeAndShutdown = 'Ex5:close-and-shutdown';
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
    id: 'signals',
    autoStart: true,
    requires: [ICommandPalette, ILauncher, IMainMenu],
    activate: activate
};


function activate(
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher,
    mainMenu: IMainMenu)
{
    const manager = app.serviceManager;
    const { commands, shell } = app;
    let category = 'Tutorial';

    // Add launcher
    launcher.add({
        command: CommandIDs.create,
        category: category,
    });

    function createPanel() {
        let panel: TutorialPanel;
        return manager.ready
            .then(() => {
                panel = new TutorialPanel();
                shell.add(panel, 'main');
                return panel});
    }

    // add menu tab
    let tutorialMenu: Menu = new Menu({commands});
    tutorialMenu.title.label = 'Tutorial';
    mainMenu.addMenu(tutorialMenu);

    // add commands to registry
    let command = CommandIDs.create 
    commands.addCommand(command, {
        label: 'Ex5: open Panel',
        caption: 'Open the Labtutorial Extension',
        execute: createPanel});

    command = CommandIDs.closeAndShutdown
    commands.addCommand(command, {
        label: 'Ex5: close Panel',
        caption: 'Close the Labtutorial Extension',
        execute: (args) => {console.log('not implemented')}});

    // add items in command palette and menu
    [
        CommandIDs.create,
        CommandIDs.closeAndShutdown
    ].forEach(command => {
        palette.addItem({ command, category });
        tutorialMenu.addItem({ command });
    });
}

export default extension;
