import { database } from '../../server/firebaseAuth';
import sport_logo from '../../../assets/img/sport_logo.jpg';

async function loadSportNews() {
    const apiKey = '7c9fb6fc26e645ae8262723d2624e6d8';
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=gb&category=sports&apiKey=${apiKey}`);
    const data = await response.json();
    return data.articles;
}

let postCount = 0;
let intervalId: NodeJS.Timeout;

export const loadSportPosts = () => {
    intervalId = setInterval(() => {
        if (postCount === 10) {
            clearInterval(intervalId);
            return;
        }
        loadSportNews()
            .then((articles) => {
                const article = articles[Math.floor(Math.random() * articles.length)];
                const data = {
                    author: "Sport News",
                    date: Date.now(),
                    text: article.title,
                    image: article.urlToImage,
                    likes: 0,
                    shares: 0,
                    logo: sport_logo,
                    comments: [],
                    liked: '',
                    reposted: "",
                    id: ""
                };

                return database.ref("posts/").push(data);
            })
            .then((response) => {
                console.log("Post saved successfully: ", response);
                postCount += 1;
            })
            .catch((error) => {
                console.error("Error saving post: ", error);
            });
    }, 3600 * 1000);
};
