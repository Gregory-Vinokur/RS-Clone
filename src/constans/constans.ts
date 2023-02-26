const CLASSTHEME = 'dark-theme';
const THEME = 'THEME';

type LangFild = {
  rus: string;
  eng: string;
};

enum PATCH_TO_DB {
  DIALOGS_ROOMS = 'dialogRooms',
  GROUP_ROOMS = 'groupRooms',
  USERS = 'users',
  LAST_CHANGE = 'lastChange',
  MESSAGES = 'messages',
  MESSAGE_TEXT = 'text',
  DEFAULT_NAME = 'Иван Иванов',
  PHOTO_URL = 'https://firebasestorage.googleapis.com/v0/b/rs-clone-ts.appspot.com/o/images%2F04.jpg?alt=media&token=60ae0ee3-7b9b-44a1-9812-155b9c766d1c',
}

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
  editeButton: {
    rus: 'Изменить',
    eng: 'Edit',
  },
  langButton: {
    rus: 'Рус',
    eng: 'Eng',
  },
  chatButton: {
    rus: 'Чат',
    eng: 'Chat',
  },
  groupRoomsButton: {
    rus: 'Группы',
    eng: 'Groups',
  },
  roomsButton: {
    rus: 'Диалог',
    eng: 'Dialog',
  },
  createGroupButton: {
    rus: 'Создать',
    eng: 'Create',
  },
  findGroupButton: {
    rus: 'Найти',
    eng: 'Find',
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
  notFind: {
    rus: 'Не найдено',
    eng: 'Not found',
  },
  noMessage: {
    rus: 'Еще нет ни одного сообщения.',
    eng: 'There are no messages yet.',
  },
  status: {
    rus: 'Статус',
    eng: 'Status',
  },
  musicPage: {
    rus: 'Музыка',
    eng: 'Music',
  },
  playlistOfDayBtn: {
    rus: 'Плейлист дня',
    eng: 'Playlist of the day',
  },
  myMusicBtn: {
    rus: 'Моя музыка',
    eng: 'My music',
  },
  searchMusicInput: {
    rus: 'Название трека или исполнителя',
    eng: 'Enter the name of the track or artist',
  },
  searchMusicBtn: {
    rus: 'Найти',
    eng: 'Search',
  },
  musicContainerTitle: {
    rus: 'Собрано для Вас',
    eng: 'Collected for you',
  },
  musicNotFound: {
    rus: 'Треков не найдено, попробуйте изменить запрос. Наша база содержит более 30 миллионов треков.',
    eng: 'No tracks found, try editing your query. Our database contains over 30 million tracks.',
  },
  comeInGroup: {
    rus: 'Присоеденится',
    eng: 'Join the group',
  },
  goOutGroup: {
    rus: 'Покинуть',
    eng: 'Go out',
  },
  CommunitiesPage: {
    rus: 'Сообщества',
    eng: 'Communities',
  },
  messagePlaceholder: {
    rus: 'Введите ваше сообщение',
    eng: 'Enter your message',
  },
  findPlaceholder: {
    rus: 'Введите имя',
    eng: 'Enter name',
  },
  groupPlaceholder: {
    rus: 'Введите название группы',
    eng: 'Enter a group name',
  },
  userMusicTitle: {
    rus: 'Музыка',
    eng: 'Music',
  },
};

type LangNameElement = keyof typeof LANGTEXT;

export { LANGTEXT, Lang, LangNameElement, CLASSTHEME, THEME, PATCH_TO_DB };
