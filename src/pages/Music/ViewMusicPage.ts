import Page from '../Template/page';
import ModelMusicPage from './ModelMusicPage';
import { createHtmlElement } from '../../utils/createElement';
import formatTime from '../../utils/formatTime';

type EmitsName = 'searchTrack';
type Track = { [key: string]: string | number };
export default class ViewerMessasges extends Page {
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

  emit(event: EmitsName, data?: string) {
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
    this.recommendedMusicBtn = createHtmlElement('div', 'recommended__page music__page-active', 'Плейлист дня');
    this.myMusicBtn = createHtmlElement('div', 'my__music-page', 'Моя музыка');
    this.searchMusicInput = createHtmlElement('input', 'search__music-input') as HTMLInputElement;
    this.searchMusicBtn = createHtmlElement('button', 'search__music-btn', 'Найти');
    this.trackListContainer = createHtmlElement('ul', 'track__list-container');
    this.trackTitleMain = createHtmlElement('div', 'main-player__name', 'Наслаждайтесь музыкой');
    this.trackAuthorMain = createHtmlElement('div', 'main-player__author');
    this.currentTrack = createHtmlElement('audio', 'track__item-current-play') as HTMLAudioElement;
    this.currentMusicIndex = 0;
    this.currentTrackId = '';
    this.mainPlayerWrapper.append(this.currentTrack);
    this.renderMainPlayer();
    this.mainWrapper.append(this.advertisingBanner);
    this.renderMusicList();
    this.renderMusicChart();
    this.playMainPlayer();
    this.currentTrack.addEventListener('timeupdate', this.updateProgressContainer);
    this.currentTrack.addEventListener('ended', this.resetProgressContainer);
    this.volumeInput.addEventListener('input', () => {
      this.setVolume(this.currentTrack);
    });
    this.searchMusicBtn.addEventListener('click', () => {
      this.searchTrack();
    });

    this.model.on('findSearchTracks', (tracks: any) => {
      if (typeof tracks !== 'undefined') this.renderMusicItem(tracks);
      this.playNextTrack(tracks);
      this.playPrevTrack(tracks);
    });

    this.model.on('getMusic', (tracks: any) => {
      this.playNextTrack(tracks);
      this.playPrevTrack(tracks);
    });
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
    this.searchMusicInput.setAttribute('placeholder', 'Название трека или исполнителя');
    searchMusicWrapper.append(this.searchMusicInput, this.searchMusicBtn);

    const trackListWrapper = createHtmlElement('div', 'track__list-wrapper', '', musicList);
    createHtmlElement('h2', 'track__list-title', 'Треки', trackListWrapper);
    trackListWrapper.append(this.trackListContainer);
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
    const percentProgress = (currentTime / duration) * 100; //Текущий процент для отображения прогресса;
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
      if (this.currentMusicIndex < tracks.length - 1) {
        this.currentMusicIndex += 1;
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrackId = `${tracks[this.currentMusicIndex].id}`;
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
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrackId = `${tracks[this.currentMusicIndex].id}`;
        this.addPlayIcon();
        setTimeout(() => {
          this.playMusicItem();
        }, 1000);
      } else {
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
    tracks.forEach((track: Track) => {
      const trackItem = createHtmlElement('li', 'track__item');
      trackItem.id = `${track.id}`;
      this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
      const trackInfo = createHtmlElement('div', 'track__info-container', '', trackItem);
      const trackAva = createHtmlElement('div', 'track__item-ava', '', trackInfo);
      const playBtnTrackItem = createHtmlElement('button', 'track__item-play', '', trackAva);
      const trackTitleContainer = createHtmlElement('div', 'track__title-container', '', trackInfo);
      createHtmlElement('p', 'track__item-title', `${track.name}`, trackTitleContainer);
      createHtmlElement('p', 'track__item-author', `${track.artistName}`, trackTitleContainer);
      const trackControls = createHtmlElement('div', 'track__item-controls', '', trackItem);
      createHtmlElement('button', 'track__item-favorite', '', trackControls);
      createHtmlElement('p', 'track__item-duration', `${formatTime(track.playbackSeconds)}`, trackControls);
      this.trackListContainer.append(trackItem);

      playBtnTrackItem.addEventListener('click', () => {
        this.currentTrack.src = `${track.previewURL}`;
        this.currentTrackId = `${track.id}`;
        this.trackTitleMain.textContent = `${track.name}`;
        this.trackAuthorMain.textContent = `${track.artistName}`;
        this.timeMainPlayer.textContent = `${formatTime(track.playbackSeconds)}`;
        const isPlaying = this.mainPlayerWrapper.classList.contains('play');
        if (isPlaying) {
          playBtnTrackItem.classList.remove('track__item-pause');
          this.pauseMusicItem();
        } else {
          playBtnTrackItem.classList.add('track__item-pause');
          this.playMusicItem();
        }
      });
    });
  }

  async renderMusicChart() {
    const tracks = await this.model.getTopTracks();
    await this.renderMusicItem(tracks);
  }
}
