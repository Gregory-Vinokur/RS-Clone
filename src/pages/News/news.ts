import './news.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import Post from './../../components/Post/post';
import { IPost } from './../../interfaces/IPost';
import { database } from './../../server/firebaseAuth';
import { loadPosts } from './../../data/news_api/load_post';
import throttle from './../../utils/throttle';
import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default class NewsPage extends Page {
    postsLimit: number;
    postsCount: number;
    lang: Lang;
    user: TypeUser;
    constructor(id: string, lang: Lang, user: TypeUser) {
        super(id);
        this.mainWrapper.className = 'news__wrap';
        this.postsLimit = 10;
        this.postsCount = 0;
        const langNews = localStorage.getItem('LANG');
        this.lang = langNews === 'eng' || langNews === 'rus' ? langNews : 'eng';
        this.user = null;
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            } else {
                this.user = null;
            }
        });
        document.body.addEventListener("scroll", throttle(async () => this.loadMorePosts(this.lang, this.user), 500));
        loadPosts(this.mainWrapper, this.postsLimit, lang, user);
    }

    async loadMorePosts(lang: Lang, user: TypeUser) {
        const postsRef = database.ref("posts");
        let postLength = 0;

        await new Promise((resolve) => {
            postsRef.once("value", (snapshot) => {
                postLength = snapshot.numChildren();
                resolve(postLength);
            });
        });
        if (document.body.scrollTop + document.body.offsetHeight >= document.body.scrollHeight) {
            if (postLength > this.postsLimit) {
                this.postsLimit += 10;
                loadPosts(this.mainWrapper, this.postsLimit, this.lang, this.user);
                this.postsCount += 10;
            }
        }
        return Promise.resolve();
    }



    changeLang = (lang: Lang) => {
        console.log(lang);
    };

    render(): HTMLElement {
        return this.mainWrapper;
    }
}

