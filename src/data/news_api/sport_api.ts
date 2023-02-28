import { database } from '../../server/firebaseAuth';
import sport_logo from '../../../assets/img/sport_logo.jpg';

async function loadSportNewsSources() {
    const apiKey = 'BWEFPCAvgxeSrSfqEIYkU855j-QX3LzB8pg9AEUpePQ';
    const response = await fetch(`https://api.newscatcherapi.com/v2/latest_headlines?countries=GB&topic=sport`, {
        headers: {
            'x-api-key': apiKey
        }
    });
    const data = await response.json();
    return data.articles;
}

export const generateSportPost = async () => {
    try {
        const sources = await loadSportNewsSources();
        if (!sources || sources.length === 0) {
            throw new Error('No sports news sources found');
        }
        const source = sources[Math.floor(Math.random() * sources.length)];
        const post = {
            author: "Sport News",
            date: Date.now(),
            text: source.title,
            image: source.media || source.image,
            likes: 0,
            shares: 0,
            logo: sport_logo,
            comments: [],
            liked: '',
            reposted: "",
            id: ""
        };
        const postRef = database.ref("posts/").push();
        await postRef.set(post);
        console.log("Post saved successfully: ", postRef.key);
    } catch (error) {
        console.error("Error generating sport post: ", error);
    }
};


