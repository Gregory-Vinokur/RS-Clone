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
        const commentButton = createHtmlElement("button", "comment__button", '', postActions);
        const commentImg = createHtmlElement("div", "comment__img", '', commentButton);
        const commentCounter = createHtmlElement("span", "comment__counter", '', commentButton);
        const shareButton = createHtmlElement("button", "share__button", '', postActions);
        const shareImg = createHtmlElement("div", "share__img", '', shareButton);
        const shareCounter = createHtmlElement("span", "share__counter", '', shareButton);
        const replyWrapper = createHtmlElement('div', 'reply__wrapper', '', this.element);

        const commentsContainer = createHtmlElement("div", "comments__container", '', replyWrapper);
        const replyContainer = createHtmlElement('div', 'reply__container', '', replyWrapper);
        const userAvatarReply = createHtmlElement("img", "user__avatar-reply", '', replyContainer) as HTMLImageElement;
        userAvatarReply.src = 'https://openclipart.org/image/800px/177394';
        const form = createHtmlElement('form', 'reply__form', '', replyContainer);
        const textarea = createHtmlElement('textarea', 'reply__textarea', '', form) as HTMLTextAreaElement;
        textarea.placeholder = 'Leave a comment...'
        const replySubmitButton = createHtmlElement('button', 'reply__submit-btn', '', form);


        likeButton.addEventListener('click', () => {
            const postId = this.element.id;
            database.ref(`posts/${postId}/likes`).once("value", (snapshot) => {
                let likes = snapshot.val() || 0;
                if (!likeButton.classList.contains('liked')) {
                    likeButton.classList.add('liked');
                    likeImg.classList.add('liked__img');
                    likes++;
                } else {
                    likeButton.classList.remove('liked');
                    likeImg.classList.remove('liked__img');
                    likes--;
                }
                likeCounter.textContent = (likes === 0) ? "" : likes.toString();
                database.ref(`posts/${postId}`).update({
                    likes
                });
            });
        });

        shareButton.addEventListener('click', () => {
            const postId = this.element.id;
            database.ref(`posts/${postId}/shares`).once("value", (snapshot) => {
                let shares = snapshot.val() || 0;
                if (shareCounter.textContent === '') {
                    shares++;
                } else {
                    shares--;
                }
                shareCounter.textContent = (shares === 0) ? "" : shares.toString();
                database.ref(`posts/${postId}`).update({
                    shares
                });
            });
        });

        textarea.addEventListener('input', () => {
            replySubmitButton.classList.add('button__active');
            if (textarea.value === '') {
                replySubmitButton.classList.remove('button__active');
            }
        })

        commentButton.addEventListener('click', () => {
            replyContainer.classList.toggle('reply__container-active')
        })

        replySubmitButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const postId = this.element.id;
            database.ref(`posts/${postId}/comments`).once("value", (snapshot) => {
                let comments = snapshot.val() || 0;
                if (textarea.value !== '') {
                    commentsContainer.classList.add('comments__container-active');
                    const commentItem = createHtmlElement("div", "comment__item");
                    const commentAvatar = createHtmlElement("img", "comment__avatar", "", commentItem) as HTMLImageElement;;
                    const commentContent = createHtmlElement("div", "comment__content", "", commentItem);
                    const commentHeader = createHtmlElement("div", "comment__header", "", commentContent);
                    const commentUsername = createHtmlElement("span", "comment__username", "Username", commentHeader);
                    const commentText = createHtmlElement("p", "comment__text", "", commentContent);
                    const commentDate = createHtmlElement("span", "comment__date", "10 minutes ago", commentContent);
                    const crossButton = createHtmlElement('button', 'cross__btn', '', commentItem);
                    commentItem.addEventListener('mouseover', () => {
                        crossButton.classList.add('cross__btn-active')
                    })
                    commentItem.addEventListener('mouseout', () => {
                        crossButton.classList.remove('cross__btn-active')
                    })
                    commentAvatar.src = userAvatarReply.src;
                    commentText.textContent = textarea.value;
                    commentsContainer.append(commentItem);
                    textarea.value = '';
                    comments = textarea.value;
                }
                commentCounter.textContent = (comments.length === 0) ? "" : comments.length.toString();
                database.ref(`posts/${postId}`).update({
                    comments
                });
            });
        })

        commentsContainer.addEventListener("click", function (event) {
            const target = event.target as HTMLButtonElement;
            if (target && target.classList.contains('cross__btn-active')) {
                console.log('clicked')
                const commentItem = target.closest(".comment__item");
                if (commentItem) {
                    commentItem.remove();
                }
            }
        });


    }
}
