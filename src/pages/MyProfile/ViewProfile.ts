import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import ModelProfile from './ModelProfile';
import 'firebase/compat/storage';
import defaultCover from '../../../assets/img/default-cover.jpg';
import defaultAva from '../../../assets/img/default-ava.jpg';

type EmitsName = 'uploadAvatar' | 'changeLang' | 'changeName' | 'changeStatus' | 'createNews' | 'deletePost' | 'uploadPostImg';

export default class ViewProfile extends Page {
  model: ModelProfile;
  inputAvatar: HTMLInputElement;
  inputCover: HTMLInputElement;
  inputCreateNews: HTMLInputElement;
  profileWrapper: HTMLElement;
  profileInfo: HTMLElement;
  createNewsBtn: HTMLElement;
  inputCreatePostImg: HTMLInputElement;
  profileCover: HTMLElement;
  profileAvatar: HTMLElement;
  spinnerLoad: HTMLElement;
  profilePerson: HTMLElement;
  userNewsContainer: HTMLElement;
  profileFriends: HTMLElement;
  emit(event: EmitsName, data?: string | File) {
    return super.emit(event, data);
  }

  on(event: EmitsName, callback: (data?: string | File) => void) {
    return super.on(event, callback);
  }

  constructor(id: string, model: ModelProfile) {
    super(id);
    this.model = model;
    this.mainWrapper.className = 'my__page';
    this.profileWrapper = createHtmlElement('div', 'profile__wrapper', '', this.mainWrapper);
    this.profileInfo = createHtmlElement('div', 'profile__info', '', this.profileWrapper);
    this.profileCover = createHtmlElement('div', 'profile__cover', '', this.profileWrapper);
    this.profileAvatar = createHtmlElement('div', 'profile__ava', '', this.profileInfo);
    this.profilePerson = createHtmlElement('div', 'profile__preson', '', this.profileInfo);
    this.userNewsContainer = createHtmlElement('div', 'news__container_user');
    this.profileFriends = createHtmlElement('div', 'profile__friends');

    this.inputAvatar = createHtmlElement('input', 'profile__input') as HTMLInputElement;
    this.inputAvatar.setAttribute('type', 'file');
    this.inputAvatar.id = 'profile__input';
    this.inputCover = createHtmlElement('input', 'profile__input-cover') as HTMLInputElement;
    this.inputCover.setAttribute('type', 'file');
    this.inputCover.id = 'profile__input-cover';

    this.inputCreateNews = createHtmlElement('input', 'input__create-news') as HTMLInputElement;
    this.inputCreateNews.setAttribute('type', 'text');

    this.createNewsBtn = createHtmlElement('button', 'create__news-btn', 'Поделиться');

    this.inputCreatePostImg = createHtmlElement('input', 'input__news-img') as HTMLInputElement;

    this.spinnerLoad = createHtmlElement('div', 'spinner__load');

    this.renderProfileCover(this.model.user?.uid as string);
    this.renderProfileAvatar(this.model.user?.uid as string);
    this.renderProfileName(this.model.user?.uid as string);
    this.renderProfileContainer();
    this.renderNews(this.model.user?.uid as string);
    this.renderUserFriends(this.model.user?.uid as string);
    this.renderFriendProfile();

    this.inputAvatar.addEventListener('change', (e: Event) => {
      this.model.uploadUserAvatar(e);
    });

    this.inputCover.addEventListener('change', (e: Event) => {
      this.model.uploadUserAvatar(e);
    });

    this.createNewsBtn.addEventListener('click', () => {
      this.createNews();
    });

    this.inputCreatePostImg.addEventListener('change', () => {
      this.emit('uploadPostImg', this.inputCreatePostImg.files![0]);
    });

    this.model.on('updateData', async () => await this.renderNews(this.model.user?.uid as string));
    this.model.on('uploadAvatar', () => {
      this.profileAvatar.innerHTML = '';
      this.renderProfileAvatar(this.model.user?.uid as string);
    });
    this.model.on('uploadCover', () => {
      this.profileCover.innerHTML = '';
      this.renderProfileCover(this.model.user?.uid as string);
    });
    this.model.on('loadPostImg', () => {
      (this.createNewsBtn as HTMLButtonElement).disabled = true;
      this.createNewsBtn.textContent = '';
      this.createNewsBtn.append(this.spinnerLoad);
    });
    this.model.on('postImgLoaded', () => {
      (this.createNewsBtn as HTMLButtonElement).disabled = false;
      this.createNewsBtn.textContent = 'Поделиться';
    });
  }

