import './musicPage.css';
import ModelMusicPage from './ModelMusicPage';
import ViewMusicPage from './ViewMusicPage';
import ControllerMusicPage from './ControllerMusicPage';
import { TypeUser } from '../../constans/types';
import { Lang } from '../../constans/constans';

export default class MusicPage {
  model: ModelMusicPage;
  view: ViewMusicPage;
  controller: ControllerMusicPage;
  constructor(id: string, lang: Lang, user: TypeUser) {
    this.model = new ModelMusicPage(lang, user);
    this.view = new ViewMusicPage(id, this.model);
    this.controller = new ControllerMusicPage(this.model, this.view);
  }

  changeLang = (lang: Lang) => {
    this.model.changeLang(lang);
  };

  render = () => {
    return this.view.render();
  };
}
