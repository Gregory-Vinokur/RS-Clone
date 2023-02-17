import { createHtmlElement } from '../../utils/createElement';
import debounce from '../../utils/debounce';

import './findWindow.css';
import ViewerMessasges from '../../pages/Messages/Viewer-messages';
import ModelMessages from '../../pages/Messages/Model-messages';
import { UserProp } from '../../constans/types';
import { LANGTEXT } from '../../constans/constans';

export default class FindWindow {
  container: HTMLElement;
  parrent: ViewerMessasges;
  inputFind: HTMLInputElement;
  userFild: HTMLElement;
  model: ModelMessages;
  allUser: Promise<UserProp[]>;
  status: HTMLElement[];
  constructor(parrent: ViewerMessasges, model: ModelMessages) {
    this.parrent = parrent;
    this.model = model;
    this.allUser = this.model.getAllUser();
    this.container = createHtmlElement('div', 'find-window-container');
    const buttonClose = createHtmlElement('div', 'button_close', '✖', this.container);
    this.status = [];

    this.inputFind = createHtmlElement('input', 'input__find', '', this.container) as HTMLInputElement;
    this.inputFind.setAttribute('type', 'text');
    this.inputFind.placeholder = LANGTEXT['findPlaceholder'][this.model.lang];
    const debonsedFind = debounce(this.findUser, 450);
    this.inputFind.addEventListener('input', debonsedFind);
    const userFildContainer = createHtmlElement('div', 'find-user-fild-container', '', this.container);
    this.userFild = createHtmlElement('div', 'find-user-fild', '', userFildContainer);
    buttonClose.addEventListener('click', () => {
      this.parrent.isFind = false;
      this.parrent.findWindow = null;
      this.parrent.buttonFind.element.classList.remove('button_active');
      this.container.remove();
    });
  }

  findUser = async () => {
    this.userFild.innerHTML = '';
    this.status = [];
    if (!this.inputFind.value) {
      return;
    }
    const users = await this.allUser;
    const findedUsers = users.filter(
      (user) => user.userName.toUpperCase().includes(this.inputFind.value.toUpperCase()) && user.userId !== this.model.user?.uid
    );
    findedUsers.forEach((user) => {
      this.userFild.appendChild(this.createUser(user));
    });
  };

  createUser = (user: UserProp) => {
    const container = createHtmlElement('div', 'finded-user-container');
    const nameContainer = createHtmlElement('div', 'finded-user-name');
    const ava = this.parrent.createAva(`${user.userAvatar}`);
    const name = createHtmlElement('span', '', `${user.userName}`);
    nameContainer.append(ava, name);
    const statusContainer = createHtmlElement('p', 'finded-user-status');
    const statusText = createHtmlElement('span', '', LANGTEXT['status'][this.model.lang]);
    this.status.push(statusText);
    const status = createHtmlElement('span', '', `: ${user.userStatus}`);

    statusContainer.append(statusText, status);
    container.append(nameContainer, statusContainer);
    container.addEventListener('click', (e) => this.parrent.createModalUserWindow(e, user.userName, user.userId, user.userAvatar));
    return container;
  };

  changeLang = () => {
    this.status.forEach((el) => (el.innerText = LANGTEXT['status'][this.model.lang]));
    this.inputFind.placeholder = LANGTEXT['findPlaceholder'][this.model.lang];
  };

  render = () => {
    return this.container;
  };
}
