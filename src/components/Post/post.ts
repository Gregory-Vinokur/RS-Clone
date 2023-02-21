import './post.css';
import { createHtmlElement } from '../../utils/createElement';
import { IPost } from './../../interfaces/IPost';
import { database } from '../../server/firebaseAuth';
import { loadComments } from './../../data/news_api/load_comments_to_posts';
import ModelProfile from './../../pages/MyProfile/ModelProfile';
import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import cat_logo from '../../../assets/img/cat_logo.jpg';
import meme_logo from '../../../assets/img/meme_logo.jpg';
import sport_logo from '../../../assets/img/sport_logo.jpg';

export default class Post extends ModelProfile {
    element: HTMLElement;
    constructor(postData: IPost, lang: Lang, user: TypeUser) {
        super(lang, user);
        this.element = createHtmlElement("div", "post__container", "");
        const postHeader = createHtmlElement("div", "post__header", "", this.element);
        const postLogo = createHtmlElement("img", "post__logo", '', postHeader) as HTMLImageElement;

        postLogo.addEventListener('click', (e: Event) => {
            const params = new URLSearchParams(window.location.search);
            const { target } = e;
            if ((target as HTMLImageElement).src === cat_logo) {
                params.set('community_name', 'cats_images');
                const search = params.toString();
                const url = `${window.location.origin}/communities?${search}`;
                window.history.pushState({}, '', url);
                window.location.href = url;
            }
            if ((target as HTMLImageElement).src === meme_logo) {
                params.set('community_name', 'memes');
                const search = params.toString();
                const url = `${window.location.origin}/communities?${search}`;
                window.history.pushState({}, '', url);
                window.location.href = url;
            }
            if ((target as HTMLImageElement).src === sport_logo) {
                params.set('community_name', 'sport_news');
                const search = params.toString();
                const url = `${window.location.origin}/communities?${search}`;
                window.history.pushState({}, '', url);
                window.location.href = url;
            }
        });
        const postInfo = createHtmlElement("div", "post__info", "", postHeader);
        const postAuthor = createHtmlElement("div", "post__author", '', postInfo);
        const postDate = createHtmlElement("div", "post__date", '', postInfo);
        const postTextElement = createHtmlElement("div", "post__text", "", this.element);
        const postImageElement = createHtmlElement("img", "post__image", "", this.element) as HTMLImageElement;
        if (postData.image) {
            postImageElement.src = postData.image;
        } else {
            postImageElement.style.display = 'none';
        }
        const postActions = createHtmlElement("div", "post__actions", "", this.element);
        const likeButton = createHtmlElement("button", "like__button", '', postActions);
        const likeImg = createHtmlElement("div", "like__img", '', likeButton);
        const likeCounter = createHtmlElement("span", "like__counter", '', likeButton);
        const userUid = this.user?.uid;

        if (!userUid) {
            return;
        }
        if (postData.liked && postData.liked[userUid] === true) {
            likeButton.classList.add('liked');
            likeImg.classList.add('liked__img');
        }
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
        userAvatarReply.src = this.user?.photoURL as string;
        const form = createHtmlElement('form', 'reply__form', '', replyContainer);
        const textarea = createHtmlElement('textarea', 'reply__textarea', '', form) as HTMLTextAreaElement;
        textarea.placeholder = 'Leave a comment...'
        const replySubmitButton = createHtmlElement('button', 'reply__submit-btn', '', form);


        likeButton.addEventListener('click', () => {
            const userUid = this.user?.uid;

            if (!userUid) {
                return;
            }
            const postId = this.element.id;
            database.ref(`posts/${postId}`).once("value", (snapshot) => {
                let likes = snapshot.val().likes || 0;
                let liked = snapshot.val().liked || {};
                if (!likeButton.classList.contains('liked')) {
                    likeButton.classList.add('liked');
                    likeImg.classList.add('liked__img');
                    likes++;
                    liked[userUid] = true;
                } else {
                    likeButton.classList.remove('liked');
                    likeImg.classList.remove('liked__img');
                    likes--;
                    delete liked[userUid]
                }
                likeCounter.textContent = (likes === 0) ? "" : likes.toString();
                database.ref(`posts/${postId}`).update({
                    likes,
                    liked
                });
            });
        });


        shareButton.addEventListener('click', () => {
            const userUid = this.user?.uid;

            if (!userUid) {
                return;
            }
            const postId = this.element.id;
            database.ref(`posts/${postId}`).once("value", (snapshot) => {
                const postData = snapshot.val();
                let shares = postData.shares || 0;
                let reposted = postData.reposted || {};
                let id = postData.id || '';
                if (reposted[userUid] !== true) {
                    shares++;
                    reposted[userUid] = true;
                    const newUserPostRef = database.ref(`users/${user?.uid}/userPost`).push(postData);
                    postData.id = newUserPostRef.key;
                    newUserPostRef.set(postData);

                } else {
                    return;
                }
                shareCounter.textContent = (shares === 0) ? "" : shares.toString();
                database.ref(`posts/${postId}`).update({
                    shares,
                    reposted,
                    id
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
            replyContainer.classList.toggle('reply__container-active');
            if (Number(commentCounter.textContent) > 0) {
                commentsContainer.classList.toggle('comments__container-active');
            }
            loadComments(this.element.id, commentsContainer, commentCounter, this.user);
        })

        replySubmitButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const postId = this.element.id;
            database.ref(`posts/${postId}/comments`).once("value", (snapshot) => {
                let comments = snapshot.val() || [];
                if (textarea.value !== '') {
                    commentsContainer.classList.add('comments__container-active');
                    const newComment = {
                        text: textarea.value,
                        author: this.user?.displayName,
                        date: Date.now(),
                        logo: this.user?.photoURL,
                        likes: 0,
                        liked: {}
                    };
                    comments.push(newComment);
                    textarea.value = '';
                }
                commentCounter.textContent = (comments.length === 0) ? "" : comments.length.toString();
                database.ref(`posts/${postId}`).update({
                    comments
                });
            });
        })

    }
}
