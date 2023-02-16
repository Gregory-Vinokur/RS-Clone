import ViewMusicPage from './ViewMusicPage';
import ModelMusicPage from './ModelMusicPage';
import FavoriteTrack from '../../interfaces/FavoriteTrack';
export default class ControllerMusicPage {
  model: ModelMusicPage;
  view: ViewMusicPage;
  constructor(model: ModelMusicPage, viewer: ViewMusicPage) {
    this.model = model;
    this.view = viewer;

    this.view.on('searchTrack', (trackName) => {
      if (typeof trackName === 'string') this.model.searchTracks(trackName);
    });
    this.view.on('addFavoriteTrack', (favoriteTrack) => {
      if (typeof favoriteTrack === 'object') this.model.setFavoriteTrack(favoriteTrack);
    });
    this.view.on('removeFavoriteTrack', (favoriteTrack) => {
      if (typeof favoriteTrack === 'object') this.model.removeFavoriteTrack(favoriteTrack);
    });
  }
}
