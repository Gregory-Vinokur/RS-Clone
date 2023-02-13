
import { database } from './../../server/firebaseAuth';

export const editComment = (postId: string, commentId: string | null, newComment: string) => {
    if (postId && commentId) {
        database.ref(`posts/${postId}/comments/${commentId}`).update({ text: newComment });
    }
};
