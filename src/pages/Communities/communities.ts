import './communities.css';
import { TypeUser } from '../../constans/types';
import { Lang, LANGTEXT } from '../../constans/constans';
import ViewerCommunities from './viewCommunities';
import { EventEmitter } from 'events';
import cat_logo from '../../../assets/img/cat_logo.jpg';
import meme_logo from '../../../assets/img/meme_logo.jpg';
import sport_logo from '../../../assets/img/sport_logo.jpg';
import cats_cover from '../../../assets/img/cats_cover.jpg';
import meme_cover from '../../../assets/img/meme_cover.jpg';
import sport_cover from '../../../assets/img/sport_cover.jpg';
import qs from 'query-string';

export default class CommunitiesPage extends EventEmitter {
    view: ViewerCommunities;
    constructor(id: string, lang: Lang, user: TypeUser) {
        super();
        this.view = new ViewerCommunities(id, lang, user);
    }

    changeLang = (lang: Lang) => {
        const communityGroupTitles = document.querySelectorAll('.community__group');
        if (communityGroupTitles.length > 0) {
            communityGroupTitles[0].textContent = LANGTEXT['animals'][lang];
            communityGroupTitles[1].textContent = LANGTEXT['humor'][lang];
            communityGroupTitles[2].textContent = LANGTEXT['public_page'][lang];
        }
        const followersText = document.querySelectorAll('.followers__text');
        if (followersText.length > 0) {
            followersText[0].textContent = LANGTEXT['followers'][lang];
            followersText[1].textContent = LANGTEXT['followers'][lang];
            followersText[2].textContent = LANGTEXT['followers'][lang];
        }
        const followStatus = document.getElementById('follow__status');
        if (followStatus) followStatus.textContent = LANGTEXT['following'][lang];
        const communityFollowersText = document.querySelector('.community__page-followers-text');
        if (communityFollowersText) communityFollowersText.textContent = LANGTEXT['followersText'][lang];
        const generatePostBtn = document.querySelector('.generate__posts');
        if (generatePostBtn) generatePostBtn.textContent = LANGTEXT['generatePost'][lang];
        const followBtn = document.querySelector('.follow__btn');
        if (followBtn && (followBtn.textContent === LANGTEXT['followBtn']['rus'] || followBtn.textContent === LANGTEXT['followBtn']['eng'])) followBtn.textContent = LANGTEXT['followBtn'][lang];
        if (followBtn && (followBtn.textContent === LANGTEXT['unfollowBtn']['rus'] || followBtn.textContent === LANGTEXT['unfollowBtn']['eng'])) followBtn.textContent = LANGTEXT['unfollowBtn'][lang];
    };

    render = () => {
        const params = qs.parse(window.location.search).community_name;
        if (params === 'cats_images') {
            this.view.createCommunityPage(cat_logo, 'Cats images', cats_cover, 'cats_images')
        }
        if (params === 'memes') {
            this.view.createCommunityPage(meme_logo, 'Memes', meme_cover, 'memes');
        }
        if (params === 'sport_news') {
            this.view.createCommunityPage(sport_logo, 'Sport News', sport_cover, 'sport_news');
        }
        return this.view.render();
    };
}
