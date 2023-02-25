import Page from '../Template/page';
import ModelMusicPage from './ModelMusicPage';
import { createHtmlElement } from '../../utils/createElement';
import formatTime from '../../utils/formatTime';
import FavoriteTrack from '../../interfaces/FavoriteTrack';
import { LANGTEXT } from '../../constans/constans';

type EmitsName = 'searchTrack' | 'addFavoriteTrack' | 'removeFavoriteTrack';
type Track = { [key: string]: string | number };

export default class ViewMusicPage extends Page {
  model: ModelMusicPage;
  mainPlayerWrapper: HTMLElement;
  playBtnMainPlayer: HTMLElement;
  nextBtnMainPlayer: HTMLElement;
  prevBtnMainPlayer: HTMLElement;
  timeMainPlayer: HTMLElement;
  volumeInput: HTMLInputElement;
  advertisingBanner: HTMLElement;
  recommendedMusicBtn: HTMLElement;
  myMusicBtn: HTMLElement;
  searchMusicInput: HTMLInputElement;
  searchMusicBtn: HTMLElement;
  trackListContainer: HTMLElement;
  trackTitleMain: HTMLElement;
  trackAuthorMain: HTMLElement;
  currentTrack: HTMLAudioElement;
  currentMusicIndex: number;
  currentTrackId: string;
  notFoundMusic: HTMLElement;

  emit(event: EmitsName, data?: string | FavoriteTrack) {
    return super.emit(event, data);
  }
  on(event: EmitsName, callback: (data?: string) => void) {
    return super.on(event, callback);
  }

  constructor(id: string, model: ModelMusicPage) {
    super(id);
    this.model = model;
    this.mainWrapper.className = 'music__wrapper';
    this.mainPlayerWrapper = createHtmlElement('div', 'main-player__wrapper', '', this.mainWrapper);
    this.playBtnMainPlayer = createHtmlElement('button', 'main__player-play');
    this.nextBtnMainPlayer = createHtmlElement('button', 'main__player-next');
    this.prevBtnMainPlayer = createHtmlElement('button', 'main__player-prev');
    this.timeMainPlayer = createHtmlElement('div', 'main-player__time');
    this.volumeInput = createHtmlElement('input', 'volume__slider') as HTMLInputElement;
    this.advertisingBanner = createHtmlElement('div', 'advertising__banner');
    this.recommendedMusicBtn = createHtmlElement('div', 'playlist__page-btn  playlist__page-active', LANGTEXT['playlistOfDayBtn'][this.model.lang]);
    this.myMusicBtn = createHtmlElement('div', 'playlist__page-btn', LANGTEXT['myMusicBtn'][this.model.lang]);
    this.searchMusicInput = createHtmlElement('input', 'search__music-input') as HTMLInputElement;
    this.searchMusicBtn = createHtmlElement('button', 'search__music-btn', LANGTEXT['searchMusicBtn'][this.model.lang]);
    this.trackListContainer = createHtmlElement('ul', 'track__list-container');
    this.trackTitleMain = createHtmlElement('div', 'main-player__name', 'Наслаждайтесь музыкой');
    this.trackAuthorMain = createHtmlElement('div', 'main-player__author');
    this.currentTrack = createHtmlElement('audio', 'track__item-current-play') as HTMLAudioElement;
    this.notFoundMusic = createHtmlElement('p', 'music__not-found', LANGTEXT['musicNotFound'][this.model.lang]);
    this.currentMusicIndex = 0;
    this.currentTrackId = '';
    this.mainPlayerWrapper.append(this.currentTrack);
    this.renderMainPlayer();
    this.playMainPlayer();
    this.mainWrapper.append(this.advertisingBanner);
    this.renderMusicList();
    this.renderMusicChart();
    this.changeMusicList(this.model.user?.uid as string);
    this.currentTrack.addEventListener('timeupdate', this.updateProgressContainer);
    this.currentTrack.addEventListener('ended', () => {
      this.resetProgressContainer();
      this.pauseMusicItem();
    });
    this.volumeInput.addEventListener('input', () => {
      this.setVolume(this.currentTrack);
    });
    this.searchMusicBtn.addEventListener('click', () => {
      this.searchTrack();
    });

    this.model.on('findSearchTracks', (tracks: any) => {
      if (tracks.length > 0) {
        this.notFoundMusic.style.display = 'none';
        this.renderMusicItem(tracks);
      } else {
        this.trackListContainer.innerHTML = '';
        this.notFoundMusic.style.display = 'block';
      }
    });
    this.model.on('changeLang', this.changeLang);
  }

