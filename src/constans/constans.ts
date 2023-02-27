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
  continueButton: {
    rus: 'Продолжить',
    eng: 'Continue',
  },
  authQuestion: {
    rus: 'Хотите продолжить как',
    eng: 'Want to continue as',
  },
  changeUserBtn: {
    rus: 'Сменить пользователя',
    eng: 'Change user',
  },
  signInButton: {
    rus: 'Войти',
    eng: 'Sign in',
  },
  signUpButton: {
    rus: 'Зарегистрироваться',
    eng: 'Sign up',
  },
  userMailTitle: {
    rus: 'Электронная почта:',
    eng: 'E-mail:',
  },
  userNameTitle: {
    rus: 'Имя:',
    eng: 'Name:',
  },
  userPasswordTitle: {
    rus: 'Пароль:',
    eng: 'Password:',
  },
  resetPasswordLink: {
    rus: 'Забыли пароль?',
    eng: 'Forgot your password?',
  },
  submitButton: {
    rus: 'Подтвердить',
    eng: 'Submit',
  },
  errorMessageMail: {
    rus: 'Неверный адрес',
    eng: 'Invalid e-mail',
  },
  errorMessageName: {
    rus: 'Введите Ваше имя, пожалуйста',
    eng: 'Enter your name, please',
  },
  errorMessagePassword: {
    rus: 'Неверный пароль',
    eng: 'Invalid password',
  },
  tooManyRequests: {
    rus: 'Слишком много запросов. Попробуйте позже.',
    eng: 'Too many requests. Try again later.',
  },
  replyComment: {
    rus: 'Оставьте комментарий...',
    eng: 'Leave a comment...',
  },
  cancelBtn: {
    rus: 'Отмена',
    eng: 'Cancel',
  },
  saveBtn: {
    rus: 'Сохранить',
    eng: 'Save',
  },
  animals: {
    rus: 'Животные',
    eng: 'Animals',
  },
  humor: {
    rus: 'Юмор',
    eng: 'Humor',
  },
  public_page: {
    rus: 'Публичная страница',
    eng: 'Public page',
  },
  follower: {
    rus: ' подписчик',
    eng: ' follower',
  },
  followers: {
    rus: ' подписчика',
    eng: ' followers',
  },
  following: {
    rus: '✔ Вы подписаны',
    eng: '✔ Following',
  },
  followBtn: {
    rus: 'Подписаться',
    eng: 'Follow',
  },
  unfollowBtn: {
    rus: 'Отписаться',
    eng: 'Unfollow',
  },
  followersText: {
    rus: ' подписчики',
    eng: ' followers',
  },
  generatePost: {
    rus: 'Сгенерировать пост',
    eng: 'Generate post',
  },
  errorPageText: {
    rus: 'СТРАНИЦА НЕ НАЙДЕНА (404)',
    eng: 'PAGE NOT FOUND (404)',
  },
  ErrorMessagePassword: {
    rus: 'Пароль должен быть не менее 6 символов.',
    eng: 'Password should be at least 6 characters.',
  },
};

type LangNameElement = keyof typeof LANGTEXT;

export { LANGTEXT, Lang, LangNameElement, CLASSTHEME, THEME, PATCH_TO_DB };
