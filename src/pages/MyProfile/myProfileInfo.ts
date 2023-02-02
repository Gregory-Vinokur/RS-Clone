import './myProfile.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import 'firebase/compat/storage';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import getUserProfileToLocalStorage from '../../utils/getUserToLocalStorage';
export default class myProfileInfo extends Page {
  constructor(id: string) {
    super(id);
    this.mainWrapper.className = 'profile__info';
    const userProfile = JSON.parse(localStorage.getItem('user-profile') || '{}');

    const profileAvatar = createHtmlElement('div', 'profile__ava', '', this.mainWrapper);
    const profileAvatarImg = createHtmlElement('img', 'profile__ava-img', '', profileAvatar);
    const uploadAvaForm = createHtmlElement('form', 'profile__ava-form', '', profileAvatar);
    const uploadAvaInput = createHtmlElement('input', 'profile__input', '', uploadAvaForm);
    const uploadAvaLabel = createHtmlElement('label', 'profile__label', 'Изменить аватар', uploadAvaForm);
    uploadAvaInput.setAttribute('type', 'file');
    uploadAvaInput.id = 'profile__input';
    uploadAvaInput.setAttribute('accept', 'image/png, image/jpeg');
    uploadAvaLabel.setAttribute('for', 'profile__input');
    uploadAvaInput.addEventListener('change', this.uploadAvatarProfile);
    profileAvatarImg.setAttribute('src', `${userProfile.avaImgUrl || ''}`);

    const profilePerson = createHtmlElement('div', 'profile__preson', '', this.mainWrapper);
    const profileNameWrapper = createHtmlElement('div', 'profile__name-wrapper', '', profilePerson);
    createHtmlElement('div', 'profile__name', `${userProfile.name || 'Кот Петр'}`, profileNameWrapper);
    const profileNameBtn = createHtmlElement('button', 'profile__name-btn', '', profileNameWrapper);
    const profileNameInput = createHtmlElement('input', 'profile__name-input', '', profilePerson);
    profileNameInput.setAttribute('type', 'text');
    profileNameInput.setAttribute('placeholder', 'Введите новые данные');

    const profileStatusWrapper = createHtmlElement('div', 'profile__status-wrapper', '', profilePerson);
    createHtmlElement('div', 'profile__status', `${userProfile.status || 'Хочу кушать'}`, profileStatusWrapper);
    const profileStatusBtn = createHtmlElement('button', 'profile__status-btn', '', profileStatusWrapper);
    const profileStatusInput = createHtmlElement('input', 'profile__status-input', '', profilePerson);
    profileStatusInput.setAttribute('type', 'text');
    profileStatusInput.setAttribute('placeholder', 'Введите новые данные');

    profileNameBtn.addEventListener('click', this.editProfileName);
    profileStatusBtn.addEventListener('click', this.editProfileStatus);
  }
  render(): HTMLElement {
    return this.mainWrapper;
  }

  uploadAvatarProfile(e: Event) {
    e.preventDefault();
    const metadata = {
      contentType: 'image/jpeg',
    };
    const { target } = e;
    const fileItem = (target as HTMLInputElement).files![0];
    const fileName = fileItem.name;

    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileItem, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log('Oops, Error', error.code);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (downloadURL !== '') {
            const avatarImgHTML = document.querySelector('.profile__ava-img');
            getUserProfileToLocalStorage('avaImgUrl', `${downloadURL}`);
            const userProfile = JSON.parse(localStorage.getItem('user-profile') || '{}');
            avatarImgHTML?.setAttribute('src', `${userProfile.avaImgUrl}`);
          }
        });
      }
    );
  }

  editProfileName() {
    const inputName: HTMLInputElement | null = document.querySelector('.profile__name-input');
    const profileName: HTMLElement | null = document.querySelector('.profile__name');
    if (inputName) inputName.style.display = 'block';
    inputName?.addEventListener('change', () => {
      if (profileName) profileName.textContent = `${inputName?.value}`;
      inputName.style.display = 'none';
      getUserProfileToLocalStorage('name', `${inputName?.value}`);
    });
  }

  editProfileStatus() {
    const inputStatus: HTMLInputElement | null = document.querySelector('.profile__status-input');
    const profileStatus: HTMLElement | null = document.querySelector('.profile__status');
    if (inputStatus) inputStatus.style.display = 'block';

    inputStatus?.addEventListener('change', () => {
      if (profileStatus) profileStatus.textContent = `${inputStatus?.value}`;
      inputStatus.style.display = 'none';
      getUserProfileToLocalStorage('status', `${inputStatus?.value}`);
    });
  }
}
