import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import { database } from './../../server/firebaseAuth';
import { loadPosts } from './load_post';

export const loadMorePosts = async (lang: Lang, user: TypeUser, postsLimit: number, postsCount: number, wrapper: HTMLElement, author?: string) => {
    const postsRef = database.ref("posts");
    let postLength = 0;

    await new Promise((resolve) => {
        postsRef.once("value", (snapshot) => {
            postLength = snapshot.numChildren();
            resolve(postLength);
        });
    });

    if (document.body.scrollTop + document.body.offsetHeight >= document.body.scrollHeight) {
        if (postLength > postsLimit) {
            postsLimit += 10;
            if (author) {
                loadPosts(wrapper, postsLimit, lang, user, author);
            }
            else {
                loadPosts(wrapper, postsLimit, lang, user);
            }
            postsCount += 10;
        }
    }

    return Promise.resolve();
}
