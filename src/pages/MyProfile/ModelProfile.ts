import { User } from 'firebase/auth';
import Model from '../Template/Model';
import 'firebase/compat/storage';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as refDB, update, get, child, push } from 'firebase/database';
import { updateProfile } from 'firebase/auth';
import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import { database } from '../../server/firebaseAuth';

export default class ModelProfile extends Model {
  userPosts: { [key: string]: any };
  postImgUrl: string;
  userPage: { [key: string]: string };
  userFriends: { [key: string]: any };
  allUsers: { [key: string]: object };
  constructor(lang: Lang, user: TypeUser) {
    super(lang, user);
    this.userPosts = {};
    this.postImgUrl = '';
    this.userPage = {};
    this.userFriends = {};
    this.allUsers = {};
  }

  db = getDatabase();

  setUserId(id: string) {
    update(refDB(this.db, 'users/' + this.user?.uid), {
      userId: id,
    });
  }
  setUserName(name: string) {
    update(refDB(this.db, 'users/' + this.user?.uid), {
      userName: name,
    });
    updateProfile(this.user as User, {
      displayName: name,
    });
  }

  setUserStatus(status: string) {
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
    const storageRef = ref(storage, `images/${this.user?.uid}/avatar/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, fileItem, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.emit('loadPercentFoto', progress);
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
              this.userPage.userAva = downloadURL;
              update(refDB(this.db, 'users/' + this.user?.uid), {
                userAvatar: downloadURL,
              });
              updateProfile(this.user as User, {
                photoURL: downloadURL,
              });
              this.emit('uploadAvatar');
            }
            if ((target as HTMLInputElement).id === 'profile__input-cover') {
              update(refDB(this.db, 'users/' + this.user?.uid), {
                userCover: downloadURL,
              });
              this.userPage.userCover = downloadURL;
              this.emit('uploadCover');
            }
          }
        });
      }
    );
  }

  createNews(newsText: string) {
    const db = getDatabase();
    const newPostKey = push(child(refDB(db), 'posts')).key;
    const updatesUserPost: { [key: string]: object } = {};
    const updatesPosts: { [key: string]: object } = {};
    const postData = {
      id: newPostKey,
      author: this.user?.displayName,
      text: newsText,
      date: Date.now(),
      image: this.postImgUrl,
      likes: 0,
      liked: {},
      logo: this.user?.photoURL,
    };
    updatesUserPost['/users/' + this.user?.uid + '/userPost/' + newPostKey] = postData;
    updatesPosts[`posts/${newPostKey}`] = postData;

    update(refDB(db), updatesPosts);
    update(refDB(db), updatesUserPost);
    this.emit('updateData');
    this.postImgUrl = '';
  }

  async getUserNews(userId: string) {
    const dbRef = refDB(getDatabase());
    await get(child(dbRef, `users/${userId}/userPost`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userNews = snapshot.val();
          this.userPosts = userNews;
          this.emit('notEmptyUserNews');
        } else {
          this.emit('emptyUserNews');
          this.userPosts = {};
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return this.userPosts;
  }

  async deleteUserPost(id: string) {
    const databaseRef = database.ref(`users/${this.user?.uid}/userPost/${id}`);
    const databaseRefPosts = database.ref(`posts/${id}`);
    databaseRef.remove();
    databaseRefPosts.remove();
    this.emit('updateData');
  }

  async setPostRepostCount(id: string) {
    const dbRef = refDB(getDatabase());
    await get(child(dbRef, `posts/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const posts = snapshot.val();
          const shares = posts.shares;
          const reposted = posts.reposted;
          delete reposted[this.user?.uid as string];
          update(refDB(this.db, `posts/${id}`), {
            shares: shares - 1,
            reposted: reposted,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async setPostLikes(params: { [key: string]: string }) {
    const dbRef = refDB(getDatabase());
    await get(child(dbRef, `users/${params.userId}/userPost/${params.postId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const post = snapshot.val();
          let likes = post.likes;
          likes = params.likeCounter;
          const liked = post.liked || {};
          console.log(params.liked);
          if (params.liked === 'true') {
            liked[this.user?.uid as string] = true;
          }
          if (params.liked === 'false') {
            delete liked[this.user?.uid as string];
          }
          update(refDB(this.db, `users/${params.userId}/userPost/${params.postId}`), {
            likes: likes,
            liked: liked,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
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

  async getUserInfo(userId: string) {
    const dbRef = refDB(this.db);
    await get(child(dbRef, `users/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const { userName, userStatus, userAvatar, userCover, subscripts, userId } = snapshot.val();
          this.userPage = {
            userName: userName,
            userStatus: userStatus || 'Обновите ваш статус :)',
            userAvatar: userAvatar,
            userCover: userCover,
            userSubscripts: subscripts,
            userId: userId,
          };
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return this.userPage;
  }

  unsubscriptionUser(userId: string) {
    const databaseRef = database.ref(`users/${this.user?.uid}/subscripts/${userId}`);
    databaseRef.remove();
  }

  subscriptionUser(userId: string) {
    update(refDB(this.db, `users/${this.user?.uid}/subscripts`), {
      [userId]: true,
    });
  }

  async getAllUsers() {
    const dbRef = refDB(this.db);
    await get(child(dbRef, `users/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          this.allUsers = users;
          return this.allUsers;
        } else {
          this.allUsers = {};
          console.log('No users');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return this.allUsers;
  }
}
