import Page from '../Template/page';
import ModelMusicPage from './ModelMusicPage';
import { createHtmlElement } from '../../utils/createElement';
type EmitsName = 'play';

export default class ViewerMessasges extends Page {
  model: ModelMusicPage;
  currentTrack: HTMLAudioElement;
  playBtnMainPlayer: HTMLElement;
  nextBtnMainPlayer: HTMLElement;
  prevBtnMainPlayer: HTMLElement;
  timeMainPlayer: HTMLElement;
  volumeInput: HTMLElement;
  advertisingBanner: HTMLElement;
  recommendedMusicBtn: HTMLElement;
  myMusicBtn: HTMLElement;
  searchMusicInput: HTMLElement;
  searchMusicBtn: HTMLElement;
  trackListContainer: HTMLElement;

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
    this.currentTrack = createHtmlElement('audio', 'current__track') as HTMLAudioElement;
    this.playBtnMainPlayer = createHtmlElement('button', 'main__player-play');
    this.nextBtnMainPlayer = createHtmlElement('button', 'main__player-next');
    this.prevBtnMainPlayer = createHtmlElement('button', 'main__player-prev');
    this.timeMainPlayer = createHtmlElement('div', 'main-player__time', '10:00');
    this.volumeInput = createHtmlElement('input', 'volume__slider') as HTMLInputElement;
    this.advertisingBanner = createHtmlElement('div', 'advertising__banner');
    this.recommendedMusicBtn = createHtmlElement('div', 'recommended__page music__page-active', 'Мировые чарты');
    this.myMusicBtn = createHtmlElement('div', 'my__music-page', 'Моя музыка');
    this.searchMusicInput = createHtmlElement('input', 'search__music-input');
    this.searchMusicBtn = createHtmlElement('button', 'search__music-btn', 'Найти');
    this.trackListContainer = createHtmlElement('ul', 'track__list-container');
    this.mainPlayer();
    this.mainWrapper.append(this.advertisingBanner);
    this.musicList();
    //this.model.getTopTracks();
  }

  mainPlayer() {
    const mainPlayerWrapper = createHtmlElement('div', 'main-player__wrapper', '', this.mainWrapper);
    const mainPlayerControls = createHtmlElement('div', 'main-player__controls', '', mainPlayerWrapper);
    mainPlayerControls.append(this.currentTrack, this.playBtnMainPlayer, this.prevBtnMainPlayer, this.nextBtnMainPlayer);

    const mainPlayerTrackInfo = createHtmlElement('div', 'main-player__info', '', mainPlayerWrapper);

    const mainPlayerTrack = createHtmlElement('div', 'main-player__about', '', mainPlayerTrackInfo);
    createHtmlElement('div', 'main-player__img', '', mainPlayerTrack);

    const mainPlayerCurrentTrack = createHtmlElement('div', 'main-player__current', '', mainPlayerTrack);
    createHtmlElement('div', 'main-player__name', 'Mockingbird', mainPlayerCurrentTrack);
    createHtmlElement('div', 'main-player__author', 'Eminem', mainPlayerCurrentTrack);
    const progressBar = createHtmlElement('div', 'main-player__progress-bar', '', mainPlayerCurrentTrack);
    createHtmlElement('div', 'main-player__progress-percent', '', progressBar);

    mainPlayerTrackInfo.append(this.timeMainPlayer);
    this.volumeInput.setAttribute('type', 'range');
    this.volumeInput.setAttribute('min', '0');
    this.volumeInput.setAttribute('max', '100');
    this.volumeInput.setAttribute('volume', '50');
    mainPlayerWrapper.append(this.volumeInput);
  }

  musicList() {
    const musicList = createHtmlElement('div', 'music__list', '', this.mainWrapper);
    const musicListPages = createHtmlElement('div', 'list__header-buttons', '', musicList);
    musicListPages.append(this.recommendedMusicBtn, this.myMusicBtn);
    const searchMusicWrapper = createHtmlElement('div', 'search__music-wrapper', '', musicList);

    this.searchMusicInput.setAttribute('type', 'text');
    this.searchMusicInput.setAttribute('placeholder', 'Название трека или исполнителя');
    searchMusicWrapper.append(this.searchMusicInput, this.searchMusicBtn);

    const trackListWrapper = createHtmlElement('div', 'track__list-wrapper', '', musicList);
    createHtmlElement('p', 'track__list-title', 'Треки', trackListWrapper);
    trackListWrapper.append(this.trackListContainer);
  }
}
