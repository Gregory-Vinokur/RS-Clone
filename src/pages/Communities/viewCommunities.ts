import Page from '../Template/page';
import { createHtmlElement } from '../../utils/createElement';
import cat_logo from '../../../assets/img/cat_logo.jpg';
import meme_logo from '../../../assets/img/meme_logo.jpg';
import sport_logo from '../../../assets/img/sport_logo.jpg';
import cats_cover from '../../../assets/img/cats_cover.jpg';
import meme_cover from '../../../assets/img/meme_cover.jpg';
import sport_cover from '../../../assets/img/sport_cover.jpg';
import { loadPosts } from '../../data/news_api/load_post';
import { Lang, LANGTEXT } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import throttle from '../../utils/throttle';
import { loadMorePosts } from './../../data/news_api/load_more_posts';
import qs from 'query-string';
import { PATH } from '../../app/app';
import { database } from './../../server/firebaseAuth';
import { IFollower } from './../../interfaces/IFollower';
import { generateCatsPost } from './../../data/news_api/cats_api';
import { generateMemePost } from './../../data/news_api/memes_api';
import { generateSportPost } from './../../data/news_api/sport_api';
type EmitsName = 'navigate';

export default class ViewerCommunities extends Page {
    postsLimit: number;
    lang: Lang;
    user: TypeUser;
    emit(event: EmitsName, data?: number | string) {
        return super.emit(event, data);
    }

    on(event: EmitsName, callback: ((data: string) => void) | ((data: number) => void)) {
        return super.on(event, callback);
    }
    constructor(id: string, lang: Lang, user: TypeUser) {
        super(id);
        this.postsLimit = 10;
        this.lang = lang;
        this.user = user;
        this.mainWrapper.className = 'communities__wrapper';
        const catsCommunityBlock = this.createCommunityBlock(cat_logo, 'Cats images', `${LANGTEXT['animals'][lang]}`, 'cats_images');
        const memesCommunityBlock = this.createCommunityBlock(meme_logo, 'Memes', `${LANGTEXT['humor'][lang]}`, 'memes');
        const sportCommunityBlock = this.createCommunityBlock(sport_logo, 'Sport News', `${LANGTEXT['public_page'][lang]}`, 'sport_news');

    }

    createCommunityBlock(logoSrc: string, title: string, group: string, community_name: string) {
        const communityBlock = createHtmlElement('div', 'community__block');
        const communityLogo = createHtmlElement('img', 'community__logo', '', communityBlock) as HTMLImageElement;
        communityLogo.src = logoSrc;

        communityLogo.addEventListener('click', (e: Event) => {
            const { target } = e;
            if ((target as HTMLImageElement).src === cat_logo) {
                this.createCommunityPage(cat_logo, 'Cats images', cats_cover, 'cats_images');
            }
            if ((target as HTMLImageElement).src === meme_logo) {
                this.createCommunityPage(meme_logo, 'Memes', meme_cover, 'memes');
            }
            if ((target as HTMLImageElement).src === sport_logo) {
                this.createCommunityPage(sport_logo, 'Sport News', sport_cover, 'sport_news');
            }
        });

        const communityInfo = createHtmlElement('div', 'community__info', '', communityBlock);
        const communityTitle = createHtmlElement('a', 'community__title', title, communityInfo);

        communityTitle.addEventListener('click', (e: Event) => {
            const { target } = e;
            if ((target as HTMLImageElement).textContent === 'Cats images') {
                this.createCommunityPage(cat_logo, 'Cats images', cats_cover, 'cats_images');
            }
            if ((target as HTMLImageElement).textContent === 'Memes') {
                this.createCommunityPage(meme_logo, 'Memes', meme_cover, 'memes');
            }
            if ((target as HTMLImageElement).textContent === 'Sport News') {
                this.createCommunityPage(sport_logo, 'Sport News', sport_cover, 'sport_news');
            }
        });

        const communityGroup = createHtmlElement('span', 'community__group', group, communityInfo);
        const communityFollowers = createHtmlElement('span', 'community__followers', '', communityInfo);
        database.ref(`communities/${community_name}/followers`).once("value", (snapshot) => {
            const followers = snapshot.val();
            const followersText = createHtmlElement('span', 'followers__text');
            if (Object.keys(followers).length === 1) {
                followersText.textContent = `${LANGTEXT['follower'][this.lang]}`
            }
            if (Object.keys(followers).length > 1) {
                followersText.textContent = `${LANGTEXT['followers'][this.lang]}`
            }
            if (followers) {
                const followersNumber = createHtmlElement('span', 'followers__number');
                followersNumber.textContent = Object.keys(followers).length.toString();
                communityFollowers.append(followersNumber);
                communityFollowers.append(followersText);
            }
        });
        this.mainWrapper.append(communityBlock);
    }

