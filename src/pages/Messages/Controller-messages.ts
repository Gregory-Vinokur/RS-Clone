import ModelMessages from './Model-messages';
import ViewerMessasges from './Viewer-messages';
import { Sort } from '../../constans/types';

export default class ControllerMessages {
  model: ModelMessages;
  viewer: ViewerMessasges;
  constructor(model: ModelMessages, viewer: ViewerMessasges) {
    this.model = model;
    this.viewer = viewer;
    this.viewer.on('send', (message) => this.sendMessage(message));
    this.viewer.on('setLimit', (limit) => this.setLimit(limit));
    this.viewer.on('setSort', (sort) => this.setSort(sort as Sort));
    this.viewer.on('deleteMessage', (id: string) => this.deleteMessage(id));
    this.viewer.on('subscripte', (uid: string) => this.model.subscripteUser(uid));
    this.viewer.on('writeUser', (uid: string) => this.model.showUser(uid));
    this.model.getMessage();
  }

  sendMessage = (message = '') => {
    if (message) {
      this.model.sendMessage(message);
    }
  };

  deleteMessage = (id: string) => {
    this.model.deleteMessage(id);
  };

  setLimit = (limit = '') => {
    this.model.setLimit(limit);
  };

  setSort = (sort: Sort) => {
    this.model.setSort(sort);
  };
}
