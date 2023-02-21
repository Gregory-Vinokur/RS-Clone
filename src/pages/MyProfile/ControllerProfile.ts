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
      this.model.setUserStatus((status as string) || '');
    });

    this.view.on('createNews', (newsText) => {
      this.model.createNews(newsText as string);
    });

    this.view.on('deletePost', (id) => {
      this.model.deleteUserPost(id as string);
    });

    this.view.on('uploadPostImg', (img) => {
      this.model.createPostImg(img as File);
    });
    this.view.on('unsubscriptionUser', (userId) => {
      this.model.unsubscriptionUser(userId as string);
    });
    this.view.on('subscriptionUser', (userId) => {
      this.model.subscriptionUser(userId as string);
    });

    this.view.on('changePostsCounter', (postId) => {
      if (typeof postId === 'string') this.model.setPostRepostCount(postId);
    });

    this.view.on('likePost', (params) => {
      if (typeof params === 'object') this.model.setPostLikes(params as { [key: string]: string });
    });
  }
}
