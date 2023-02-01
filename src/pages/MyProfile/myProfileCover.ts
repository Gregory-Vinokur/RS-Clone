import './myProfile.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import 'firebase/compat/storage';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import getUserProfileToLocalStorage from '../../utils/getUserToLocalStorage';

export default class myProfileCover extends Page {
  profileCoverWrapper: HTMLElement;
  constructor(id: string) {
    super(id);
    this.profileCoverWrapper = createHtmlElement('div', 'profile__cover', '', this.mainWrapper);
    const userProfile = JSON.parse(localStorage.getItem('user-profile') || '{}');

    const profileCoverImg = createHtmlElement('img', 'profile__cover-img', '', this.profileCoverWrapper);
    const uploadCoverInput = createHtmlElement('input', 'profile__input-cover', '', this.profileCoverWrapper);
    uploadCoverInput.setAttribute('type', 'file');
    uploadCoverInput.id = 'profile__input-cover';
    uploadCoverInput.setAttribute('accept', 'image/png, image/jpeg');

    uploadCoverInput.addEventListener('change', this.uploadProfileCover);
    profileCoverImg.setAttribute('src', `${userProfile.avaCoverUrl || ''} `);

    createHtmlElement('div', 'profile__header', '', this.profileCoverWrapper);
  }
  render(): HTMLElement {
    return this.profileCoverWrapper;
  }

  uploadProfileCover(e: Event) {
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
            const coverImgHTML = document.querySelector('.profile__cover-img');
            getUserProfileToLocalStorage('avaCoverUrl', `${downloadURL}`);

            const userProfile = JSON.parse(localStorage.getItem('user-profile') || '{}');
            coverImgHTML?.setAttribute('src', `${userProfile.avaCoverUrl}`);
          }
        });
      }
    );
  }
}
