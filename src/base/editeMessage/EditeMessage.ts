import { createHtmlElement } from '../../utils/createElement';
import './editeMessage.css';
import ViewerMessasges from '../../pages/Messages/Viewer-messages';
import ModelMessages from '../../pages/Messages/Model-messages';
import Button from '../button/Button';

export default class EditeMessage {
  parrent: ViewerMessasges;
  model: ModelMessages;
  key: string;
  container: HTMLElement;
  buttonDelete: Button<ModelMessages>;
  buttonEdite: Button<ModelMessages>;
  text: string;
  constructor(parent: ViewerMessasges, model: ModelMessages, key: string, text: string) {
    this.parrent = parent;
    this.model = model;
    this.key = key;
    this.text = text;

    this.container = createHtmlElement('div', 'edite-message-container');
    const buttonClose = createHtmlElement('div', 'button_close', '✖', this.container);
    buttonClose.addEventListener('click', () => {
      this.closeWindow();
    });
    const buttonContainer = createHtmlElement('div', 'edite-message-buttons');
    this.buttonDelete = new Button('deleteButton', this.model, () => {
      this.parrent.deleteMessage(this.key);
      this.closeWindow();
      // }
    });
    this.buttonEdite = new Button('editeButton', this.model, () => {
      this.parrent.editeMessage(this.key, this.text);
      this.closeWindow();
      // }
    });
    buttonContainer.append(this.buttonDelete.render(), this.buttonEdite.render());
    this.container.append(buttonClose, buttonContainer);
    document.body.addEventListener('click', this.closeWindow, { once: true });
  }

  private closeWindow = () => {
    this.parrent.isEditeMessageWindow = false;
    this.parrent.editeMessageWindow = null;
    this.container.remove();
  };

  changeLang = () => {
    this.buttonDelete.changeLang();
    this.buttonEdite.changeLang();
  };

  render = () => {
    return this.container;
  };
}
