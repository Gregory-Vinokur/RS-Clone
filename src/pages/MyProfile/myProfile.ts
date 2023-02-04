import './myProfile.css';
import Page from '../Template/page';

import ViewProfile from './ViewProfile';
import ModelProfule from './ModelProfile';
import CotrollerProfile from './ControllerProfile';
import { Lang } from '../../constans/constans';
export default class myProfile extends Page {
  model: ModelProfule;
  viewer: ViewProfile;
  controller: CotrollerProfile;

  constructor(id: string, lang: Lang) {
    super(id);

    this.model = new ModelProfule(lang);
    this.viewer = new ViewProfile(id, this.model);
    this.controller = new CotrollerProfile(this.model, this.viewer);
  }

  changeLang = (lang: Lang) => {
    this.model.changeLang(lang);
  };

  render(): HTMLElement {
    return this.viewer.render();
  }
}
