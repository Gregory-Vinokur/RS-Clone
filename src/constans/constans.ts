const CLASSTHEME = 'dark-theme';
const THEME = 'THEME';

type LangFild = {
  rus: string;
  eng: string;
};
// type LangText = {
//   [prop: string]: LangFild;
// };

type Lang = keyof LangFild;

const LANGTEXT = {
  sendButton: {
    rus: 'Отправить',
    eng: 'Send',
  },
  deleteButton: {
    rus: 'Удалить',
    eng: 'Delete',
  },
  langButton: {
    rus: 'Рус',
    eng: 'Eng',
  },
  chatButton: {
    rus: 'Чат',
    eng: 'Chat',
  },
  roomsButton: {
    rus: 'Группы',
    eng: 'Rooms',
  },
  inputLimit: {
    rus: 'Лимит сообщений: ',
    eng: 'Limit messages: ',
  },
  sortDesc: {
    rus: 'Сначала новые',
    eng: 'First new',
  },
  sortAsc: {
    rus: 'Сначала старые',
    eng: 'First old',
  },
  myProfile: {
    rus: 'Мой профиль',
    eng: 'My Profile',
  },
  news: {
    rus: 'Новости',
    eng: 'News',
  },
  messenger: {
    rus: 'Сообщения',
    eng: 'Messenger',
  },
  Logout: {
    rus: 'Выйти',
    eng: 'Logout',
  },
  addSubscriptions: {
    rus: 'Подписаться',
    eng: 'Subscribe',
  },
  delSubscriptions: {
    rus: 'Отписаться',
    eng: 'Unsubscribe',
  },
  writeUser: {
    rus: 'Написать сообщение',
    eng: 'Write a message',
  },
};

type LangNameElement = keyof typeof LANGTEXT;

export { LANGTEXT, Lang, LangNameElement, CLASSTHEME, THEME };
