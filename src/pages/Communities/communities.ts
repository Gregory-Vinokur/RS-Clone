import './communities.css';
import { TypeUser } from '../../constans/types';
import { Lang } from '../../constans/constans';
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
        console.log(lang);
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
