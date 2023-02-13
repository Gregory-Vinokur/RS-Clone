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
      const response = await fetch('https://api.napster.com/v2.2/search?query=mockingb', {
        headers: {
          apiKey: this.apiKey,
        },
      });

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
}
