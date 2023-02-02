import { EventEmitter } from 'events';
import { createHtmlElement } from '../../utils/createElement';

export default abstract class Page extends EventEmitter {
  mainWrapper: HTMLElement;
  constructor(id: string) {
    super();
    this.mainWrapper = createHtmlElement('div', 'main__wrapper');
    this.mainWrapper.id = id;
  }

  render() {
    return this.mainWrapper;
  }
}
