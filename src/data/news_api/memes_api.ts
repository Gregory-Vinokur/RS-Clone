import { database } from './../../server/firebaseAuth';
import meme_logo from '../../../assets/img/meme_logo.jpg';

async function loadMemes() {
    const apiKey = 'ded0a8c7f5104062933a142cbdc9ef5c';
    const response = await fetch(`https://api.humorapi.com/memes/random?api-key=${apiKey}&keywords=programming&min-rating=10`);
    const data = await response.json();
    return data.url;
}

export const loadMemePosts = () => {
    setInterval(() => {
        loadMemes()
            .then((image) => {
                const data = {
                    author: "Memes",
                    date: Date.now(),
                    text: "Laugh with memes!",
                    image,
                    likes: 0,
                    shares: 0,
                    logo: meme_logo,
                    comments: [],
                    liked: ''
                };

                return database.ref("posts/").push(data);
            })
            .then((response) => {
                console.log("Post saved successfully: ", response);
            })
            .catch((error) => {
                console.error("Error saving post: ", error);
            });
    }, 1000);
};
