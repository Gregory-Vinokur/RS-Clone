
import { IPost } from '../../interfaces/IPost';
import { database } from './../../server/firebaseAuth';
import Post from './../../components/Post/post';
import { getTimeDifference } from './../../utils/getTimeDifference';
import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';

export const loadPosts = (wrapper: HTMLElement, postLimit: number, lang: Lang, user: TypeUser) => {
    const postsRef = database.ref("posts").limitToLast(postLimit);

    postsRef.once("value", (snapshot) => {
        wrapper.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const postData: IPost = childSnapshot.val();
            const post = new Post(postData, lang, user);
            const postImageElement = post.element.querySelector(".post__image") as HTMLImageElement;
            postImageElement.src = postData.image;
            const postLogo = post.element.querySelector(".post__logo") as HTMLImageElement;
            postLogo.src = postData.logo;
            const postAuthor = post.element.querySelector(".post__author") as HTMLElement;
            postAuthor.textContent = postData.author;
            const postDate = post.element.querySelector(".post__date") as HTMLElement;
            postDate.textContent = `${getTimeDifference(postData.date)}`;
            const postText = post.element.querySelector(".post__text") as HTMLElement;
            postText.textContent = postData.text;
            const postLikesCounter = post.element.querySelector(".like__counter") as HTMLElement;
            if (postData.likes > 0) {
                postLikesCounter.textContent = `${postData.likes}`;
            }
            const postSharesCounter = post.element.querySelector(".share__counter") as HTMLElement;
            if (postData.shares > 0) {
                postSharesCounter.textContent = `${postData.shares}`;
            }
            const postCommentCounter = post.element.querySelector(".comment__counter") as HTMLElement;
            if (postData.comments && postData.comments.length > 0) {
                postCommentCounter.textContent = `${postData.comments.length}`;
            }
            post.element.setAttribute('id', `${childSnapshot.key}`);
            wrapper.prepend(post.element);
        });
    });
};
