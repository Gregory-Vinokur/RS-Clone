import "./messages.css";
import ModelMessages from "./Model-messages";
import ViewerMessasges from "./Viewer-messages";
import ControllerMessages from "./Controller-messages";

export default class Messages {
  model: ModelMessages;
  viewer: ViewerMessasges;
  controller: ControllerMessages;
  constructor(id: string) {
    this.model = new ModelMessages();
    this.viewer = new ViewerMessasges(id, this.model);
    this.controller = new ControllerMessages(this.model, this.viewer);
  }

  render = () => {
    return this.viewer.render();
  }
}