import { database } from './../../server/firebaseAuth';
import cat_logo from '../../../assets/img/cat_logo.jpg'

async function loadCats() {
    const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=5');
    const data = await response.json();
    return data[0].url;
}

export const loadCatsPosts = async () => {
    setInterval(async function () {
        const image = await loadCats();
        const data = {
            author: "Cats images",
            date: Date.now(),
            text: "We love cats!",
            image,
            likes: 0,
            shares: 0,
            logo: cat_logo,
            comments: []

        };

        database
            .ref("posts/")
            .push(data)
            .then((data) => {
                console.log("Post saved successfully: ", data);
            })
            .catch((error) => {
                console.error("Error saving post: ", error);
            });
    }, 60 * 1000);
}