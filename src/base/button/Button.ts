import Model from '../../pages/Template/Model';
import { createHtmlElement } from '../../utils/createElement';
import './button.css';
import { LANGTEXT, LangNameElement } from '../../constans/constans';

export default class Button<T extends Model> {
  element: HTMLElement;
  model: T;
  name: LangNameElement;
  constructor(name: LangNameElement, model: T, callback: () => void) {
    this.name = name;
    this.element = createHtmlElement('div', `button button_${name}`);
    this.model = model;
    this.changeLang();
    this.element.addEventListener('click', callback);
  }

  changeLang = () => {
    this.element.innerText = LANGTEXT[this.name][this.model.lang];
  };

  render = () => this.element;
}
