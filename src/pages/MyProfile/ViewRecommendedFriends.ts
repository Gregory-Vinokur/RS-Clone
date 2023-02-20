import { createHtmlElement } from '../../utils/createElement';
import ModelProfile from './ModelProfile';
import defaultAva from '../../../assets/img/default-ava.jpg';

export default class ViewRecommendedFriends {
  element: HTMLElement;
  model: ModelProfile;
  constructor(model: ModelProfile) {
    this.model = model;
    this.element = createHtmlElement('div', 'recommended__friends', '');
    this.renderRecommendedFriends();
  }

  async renderRecommendedFriends() {
    const allUsers = Object.keys(await this.model.getAllUsers());
    const user = await this.model.getUserInfo(this.model.user?.uid as string);
    const maxLength = 7;

    if (user.userSubscripts !== undefined) {
      const userSubscripts = Object.keys(user.userSubscripts);
      userSubscripts.push(this.model.user?.uid as string); // Текущий ID добавляется в массив подписок, чтобы пользователь не рекомендовался сам себе
      const recommendedFriends = allUsers.filter((user) => {
        return userSubscripts.indexOf(user) === -1;
      });
      const limitRecommendedFriends = recommendedFriends.slice(0, maxLength);

      limitRecommendedFriends.forEach(async (userId) => {
        const userPage = await this.model.getUserInfo(userId);
        const onlyName = userPage.userName.split(' ').slice(0, 1).join('');

        const userInfoWrapper = createHtmlElement('div', 'recommended__friends_content', '', this.element);
        userInfoWrapper.id = `${userPage.userId}`;
        const userAva = createHtmlElement('img', 'recommended__friends_ava', '', userInfoWrapper);
        const userName = createHtmlElement('div', 'recommended__friends_name', '', userInfoWrapper);
        userName.textContent = `${onlyName || 'Иван'}`;
        (userAva as HTMLImageElement).src = `${userPage.userAvatar || defaultAva}`;
      });
    } else {
      const userInfoWrapper = createHtmlElement('div', 'profile__friends_empty', 'Рекомендованных подписок нет', this.element);
    }
  }

  render(): HTMLElement {
    return this.element;
  }
}