  renderMainPlayer() {
    const mainPlayerControls = createHtmlElement('div', 'main-player__controls', '', this.mainPlayerWrapper);
    mainPlayerControls.append(this.playBtnMainPlayer, this.prevBtnMainPlayer, this.nextBtnMainPlayer);

    const mainPlayerTrackInfo = createHtmlElement('div', 'main-player__info', '', this.mainPlayerWrapper);

    const mainPlayerTrack = createHtmlElement('div', 'main-player__about', '', mainPlayerTrackInfo);
    createHtmlElement('div', 'main-player__img', '', mainPlayerTrack);

    const mainPlayerCurrentTrack = createHtmlElement('div', 'main-player__current', '', mainPlayerTrack);
    mainPlayerCurrentTrack.append(this.trackTitleMain, this.trackAuthorMain);
    const progressBar = createHtmlElement('div', 'main-player__progress-bar', '', mainPlayerCurrentTrack);
    createHtmlElement('div', 'main-player__progress-percent', '', progressBar);

    mainPlayerTrackInfo.append(this.timeMainPlayer);
    this.volumeInput.setAttribute('type', 'range');
    this.volumeInput.setAttribute('min', '0');
    this.volumeInput.setAttribute('max', '100');
    this.volumeInput.setAttribute('volume', '50');
    this.mainPlayerWrapper.append(this.volumeInput);
  }

  renderMusicList() {
    const musicList = createHtmlElement('div', 'music__list', '', this.mainWrapper);
    const musicListPages = createHtmlElement('div', 'list__header-buttons', '', musicList);
    musicListPages.append(this.recommendedMusicBtn, this.myMusicBtn);
    const searchMusicWrapper = createHtmlElement('div', 'search__music-wrapper', '', musicList);
    this.searchMusicInput.setAttribute('type', 'text');
    this.searchMusicInput.placeholder = LANGTEXT['searchMusicInput'][this.model.lang];
    searchMusicWrapper.append(this.searchMusicInput, this.searchMusicBtn);

    const trackListWrapper = createHtmlElement('div', 'track__list-wrapper', '', musicList);
    createHtmlElement('h2', 'track__list-title', LANGTEXT['musicContainerTitle'][this.model.lang], trackListWrapper);
    trackListWrapper.append(this.trackListContainer);
    trackListWrapper.append(this.notFoundMusic);
  }

  removePlayIcon() {
    const trackItemsPlayBtn = document.querySelectorAll('.track__item-play');
    trackItemsPlayBtn.forEach((btn) => {
      if (btn.classList.contains('track__item-pause')) {
        btn.classList.remove('track__item-pause');
      }
    });
  }

  addPlayIcon() {
    const trackItem = document.getElementById(this.currentTrackId);
    if (trackItem) {
      const trackItemPlayBtn: HTMLElement | null = trackItem.querySelector('.track__item-play');
      trackItemPlayBtn?.classList.add('track__item-pause');
    }
  }

  playMusicItem() {
    this.mainPlayerWrapper?.classList.add('play');
    this.playBtnMainPlayer.classList.add('main__player-pause');
    this.currentTrack.play();
  }

  playMainPlayer() {
    this.playBtnMainPlayer.addEventListener('click', () => {
      this.removePlayIcon();
      const isPlaying = this.mainPlayerWrapper.classList.contains('play');
      if (isPlaying) {
        this.pauseMusicItem();
      } else {
        this.playMusicItem();
        this.addPlayIcon();
      }
    });
  }

  pauseMusicItem() {
    this.removePlayIcon();
    this.mainPlayerWrapper?.classList.remove('play');
    this.playBtnMainPlayer.classList.remove('main__player-pause');
    this.currentTrack.pause();
  }

  updateProgressContainer(e: Event) {
    const progressPercent: HTMLElement | null = document.querySelector('.main-player__progress-percent');
    const { duration, currentTime } = e.target as HTMLAudioElement;
    const percentProgress = (currentTime / duration) * 100;
    if (progressPercent) progressPercent.style.width = `${percentProgress}%`;
  }

  resetProgressContainer() {
    const progressPercent: HTMLElement | null = document.querySelector('.main-player__progress-percent');
    if (progressPercent) progressPercent.style.width = '0%';
  }

  setVolume(audio: HTMLAudioElement) {
    audio.volume = Number(this.volumeInput.value) / 100;
  }

