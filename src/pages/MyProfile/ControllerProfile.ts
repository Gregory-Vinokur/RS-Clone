import ModelProfule from './ModelProfile';
import ViewProfile from './ViewProfile';

export default class ControllerProfule {
  model: ModelProfule;
  view: ViewProfile;
  constructor(model: ModelProfule, view: ViewProfile) {
    this.model = model;
    this.view = view;
    this.view.on('uploadAvatar', () => {
      this.uploadProfileAvatar();
    });
    this.view.on('changeName', (name) => {
      this.model.setUserName(name !== undefined ? name : '');
    });

    this.view.on('changeStatus', (status) => {
      this.model.setUserStatus(status !== undefined ? status : '');
    });

    this.view.on('createNews', (newsText) => {
      this.model.createNews(newsText as string);
    });

    this.view.on('deletePost', (id) => {
      this.model.deleteUserPost(id as string);
    });
  }

  uploadProfileAvatar = () => {
    this.model.getAvatarImgUrl();
  };
}
