import './footer.css';
import { createHtmlElement } from '../../utils/createElement';

export default class Footer {
  createFooter(): HTMLElement {
    const element = createHtmlElement('footer', '', '', document.body);
    const wrapper = createHtmlElement('div', 'footer__wrap', '', element);
    const socials = createHtmlElement('div', 'socials', '', wrapper);
    const githubLinks = createHtmlElement('div', 'github__links', '', socials);
    const githubLink1 = createHtmlElement('a', 'footer__logo__link', '', githubLinks);
    githubLink1.setAttribute('target', '_blank');
    githubLink1.setAttribute('href', 'https://github.com/M0rl0ck');
    createHtmlElement('div', 'github__img', '', githubLink1);
    createHtmlElement('span', 'github__text', 'SERGEY SERGEEV', githubLink1);
    const githubLink2 = createHtmlElement('a', 'footer__logo__link', '', githubLinks);
    githubLink2.setAttribute('target', '_blank');
    githubLink2.setAttribute('href', 'https://github.com/artemkamyshenkov');
    createHtmlElement('div', 'github__img', '', githubLink2);
    createHtmlElement('span', 'github__text', 'artemkamyshenkov', githubLink2);
    const githubLink3 = createHtmlElement('a', 'footer__logo__link', '', githubLinks);
    githubLink3.setAttribute('target', '_blank');
    githubLink3.setAttribute('href', 'https://github.com/Gregory-Vinokur');
    createHtmlElement('div', 'github__img', '', githubLink3);
    createHtmlElement('span', 'github__text', 'Gregory-Vinokur', githubLink3);
    const footerYear = createHtmlElement('div', 'footer__year', '', socials);
    const footerText = createHtmlElement('p', 'footer__text', '2023 ® ', footerYear);
    const rsLink = createHtmlElement('a', 'footer__logo__link', '', footerYear);
    rsLink.setAttribute('target', '_blank');
    rsLink.setAttribute('href', 'https://rs.school/js/');
    const rsImg = createHtmlElement('div', 'rs__img', '', rsLink);
    return element;
  }
}
