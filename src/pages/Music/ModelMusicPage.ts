import Model from '../Template/Model';
import { TypeUser } from '../../constans/types';
import { Lang } from '../../constans/constans';
import FavoriteTrack from '../../interfaces/FavoriteTrack';
import { getDatabase, ref, update, get, child } from 'firebase/database';
import { database } from '../../server/firebaseAuth';
type Track = { [key: string]: string | number };
export default class ModelMusicPage extends Model {
  apiUrl: string;
  apiKey: string;
  userMusic: { [key: string]: Track };
  constructor(lang: Lang, user: TypeUser) {
    super(lang, user);
    this.apiUrl = 'https://api.napster.com';
    this.apiKey = 'YjBiYjc0ZWMtNTIyMy00NWFlLWI4MDItMTY0ODI1NmQ2ZmI2';
    this.userMusic = {};
  }

  async getTopTracks() {
    try {
      const response = await fetch('https://api.napster.com/v2.2/tracks/top?limit=30', {
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
      const response = await fetch(`${this.apiUrl}/v2.2/search?query=${trackName}&per_type_limit=20`, {
        headers: {
          apiKey: this.apiKey,
        },
      });
      const data = await response.json();
      const tracks = data.search.data.tracks;
      console.log(tracks);
      this.emit('findSearchTracks', tracks);
      return tracks;
    } catch (error) {
      console.error(error);
    }
  }

  setFavoriteTrack(favoriteTrack: FavoriteTrack) {
    const db = getDatabase();

    const updates: { [key: string]: object } = {};
    const postData = {
      id: favoriteTrack.id,
      artistName: favoriteTrack.author,
      name: favoriteTrack.title,
      previewURL: favoriteTrack.src,
      playbackSeconds: favoriteTrack.duration,
    };

    updates['/users/' + this.user?.uid + '/userMusic/' + `${favoriteTrack.id}`] = postData;
    update(ref(db), updates);
  }

  removeFavoriteTrack(favoriteTrack: FavoriteTrack) {
    const databaseRef = database.ref(`users/${this.user?.uid}/userMusic/${favoriteTrack.id}`);
    databaseRef.remove();
    this.emit('deleteFavoriteTrack');
  }

  async getUserFavoriteMusic(userId: string) {
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `users/${userId}/userMusic`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userMusic = snapshot.val();
          this.userMusic = userMusic;
          this.emit('getFavoriteMusic', userMusic);
        } else {
          this.userMusic = {};
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return this.userMusic;
  }
}
