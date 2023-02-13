
import { TypeUser } from '../../constans/types';
import { IComment } from '../../interfaces/IComment';
import { createHtmlElement } from '../../utils/createElement';
import { getTimeDifference } from '../../utils/getTimeDifference';
import { database } from './../../server/firebaseAuth';
import { editComment } from './edit_comments';

export const loadComments = (postId: string, commentsContainer: HTMLElement, commentCounter: HTMLSpanElement, user: TypeUser) => {
    database
        .ref(`posts/${postId}/comments`)
        .on("value", (snapshot) => {
            let comments: IComment[] = [];
            snapshot.forEach((childSnapshot) => {
                let comment = childSnapshot.val() as IComment;
                comment.id = childSnapshot.key;
                comments.push(comment);
            });
            commentsContainer.innerHTML = '';
            comments.forEach((comment) => {
                const commentItem = createHtmlElement("div", "comment__item");
                commentItem.setAttribute('data-comment-id', `${comment.id}`);
                const commentAvatar = createHtmlElement("img", "comment__avatar", "", commentItem) as HTMLImageElement;;
                const commentContent = createHtmlElement("div", "comment__content", "", commentItem);
                const commentHeader = createHtmlElement("div", "comment__header", "", commentContent);
                const commentUsername = createHtmlElement("span", "comment__username", comment.author, commentHeader);
                const commentText = createHtmlElement("p", "comment__text", comment.text, commentContent);
                const commentDate = createHtmlElement("span", "comment__date", `${getTimeDifference(comment.date)}`, commentContent);
                const editButton = createHtmlElement('button', 'edit__btn', '', commentItem);
                const crossButton = createHtmlElement('button', 'cross__btn', '', commentItem);
                const likeButton = createHtmlElement("button", "like__btn-reply", '', commentItem);
                if (comment.likes > 0) {
                    likeButton.classList.add('like__btn-reply-active');
                }
                const likeCounter = createHtmlElement("span", "like__counter-reply", '', likeButton);
                likeCounter.textContent = (comment.likes === 0) ? "" : comment.likes.toString();
                if (comment.liked === `${user?.uid}-true`) {
                    likeButton.classList.add('liked__comment');
                    likeCounter.style.color = 'rgb(255, 51, 71)';
                }
                commentItem.addEventListener('mouseover', () => {
                    if (commentText.childElementCount === 3) {
                        crossButton.classList.remove('cross__btn-active');
                        editButton.classList.remove('edit__btn-active');
                        likeButton.classList.remove('like__btn-reply-active');
                    }
                    else {
                        crossButton.classList.add('cross__btn-active');
                        editButton.classList.add('edit__btn-active');
                        likeButton.classList.add('like__btn-reply-active');
                    }

                });
                commentItem.addEventListener('mouseout', () => {
                    crossButton.classList.remove('cross__btn-active');
                    editButton.classList.remove('edit__btn-active');
                    likeButton.classList.remove('like__btn-reply-active');
                });

                crossButton.addEventListener('click', () => {
                    commentItem.remove();
                    commentCounter.textContent = (Number(commentCounter.textContent) - 1 === 0) ? '' : (Number(commentCounter.textContent) - 1).toString();
                    database.ref(`posts/${postId}/comments/${comment.id}`).remove();
                    if (commentsContainer.childElementCount === 0) {
                        commentsContainer.classList.remove('comments__container-active');
                    }
                })

                editButton.addEventListener('click', () => {
                    const textArea = createHtmlElement("textarea", 'reply__textarea') as HTMLTextAreaElement;
                    const cancelBtn = createHtmlElement("button", 'cancel__btn', 'Cancel') as HTMLButtonElement;
                    const saveBtn = createHtmlElement("button", 'save__btn', 'Save') as HTMLButtonElement;
                    const commentTextValue = commentText.textContent;
                    if (commentTextValue) {
                        textArea.value = commentTextValue;
                    }
                    const previousText = commentText.textContent;
                    const previousDate = commentDate.textContent;
                    commentText.textContent = "";
                    commentDate.textContent = "";
                    commentText.appendChild(textArea);
                    commentText.appendChild(cancelBtn);
                    commentText.appendChild(saveBtn);
                    textArea.focus();

                    cancelBtn.addEventListener('click', () => {
                        textArea.remove();
                        cancelBtn.remove();
                        saveBtn.remove();
                        commentText.textContent = previousText;
                        commentDate.textContent = previousDate;
                    })

                    saveBtn.addEventListener('click', () => {
                        textArea.remove();
                        cancelBtn.remove();
                        saveBtn.remove();
                        commentText.textContent = textArea.value;
                        commentDate.textContent = previousDate;
                        editComment(postId, comment.id, textArea.value);
                    })
                })

                likeButton.addEventListener('click', () => {
                    let likes = comment.likes;
                    let liked = comment.liked;
                    if (liked === `${user?.uid}-false`) {
                        liked = `${user?.uid}-true`
                        likes++;
                    } else {
                        liked = `${user?.uid}-false`
                        likes--;
                    }
                    database.ref(`posts/${postId}/comments/${comment.id}`).update({
                        likes,
                        liked
                    });
                })

                commentAvatar.src = comment.logo;
                commentsContainer.append(commentItem);
            });
        });
}

