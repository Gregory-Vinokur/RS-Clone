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
  textInRooms: {
    rus: 'Выберите кому хотите написать.',
    eng: 'Select who you want to write.',
  },
  createUserNewsBtn: {
    rus: 'Поделиться',
    eng: 'Share',
  },
  inputCreateNews: {
    rus: 'Что у вас нового?',
    eng: 'Anything new?',
  },
  subscriptsUserBtn: {
    rus: 'Подписаться',
    eng: 'Subscribe',
  },
  unsubscriptsUserBtn: {
    rus: 'Вы подписаны',
    eng: 'Unsubscribe',
  },
  userSubscriptions: {
    rus: 'Подписки',
    eng: 'Subscriptions',
  },
  recommendedSubscriptions: {
    rus: 'Рекомендованные подписки',
    eng: 'Recommended subscriptions',
  },
  emptyUserNews: {
    rus: 'Пользователь не добавил ни одной новости',
    eng: 'The user has not added any news',
  },
  buttonFind: {
    rus: 'Найти',
    eng: 'Find user',
  },
  status: {
    rus: 'Статус',
    eng: 'Status',
  },
  musicPage: {
    rus: 'Музыка',
    eng: 'Music',
  },
  CommunitiesPage: {
    rus: 'Сообщества',
    eng: 'Communities',
  },
};

type LangNameElement = keyof typeof LANGTEXT;

export { LANGTEXT, Lang, LangNameElement, CLASSTHEME, THEME };
