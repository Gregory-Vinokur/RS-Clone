import ModelProfule from './ModelProfile';
import ViewProfile from './ViewProfile';

export default class ControllerProfule {
  model: ModelProfule;
  view: ViewProfile;
  constructor(model: ModelProfule, view: ViewProfile) {
    this.model = model;
    this.view = view;

    this.view.on('changeName', (name) => {
      if (typeof name === 'string') {
        this.model.setUserName(name || '');
      }
    });

    this.view.on('changeStatus', (status) => {
      if (typeof status === 'string') this.model.setUserStatus(status);
    });

    this.view.on('createNews', (newsText) => {
      if (typeof newsText === 'string') this.model.createNews(newsText);
    });

    this.view.on('deletePost', (id) => {
      if (typeof id === 'string') this.model.deleteUserPost(id);
    });

    this.view.on('uploadPostImg', (img) => {
      this.model.createPostImg(img as File);
    });
    this.view.on('unsubscriptionUser', (userId) => {
      if (typeof userId === 'string') this.model.unsubscriptionUser(userId);
    });
    this.view.on('subscriptionUser', (userId) => {
      if (typeof userId === 'string') this.model.subscriptionUser(userId);
    });

    this.view.on('changePostsCounter', (params) => {
      if (typeof params === 'object') this.model.setPostRepostCount(params as { [key: string]: string });
    });

    this.view.on('likePost', (params) => {
      if (typeof params === 'object') this.model.setPostLikes(params as { [key: string]: string });
    });

    this.view.on('shareNews', (params) => {
      if (typeof params === 'object') this.model.getUserPost(params as { [key: string]: string });
    });
  }
}
