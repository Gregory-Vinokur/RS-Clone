import './messages.css';
import ModelMessages from './Model-messages';
import ViewerMessasges from './Viewer-messages';
import ControllerMessages from './Controller-messages';
import { Lang } from '../../constans/constans';

export default class Messages {
  model: ModelMessages;
  viewer: ViewerMessasges;
  controller: ControllerMessages;
  constructor(id: string, lang: Lang) {
    this.model = new ModelMessages(lang);
    this.viewer = new ViewerMessasges(id, this.model);
    this.controller = new ControllerMessages(this.model, this.viewer);
  }

  changeLang = (lang: Lang) => {
    this.model.changeLang(lang);
  };

  render = () => {
    return this.viewer.render();
  };
}
