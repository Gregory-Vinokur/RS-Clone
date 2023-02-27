import './news.css';
import Page from '../Template/page';
import { loadPosts } from './../../data/news_api/load_post';
import throttle from './../../utils/throttle';
import { Lang, LANGTEXT } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import { loadMorePosts } from '../../data/news_api/load_more_posts';

export default class NewsPage extends Page {
    postsLimit: number;
    constructor(id: string, lang: Lang, user: TypeUser) {
        super(id);
        this.mainWrapper.className = 'news__wrap';
        this.postsLimit = 10;
        document.body.addEventListener("scroll", throttle(async () => loadMorePosts(lang, user, this.mainWrapper), 500));
        loadPosts(this.mainWrapper, this.postsLimit, lang, user);
    }

    changeLang = (lang: Lang) => {
        const textareas = document.querySelectorAll('.reply__textarea');
        const cancelBtns = document.querySelectorAll('.cancel__btn');
        const saveBtns = document.querySelectorAll('.save__btn');
        textareas.forEach(el => (el as HTMLTextAreaElement).placeholder = LANGTEXT['replyComment'][lang]);
        cancelBtns.forEach(el => (el as HTMLButtonElement).textContent = LANGTEXT['cancelBtn'][lang]);
        saveBtns.forEach(el => (el as HTMLButtonElement).textContent = LANGTEXT['saveBtn'][lang]);
    };

    render(): HTMLElement {
        return this.mainWrapper;
    }
}