  playNextTrack(tracks: Track[]) {
    this.nextBtnMainPlayer.addEventListener('click', () => {
      this.removePlayIcon();
      if (this.currentMusicIndex < tracks.length) {
        this.currentMusicIndex += 1;
        const trackId =
          typeof tracks[this.currentMusicIndex].id === 'string'
            ? this.clipTrackId(String(tracks[this.currentMusicIndex].id))
            : tracks[this.currentMusicIndex].id;
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrackId = `${trackId}`;
        this.addPlayIcon();
        setTimeout(() => {
          this.playMusicItem();
        }, 1000);
      } else {
        this.currentMusicIndex = 0;
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrackId = `${tracks[this.currentMusicIndex].id}`;
        this.addPlayIcon();
        setTimeout(() => {
          this.playMusicItem();
        }, 1000);
      }
      this.trackTitleMain.textContent = `${tracks[this.currentMusicIndex].name}`;
      this.trackAuthorMain.textContent = `${tracks[this.currentMusicIndex].artistName}`;
      this.timeMainPlayer.textContent = `${formatTime(tracks[this.currentMusicIndex].playbackSeconds)}`;
    });
  }

  playPrevTrack(tracks: Track[]) {
    this.prevBtnMainPlayer.addEventListener('click', () => {
      this.removePlayIcon();
      if (!(this.currentMusicIndex === 0)) {
        this.currentMusicIndex -= 1;
        const trackId =
          typeof tracks[this.currentMusicIndex].id === 'string'
            ? this.clipTrackId(String(tracks[this.currentMusicIndex].id))
            : tracks[this.currentMusicIndex].id;
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrackId = `${trackId}`;
        this.addPlayIcon();
        setTimeout(() => {
          this.playMusicItem();
        }, 1000);
      } else if (this.currentMusicIndex === 0) {
        this.currentMusicIndex = tracks.length - 1;
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrackId = `${tracks[this.currentMusicIndex].id}`;
        this.addPlayIcon();
        setTimeout(() => {
          this.playMusicItem();
        }, 1000);
      }
      this.trackTitleMain.textContent = `${tracks[this.currentMusicIndex].name}`;
      this.trackAuthorMain.textContent = `${tracks[this.currentMusicIndex].artistName}`;
      this.timeMainPlayer.textContent = `${formatTime(tracks[this.currentMusicIndex].playbackSeconds)}`;
    });
  }

  searchTrack() {
    this.emit('searchTrack', this.searchMusicInput.value);
    this.searchMusicInput.value = '';
  }

  async renderMusicItem(tracks: Track[]) {
    this.trackListContainer.innerHTML = '';
    tracks.forEach((track: Track, indexTrack: number) => {
      const trackItem = createHtmlElement('li', 'track__item');
      const trackId = typeof track.id === 'string' ? this.clipTrackId(track.id) : track.id;
      const trackName = typeof track.name === 'string' ? track.name.substring(0, 39) : track.name;
      trackItem.id = `${trackId}`;
      const trackItemSrc = createHtmlElement('audio', 'track__item-src', '', trackItem) as HTMLAudioElement;
      trackItemSrc.src = `${track.previewURL}`;
      const trackInfo = createHtmlElement('div', 'track__info-container', '', trackItem);
      const trackAva = createHtmlElement('div', 'track__item-ava', '', trackInfo);
      const playBtnTrackItem = createHtmlElement('button', 'track__item-play', '', trackAva);
      const trackTitleContainer = createHtmlElement('div', 'track__title-container', '', trackInfo);
      createHtmlElement('p', 'track__item-title', `${trackName}`, trackTitleContainer);
      createHtmlElement('p', 'track__item-author', `${track.artistName}`, trackTitleContainer);
      const trackControls = createHtmlElement('div', 'track__item-controls', '', trackItem);
      const addFavoriteBtn = createHtmlElement('button', 'track__item-favorite', '', trackControls);
      createHtmlElement('p', 'track__item-duration', `${formatTime(track.playbackSeconds)}`, trackControls);
      this.trackListContainer.append(trackItem);
      this.currentTrackId = `${trackId}`;
      this.trackTitleMain.textContent = `${tracks[0].name}`;
      this.trackAuthorMain.textContent = `${tracks[0].artistName}`;
      this.timeMainPlayer.textContent = `${formatTime(tracks[0].playbackSeconds)}`;
      this.currentTrack.src = `${tracks[0].previewURL}`;
      this.currentMusicIndex = 0;
      playBtnTrackItem.addEventListener('click', () => {
        this.currentTrack.src = `${track.previewURL}`;
        this.currentTrackId = `${trackId}`;
        this.trackTitleMain.textContent = `${track.name}`;
        this.trackAuthorMain.textContent = `${track.artistName}`;
        this.timeMainPlayer.textContent = `${formatTime(track.playbackSeconds)}`;
        this.currentMusicIndex = indexTrack;
        const isPlaying = this.mainPlayerWrapper.classList.contains('play');
        if (isPlaying) {
          playBtnTrackItem.classList.remove('track__item-pause');
          this.pauseMusicItem();
        } else {
          playBtnTrackItem.classList.add('track__item-pause');
          this.playMusicItem();
        }
      });

      addFavoriteBtn.addEventListener('click', () => {
        const favoriteTrack: FavoriteTrack = {
          id: `${trackId}`,
          title: `${track.name}`,
          author: `${track.artistName}`,
          src: trackItemSrc.src,
          duration: Number(track.playbackSeconds),
        };

        if (!addFavoriteBtn.classList.contains('track__item-favorite-active')) {
          addFavoriteBtn.classList.add('track__item-favorite-active');
          this.emit('addFavoriteTrack', favoriteTrack);
        } else if (addFavoriteBtn.classList.contains('track__item-favorite-active')) {
          addFavoriteBtn.classList.remove('track__item-favorite-active');
          this.emit('removeFavoriteTrack', favoriteTrack);
        }
      });
    });
    this.playNextTrack(tracks);
    this.playPrevTrack(tracks);
    await this.highlightFavoriteMusic(this.model.user?.uid as string);
  }

