import './news.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import { Lang } from '../../constans/constans';
import Post from './../../components/Post/post';
import { IPost } from './../../interfaces/IPost';
import { database } from './../../server/firebaseAuth';
import { loadPosts } from './../../data/news_api/load_post';

export default class NewsPage extends Page {
    constructor(id: string) {
        super(id);
        this.mainWrapper.className = 'news__wrap';
        loadPosts(this.mainWrapper);
    }


    changeLang = (lang: Lang) => {
        console.log(lang);
    };

    render(): HTMLElement {
        return this.mainWrapper;
    }
}

