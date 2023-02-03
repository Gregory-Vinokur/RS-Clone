import ModelMessages from './Model-messages';
import ViewerMessasges from './Viewer-messages';

export default class ControllerMessages {
  model: ModelMessages;
  viewer: ViewerMessasges;
  constructor(model: ModelMessages, viewer: ViewerMessasges) {
    this.model = model;
    this.viewer = viewer;
    this.viewer.on('send', (message) => this.sendMessage(message));
    this.viewer.on('setLimit', (limit) => this.setLimit(limit));
    this.model.getMessage();
  }

  sendMessage = (message = '') => {
    if (message) {
      this.model.sendMessage(message);
    }
  };

  setLimit = (limit = '') => {
    this.model.setLimit(limit);
  };
}
