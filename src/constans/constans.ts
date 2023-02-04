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
};

type LangNameElement = keyof typeof LANGTEXT;

export { LANGTEXT, Lang, LangNameElement, CLASSTHEME, THEME };
