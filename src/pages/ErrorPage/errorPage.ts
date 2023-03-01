import './errorPage.css';
import { createHtmlElement } from '../../utils/createElement';
import Page from '../Template/page';
import { Lang, LANGTEXT } from '../../constans/constans';

export default class ErrorPage extends Page {
  errorText: HTMLElement;
  constructor(id: string, lang: Lang) {
    super(id);
    this.mainWrapper.className = 'error__wrap';
    this.errorText = createHtmlElement('h1', 'error__text', `${LANGTEXT['errorPageText'][lang]}`, this.mainWrapper);
  }

  changeLang = (lang: Lang) => {
    this.errorText.textContent = LANGTEXT['errorPageText'][lang];
  };

  render(): HTMLElement {
    return this.mainWrapper;
  }
}
