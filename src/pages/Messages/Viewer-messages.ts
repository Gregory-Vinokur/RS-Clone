import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import ModelMessages from './Model-messages';
import Button from '../../base/button/Button';
import avatar from '../../../assets/img/ava.jpg';
import { LANGTEXT } from '../../constans/constans';

type EmitsName =
  | 'send'
  | 'changeLang'
  | 'deleteMessage'
  | 'setLimit'
  | 'setSort'
  | 'subscripte'
  | 'unsubscripte'
  | 'writeUser'
  | 'toChat'
  | 'toRooms'
  | 'checkDialog';

enum SORTBY {
  DESC = 'desc',
  ASC = 'asc',
}

type Callback = ((data: string) => void) | ((data: number) => void) | (() => void);

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
  buttonsHeader: Button<ModelMessages>[];
  buttonSend: Button<ModelMessages>;
  messagesChat: HTMLElement;
  messagesRooms: HTMLElement;
  messagesRoomsMembers: HTMLElement;
  messagesRoomsChat: HTMLElement;
  titleInRooms: HTMLElement;

  emit(event: EmitsName, data?: string | number) {
    return super.emit(event, data);
  }

  on(event: EmitsName, callback: Callback) {
    return super.on(event, callback);
  }

  constructor(id: string, model: ModelMessages) {
    super(id);
    this.mainWrapper.className = 'messages__page';
    this.model = model;
    this.model.on('changeLang', this.changeLang);
    this.buttons = [];
    this.buttonsHeader = [];

    this.messagesField = createHtmlElement('div', 'messages__field');
    this.messagesChat = createHtmlElement('div', 'messages__chat', '', this.messagesField);
    this.messagesRooms = createHtmlElement('div', 'messages__rooms');
    this.messagesRoomsMembers = createHtmlElement('div', 'messages__members', 'Members', this.messagesRooms);
    this.messagesRoomsChat = createHtmlElement('div', 'messages__roomsChat', '', this.messagesRooms);
    this.titleInRooms = createHtmlElement('h2', '', LANGTEXT['textInRooms'][this.model.lang], this.messagesRoomsChat);

    const buttonsHeaderContainer = this.createButtonsHeader();
    this.input = this.createInputMessage();
    this.setTextAreaHeight();

    this.containerButtons = createHtmlElement('div', 'message__containerButtons');
    const containerLimit = createHtmlElement('div', 'container-limit', '', this.containerButtons);

    this.limitText = createHtmlElement('span', 'input-limit-title', LANGTEXT['inputLimit'][this.model.lang], containerLimit);
    this.inputLimit = this.createLimit(containerLimit);

    this.sortSelect = createHtmlElement('select', 'sort__select', '', containerLimit) as HTMLSelectElement;
    this.sortDESC = createHtmlElement('option', 'sort__option', `${LANGTEXT['sortDesc'][this.model.lang]}`, this.sortSelect);
    this.sortDESC.setAttribute('value', SORTBY.DESC);
    this.sortASC = createHtmlElement('option', 'sort__option', `${LANGTEXT['sortAsc'][this.model.lang]}`, this.sortSelect);
    this.sortASC.setAttribute('value', SORTBY.ASC);
    this.sortSelect.value = this.model.sort;
    this.sortSelect.addEventListener('change', () => this.emit('setSort', this.sortSelect.value));

    this.buttonSend = new Button('sendButton', this.model, this.sendMessage);
    this.containerButtons.append(this.buttonSend.render());

    this.mainWrapper.append(buttonsHeaderContainer, this.messagesField, this.input, this.containerButtons);
    this.messagesChat.innerHTML = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    this.messagesChat.classList.add('messages__field_load');
    this.model.on('updateData', this.updateData);
    this.model.on('updateDialog', this.createRooms);
    this.model.on('showDialog', this.showDialog);
    this.model.on('updateDialog', (index?: number) => this.updateDialog(index));
    this.createRooms();
  }

  private createButtonsHeader = () => {
    const buttonsHeaderContainer = createHtmlElement('div', 'buttons-header');
    const buttonChat = new Button('chatButton', this.model, () => {
      this.buttonsHeader.forEach((button) => button.element.classList.remove('button_active'));
      buttonChat.element.classList.add('button_active');
      this.messagesField.innerHTML = '';
      this.emit('toChat');
      this.messagesField.append(this.messagesChat);
      this.messagesField.scrollTop = this.messagesField.scrollHeight;
    });
    buttonChat.element.classList.add('button_active');
    const buttonRooms = new Button('roomsButton', this.model, () => {
      this.buttonsHeader.forEach((button) => button.element.classList.remove('button_active'));
      buttonRooms.element.classList.add('button_active');
      this.messagesField.innerHTML = '';
      this.emit('toRooms');
      this.messagesField.append(this.messagesRooms);
    });
    this.buttonsHeader.push(buttonChat, buttonRooms);
    buttonsHeaderContainer.append(...this.buttonsHeader.map((button) => button.render()));
    return buttonsHeaderContainer;
  };

  private createInputMessage = () => {
    const input = createHtmlElement('textarea', 'input__message') as HTMLInputElement;
    input.setAttribute('rows', '1');
    input.addEventListener('input', this.setTextAreaHeight);
    return input;
  };

  private createLimit = (containerLimit: HTMLElement) => {
    const inputLimit = createHtmlElement('input', 'input__limit', '', containerLimit) as HTMLInputElement;
    inputLimit.setAttribute('type', 'number');
    inputLimit.setAttribute('min', '1');
    inputLimit.setAttribute('max', '100');
    inputLimit.value = this.model.limit.toString();
    inputLimit.addEventListener('input', () => this.emit('setLimit', inputLimit.value));
    return inputLimit;
  };

  private setTextAreaHeight = () => {
    this.input.style.height = `auto`;
    this.input.style.height = `${this.input.scrollHeight}px`;
  };

  private sendMessage = () => {
    if (this.model.isChat || this.model.isRooms) {
      this.emit('send', this.input.value);
      this.input.value = '';
      this.setTextAreaHeight();
    }
  };

  private deleteMessage = (id: string) => {
    this.emit('deleteMessage', id);
  };

  private updateData = () => {
    this.inputLimit.value = this.model.limit.toString();
    this.createMessages();
  };

  private createRooms = async () => {
    this.messagesRoomsMembers.innerHTML = '';
    const userProp = await Promise.all(this.model.dialogMembersProp);
    for (let index = 0; index < userProp.length; index++) {
      const member = createHtmlElement('div', 'messages__member', ``, this.messagesRoomsMembers);
      const ava = this.createAva(`${userProp[index].userAvatar}`);
      const name = createHtmlElement('span', '', `${userProp[index].userName}`);
      member.append(ava, name);
      member.addEventListener('click', () => this.emit('checkDialog', index));
    }
  };

  private showDialog = () => {
    this.messagesRoomsChat.innerHTML = '';
    this.model.dialogsMessages[this.model.currentDialogIndex].forEach((element) => {
      const className = element.uid === this.model.user?.uid ? 'my_message' : 'other_message';
      const message = createHtmlElement('div', `containerMessage ${className}`, '', this.messagesRoomsChat);
      const text = createHtmlElement('p', '', element?.text, message);
      const time = this.createDataElement(element?.time);
      message.append(time);
    });
  };

  private updateDialog = (index?: number) => {
    if (index === this.model.currentDialogIndex) {
      this.showDialog();
    }
  };

  private createMessages = () => {
    this.messagesChat.innerHTML = '';
    this.messagesChat.classList.remove('messages__field_load');
    this.buttons = [];
    this.model.messages?.forEach((doc) => {
      const document = doc.data();
      const classMessage = document.uid === this.model.user?.uid ? 'my_message' : 'other_message';
      const containerMessage = createHtmlElement('div', `containerMessage ${classMessage}`);
      this.messagesChat.prepend(containerMessage);
      const title = createHtmlElement('div', 'messageTitle', '', containerMessage);

      const ava = this.createAva(document.photo);
      title.append(ava);

      if (document.uid !== this.model.user?.uid) {
        ava.addEventListener('click', (e) => this.createModalUserWindow(e, document.uid));
      }

      createHtmlElement('span', '', `${document.name}`, title);
      if (document.uid === this.model.user?.uid) {
        const buttonDelete = new Button('deleteButton', this.model, () => this.deleteMessage(doc.id));
        this.buttons.push(buttonDelete);
        title.append(buttonDelete.render());
      }
      createHtmlElement('p', 'message_text', `${document.text}`, containerMessage);
      containerMessage.append(this.createDataElement(document.created?.seconds));
    });
    this.messagesField.scrollTop = this.messagesField.scrollHeight;
  };

  createDataElement = (sec?: number | string) => {
    const timeSec = sec ? Number(sec) * 1000 : Date.now();
    const time = new Date(timeSec);
    const timeText = `${time.getDate().toString().padStart(2, '0')}.${time.getMonth().toString().padStart(2, '0')}.${time.getFullYear()} ${time
      .getHours()
      .toString()
      .padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    return createHtmlElement('p', 'message_time', timeText);
  };

  createAva = (imgUrl: string) => {
    const ava = new Image();
    ava.src = imgUrl ? imgUrl : avatar;
    ava.onerror = () => {
      ava.src = avatar;
    };
    return ava;
  };

  private createModalUserWindow = (e: Event, id: string) => {
    e.stopPropagation();
    const shadow = createHtmlElement('div', 'modal', '', this.mainWrapper);
    const wrapper = createHtmlElement('div', 'modal-user-window', '', shadow);
    const addSubscriptions = createHtmlElement('p', '', LANGTEXT['addSubscriptions'][this.model.lang], wrapper);
    if (this.model.subscripts.includes(id)) {
      addSubscriptions.innerText = LANGTEXT['delSubscriptions'][this.model.lang];
      addSubscriptions.addEventListener('click', () => this.emit('unsubscripte', id));
    } else {
      addSubscriptions.addEventListener('click', () => this.emit('subscripte', id));
    }
    const writeUser = createHtmlElement('p', '', LANGTEXT['writeUser'][this.model.lang], wrapper);
    writeUser.addEventListener('click', () => this.emit('writeUser', id));
    shadow.addEventListener('click', () => shadow.remove());
  };

  private changeLang = () => {
    this.buttons.forEach((button) => button.changeLang());
    this.buttonsHeader.forEach((button) => button.changeLang());
    this.buttonSend.changeLang();
    this.titleInRooms.innerText = LANGTEXT['textInRooms'][this.model.lang];
    this.limitText.innerText = LANGTEXT['inputLimit'][this.model.lang];
    this.sortDESC.innerText = LANGTEXT['sortDesc'][this.model.lang];
    this.sortASC.innerText = LANGTEXT['sortAsc'][this.model.lang];
  };
}