    createCommunityPage(logoSrc: string, title: string, coverSrc: string, community_name: string) {
        const params = qs.parse(window.location.search);
        params.community_name = community_name;
        const search = qs.stringify(params);
        window.history.pushState({}, 'path', window.location.origin + window.location.pathname + `${search ? '?' + search : ''}`);
        const communityPage = createHtmlElement('div', 'community__page');
        const communityPageInfo = createHtmlElement('div', 'community__page-info', '', communityPage);
        const communityPageLogo = createHtmlElement('img', 'community__page-logo', '', communityPageInfo) as HTMLImageElement;
        communityPageLogo.src = logoSrc;
        const communityPageBtnWrap = createHtmlElement('div', 'community__page-btn-wrap', '', communityPageInfo);
        const communityPageTitle = createHtmlElement('span', 'community__page-title', title, communityPageBtnWrap);
        const followStatus = createHtmlElement('span', 'community__page-follow-status', `${LANGTEXT['following'][this.lang]}`, communityPageBtnWrap);
        followStatus.id = 'follow__status'
        const followButton = createHtmlElement('button', 'follow__btn', '', communityPageBtnWrap) as HTMLButtonElement;

        const userUid = this.user?.uid;

        if (userUid) {
            const communityRef = database.ref(`communities/${community_name}`);

            communityRef.child('followers').once('value', (snapshot) => {
                const followers = snapshot.val() || {};

                if (userUid in followers) {
                    followStatus.classList.add('followed');
                    followButton.textContent = `${LANGTEXT['unfollowBtn'][this.lang]}`;
                } else {
                    followStatus.classList.remove('followed');
                    followButton.textContent = `${LANGTEXT['followBtn'][this.lang]}`;
                }
            });
        }

        followButton.addEventListener('click', () => {
            const userUid = this.user?.uid;

            if (!userUid) {
                return;
            }

            const communityRef = database.ref(`communities/${community_name}`);

            communityRef.child('followers').once('value', (snapshot) => {
                const followers = snapshot.val() || {};

                if (followButton.textContent === LANGTEXT['followBtn'][this.lang]) {
                    followStatus.classList.add('followed');
                    followButton.textContent = `${LANGTEXT['unfollowBtn'][this.lang]}`;
                    followers[userUid] = true;
                } else {
                    followStatus.classList.remove('followed');
                    followButton.textContent = `${LANGTEXT['followBtn'][this.lang]}`;
                    delete followers[userUid];
                }

                const followerCount = Object.keys(followers).length;
                followersCount.textContent = followerCount === 0 ? '' : followerCount.toString();

                communityRef.update({ followers });
            });
        });

        const communityCover = createHtmlElement('div', 'community__page-cover', '', communityPage);
        const communityCoverImg = createHtmlElement('img', 'community__page-cover-img', '', communityCover) as HTMLImageElement;
        communityCoverImg.src = coverSrc;
        const communityHeader = createHtmlElement('div', 'community__page-header', '', communityPage);
        const communityMainContent = createHtmlElement('div', 'community__page-content', '', communityPage);
        const communityMainContentWrap = createHtmlElement('div', 'community__page-content-wrap', '', communityMainContent);
        const generatePostBtn = createHtmlElement('button', 'generate__posts', `${LANGTEXT['generatePost'][this.lang]}`, communityMainContentWrap);

        generatePostBtn.addEventListener('click', async () => {
            const params = qs.parse(window.location.search);
            if (params.community_name === 'cats_images') {
                generateCatsPost().then(() => {
                    setTimeout(() => loadPosts(communityPosts, this.postsLimit, this.lang, this.user, title), 1000)
                })
            }
            if (params.community_name === 'memes') {
                generateMemePost().then(() => {
                    setTimeout(() => loadPosts(communityPosts, this.postsLimit, this.lang, this.user, title), 1000)
                })
            }
            if (params.community_name === 'sport_news') {
                generateSportPost().then(() => {
                    setTimeout(() => loadPosts(communityPosts, this.postsLimit, this.lang, this.user, title), 1000)
                })
            }
        })
        const communityPosts = createHtmlElement('div', 'community__page-posts', '', communityMainContentWrap);
        loadPosts(communityPosts, this.postsLimit, this.lang, this.user, title);
        document.body.addEventListener("scroll", throttle(async () => loadMorePosts(this.lang, this.user, communityPosts, title), 500));
        const communityFollowers = createHtmlElement('div', 'community__page-followers', '', communityMainContent);
        const communityFollowersTextWrap = createHtmlElement('p', 'community__page-followers-text-wrap', '', communityFollowers);
        const communityFollowersText = createHtmlElement('p', 'community__page-followers-text', `${LANGTEXT['followersText'][this.lang]}`, communityFollowersTextWrap);
        const followersCount = createHtmlElement('span', 'community__page-followers-count', ``, communityFollowersTextWrap);
        const followersWrap = createHtmlElement('div', 'community__page-followers-wrap', '', communityFollowers);

        const communityFollowersSmall = createHtmlElement('div', 'community__page-followers-small', '', communityPageBtnWrap);
        const communityFollowersTextWrapSmall = createHtmlElement('p', 'community__page-followers-text-wrap-small', '', communityFollowersSmall);
        const communityFollowersTextSmall = createHtmlElement('p', 'community__page-followers-text', `${LANGTEXT['followersText'][this.lang]}`, communityFollowersTextWrapSmall);
        const followersCountSmall = createHtmlElement('span', 'community__page-followers-count', ``, communityFollowersTextWrapSmall);
        const followersWrapSmall = createHtmlElement('div', 'community__page-followers-wrap', '', communityFollowersSmall);

        communityFollowersTextWrapSmall.addEventListener('click', () => {
            followersWrapSmall.classList.toggle('visible')
        })

        const followersRef = database.ref(`communities/${community_name}/followers`);

        followersRef.on('value', (snapshot) => {
            const followers = snapshot.val() || {};
            const followerCount = Object.keys(followers).length;
            followersCount.textContent = followerCount === 0 ? '' : followerCount.toString();
            followersCountSmall.textContent = followerCount === 0 ? '' : followerCount.toString();

            followersWrap.innerHTML = '';
            followersWrapSmall.innerHTML = '';

            Object.keys(followers).forEach((followerUid) => {
                const followerRef = database.ref(`users/${followerUid}`);
                followerRef.once('value', (snapshot) => {
                    const followerData = snapshot.val();
                    if (followerData) {
                        const followerItem = this.createFollower(followerData);
                        followerItem.id = followerUid;
                        followersWrap.append(followerItem);
                    }
                });
            });

            Object.keys(followers).forEach((followerUid) => {
                const followerRef = database.ref(`users/${followerUid}`);
                followerRef.once('value', (snapshot) => {
                    const followerData = snapshot.val();
                    if (followerData) {
                        const followerItem = this.createFollower(followerData);
                        followersWrapSmall.append(followerItem);
                    }
                });
            });
        });
        this.mainWrapper.innerHTML = '';
        this.mainWrapper.style.background = 'transparent';
        this.mainWrapper.style.border = 'none';
        this.mainWrapper.style.boxShadow = 'none';
        this.mainWrapper.append(communityPage);
    }

    createFollower(followerData: IFollower) {
        const followerItem = createHtmlElement('div', 'community__page-followers-item');
        const followerAvatar = createHtmlElement('img', 'community__page-follower-avatar', '', followerItem) as HTMLImageElement;
        followerAvatar.src = followerData.userAvatar;
        const followerName = createHtmlElement('div', 'community__page-follower-name', `${followerData.userName}`, followerItem);

        followerItem.addEventListener('click', () => {
            const url = `${window.location.origin}/profile?id=${followerItem.id}`;
            window.history.pushState({}, '', url);
            window.location.href = url;
        })
        return followerItem;
    }

}