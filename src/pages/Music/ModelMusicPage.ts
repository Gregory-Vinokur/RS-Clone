import Model from '../Template/Model';
import { TypeUser } from '../../constans/types';
import { Lang } from '../../constans/constans';

export default class ModelMusicPage extends Model {
  apiUrl: string;
  apiKey: string;
  constructor(lang: Lang, user: TypeUser) {
    super(lang, user);
    this.apiUrl = 'https://api.napster.com';
    this.apiKey = 'YjBiYjc0ZWMtNTIyMy00NWFlLWI4MDItMTY0ODI1NmQ2ZmI2';
  }

  async getTopTracks() {
    try {
      const response = await fetch('https://api.napster.com/v2.2/tracks/top?limit=5', {
        headers: {
          apiKey: this.apiKey,
        },
      });
      const data = await response.json();
      this.emit('getMusic', data.tracks);
      return data.tracks;
    } catch (error) {
      console.error(error);
    }
  }

  async searchTracks(trackName: string) {
    try {
      const response = await fetch(`${this.apiUrl}/v2.2/search?query=${trackName}&per_type_limit=5`, {
        headers: {
          apiKey: this.apiKey,
        },
      });
      const data = await response.json();
      const tracks = data.search.data.tracks;
      this.emit('findSearchTracks', tracks);
      return tracks;
    } catch (error) {
      console.error(error);
    }
  }
}
