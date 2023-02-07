import ModelProfule from './ModelProfile';
import ViewProfile from './ViewProfile';

export default class ControllerProfule {
  model: ModelProfule;
  view: ViewProfile;
  constructor(model: ModelProfule, view: ViewProfile) {
    this.model = model;
    this.view = view;

    this.view.on('changeName', (name) => {
      // this.model.setUserName(name !== undefined ? name : '');
      this.model.setUserName((name as string) || '');
    });

    this.view.on('changeStatus', (status) => {
      //this.model.setUserStatus(status !== undefined ? status : '');
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
  }
}
