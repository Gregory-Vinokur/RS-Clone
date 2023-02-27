import { database } from '../../server/firebaseAuth';
import sport_logo from '../../../assets/img/sport_logo.jpg';

async function loadSportNews() {
    const apiKey = '7c9fb6fc26e645ae8262723d2624e6d8';
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=gb&category=sports&apiKey=${apiKey}`);
    const data = await response.json();
    return data.articles;
}

export const generateSportPost = async () => {
    try {
        const articles = await loadSportNews();
        if (!articles || articles.length === 0) {
            throw new Error('No sports news found');
        } else if (articles || articles.length > 0) {
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
            const response = await database.ref("posts/").push(data);
            console.log("Post saved successfully: ", response);
        }
    } catch (error) {
        console.error("Error generating sport post: ", error);
    }
};

