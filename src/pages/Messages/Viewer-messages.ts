import { createHtmlElement } from '../../utils/createElement';
import debounce from '../../utils/debounce';
import Page from '../Template/page';
import ModelMessages from './Model-messages';
import Button from '../../base/button/Button';
import avatar from '../../../assets/img/ava.jpg';
import FindWindow from '../../base/find/FindWindow';
import CreateGroupWindow from '../../base/createGroup/CreateGroup';
import FindGroupWindow from '../../base/find/FindGroupWindow';
import { LANGTEXT, PATCH_TO_DB } from '../../constans/constans';

type EmitsName =
  | 'send'
  | 'changeLang'
  | 'deleteMessage'
  | 'deleteDialogMessage'
  | 'setLimit'
  | 'setSort'
  | 'subscripte'
  | 'unsubscripte'
  | 'writeUser'
  | 'toChat'
  | 'toRooms'
  | 'toGroupRooms'
  | 'checkDialog'
  | 'checkGroup'
  | 'createGroup'
  | 'comeInGroup'
  | 'goOutGroup';

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
  buttonsDialog: Button<ModelMessages>[];
  buttonsHeader: Button<ModelMessages>[];
  buttonSend: Button<ModelMessages>;
  messagesChat: HTMLElement;
  messagesRooms: HTMLElement;
  messagesRoomsMembers: HTMLElement;
  messagesRoomsMembersElement: HTMLElement[];
  messagesRoomsChat: HTMLElement;
  titleInRooms: HTMLElement;
  messagesChatContainer: HTMLElement;
  messagesRoomsChatContainer: HTMLElement;
  isFind: boolean;
  findWindow: FindWindow | null;
  buttonChat!: Button<ModelMessages>;
  buttonRooms!: Button<ModelMessages>;
  buttonFind!: Button<ModelMessages>;
  buttonGroupRooms!: Button<ModelMessages>;
  messagesGroupRooms: HTMLElement;
  messagesGroupRoomsChatContainer: HTMLElement;
  titleInGroupRooms: HTMLElement;
  messagesGroupRoomsChat: HTMLElement;
  messagesGroupRoomsNames: HTMLElement;
  groupRoomsElement: HTMLElement[];
  buttonNewGroup!: Button<ModelMessages>;
  buttonFindGroup!: Button<ModelMessages>;
  createGroupWindow: CreateGroupWindow | null;
  isCreateWindow: boolean;
  isFindGrop: boolean;
  findGroupWindow: FindGroupWindow | null;

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
    this.buttonsDialog = [];
    this.buttonsHeader = [];
    this.isFind = false;
    this.isFindGrop = false;
    this.isCreateWindow = false;
    this.findWindow = null;
    this.findGroupWindow = null;
    this.createGroupWindow = null;
    this.messagesRoomsMembersElement = [];
    this.groupRoomsElement = [];
    this.messagesField = createHtmlElement('div', 'messages__field');
    this.messagesChatContainer = createHtmlElement('div', 'messages__container', '', this.messagesField);
    this.messagesChat = createHtmlElement('div', 'messages__chat', '', this.messagesChatContainer);

    this.messagesRooms = createHtmlElement('div', 'messages__rooms');
    this.messagesRoomsMembers = createHtmlElement('div', 'messages__members', '', this.messagesRooms);
    this.messagesRoomsChatContainer = createHtmlElement('div', 'messages__container', '', this.messagesRooms);
    this.messagesRoomsChat = createHtmlElement('div', 'messages__roomsChat', '', this.messagesRoomsChatContainer);
    this.titleInRooms = createHtmlElement('h2', '', LANGTEXT['textInRooms'][this.model.lang], this.messagesRoomsChat);

    this.messagesGroupRooms = createHtmlElement('div', 'messages__rooms', '');
    const messagesGroupRoomsNamesContainer = createHtmlElement('div', 'messages__group-rooms-container', '', this.messagesGroupRooms);
    const buttonsGroupRooms = this.createBattonGroupRooms();
    messagesGroupRoomsNamesContainer.appendChild(buttonsGroupRooms);
    this.messagesGroupRoomsNames = createHtmlElement('div', 'messages__members', 'Members', messagesGroupRoomsNamesContainer);
    this.messagesGroupRoomsChatContainer = createHtmlElement('div', 'messages__container', '', this.messagesGroupRooms);
    this.messagesGroupRoomsChat = createHtmlElement('div', 'messages__roomsChat', '', this.messagesGroupRoomsChatContainer);
    this.titleInGroupRooms = createHtmlElement('h2', '', LANGTEXT['textInRooms'][this.model.lang], this.messagesGroupRoomsChat);

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
    const debonseCreateRooms = debounce(this.createRooms, 200);
    this.model.on('updateDialogs', () => {
      debonseCreateRooms();
    });
    const debonceCreateGroups = debounce(this.createGroups, 200);
    // const debonceShowGroup = debounce(this.showGroup, 200);
    this.model.on('updateGroups', () => {
      debonceCreateGroups();
      // debonceShowGroup();
    });
    this.model.on('showDialog', this.showDialog);
    this.model.on('showGroup', this.showGroup);
    this.model.on('updateDialog', (index?: number) => this.updateDialog(index));
    this.createRooms();
    debonceCreateGroups();
  }

  private goTo = () => {
    this.messagesField.innerHTML = '';
    this.isFind = false;
    this.isCreateWindow = false;
    this.isFindGrop = false;
    this.findWindow = null;
    this.createGroupWindow = null;
    this.findGroupWindow = null;
    this.buttonsHeader.forEach((button) => button.element.classList.remove('button_active'));
    this.buttonNewGroup.element.classList.remove('button_active');
    this.buttonFindGroup.element.classList.remove('button_active');
  };

  private goToChat = () => {
    this.goTo();
    this.emit('toChat');
    this.inputLimit.disabled = false;
    this.sortSelect.disabled = false;
    this.buttonChat.element.classList.add('button_active');
    this.limitText.classList.remove('disabled');
    this.messagesField.append(this.messagesChatContainer);
    this.messagesChatContainer.scrollTop = this.messagesChatContainer.scrollHeight;
  };

  private goToRooms = () => {
    this.goTo();
    this.emit('toRooms');
    this.inputLimit.disabled = true;
    this.sortSelect.disabled = true;
    this.buttonRooms.element.classList.add('button_active');
    this.limitText.classList.add('disabled');
    this.messagesField.append(this.messagesRooms);
    this.messagesRoomsChatContainer.scrollTop = this.messagesRoomsChatContainer.scrollHeight;
  };

  private goToGroupRooms = () => {
    this.goTo();
    this.emit('toGroupRooms');
    this.inputLimit.disabled = true;
    this.sortSelect.disabled = true;
    this.buttonGroupRooms.element.classList.add('button_active');
    this.limitText.classList.add('disabled');
    this.messagesField.append(this.messagesGroupRooms);
    this.messagesRoomsChatContainer.scrollTop = this.messagesRoomsChatContainer.scrollHeight;
  };

  private createButtonsHeader = () => {
    const buttonsHeaderContainer = createHtmlElement('div', 'buttons-header');
    this.buttonChat = new Button('chatButton', this.model, () => {
      this.goToChat();
    });
    this.buttonChat.element.classList.add('button_active');
    this.buttonRooms = new Button('roomsButton', this.model, () => {
      this.goToRooms();
    });
    this.buttonGroupRooms = new Button('groupRoomsButton', this.model, () => {
      this.goToGroupRooms();
    });
    this.buttonFind = new Button('buttonFind', this.model, () => {
      if (!this.isFind) {
        this.isFind = true;
        this.buttonFind.element.classList.add('button_active');
        this.findWindow = new FindWindow(this, this.model);
        this.messagesField.append(this.findWindow.render());
      }
    });
    this.buttonsHeader.push(this.buttonChat, this.buttonRooms, this.buttonGroupRooms, this.buttonFind);
    buttonsHeaderContainer.append(...this.buttonsHeader.map((button) => button.render()));
    return buttonsHeaderContainer;
  };

  private createBattonGroupRooms = () => {
    const container = createHtmlElement('div', 'buttons-group-rooms');
    this.buttonNewGroup = new Button('createGroupButton', this.model, () => {
      if (!this.isCreateWindow) {
        this.isCreateWindow = true;
        this.buttonNewGroup.element.classList.add('button_active');
        this.createGroupWindow = new CreateGroupWindow(this, this.model);
        this.messagesField.append(this.createGroupWindow.render());
      }
    });

    this.buttonFindGroup = new Button('findGroupButton', this.model, () => {
      if (!this.isFindGrop) {
        this.isFindGrop = true;
        this.buttonFindGroup.element.classList.add('button_active');
        this.findGroupWindow = new FindGroupWindow(this, this.model);
        this.messagesField.append(this.findGroupWindow.render());
      }
    });
    container.append(this.buttonNewGroup.render(), this.buttonFindGroup.render());
    return container;
  };

  createInputMessage = () => {
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
    if (this.model.isChat || (this.model.isRooms && this.model.currentDialog) || (this.model.isGroupRooms && this.model.currentGroup)) {
      this.emit('send', this.input.value);
      this.input.value = '';
      this.setTextAreaHeight();
    }
  };

  private deleteMessage = (id: string) => {
    this.emit('deleteMessage', id);
  };

  private deleteDialogMessage = (id: string) => {
    this.emit('deleteDialogMessage', id);
  };

  private updateData = () => {
    this.inputLimit.value = this.model.limit.toString();
    this.createMessages();
  };

  private createRooms = async () => {
    this.messagesRoomsMembers.innerHTML = '';
    this.messagesRoomsMembersElement = [];

    const userProp = await Promise.all(this.model.dialogMembersProp);

    for (let index = 0; index < userProp.length; index++) {
      const member = createHtmlElement('div', 'messages__member', ``, this.messagesRoomsMembers);
      if (index === this.model.dialogRooms.findIndex((el) => el === this.model.currentDialog)) {
        member.classList.add('active');
      }
      const ava = this.createAva(`${userProp[index].userAvatar}`);
      const name = createHtmlElement('span', '', `${userProp[index].userName}`);
      // const containerButtons = createHtmlElement('div', 'messages__member__buttons');
      const button = createHtmlElement('div', 'messages__member__button');
      createHtmlElement('span', '', '', button);
      createHtmlElement('span', '', '', button);
      createHtmlElement('span', '', '', button);
      member.append(ava, name, button);
      this.messagesRoomsMembersElement.push(member);
      button.addEventListener('click', (e) =>
        this.createModalUserWindow(e, userProp[index].userName, userProp[index].userId, userProp[index].userAvatar)
      );
      member.addEventListener('click', () => {
        member.classList.remove('new-message');
        this.messagesRoomsMembersElement.forEach((el) => el.classList.remove('active'));
        member.classList.add('active');
        this.emit('checkDialog', index);
      });
    }
    // this.updateDialog();
  };

  private createGroups = async () => {
    this.messagesGroupRoomsNames.innerHTML = '';
    this.groupRoomsElement = [];
    const groupsProp = await Promise.all(this.model.groupsProp);
    groupsProp.forEach((group, index) => {
      const groupElement = createHtmlElement('div', 'messages__member', ``, this.messagesGroupRoomsNames);
      if (group.uid === this.model.currentGroup) {
        groupElement.classList.add('active');
      }
      const ava = this.createAva(`${group.groupAvatar}`);
      const name = createHtmlElement('p', 'messages__group-name', `${group.nameGroup}`);
      const button = createHtmlElement('div', 'messages__member__button');
      createHtmlElement('span', '', '', button);
      createHtmlElement('span', '', '', button);
      createHtmlElement('span', '', '', button);
      groupElement.append(ava, name, button);
      this.groupRoomsElement.push(groupElement);
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.createModalGroupWindow(e, group.nameGroup, group.uid, group.groupAvatar);
      });
      groupElement.addEventListener('click', () => {
        groupElement.classList.remove('new-message');
        this.groupRoomsElement.forEach((el) => el.classList.remove('active'));
        groupElement.classList.add('active');
        this.emit('checkGroup', index);
      });
    });
    this.showGroup();
  };

  private showDialog = () => {
    this.messagesRoomsChat.innerHTML = '';
    this.buttonsDialog = [];
    const index = this.model.dialogRooms.findIndex((el) => el === this.model.currentDialog);
    if (!this.model.dialogsMessages[index]) {
      return;
    }
    this.model.dialogsMessages[index].forEach((element) => {
      const className = element.uid === this.model.user?.uid ? 'my_message' : 'other_message';
      const message = createHtmlElement('div', `containerMessage ${className}`, '', this.messagesRoomsChat);
      const container = createHtmlElement('div', 'container-text', '', message);
      createHtmlElement('p', '', element?.text, container);
      if (element.uid === this.model.user?.uid) {
        const button = new Button('deleteButton', this.model, () => this.deleteDialogMessage(element.key));
        this.buttonsDialog.push(button);
        const containerButton = createHtmlElement('div', 'message__container-button', '', container);
        containerButton.append(button.render());
      }
      const time = this.createDataElement(element?.time);
      message.append(time);
    });
    this.messagesRoomsChatContainer.scrollTop = this.messagesRoomsChatContainer.scrollHeight;
  };

  private showGroup = () => {
    if (this.model.currentGroup) {
      this.messagesGroupRoomsChat.innerHTML = '';
      const index = this.model.groupRooms.findIndex((el) => el === this.model.currentGroup);
      if (!this.model.groupsProp[index]) {
        this.messagesGroupRoomsChat.appendChild(this.titleInGroupRooms);
        return;
      }

      const messages = this.model.groupsProp[index][PATCH_TO_DB.MESSAGES];
      if (!messages) {
        return;
      }
      const messagesKeys = Object.keys(messages);
      messagesKeys.forEach((key) => {
        const className = messages[key].uid === this.model.user?.uid ? 'my_message' : 'other_message';
        const message = createHtmlElement('div', `containerMessage ${className}`, '', this.messagesGroupRoomsChat);
        const container = createHtmlElement('div', 'container-text', '', message);
        createHtmlElement('p', '', messages[key]?.text, container);
        if (messages[key].uid === this.model.user?.uid) {
          const button = new Button('deleteButton', this.model, () => this.deleteDialogMessage(messages[key].key));
          this.buttonsDialog.push(button);
          const containerButton = createHtmlElement('div', 'message__container-button', '', container);
          containerButton.append(button.render());
        }
        const time = this.createDataElement(messages[key].time);
        message.append(time);
      });
    }
  };

  private updateDialog = async (index = -1) => {
    if (this.model.dialogRooms[index] === this.model.currentDialog) {
      this.showDialog();
    } else {
      await Promise.all(this.model.dialogMembersProp);
      if (this.messagesRoomsMembersElement.length) {
        if (index < 0) {
          return;
        }
        if (this.model.lastChangeUserDialog[index] < this.model.lastChangeDialog[index]) {
          this.messagesRoomsMembersElement[index].classList.add('new-message');
        }
      }
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
        ava.addEventListener('click', (e) => this.createModalUserWindow(e, document.name, document.uid, document.photo));
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
    this.messagesChatContainer.scrollTop = this.messagesChatContainer.scrollHeight;
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

  createModalUserWindow = (e: Event, name: string, id: string, imgUrl: string) => {
    const addSubscriptions = createHtmlElement('p', '', LANGTEXT['addSubscriptions'][this.model.lang]);
    const writeUser = createHtmlElement('p', '', LANGTEXT['writeUser'][this.model.lang]);

    const shadow = this.createModalWindow(e, name, imgUrl, addSubscriptions, writeUser);
    if (this.model.subscripts.includes(id)) {
      addSubscriptions.innerText = LANGTEXT['delSubscriptions'][this.model.lang];
      addSubscriptions.addEventListener('click', () => {
        shadow.remove();
        this.emit('unsubscripte', id);
      });
    } else {
      addSubscriptions.addEventListener('click', () => {
        shadow.remove();
        this.emit('subscripte', id);
      });
    }
    writeUser.addEventListener('click', () => {
      shadow.remove();
      this.emit('writeUser', id);
      this.goToRooms();
    });
  };

  createModalGroupWindow = (e: Event, name: string, id: string, imgUrl: string) => {
    const addSubscriptions = createHtmlElement('p', '', LANGTEXT['comeInGroup'][this.model.lang]);
    const shadow = this.createModalWindow(e, name, imgUrl, addSubscriptions);
    if (this.model.groupRooms.includes(id)) {
      addSubscriptions.innerText = LANGTEXT['goOutGroup'][this.model.lang];
      addSubscriptions.addEventListener('click', () => {
        shadow.remove();
        this.emit('goOutGroup', id);
      });
    } else {
      addSubscriptions.addEventListener('click', () => {
        shadow.remove();
        this.emit('comeInGroup', id);
        this.goToGroupRooms();
      });
    }
  };

  private createModalWindow = (e: Event, name: string, imgUrl: string, ...link: HTMLElement[]) => {
    e.stopPropagation();
    const shadow = createHtmlElement('div', 'modal', '', this.mainWrapper);
    const wrapper = createHtmlElement('div', 'modal-user-window', '', shadow);
    const buttonClose = createHtmlElement('div', 'button_close', '✖', wrapper);
    const ava = this.createAva(imgUrl);
    const nameTitle = createHtmlElement('h2', '', name);
    wrapper.append(ava, nameTitle, ...link);

    wrapper.addEventListener('click', (e) => e.stopPropagation());
    buttonClose.addEventListener('click', () => shadow.remove());
    shadow.addEventListener('click', () => shadow.remove());
    return shadow;
  };

  private changeLang = () => {
    this.buttons.forEach((button) => button.changeLang());
    this.buttonsDialog.forEach((button) => button.changeLang());
    this.buttonsHeader.forEach((button) => button.changeLang());
    this.buttonFindGroup.changeLang();
    this, this.buttonNewGroup.changeLang();
    this.buttonSend.changeLang();
    if (this.findWindow) {
      this.findWindow.changeLang();
    }
    if (this.createGroupWindow) {
      this.createGroupWindow.changeLang();
    }
    this.titleInRooms.innerText = LANGTEXT['textInRooms'][this.model.lang];
    this.titleInGroupRooms.innerText = LANGTEXT['textInRooms'][this.model.lang];
    this.limitText.innerText = LANGTEXT['inputLimit'][this.model.lang];
    this.sortDESC.innerText = LANGTEXT['sortDesc'][this.model.lang];
    this.sortASC.innerText = LANGTEXT['sortAsc'][this.model.lang];
  };
}
