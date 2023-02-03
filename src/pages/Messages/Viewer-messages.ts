import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import ModelMessages from './Model-messages';
import Button from '../../base/button/Button';
import avatar from '../../../assets/img/ava.jpg';
import { LANGTEXT } from '../../constans/constans';

type EmitsName = 'send' | 'changeLang' | 'delete' | 'setLimit' | 'setSort';
enum SORTBY {
  DESC = 'desc',
  ASC = 'asc',
}

export default class ViewerMessasges extends Page {
  model: ModelMessages;
  messagesField: HTMLElement;
  input: HTMLInputElement;
  containerButtons: HTMLElement;
  inputLimit: HTMLInputElement;
  limitText: HTMLElement;
  sortSelect: HTMLSelectElement;
  sortDESC: HTMLElement;
  sortASC: HTMLElement;

  emit(event: EmitsName, data?: string) {
    return super.emit(event, data);
  }

  on(event: EmitsName, callback: (data?: string) => void) {
    return super.on(event, callback);
  }

  constructor(id: string, model: ModelMessages) {
    super(id);
    this.mainWrapper.className = 'messages__page';
    this.model = model;
    this.messagesField = createHtmlElement('div', 'messages__field');
    this.input = createHtmlElement('input', 'input__message') as HTMLInputElement;
    this.input.setAttribute('type', 'text');
    this.containerButtons = createHtmlElement('div', 'message__containerButtons');
    const containerLimit = createHtmlElement('div', 'container-limit', '', this.containerButtons);
    this.limitText = createHtmlElement('span', 'input-limit-title', LANGTEXT['inputLimit'][this.model.lang], containerLimit);
    this.inputLimit = createHtmlElement('input', 'input__limit', '', containerLimit) as HTMLInputElement;
    this.inputLimit.setAttribute('type', 'number');
    this.inputLimit.setAttribute('min', '1');
    this.inputLimit.setAttribute('max', '30');
    this.inputLimit.value = this.model.limit.toString();
    this.inputLimit.addEventListener('input', () => this.emit('setLimit', this.inputLimit.value));

    this.sortSelect = createHtmlElement('select', 'sort__select', '', containerLimit) as HTMLSelectElement;
    this.sortDESC = createHtmlElement('option', 'sort__option', `${LANGTEXT['sortDesc'][this.model.lang]}`, this.sortSelect);
    this.sortDESC.setAttribute('value', SORTBY.DESC);
    this.sortASC = createHtmlElement('option', 'sort__option', `${LANGTEXT['sortAsc'][this.model.lang]}`, this.sortSelect);
    this.sortASC.setAttribute('value', SORTBY.ASC);
    this.sortSelect.value = this.model.sort;
    this.sortSelect.addEventListener('change', () => this.emit('setSort', this.sortSelect.value));

    const buttonSend = new Button('sendButton', this.model, this.sendMessage);
    this.containerButtons.append(buttonSend.render());
    this.createContent();
    this.model.on('authorized', this.createContent);
    this.model.on('updateData', this.updateData);
  }

  createContent = () => {
    this.mainWrapper.innerHTML = '';
    if (!this.model.isLogin) {
      this.mainWrapper.innerHTML = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    } else {
      this.mainWrapper.append(this.messagesField, this.input, this.containerButtons);
    }
  };

  sendMessage = () => {
    this.emit('send', this.input.value);
    this.input.value = '';
  };

  deleteMessage = (id: string) => {
    this.model.deleteMessage(id);
  };

  updateData = () => {
    this.inputLimit.value = this.model.limit.toString();
    this.createMessages();
  };

  createMessages = () => {
    this.messagesField.innerHTML = '';
    this.model.messages?.forEach((doc) => {
      const document = doc.data();
      const classMessage = document.uid === this.model.user?.uid ? 'my_message' : 'other_message';
      const containerMessage = createHtmlElement('div', `containerMessage ${classMessage}`);
      this.messagesField.prepend(containerMessage);
      const title = createHtmlElement('div', 'messageTitle', '', containerMessage);
      const ava = new Image();
      ava.src = document.photo ? document.photo : avatar;
      title.append(ava);
      createHtmlElement('span', '', `${document.name}`, title);
      if (document.uid === this.model.user?.uid) {
        const buttonDelete = new Button('deleteButton', this.model, () => this.deleteMessage(doc.id));
        title.append(buttonDelete.render());
      }
      createHtmlElement('p', 'message_text', `${document.text}`, containerMessage);
    });
    this.messagesField.scrollTop = this.messagesField.scrollHeight;
  };
}
