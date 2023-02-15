import { createHtmlElement } from '../../utils/createElement';
import './createGroup.css';
import ViewerMessasges from '../../pages/Messages/Viewer-messages';
import ModelMessages from '../../pages/Messages/Model-messages';
import Button from '../button/Button';

export default class CreateGroupWindow {
  container: HTMLElement;
  parrent: ViewerMessasges;
  model: ModelMessages;
  inputFind: HTMLInputElement;
  buttonCreate: Button<ModelMessages>;
  constructor(parent: ViewerMessasges, model: ModelMessages) {
    this.parrent = parent;
    this.model = model;

    this.container = createHtmlElement('div', 'create-group-window-container');
    const buttonClose = createHtmlElement('div', 'button_close', '✖', this.container);
    this.inputFind = createHtmlElement('input', 'input__find', '', this.container) as HTMLInputElement;
    this.inputFind.setAttribute('type', 'text');
    this.buttonCreate = new Button('createGroupButton', this.model, () => {
      if (this.inputFind.value) {
        this.parrent.emit('createGroup', this.inputFind.value);
        this.closeWindow();
      }
    });
    this.container.append(this.buttonCreate.render());

    buttonClose.addEventListener('click', () => {
      this.closeWindow();
    });
  }

  private closeWindow = () => {
    this.parrent.isCreateWindow = false;
    this.parrent.createGroupWindow = null;
    this.parrent.buttonNewGroup.element.classList.remove('button_active');
    this.container.remove();
  };

  changeLang = () => {
    this.buttonCreate.changeLang();
  };

  render = () => {
    return this.container;
  };
}