  async renderMusicChart() {
    const tracks = await this.model.getTopTracks();
    await this.renderMusicItem(tracks);
  }

  async highlightFavoriteMusic(userId: string) {
    const userMusic = await this.model.getUserFavoriteMusic(userId);
    const trackItems = document.querySelectorAll('.track__item');
    Object.keys(userMusic).forEach((id) => {
      trackItems.forEach((track) => {
        if (track.id === id) {
          const favoriteBtn: HTMLElement | null = track.querySelector('.track__item-favorite');
          favoriteBtn?.classList.add('track__item-favorite-active');
        }
      });
    });
  }

  changeMusicList(userId: string) {
    this.myMusicBtn.addEventListener('click', async () => {
      this.recommendedMusicBtn.classList.remove('playlist__page-active');
      this.myMusicBtn.classList.add('playlist__page-active');
      this.searchMusicInput.style.display = 'none';
      this.searchMusicBtn.style.display = 'none';
      this.notFoundMusic.style.display = 'none';
      await this.renderFavoriteTracks(userId);
    });

    this.recommendedMusicBtn.addEventListener('click', async () => {
      this.myMusicBtn.classList.remove('playlist__page-active');
      this.recommendedMusicBtn.classList.add('playlist__page-active');
      this.searchMusicInput.style.display = 'block';
      this.searchMusicBtn.style.display = 'block';
      await this.renderMusicChart();
      await this.highlightFavoriteMusic(this.model.user?.uid as string);
    });
  }

  async renderFavoriteTracks(userId: string) {
    const favoriteTrack = await this.model.getUserFavoriteMusic(userId);
    const tracks: Track[] = [];
    Object.keys(favoriteTrack).forEach((track) => {
      tracks.push(favoriteTrack[track]);
    });
    await this.renderMusicItem(tracks);
  }

  clipTrackId(id: string) {
    const index = id.indexOf('tra.');
    if (index !== -1) {
      return id.substring(4);
    }
    return id;
  }

  private changeLang = () => {
    this.recommendedMusicBtn.innerText = LANGTEXT['playlistOfDayBtn'][this.model.lang];
    this.myMusicBtn.innerText = LANGTEXT['myMusicBtn'][this.model.lang];
    this.searchMusicInput.placeholder = LANGTEXT['searchMusicInput'][this.model.lang];
    this.searchMusicBtn.innerText = LANGTEXT['searchMusicBtn'][this.model.lang];
    const trackListTitle: HTMLElement | null = document.querySelector('.track__list-title');
    this.notFoundMusic.innerText = LANGTEXT['musicNotFound'][this.model.lang];
    if (trackListTitle) trackListTitle.innerText = LANGTEXT['musicContainerTitle'][this.model.lang];
  };
}
