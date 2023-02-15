import ModelMessages from './Model-messages';
import ViewerMessasges from './Viewer-messages';
import { Sort } from '../../constans/types';

export default class ControllerMessages {
  model: ModelMessages;
  viewer: ViewerMessasges;
  constructor(model: ModelMessages, viewer: ViewerMessasges) {
    this.model = model;
    this.viewer = viewer;
    this.viewer.on('send', (message: string) => this.sendMessage(message));
    this.viewer.on('setLimit', (limit: string) => this.setLimit(limit));
    this.viewer.on('setSort', (sort: string) => this.setSort(sort as Sort));
    this.viewer.on('deleteMessage', (id: string) => this.deleteMessage(id));
    this.viewer.on('deleteDialogMessage', (id: string) => this.model.deleteDialogMessage(id));
    this.viewer.on('subscripte', (uid: string) => this.model.subscripteUser(uid));
    this.viewer.on('unsubscripte', (uid: string) => this.model.unSubscripteUser(uid));
    this.viewer.on('writeUser', (uid: string) => this.model.writeUser(uid));
    this.viewer.on('createGroup', (name: string) => this.model.createNewGroup(name));
    this.viewer.on('toChat', () => {
      this.model.isChat = true;
      this.model.isRooms = false;
      this.model.isGroupRooms = false;
    });
    this.viewer.on('toRooms', () => {
      this.model.isChat = false;
      this.model.isRooms = true;
      this.model.isGroupRooms = false;
    });
    this.viewer.on('toGroupRooms', () => {
      this.model.isChat = false;
      this.model.isRooms = false;
      this.model.isGroupRooms = true;
    });
    this.model.getMessage();
    this.viewer.on('checkDialog', (index: number) => this.model.checkDialog(index));
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
