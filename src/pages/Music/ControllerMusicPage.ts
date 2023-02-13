import ViewMusicPage from './ViewMusicPage';
import ModelMusicPage from './ModelMusicPage';

export default class ControllerMusicPage {
  model: ModelMusicPage;
  viewer: ViewMusicPage;
  constructor(model: ModelMusicPage, viewer: ViewMusicPage) {
    this.model = model;
    this.viewer = viewer;
  }
}
