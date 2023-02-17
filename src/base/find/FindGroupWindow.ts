import { createHtmlElement } from '../../utils/createElement';
import debounce from '../../utils/debounce';

import './findWindow.css';
import ViewerMessasges from '../../pages/Messages/Viewer-messages';
import ModelMessages from '../../pages/Messages/Model-messages';
import { GroupProps } from '../../constans/types';

export default class FindGroupWindow {
  parrent: ViewerMessasges;
  model: ModelMessages;
  container: HTMLElement;
  allGroup: Promise<GroupProps[]>;
  status: HTMLElement[];
  inputFind: HTMLInputElement;
  userFild: HTMLElement;
  constructor(parent: ViewerMessasges, model: ModelMessages) {
    this.parrent = parent;
    this.model = model;

    this.allGroup = this.model.getAllGroups();
    this.container = createHtmlElement('div', 'create-group-window-container');
    const buttonClose = createHtmlElement('div', 'button_close', '✖', this.container);
    this.status = [];
    this.inputFind = createHtmlElement('input', 'input__find', '', this.container) as HTMLInputElement;
    this.inputFind.setAttribute('type', 'text');
    const debonsedFind = debounce(this.findUser, 450);
    this.inputFind.addEventListener('input', debonsedFind);
    const userFildContainer = createHtmlElement('div', 'find-user-fild-container', '', this.container);
    this.userFild = createHtmlElement('div', 'find-user-fild', '', userFildContainer);

    buttonClose.addEventListener('click', () => {
      this.closeWindow();
    });
  }

  private findUser = async () => {
    this.userFild.innerHTML = '';
    this.status = [];
    if (!this.inputFind.value) {
      return;
    }
    const groups = await this.allGroup;
    const findedGroups = groups.filter((group) => group.nameGroup.toUpperCase().includes(this.inputFind.value.toUpperCase()));
    findedGroups.forEach((group) => {
      this.userFild.appendChild(this.createGroup(group));
    });
  };

  private createGroup = (group: GroupProps) => {
    const container = createHtmlElement('div', 'finded-user-container');
    const nameContainer = createHtmlElement('div', 'finded-user-name');
    const ava = this.parrent.createAva(`${group.groupAvatar}`);
    const name = createHtmlElement('span', '', `${group.nameGroup}`);
    nameContainer.append(ava, name);

    container.append(nameContainer);
    container.addEventListener('click', (e) => {
      this.parrent.createModalGroupWindow(e, group.nameGroup, group.uid, group.groupAvatar);
    });
    return container;
  };

  private closeWindow = () => {
    this.parrent.isFindGrop = false;
    this.parrent.findGroupWindow = null;
    this.parrent.buttonFindGroup.element.classList.remove('button_active');
    this.container.remove();
  };

  render = () => {
    return this.container;
  };
}
