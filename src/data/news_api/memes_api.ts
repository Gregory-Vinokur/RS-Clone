import { database } from './../../server/firebaseAuth';
import meme_logo from '../../../assets/img/meme_logo.jpg';

async function loadMemes() {
    const apiKey = '2a25a018d93b4bd394670cafc376ca6e';
    const response = await fetch(`https://api.humorapi.com/memes/random?api-key=${apiKey}&keywords=programming`);
    const data = await response.json();
    return data.url;
}

export const generateMemePost = async () => {
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
                liked: '',
                reposted: "",
                id: ""
            };

            return database.ref("posts/").push(data);
        })
        .then((response) => {
            console.log("Post saved successfully: ", response);
        })
        .catch((error) => {
            console.error("Error saving post: ", error);
        });
}
