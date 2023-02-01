import './myProfile.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { firebaseConfig } from '../../server/firebase.config';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
export default class myProfile extends Page {
  fileItem: Blob | Uint8Array | ArrayBuffer;
  fileName: string;
  constructor(id: string) {
    super(id);
    this.fileName = '';
    this.fileItem = new Blob();

    this.mainWrapper.className = 'my__page';
    const profileWrapper = createHtmlElement('div', 'profile__wrapper', '', this.mainWrapper);
    createHtmlElement('div', 'profile__cover', '', profileWrapper);
    const profileInfo = createHtmlElement('div', 'profile__info', '', profileWrapper);

    const profileAvatar = createHtmlElement('div', 'profile__ava', '', profileInfo);
    createHtmlElement('img', 'profile__ava-img', '', profileAvatar);
    const uploadAvaForm = createHtmlElement('form', 'profile__ava-form', '', profileAvatar);
    const uploadAvaInput = createHtmlElement('input', 'profile__input', '', uploadAvaForm);
    const uploadAvaLabel = createHtmlElement('label', 'profile__label', '+', uploadAvaForm);
    const uploadAvaBtn = createHtmlElement('button', 'profile__ava-btn', 'Добавить аватар', uploadAvaForm);
    uploadAvaInput.setAttribute('type', 'file');
    uploadAvaInput.id = 'profile__input';
    uploadAvaInput.setAttribute('accept', 'image/png, image/jpeg');
    uploadAvaLabel.setAttribute('for', 'profile__input');
    uploadAvaBtn.setAttribute('type', 'submit');

    const profilePerson = createHtmlElement('div', 'profile__preson', '', profileInfo);
    createHtmlElement('div', 'profile__name', 'Artem Kamyshenkov', profilePerson);
    createHtmlElement('div', 'profile__status', 'Pending...', profilePerson);

    uploadAvaInput.addEventListener('change', this.getFile);
    uploadAvaBtn.addEventListener('click', this.uploadAvatar);
  }

  name = '1';
  render(): HTMLElement {
    return this.mainWrapper;
  }

  getFile(e: Event) {
    e.preventDefault();
    const { target } = e;
    this.fileItem = (target as HTMLInputElement).files![0];
    this.fileName = this.fileItem.name;
  }

  uploadAvatar(e: Event) {
    e.preventDefault();
    const metadata = {
      contentType: 'image/jpeg',
    };

    const storage = getStorage();
    const storageRef = ref(storage, 'images/rivers.jpg');
    const uploadTask = uploadBytesResumable(storageRef, this.fileItem, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
    // firebase.initializeApp(firebaseConfig);
    // const storageRef = firebase.storage().ref('images/cv.jpg');
    // const uploadTask = storageRef.put(this.fileItem);
    // console.log(this.fileName);
    // uploadTask.on(
    //   'state__changed',
    //   (snapshot) => {
    //     console.log(snapshot);
    //   },
    //   (err) => {
    //     console.log(err);
    //   },
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       console.log('File available at', downloadURL);
    //     });
    //   }
    // );
    console.log(this.fileName);
  }
}
