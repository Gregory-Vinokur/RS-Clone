import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import ModelMessages from './Model-messages';
import Button from '../../base/button/Button';
import avatar from '../../../assets/img/ava.jpg';
import { LANGTEXT } from '../../constans/constans';

type EmitsName = 'send' | 'changeLang' | 'deleteMessage' | 'setLimit' | 'setSort' | 'subscripte' | 'writeUser';
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
  buttons: Button<ModelMessages>[];
  buttonSend: Button<ModelMessages>;

  emit(event: EmitsName, data: string) {
    return super.emit(event, data);
  }

  on(event: EmitsName, callback: (data: string) => void) {
    return super.on(event, callback);
  }

  constructor(id: string, model: ModelMessages) {
    super(id);
    this.mainWrapper.className = 'messages__page';
    this.model = model;
    this.model.on('changeLang', this.changeLang);
    this.buttons = [];
    this.messagesField = createHtmlElement('div', 'messages__field');

    this.input = createHtmlElement('textarea', 'input__message') as HTMLInputElement;
    this.input.setAttribute('rows', '1');
    this.setTextAreaHeight();
    this.input.addEventListener('input', this.setTextAreaHeight);

    this.containerButtons = createHtmlElement('div', 'message__containerButtons');
    const containerLimit = createHtmlElement('div', 'container-limit', '', this.containerButtons);
    this.limitText = createHtmlElement('span', 'input-limit-title', LANGTEXT['inputLimit'][this.model.lang], containerLimit);
    this.inputLimit = createHtmlElement('input', 'input__limit', '', containerLimit) as HTMLInputElement;
    this.inputLimit.setAttribute('type', 'number');
    this.inputLimit.setAttribute('min', '1');
    this.inputLimit.setAttribute('max', '100');
    this.inputLimit.value = this.model.limit.toString();
    this.inputLimit.addEventListener('input', () => this.emit('setLimit', this.inputLimit.value));

    this.sortSelect = createHtmlElement('select', 'sort__select', '', containerLimit) as HTMLSelectElement;
    this.sortDESC = createHtmlElement('option', 'sort__option', `${LANGTEXT['sortDesc'][this.model.lang]}`, this.sortSelect);
    this.sortDESC.setAttribute('value', SORTBY.DESC);
    this.sortASC = createHtmlElement('option', 'sort__option', `${LANGTEXT['sortAsc'][this.model.lang]}`, this.sortSelect);
    this.sortASC.setAttribute('value', SORTBY.ASC);
    this.sortSelect.value = this.model.sort;
    this.sortSelect.addEventListener('change', () => this.emit('setSort', this.sortSelect.value));

    this.buttonSend = new Button('sendButton', this.model, this.sendMessage);
    this.containerButtons.append(this.buttonSend.render());
    this.mainWrapper.append(this.messagesField, this.input, this.containerButtons);
    this.messagesField.innerHTML = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    this.messagesField.classList.add('messages__field_load');
    this.model.on('updateData', this.updateData);
  }

  setTextAreaHeight = () => {
    this.input.style.height = `auto`;
    this.input.style.height = `${this.input.scrollHeight}px`;
  };

  sendMessage = () => {
    this.emit('send', this.input.value);
    this.input.value = '';
    this.setTextAreaHeight();
  };

  deleteMessage = (id: string) => {
    this.emit('deleteMessage', id);
  };

  updateData = () => {
    this.inputLimit.value = this.model.limit.toString();
    this.createMessages();
  };

  createMessages = () => {
    this.messagesField.innerHTML = '';
    this.messagesField.classList.remove('messages__field_load');
    this.buttons = [];
    this.model.messages?.forEach((doc) => {
      const document = doc.data();
      const classMessage = document.uid === this.model.user?.uid ? 'my_message' : 'other_message';
      const containerMessage = createHtmlElement('div', `containerMessage ${classMessage}`);
      this.messagesField.prepend(containerMessage);
      const title = createHtmlElement('div', 'messageTitle', '', containerMessage);

      const ava = new Image();
      ava.src = document.photo ? document.photo : avatar;
      title.append(ava);

      if (document.uid !== this.model.user?.uid) {
        ava.addEventListener('click', (e) => this.createModalUserWindow(e, containerMessage, document.uid));
      }

      createHtmlElement('span', '', `${document.name}`, title);
      if (document.uid === this.model.user?.uid) {
        const buttonDelete = new Button('deleteButton', this.model, () => this.deleteMessage(doc.id));
        this.buttons.push(buttonDelete);
        title.append(buttonDelete.render());
      }
      createHtmlElement('p', 'message_text', `${document.text}`, containerMessage);
      const timeSec = document.created?.seconds ? document.created.seconds * 1000 : Date.now();
      const time = new Date(timeSec);
      const timeText = `${time.getDate().toString().padStart(2, '0')}.${time
        .getMonth()
        .toString()
        .padStart(2, '0')}.${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
      createHtmlElement('p', 'message_time', timeText, containerMessage);
    });
    this.messagesField.scrollTop = this.messagesField.scrollHeight;
  };

  createModalUserWindow = (e: Event, container: HTMLElement, id: string) => {
    e.stopPropagation();
    const wrapper = createHtmlElement('div', 'modal-user-window', '', container);
    const addSubscriptions = createHtmlElement('p', '', LANGTEXT['addSubscriptions'][this.model.lang], wrapper);
    addSubscriptions.addEventListener('click', () => this.emit('subscripte', id));
    const writeUser = createHtmlElement('p', '', LANGTEXT['writeUser'][this.model.lang], wrapper);
    writeUser.addEventListener('click', () => this.emit('writeUser', id));
    const delleteModal = () => {
      window.removeEventListener('click', delleteModal);
      wrapper.remove();
    };
    window.addEventListener('click', delleteModal);
  };

  changeLang = () => {
    this.buttons.forEach((button) => button.changeLang());
    this.buttonSend.changeLang();
    this.limitText.innerText = LANGTEXT['inputLimit'][this.model.lang];
    this.sortDESC.innerText = LANGTEXT['sortDesc'][this.model.lang];
    this.sortASC.innerText = LANGTEXT['sortAsc'][this.model.lang];
  };
}
