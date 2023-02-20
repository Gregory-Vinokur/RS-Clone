import './news.css';
import Page from '../Template/page';
import { loadPosts } from './../../data/news_api/load_post';
import throttle from './../../utils/throttle';
import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import { loadMorePosts } from '../../data/news_api/load_more_posts';

export default class NewsPage extends Page {
    postsLimit: number;
    postsCount: number;
    constructor(id: string, lang: Lang, user: TypeUser) {
        super(id);
        this.mainWrapper.className = 'news__wrap';
        this.postsLimit = 10;
        this.postsCount = 0;
        document.body.addEventListener("scroll", throttle(async () => loadMorePosts(lang, user, this.postsLimit, this.postsCount, this.mainWrapper), 500));
        loadPosts(this.mainWrapper, this.postsLimit, lang, user);
    }

    changeLang = (lang: Lang) => {
        console.log(lang);
    };

    render(): HTMLElement {
        return this.mainWrapper;
    }
}