  async renderProfileAvatar(userId: string) {
    const user = await this.model.getUserInfo(userId);
    const profileAvatarImg = createHtmlElement('img', 'profile__ava-img', '', this.profileAvatar);
    const uploadAvaForm = createHtmlElement('form', 'profile__ava-form', '', this.profileAvatar);
    const uploadAvaLabel = createHtmlElement('label', 'profile__label', 'Изменить аватар', uploadAvaForm);
    uploadAvaForm.append(this.inputAvatar);
    uploadAvaLabel.setAttribute('for', 'profile__input');
    profileAvatarImg.setAttribute('src', `${user.userAvatar || defaultAva}`);
  }

  async renderProfileName(userId: string) {
    const user = await this.model.getUserInfo(userId);
    const profileNameWrapper = createHtmlElement('div', 'profile__name-wrapper', '', this.profilePerson);
    createHtmlElement('div', 'profile__name', `${user.userName || 'Иван Иванов'}`, profileNameWrapper);
    const profileNameBtn = createHtmlElement('button', 'profile__name-btn', '', profileNameWrapper);
    const profileNameInput = createHtmlElement('input', 'profile__name-input', '', this.profilePerson);
    profileNameInput.setAttribute('type', 'text');
    profileNameInput.setAttribute('placeholder', 'Введите новые данные');

    profileNameBtn.addEventListener('click', () => {
      this.editProfileName();
    });

    const profileStatusWrapper = createHtmlElement('div', 'profile__status-wrapper', '', this.profilePerson);
    createHtmlElement('div', 'profile__status', `${user.userStatus || 'Обновите ваш статус:)'}`, profileStatusWrapper);
    const profileStatusBtn = createHtmlElement('button', 'profile__status-btn', '', profileStatusWrapper);
    const profileStatusInput = createHtmlElement('input', 'profile__status-input', '', this.profilePerson);
    profileStatusInput.setAttribute('type', 'text');
    profileStatusInput.setAttribute('placeholder', 'Введите новые данные');

    profileStatusBtn.addEventListener('click', () => {
      this.editProfileStatus();
    });
  }

  async renderProfileCover(userId: string) {
    const user = await this.model.getUserInfo(userId);
    const profileCoverImg = createHtmlElement('img', 'profile__cover-img', '', this.profileCover);
    const uploadCoverLabel = createHtmlElement('label', 'profile__label-cover', '', this.profileWrapper);
    uploadCoverLabel.setAttribute('for', 'profile__input-cover');
    this.profileCover.append(this.inputCover);
    profileCoverImg.setAttribute('src', `${user.userCover || defaultCover}`);

    createHtmlElement('div', 'profile__header', '', this.profileCover);
  }

  editProfileName() {
    const inputName: HTMLInputElement | null = document.querySelector('.profile__name-input');
    const profileName: HTMLElement | null = document.querySelector('.profile__name');
    if (inputName) inputName.style.display = 'block';
    inputName?.addEventListener('change', () => {
      if (profileName) profileName.textContent = `${inputName?.value}`;
      inputName.style.display = 'none';
      this.emit('changeName', `${inputName?.value}`);
    });
  }

  editProfileStatus() {
    const inputStatus: HTMLInputElement | null = document.querySelector('.profile__status-input');
    const profileStatus: HTMLElement | null = document.querySelector('.profile__status');
    if (inputStatus) inputStatus.style.display = 'block';

    inputStatus?.addEventListener('change', () => {
      if (profileStatus) profileStatus.textContent = `${inputStatus?.value}`;
      inputStatus.style.display = 'none';
      this.emit('changeStatus', `${inputStatus?.value}`);
    });
  }

  renderProfileContainer() {
    const profileMainContainer = createHtmlElement('div', 'profile__main', '', this.profileWrapper);
    const profileNews = createHtmlElement('div', 'profile__news', '', profileMainContainer);
    const profileFriends = createHtmlElement('div', 'profile__friends_wrapper', '', profileMainContainer);
    createHtmlElement('div', 'profile__friends_text', 'Друзья', profileFriends);
    profileFriends.append(this.profileFriends);
    const profileCreateNews = createHtmlElement('div', 'create__news', '', profileNews);
    this.inputCreateNews.setAttribute('placeholder', 'Что у вас нового?');
    this.inputCreatePostImg.id = 'input__news-img';
    this.inputCreatePostImg.type = 'file';
    const labelPostImg = createHtmlElement('label', 'label__news-img', '');
    profileCreateNews.append(this.inputCreateNews, this.inputCreatePostImg, labelPostImg, this.createNewsBtn);

    labelPostImg.setAttribute('for', `${this.inputCreatePostImg.id}`);
    profileNews.append(this.userNewsContainer);
  }

  createNews() {
    this.emit('createNews', this.inputCreateNews.value);
    this.inputCreateNews.value = '';
  }

