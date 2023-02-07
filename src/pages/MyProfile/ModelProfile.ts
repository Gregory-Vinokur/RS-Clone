import { User } from 'firebase/auth';
import Model from '../Template/Model';
import 'firebase/compat/storage';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import getUserProfileToLocalStorage from '../../utils/getUserToLocalStorage';
import { getDatabase, ref as refDB, update, get, child, push, remove } from 'firebase/database';
import { getAuth, updateProfile } from 'firebase/auth';
import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import { database } from '../../server/firebaseAuth';

//TODO: исправить загрузку фото без перезагрузки страницы
type UserProfile = {
  avaImgUrl: string | null;
  name: string | null;
  status: string | null;
  avaCoverUrl: string | null;
};

export default class ModelProfile extends Model {
  userProfile: UserProfile;
  userPosts: { [key: string]: any };
  postImgUrl: string;
  constructor(lang: Lang, user: TypeUser) {
    super(lang, user);
    this.userProfile = JSON.parse(localStorage.getItem('user-profile') || '{}');
    this.userPosts = {};
    this.postImgUrl = '';
  }

  db = getDatabase();

  getAvatarImgUrl() {
    return this.userProfile.avaImgUrl || '';
  }

  getCoverImgUrl() {
    return this.userProfile.avaCoverUrl || '';
  }

  getUserName() {
    // const dbRef = refDB(this.db);
    // await get(child(dbRef, `users/01RXeSH493bwfR3JMtmwMDvgjb63`))
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       const { userName } = snapshot.val();
    //       return userName;
    //     } else {
    //       console.log('No data available');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    return this.userProfile.name || 'Кот Петр';
  }

  setUserName(name: string) {
    update(refDB(this.db, 'users/' + this.user?.uid), {
      // Обновление имени юзера по ID в БД
      userName: name,
    });
    getUserProfileToLocalStorage('name', name);
    const auth = getAuth();
    updateProfile(auth.currentUser as User, {
      displayName: name,
      photoURL: this.userProfile.avaImgUrl,
    })
      .then(() => {
        console.log('Profile updated!');
      })
      .catch((error) => {
        console.log('Oops Error, ', error);
      });
  }

  getUserStatus() {
    return this.userProfile.status || 'Хочу кушать';
  }

  setUserStatus(status: string) {
    getUserProfileToLocalStorage('status', status);
    update(refDB(this.db, 'users/' + this.user?.uid), {
      userStatus: status,
    });
  }

  uploadUserAvatar(e: Event) {
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
        console.log('Чтобы обновить фото Вы должны быть авторизованы');
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (downloadURL !== '') {
            if ((target as HTMLInputElement).id === 'profile__input') {
              getUserProfileToLocalStorage('avaImgUrl', `${downloadURL}`);
              update(refDB(this.db, 'users/' + this.user?.uid), {
                userAvatar: downloadURL,
              });
              const auth = getAuth();
              updateProfile(auth.currentUser as User, {
                photoURL: downloadURL,
              });
            }
            if ((target as HTMLInputElement).id === 'profile__input-cover') {
              getUserProfileToLocalStorage('avaCoverUrl', `${downloadURL}`);
              update(refDB(this.db, 'users/' + this.user?.uid), {
                userCover: downloadURL,
              });
            }
            //window.location.reload();
          }
        });
      }
    );
  }

  createNews(newsText: string) {
    const optionsTime: { [key: string]: string } = { hour: 'numeric', minute: 'numeric' };
    const timeDate = new Date().toLocaleTimeString([], optionsTime);
    const dayDate = new Date().toLocaleDateString();
    const db = getDatabase();
    const newPostKey = push(child(refDB(db), 'posts')).key;
    const updates: { [key: string]: object } = {};

    const postData = {
      id: newPostKey,
      author: this.getUserName(),
      text: newsText,
      time: `${timeDate} / ${dayDate}`,
      img: this.postImgUrl,
    };
    updates['/users/' + this.user?.uid + '/userPost/' + newPostKey] = postData;

    update(refDB(db), updates);
    this.emit('updateData');
    this.postImgUrl = '';
  }

  async getUserNews() {
    const dbRef = refDB(getDatabase());
    await get(child(dbRef, `users/${this.user?.uid}/userPost`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userNews = snapshot.val();
          this.userPosts = userNews;
        } else {
          this.userPosts = {};
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return this.userPosts;
  }

  deleteUserPost(id: string) {
    const databaseRef = database.ref(`users/${this.user?.uid}/userPost/${id}`);
    databaseRef.remove();
    this.emit('updateData');
  }

  async createPostImg(img: File) {
    const metadata = {
      contentType: 'image/jpeg',
    };
    const fileItem = img;
    const fileName = fileItem?.name;

    const storage = getStorage();
    const storageRef = ref(storage, `images/${this.user?.uid}/posts/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, fileItem, metadata);

    // Listen for state changes, errors, and completion of the upload.
    await uploadTask.on(
      'state_changed',
      (snapshot) => {
        this.emit('loadPostImg');
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log('Oops, Error', error.code);
        console.log('Чтобы обновить фото Вы должны быть авторизованы');
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (downloadURL !== '') {
            this.postImgUrl = downloadURL;
            this.emit('postImgLoaded');
          }
        });
      }
    );
  }
}
