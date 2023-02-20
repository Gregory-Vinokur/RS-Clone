import Page from '../Template/page';
import { createHtmlElement } from '../../utils/createElement';
import cat_logo from '../../../assets/img/cat_logo.jpg';
import meme_logo from '../../../assets/img/meme_logo.jpg';
import sport_logo from '../../../assets/img/sport_logo.jpg';
import cats_cover from '../../../assets/img/cats_cover.jpg';
import meme_cover from '../../../assets/img/meme_cover.jpg';
import sport_cover from '../../../assets/img/sport_cover.jpg';
import { loadPosts } from '../../data/news_api/load_post';
import { Lang } from '../../constans/constans';
import { TypeUser } from '../../constans/types';
import throttle from '../../utils/throttle';
import { loadMorePosts } from './../../data/news_api/load_more_posts';
import qs from 'query-string';
import { PATH } from '../../app/app';
import { database } from './../../server/firebaseAuth';
import { IFollower } from './../../interfaces/IFollower';
import { loadCatsPosts } from './../../data/news_api/cats_api';
import { loadMemePosts } from './../../data/news_api/memes_api';
import { loadSportPosts } from './../../data/news_api/sport_api';
type EmitsName = 'navigate';

export default class ViewerCommunities extends Page {
    postsLimit: number;
    postsCount: number;
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
        this.postsCount = 0;
        this.lang = lang;
        this.user = user;
        this.mainWrapper.className = 'communities__wrapper';
        const catsCommunityBlock = this.createCommunityBlock(cat_logo, 'Cats images', 'Animals', 'cats_images');
        const memesCommunityBlock = this.createCommunityBlock(meme_logo, 'Memes', 'Humor', 'memes');
        const sportCommunityBlock = this.createCommunityBlock(sport_logo, 'Sport News', 'Public page', 'sport_news');

    }

    createCommunityBlock(logoSrc: string, title: string, group: string, community_name: string) {
        const communityBlock = createHtmlElement('div', 'community__block');
        const communityLogo = createHtmlElement('img', 'community__logo', '', communityBlock) as HTMLImageElement;
        communityLogo.src = logoSrc;

        communityLogo.addEventListener('click', (e: Event) => {
            const { target } = e;
            if ((target as HTMLImageElement).src === cat_logo) {
                loadCatsPosts();
                this.createCommunityPage(cat_logo, 'Cats images', cats_cover, 'cats_images');
            }
            if ((target as HTMLImageElement).src === meme_logo) {
                this.createCommunityPage(meme_logo, 'Memes', meme_cover, 'memes');
                loadMemePosts();
            }
            if ((target as HTMLImageElement).src === sport_logo) {
                this.createCommunityPage(sport_logo, 'Sport News', sport_cover, 'sport_news');
                loadSportPosts();
            }
        });

        const communityInfo = createHtmlElement('div', 'community__info', '', communityBlock);
        const communityTitle = createHtmlElement('a', 'community__title', title, communityInfo);

        communityTitle.addEventListener('click', (e: Event) => {
            const { target } = e;
            if ((target as HTMLImageElement).textContent === 'Cats images') {
                this.createCommunityPage(cat_logo, 'Cats images', cats_cover, 'cats_images');
                loadCatsPosts();
            }
            if ((target as HTMLImageElement).textContent === 'Memes') {
                this.createCommunityPage(meme_logo, 'Memes', meme_cover, 'memes');
                loadMemePosts();
            }
            if ((target as HTMLImageElement).textContent === 'Sport News') {
                this.createCommunityPage(sport_logo, 'Sport News', sport_cover, 'sport_news');
                loadSportPosts();
            }
        });

        const communityGroup = createHtmlElement('span', 'community__group', group, communityInfo);
        const communityFollowers = createHtmlElement('span', 'community__followers', '', communityInfo);
        database.ref(`communities/${community_name}/followers`).once("value", (snapshot) => {
            const followers = snapshot.val();
            let followersText = '';
            if (Object.keys(followers).length === 1) {
                followersText = ' follower'
            }
            if (Object.keys(followers).length > 1) {
                followersText = ' followers'
            }
            if (followers) {
                communityFollowers.textContent = Object.keys(followers).length.toString() + followersText;
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
        const followStatus = createHtmlElement('span', 'community__page-follow-status', '✔ Following', communityPageBtnWrap);
        const followButton = createHtmlElement('button', 'follow__btn', 'Follow', communityPageBtnWrap) as HTMLButtonElement;

        const userUid = this.user?.uid;

        if (userUid) {
            const communityRef = database.ref(`communities/${community_name}`);

            communityRef.child('followers').once('value', (snapshot) => {
                const followers = snapshot.val() || {};

                if (userUid in followers) {
                    followStatus.classList.add('followed');
                    followButton.textContent = 'Unfollow';
                } else {
                    followStatus.classList.remove('followed');
                    followButton.textContent = 'Follow';
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

                if (followButton.textContent === 'Follow') {
                    followStatus.classList.add('followed');
                    followButton.textContent = 'Unfollow';
                    followers[userUid] = true;
                } else {
                    followStatus.classList.remove('followed');
                    followButton.textContent = 'Follow';
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
        const communityPosts = createHtmlElement('div', 'community__page-posts', '', communityMainContent);
        loadPosts(communityPosts, this.postsLimit, this.lang, this.user, title);
        document.body.addEventListener("scroll", throttle(async () => loadMorePosts(this.lang, this.user, this.postsLimit, this.postsCount, communityPosts, title), 500));
        const communityFollowers = createHtmlElement('div', 'community__page-followers', '', communityMainContent);
        const communityFollowersText = createHtmlElement('p', 'community__page-followers-text', 'Followers', communityFollowers);
        const followersCount = createHtmlElement('span', 'community__page-followers-count', ``, communityFollowersText);
        const followersWrap = createHtmlElement('div', 'community__page-followers-wrap', '', communityFollowers);

        const followersRef = database.ref(`communities/${community_name}/followers`);

        followersRef.on('value', (snapshot) => {
            const followers = snapshot.val() || {};
            const followerCount = Object.keys(followers).length;
            followersCount.textContent = followerCount === 0 ? '' : followerCount.toString();

            followersWrap.innerHTML = '';

            Object.keys(followers).forEach((followerUid) => {
                const followerRef = database.ref(`users/${followerUid}`);
                followerRef.once('value', (snapshot) => {
                    const followerData = snapshot.val();
                    if (followerData) {
                        const followerItem = this.createFollower(followerData);
                        followersWrap.append(followerItem);
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
        return followerItem;
    }

}