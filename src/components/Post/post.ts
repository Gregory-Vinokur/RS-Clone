import './post.css';
import { createHtmlElement } from '../../utils/createElement';
import { IPost } from './../../interfaces/IPost';
import { database } from '../../server/firebaseAuth';

export default class Post {
    element: HTMLElement;
    constructor(postData: IPost) {
        this.element = createHtmlElement("div", "post__container", "");
        const postHeader = createHtmlElement("div", "post__header", "", this.element);
        const postLogo = createHtmlElement("img", "post__logo", '', postHeader) as HTMLImageElement;
        const postInfo = createHtmlElement("div", "post__info", "", postHeader);
        const postAuthor = createHtmlElement("div", "post__author", '', postInfo);
        const postDate = createHtmlElement("div", "post__date", '', postInfo);
        const postTextElement = createHtmlElement("div", "post__text", "", this.element);
        const postImageElement = createHtmlElement("img", "post__image", "", this.element) as HTMLImageElement;
        postImageElement.src = postData.image;
        const postActions = createHtmlElement("div", "post__actions", "", this.element);
        const likeButton = createHtmlElement("button", "like__button", '', postActions);
        const likeImg = createHtmlElement("div", "like__img", '', likeButton);
        const likeCounter = createHtmlElement("span", "like__counter", '', likeButton);
        const shareButton = createHtmlElement("button", "share__button", '', postActions);
        const shareImg = createHtmlElement("div", "share__img", '', shareButton);
        const shareCounter = createHtmlElement("span", "share__counter", '', shareButton);

        likeButton.addEventListener('click', () => {
            const postId = this.element.id;
            if (!likeButton.classList.contains('liked')) {
                likeButton.classList.add('liked');
                likeImg.classList.add('liked__img');
                likeCounter.textContent = (Number(likeCounter.textContent) + 1).toString();
                database.ref(`posts/${postId}`).update({
                    likes: +1
                });
            }
            else {
                likeButton.classList.remove('liked');
                likeImg.classList.remove('liked__img');
                likeCounter.textContent = (Number(likeCounter.textContent) - 1).toString();
                database.ref(`posts/${postId}`).update({
                    likes: -1
                });
            }
            if (likeCounter.textContent === '0') {
                likeCounter.textContent = '';
            }
        })

        shareButton.addEventListener('click', () => {
            const postId = this.element.id;
            if (shareCounter.textContent === '') {
                shareCounter.textContent = (Number(shareCounter.textContent) + 1).toString();
                database.ref(`posts/${postId}`).update({
                    shares: +1
                });
            }
            else {
                shareCounter.textContent = (Number(shareCounter.textContent) - 1).toString();
                database.ref(`posts/${postId}`).update({
                    shares: -1
                });
            }
            if (shareCounter.textContent === '0') {
                shareCounter.textContent = '';
            }
        })
    }
}
