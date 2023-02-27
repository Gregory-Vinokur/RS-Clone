import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import { database } from './../../server/firebaseAuth';
import { loadPosts } from './load_post';

let postsLimit = 10;

export const loadMorePosts = async (lang: Lang, user: TypeUser, wrapper: HTMLElement, author?: string) => {
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
        }
    }

    return Promise.resolve();
}
