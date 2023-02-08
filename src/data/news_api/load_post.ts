
import { IPost } from '../../interfaces/IPost';
import { database } from './../../server/firebaseAuth';
import Post from './../../components/Post/post';
import { getTimeDifference } from './../../utils/getTimeDifference';

export const loadPosts = (wrapper: HTMLElement, postLimit: number) => {
    const postsRef = database.ref("posts").limitToLast(postLimit);

    postsRef.once("value", (snapshot) => {
        wrapper.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const postData: IPost = childSnapshot.val();
            const post = new Post(postData);
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
            post.element.setAttribute('id', `${childSnapshot.key}`);
            wrapper.prepend(post.element);
        });
    });
};