  async renderNews(userId: string) {
    const userPost = await this.model.getUserNews(userId);
    const createdPostContainer: HTMLElement | null = document.querySelector('.news__container_user');
    if (createdPostContainer) createdPostContainer.innerHTML = '';

    Object.keys(userPost).forEach((postId: string) => {
      const postContainer = createHtmlElement('div', 'post__container_user', '', createdPostContainer as HTMLElement);
      postContainer.id = `${userPost[postId].id}`;
      const postHeader = createHtmlElement('div', 'post__header_user', '', postContainer);
      const postInfo = createHtmlElement('div', 'post__info_user', '', postHeader);
      createHtmlElement('p', 'post__author', `Autor: ${userPost[postId].author}`, postInfo);
      createHtmlElement('p', 'post__date', `Time: ${userPost[postId].time}`, postInfo);

      const deleteBtn = createHtmlElement('button', 'delete__post_user', '', postHeader);

      const postContent = createHtmlElement('div', 'post__content', '', postContainer);
      createHtmlElement('p', 'post__text', `${userPost[postId].text}`, postContent);
      const postImgContainer = createHtmlElement('div', 'post__container_img', '', postContent);
      const postImg = createHtmlElement('img', 'post__img_user', '', postImgContainer) as HTMLImageElement;
      postImg.src = `${userPost[postId].img}`;
      createdPostContainer?.prepend(postContainer);

      const actionPost = createHtmlElement('div', 'post__action_user', '', postContainer);
      const likePostBtn = createHtmlElement('button', 'like__button like__btn_user', '', actionPost);
      createHtmlElement('div', 'like__img', '', likePostBtn);
      createHtmlElement('span', 'like__counter', '', likePostBtn);

      const repostPostBtn = createHtmlElement('button', 'share__button share__btn_user', '', actionPost);
      createHtmlElement('div', 'share__img', '', repostPostBtn);
      createHtmlElement('span', 'share__counter', '', repostPostBtn);

      deleteBtn.addEventListener('click', () => {
        this.emit('deletePost', postContainer.id);
      });
    });
  }

  async renderUserFriends(userId: string) {
    const user = await this.model.getUserInfo(userId);
    if (this.profileFriends) this.profileFriends.innerHTML = '';
    if (user.userSubscripts !== undefined) {
      Object.keys(user.userSubscripts).forEach(async (userId) => {
        const userPage = await this.model.getUserInfo(userId);
        const onlyName = userPage.userName.split(' ').slice(0, 1).join('');

        const userInfoWrapper = createHtmlElement('div', 'profile__friends_content', '', this.profileFriends);
        userInfoWrapper.id = `${userPage.userId}`;
        const userAva = createHtmlElement('img', 'profile__friends_ava', '', userInfoWrapper);
        const userName = createHtmlElement('div', 'profile__friends_name', '', userInfoWrapper);
        userName.textContent = `${onlyName || 'Иван'}`;
        (userAva as HTMLImageElement).src = `${userPage.userAvatar || defaultAva}`;
      });
    }
  }
  renderFriendProfile() {
    this.profileFriends?.addEventListener('click', async (e: Event) => {
      const { target } = e;
      const userId = (target as HTMLElement).parentElement?.id;

      this.profileAvatar.innerHTML = '';
      this.profileCover.innerHTML = '';
      this.profilePerson.innerHTML = '';
      this.userNewsContainer.innerHTML = '';
      this.profileFriends.innerHTML = '';
      await this.renderProfileAvatar(userId as string);
      await this.renderProfileName(userId as string);
      await this.renderProfileCover(userId as string);
      await this.renderNews(userId as string);
      await this.renderUserFriends(userId as string);

      //const profileLabelCover: HTMLElement | null = this.profileWrapper.querySelector('.profile__label-cover');
      const profileAvaBtn: HTMLElement | null = document.querySelector('.profile__label');
      const createNews: HTMLElement | null = document.querySelector('.create__news');
      const deleteNewsBtn: HTMLElement | null = this.userNewsContainer.querySelector('.delete__post_user');
      const changeNameBtn: HTMLElement | null = document.querySelector('.profile__name-btn');
      const changeStatusBtn: HTMLElement | null = document.querySelector('.profile__status-btn');
      if (profileAvaBtn) profileAvaBtn.style.visibility = 'hidden';
      if (createNews) createNews.style.display = 'none';
      if (deleteNewsBtn) deleteNewsBtn.style.display = 'none';
      if (changeNameBtn) changeNameBtn.style.display = 'none';
      if (changeStatusBtn) changeStatusBtn.style.display = 'none';
    });
  }
  // renderEmptyPostBlock(element: HTMLElement) {
  //   const newsContainer = document.querySelector('.profile__news');
  //   if (element && element.childNodes) {
  //     if (element.childNodes.length + 1 > 0) newsContainer?.classList.add('empty-user');
  //     else newsContainer?.classList.remove('empty-user');
  //   }
  //   const emptyBlockWrapper = createHtmlElement('div', 'empty__block_user', '', newsContainer as HTMLElement);
  //   createHtmlElement('p', 'empty__block_text', 'Вы пока не добавили ни одной записи', emptyBlockWrapper);
  // }
}
