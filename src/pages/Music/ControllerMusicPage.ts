import ViewMusicPage from './ViewMusicPage';
import ModelMusicPage from './ModelMusicPage';

export default class ControllerMusicPage {
  model: ModelMusicPage;
  view: ViewMusicPage;
  constructor(model: ModelMusicPage, viewer: ViewMusicPage) {
    this.model = model;
    this.view = viewer;

    this.view.on('searchTrack', (trackName) => {
      if (typeof trackName === 'string') this.model.searchTracks(trackName);
    });
  }
}
