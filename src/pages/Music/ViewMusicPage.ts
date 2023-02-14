import Page from '../Template/page';
import ModelMusicPage from './ModelMusicPage';
import { createHtmlElement } from '../../utils/createElement';
import formatTime from '../../utils/formatTime';

type EmitsName = 'load';
type Track = { [key: string]: any };
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
  searchMusicInput: HTMLElement;
  searchMusicBtn: HTMLElement;
  trackListContainer: HTMLElement;
  trackTitleMain: HTMLElement;
  trackAuthorMain: HTMLElement;
  currentTrack: HTMLAudioElement;
  currentMusicIndex: number;

  emit(event: EmitsName, data?: string | number) {
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
    this.recommendedMusicBtn = createHtmlElement('div', 'recommended__page music__page-active', 'Мировые чарты');
    this.myMusicBtn = createHtmlElement('div', 'my__music-page', 'Моя музыка');
    this.searchMusicInput = createHtmlElement('input', 'search__music-input');
    this.searchMusicBtn = createHtmlElement('button', 'search__music-btn', 'Найти');
    this.trackListContainer = createHtmlElement('ul', 'track__list-container');
    this.trackTitleMain = createHtmlElement('div', 'main-player__name', 'Наслаждайтесь музыкой');
    this.trackAuthorMain = createHtmlElement('div', 'main-player__author');
    this.currentTrack = createHtmlElement('audio', 'track__item-current-play') as HTMLAudioElement;
    this.currentMusicIndex = 0;
    this.mainPlayerWrapper.append(this.currentTrack);
    this.renderMainPlayer();
    this.mainWrapper.append(this.advertisingBanner);
    this.renderMusicList();
    this.renderMusicItem();
    this.playNextTrack();
    this.playPrevTrack();

    this.currentTrack.addEventListener('timeupdate', this.updateProgressContainer);
    this.currentTrack.addEventListener('ended', this.resetProgressContainer);
    this.volumeInput.addEventListener('click', () => {
      this.setVolume(this.currentTrack);
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

  async renderMusicItem() {
    const { tracks } = await this.model.getTopTracks();
    console.log(tracks);
    this.trackListContainer.innerHTML = '';
    tracks.forEach((track: Track) => {
      const trackItem = createHtmlElement('li', 'track__item');
      trackItem.id = `${track.id}`;
      // const currentTrackList = createHtmlElement('audio', 'track__item-src', '', trackItem) as HTMLAudioElement;
      // currentTrackList.src = `${track.previewURL}`;
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
        this.playMusicItem(trackItem, playBtnTrackItem, track);
      });

      this.playBtnMainPlayer.addEventListener('click', () => {
        this.playMusicItem(trackItem, playBtnTrackItem, track);
      });
      this.playMusicMainPlayer(playBtnTrackItem, trackItem);
    });
  }

  stopMusicPlay() {
    const trackItem = document.querySelectorAll('.track__item');
    trackItem.forEach((track) => {
      const currentAudio: HTMLAudioElement | null = track.querySelector('.track__item-src');
      const audioBtn: HTMLElement | null = track.querySelector('.track__item-play');
      track.classList.remove('play');
      if (currentAudio) currentAudio.pause();
      if (audioBtn) audioBtn.classList.remove('track__item-pause');
    });
  }

  playMusicMainPlayer(playBtn: HTMLElement, trackItem: HTMLElement) {
    this.playBtnMainPlayer.addEventListener('click', () => {
      if (this.mainPlayerWrapper.classList.contains('play')) {
        //this.stopMusicPlay();
        this.mainPlayerWrapper.classList.remove('play');
        // currentTrackList.pause();
        trackItem.classList.remove('play');
        playBtn.classList.remove('track__item-pause');
        this.playBtnMainPlayer.classList.remove('main__player-pause');
        this.currentTrack.pause();
      } else if (!this.mainPlayerWrapper.classList.contains('play')) {
        this.stopMusicPlay();
        playBtn.classList.add('track__item-pause');
        this.mainPlayerWrapper.classList.add('play');
        this.playBtnMainPlayer.classList.add('main__player-pause');
        trackItem.classList.add('play');
        this.currentTrack.play();
      }
    });
  }

  playMusicItem(trackItem: HTMLElement, playBtnTrackItem: HTMLElement, track: Track) {
    const mainPlayer: HTMLElement | null = document.querySelector('.main-player__wrapper');
    if (!trackItem.classList.contains('play')) {
      this.stopMusicPlay();
      //currentTrackList.play();
      trackItem.classList.add('play');
      playBtnTrackItem.classList.add('track__item-pause');
      this.trackTitleMain.textContent = `${track.name}`;
      this.trackAuthorMain.textContent = `${track.artistName}`;
      this.playBtnMainPlayer.classList.add('main__player-pause');
      this.timeMainPlayer.textContent = `${formatTime(track.playbackSeconds)}`;
      mainPlayer?.classList.add('play');
      //this.currentTrack.src = `${track.previewURL}`;
      this.currentTrack.play();
    } else {
      trackItem.classList.remove('play');
      //currentTrackList.pause();
      playBtnTrackItem.classList.remove('track__item-pause');
      this.playBtnMainPlayer.classList.remove('main__player-pause');
      mainPlayer?.classList.remove('play');
      this.currentTrack.pause();
    }
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

  async playNextTrack() {
    const { tracks } = await this.model.getTopTracks();
    this.nextBtnMainPlayer.addEventListener('click', () => {
      if (this.currentMusicIndex < tracks.length - 1) {
        this.currentMusicIndex += 1;
        this.currentTrack.pause();
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrack.play();
      } else {
        this.currentMusicIndex = 0;
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrack.play();
      }
    });
  }

  async playPrevTrack() {
    const { tracks } = await this.model.getTopTracks();
    this.prevBtnMainPlayer.addEventListener('click', () => {
      if (!(this.currentMusicIndex === 0)) {
        this.currentMusicIndex -= 1;
        this.currentTrack.pause();
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrack.play();
      } else {
        this.currentMusicIndex = tracks.length - 1;
        this.currentTrack.src = `${tracks[this.currentMusicIndex].previewURL}`;
        this.currentTrack.play();
      }
    });
  }
}
