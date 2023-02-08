import './news.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import { Lang } from '../../constans/constans';
import Post from './../../components/Post/post';
import { IPost } from './../../interfaces/IPost';
import { database } from './../../server/firebaseAuth';
import { loadPosts } from './../../data/news_api/load_post';
import throttle from './../../utils/throttle';

export default class NewsPage extends Page {
    postsLimit: number;
    postsCount: number;
    constructor(id: string) {
        super(id);
        this.mainWrapper.className = 'news__wrap';
        this.postsLimit = 10;
        this.postsCount = 0;
        document.body.addEventListener("scroll", throttle(async () => this.loadMorePosts(), 500));
        loadPosts(this.mainWrapper, this.postsLimit);
    }

    async loadMorePosts() {
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
                console.log('load');
                loadPosts(this.mainWrapper, this.postsLimit);
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

