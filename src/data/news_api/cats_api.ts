import { database } from './../../server/firebaseAuth';
import cat_logo from '../../../assets/img/cat_logo.jpg'

async function loadCats() {
    const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=5');
    const data = await response.json();
    return data[0].url;
}

let postCount = 0;
let intervalId: NodeJS.Timer;

export const loadCatsPosts = () => {
    intervalId = setInterval(() => {
        if (postCount === 10) {
            clearInterval(intervalId);
        } else {
            postCount++;
            loadCats()
                .then((image) => {
                    const data = {
                        author: "Cats images",
                        date: Date.now(),
                        text: "We love cats!",
                        image,
                        likes: 0,
                        shares: 0,
                        logo: cat_logo,
                        comments: [],
                        liked: "",
                        reposted: ""
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
    }, 60 * 1000);
};
