import { createHtmlElement } from '../../utils/createElement';
import debounce from '../../utils/debounce';
import Page from '../Template/page';
import ModelMessages from './Model-messages';
import Button from '../../base/button/Button';
import avatar from '../../../assets/img/ava.jpg';
import FindWindow from '../../base/find/FindWindow';
import CreateGroupWindow from '../../base/createGroup/CreateGroup';
import FindGroupWindow from '../../base/find/FindGroupWindow';
import EditeMessage from '../../base/editeMessage/EditeMessage';
import { LANGTEXT, PATCH_TO_DB } from '../../constans/constans';

type EmitsName =
  | 'send'
  | 'edite'
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
  | 'goOutGroup'
  | 'deleteGroupMessage';

enum SORTBY {
  DESC = 'desc',
  ASC = 'asc',
}

type Callback = ((data: string, text: string) => void) | ((data: number) => void) | (() => void);

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
  editeMessageWindow: EditeMessage | null;
  isEditeMessageWindow: boolean;
  isEditeMessage: boolean;
  editeMessageId: string;
  buttonEdite: Button<ModelMessages>;
  buttonEditeClose: HTMLElement;
  noMessage: HTMLElement;

  emit(event: EmitsName, data?: string | number, text?: string) {
    return super.emit(event, data, text);
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
    this.isEditeMessageWindow = false;
    this.isEditeMessage = false;
    this.findWindow = null;
    this.findGroupWindow = null;
    this.createGroupWindow = null;
    this.editeMessageWindow = null;
    this.editeMessageId = '';
    this.messagesRoomsMembersElement = [];
    this.groupRoomsElement = [];
    this.messagesField = createHtmlElement('div', 'messages__field');
    this.messagesChatContainer = createHtmlElement('div', 'messages__container', '', this.messagesField);
    this.messagesChat = createHtmlElement('div', 'messages__chat', '', this.messagesChatContainer);

    this.messagesRooms = createHtmlElement('div', 'messages__rooms');
    const messagesRoomsMembersContainer = createHtmlElement('div', 'messages__group-rooms-container', '', this.messagesRooms);
    this.messagesRoomsMembers = createHtmlElement('div', 'messages__members', '', messagesRoomsMembersContainer);
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
    const sendInputWrapper = createHtmlElement('div', 'send-input-wrapper');
    this.buttonEditeClose = createHtmlElement('div', 'button_close', '✖', sendInputWrapper);
    this.buttonEditeClose.style.display = 'none';
    this.buttonEditeClose.addEventListener('click', this.stopeEdite);
    const sendInputContainer = createHtmlElement('div', 'send-input-container', '', sendInputWrapper);
    this.buttonSend = new Button('sendButton', this.model, this.sendMessage);
    this.buttonEdite = new Button('editeButton', this.model, this.updateMessage);
    this.buttonEdite.element.style.display = 'none';
    sendInputContainer.append(this.input, this.buttonSend.render(), this.buttonEdite.render());
    this.noMessage = createHtmlElement('h2', '', LANGTEXT.noMessage[this.model.lang]);

    this.mainWrapper.append(buttonsHeaderContainer, this.messagesField, sendInputWrapper, this.containerButtons);
    this.messagesChat.innerHTML = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    this.messagesChat.classList.add('messages__field_load');
    this.model.on('updateData', this.updateData);
    const debonseCreateRooms = debounce(this.createRooms, 200);
    this.model.on('updateDialogs', () => {
      debonseCreateRooms();
    });
    const debonceCreateGroups = debounce(this.createGroups, 200);
    this.model.on('updateGroups', () => {
      debonceCreateGroups();
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
    this.isEditeMessageWindow = false;
    this.findWindow = null;
    this.createGroupWindow = null;
    this.findGroupWindow = null;
    this.editeMessageWindow = null;
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
    this.stopeEdite();
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
    this.stopeEdite();
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
    this.stopeEdite();
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
    input.placeholder = LANGTEXT['messagePlaceholder'][this.model.lang];
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

  private updateMessage = () => {
    if (this.model.isChat || (this.model.isRooms && this.model.currentDialog) || (this.model.isGroupRooms && this.model.currentGroup)) {
      this.emit('edite', this.editeMessageId, this.input.value);
      this.stopeEdite();
    }
  };

  deleteMessage = (id: string) => {
    if (this.model.isChat) {
      this.emit('deleteMessage', id);
    }
    if (this.model.isRooms) {
      this.emit('deleteDialogMessage', id);
    }
    if (this.model.isGroupRooms) {
      this.emit('deleteGroupMessage', id);
    }
  };

  editeMessage = (id: string, text: string) => {
    this.editeMessageId = id;
    this.input.value = text;
    this.buttonSend.element.style.display = 'none';
    this.buttonEdite.element.style.display = 'flex';
    this.buttonEditeClose.style.display = 'block';
    this.setTextAreaHeight();
  };

  stopeEdite = () => {
    this.editeMessageId = '';
    this.input.value = '';
    this.buttonSend.element.style.display = 'flex';
    this.buttonEdite.element.style.display = 'none';
    this.buttonEditeClose.style.display = 'none';
    this.setTextAreaHeight();
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
      const button = this.createHumburgerButton();
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
  };

  private createHumburgerButton = () => {
    const button = createHtmlElement('div', 'messages__member__button');
    createHtmlElement('span', 'button__span', '', button);
    createHtmlElement('span', 'button__span', '', button);
    createHtmlElement('span', 'button__span', '', button);
    return button;
  };

  private createGroups = async () => {
    this.messagesGroupRoomsNames.innerHTML = '';
    this.groupRoomsElement = [];
    const groupsProp = await Promise.all(this.model.groupsProp);
    groupsProp.forEach((group, index) => {
      const groupElement = createHtmlElement('div', 'messages__member', ``, this.messagesGroupRoomsNames);
      if (group.lastChange > this.model.groupRoomsLastChange[index] && group.uid !== this.model.currentGroup) {
        groupElement.classList.add('new-message');
      }
      if (group.uid === this.model.currentGroup) {
        groupElement.classList.add('active');
      }
      const ava = this.createAva(`${group.groupAvatar}`);
      const name = createHtmlElement('span', '', `${group.nameGroup}`);
      const button = this.createHumburgerButton();
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
    if (!this.model.dialogsMessages[index].length) {
      this.messagesRoomsChat.appendChild(this.noMessage);
      return;
    }
    this.model.dialogsMessages[index].forEach((element) => {
      const className = element.uid === this.model.user?.uid ? 'my_message' : 'other_message';
      const message = createHtmlElement('div', `containerMessage ${className}`, '', this.messagesRoomsChat);
      const title = createHtmlElement('div', 'messageTitle', '', message);
      const ava = this.createAva(element.avatar);
      title.append(ava);
      createHtmlElement('span', 'messages-autor', `${element.name}`, title);
      const container = createHtmlElement('div', 'container-text', '', message);
      createHtmlElement('p', 'message-text', element?.text, container);
      const time = this.createDataElement(element?.time);
      message.append(time);
      if (element.uid === this.model.user?.uid) {
        const button = this.createHumburgerButton();
        title.append(button);
        button.addEventListener('click', (e) => {
          if (!this.isEditeMessageWindow) {
            e.stopPropagation();
          }
          this.isEditeMessageWindow = true;
          this.editeMessageWindow = new EditeMessage(this, this.model, element.key, element?.text);
          message.append(this.editeMessageWindow.render());
        });
      }
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
        this.messagesGroupRoomsChat.append(this.noMessage);
        return;
      }
      const messagesKeys = Object.keys(messages);
      messagesKeys.forEach((key) => {
        const className = messages[key].uid === this.model.user?.uid ? 'my_message' : 'other_message';
        const message = createHtmlElement('div', `containerMessage ${className}`, '', this.messagesGroupRoomsChat);

        const title = createHtmlElement('div', 'messageTitle', '', message);
        const ava = this.createAva(messages[key].avatar);
        title.append(ava);
        if (messages[key].uid !== this.model.user?.uid) {
          ava.addEventListener('click', (e) => this.createModalUserWindow(e, messages[key].name, messages[key].uid, messages[key].avatar));
        }
        createHtmlElement('span', 'messages-autor', `${messages[key].name}`, title);

        const container = createHtmlElement('div', 'container-text', '', message);
        createHtmlElement('p', 'message-text', messages[key]?.text, container);
        const time = this.createDataElement(messages[key].time);
        message.append(time);
        if (messages[key].uid === this.model.user?.uid) {
          const button = this.createHumburgerButton();
          title.append(button);
          button.addEventListener('click', (e) => {
            if (!this.isEditeMessageWindow) {
              e.stopPropagation();
            }
            this.isEditeMessageWindow = true;
            this.editeMessageWindow = new EditeMessage(this, this.model, key, messages[key]?.text);
            message.append(this.editeMessageWindow.render());
          });
        }
      });
    }
    this.messagesGroupRoomsChatContainer.scrollTop = this.messagesGroupRoomsChatContainer.scrollHeight;
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
    let isMessage = 0;
    this.model.messages?.forEach((doc) => {
      isMessage++;
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
      createHtmlElement('span', 'messages-autor', `${document.name}`, title);

      if (document.uid === this.model.user?.uid) {
        const button = this.createHumburgerButton();
        title.append(button);
        button.addEventListener('click', (e) => {
          if (!this.isEditeMessageWindow) {
            e.stopPropagation();
          }
          this.isEditeMessageWindow = true;
          this.editeMessageWindow = new EditeMessage(this, this.model, doc.id, document.text);
          containerMessage.append(this.editeMessageWindow.render());
        });
      }
      createHtmlElement('p', 'message-text', `${document.text}`, containerMessage);
      containerMessage.append(this.createDataElement(document.created?.seconds * 1000));
    });
    console.log(isMessage);
    if (!isMessage) {
      this.messagesChat.appendChild(this.noMessage);
    }
    this.messagesChatContainer.scrollTop = this.messagesChatContainer.scrollHeight;
  };

  createDataElement = (sec?: number | string) => {
    const timeSec = sec ? Number(sec) : Date.now();
    const time = new Date(timeSec);
    const timeText = `${time.getDate().toString().padStart(2, '0')}.${(time.getMonth() + 1).toString().padStart(2, '0')}.${time.getFullYear()} ${time
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
    const nameTitle = createHtmlElement('h2', 'modal__name', name);
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
    this.buttonEdite.changeLang();
    if (this.findWindow) {
      this.findWindow.changeLang();
    }
    if (this.findGroupWindow) {
      this.findGroupWindow.changeLang();
    }
    if (this.createGroupWindow) {
      this.createGroupWindow.changeLang();
    }
    if (this.editeMessageWindow) {
      this.editeMessageWindow.changeLang();
    }
    this.noMessage.innerText = LANGTEXT.noMessage[this.model.lang];
    this.input.placeholder = LANGTEXT['messagePlaceholder'][this.model.lang];
    this.titleInRooms.innerText = LANGTEXT['textInRooms'][this.model.lang];
    this.titleInGroupRooms.innerText = LANGTEXT['textInRooms'][this.model.lang];
    this.limitText.innerText = LANGTEXT['inputLimit'][this.model.lang];
    this.sortDESC.innerText = LANGTEXT['sortDesc'][this.model.lang];
    this.sortASC.innerText = LANGTEXT['sortAsc'][this.model.lang];
  };
}
