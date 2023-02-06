import './app.css';
import ModelApp from './Model-app';
import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';
import { createHtmlElement } from '../utils/createElement';
import ErrorPage from './../pages/ErrorPage/errorPage';
import LoginPage from './../pages/Login/login';
import Navbar from './../components/Navbar/navbar';
import myProfile from './../pages/MyProfile/myProfile';
import Messages from './../pages/Messages/Messages';
import { CLASSTHEME, Lang, THEME } from '../constans/constans';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import NewsPage from './../pages/News/news';

const LANG = 'LANG';

export const PATH = {
  login: '/',
  errorPage: '/404',
  profilePage: '/profile',
  messagesPage: '/messages',
  newsPage: '/news'
};

class App {
  private wrapper: HTMLElement;
  private container: HTMLElement;
  private navbarWrap: HTMLElement;
  private routes;
  user: User | null;
  page: LoginPage | ErrorPage | myProfile | Messages | NewsPage | null;
  header: Header;
  navbar: Navbar;
  model: ModelApp;
  lang: Lang;
  constructor() {
    this.page = null;
    this.user = null;
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        this.user = user;
      } else {
        // User is signed out
        this.user = null;
      }
      this.loadPages();
    });
    const lang = localStorage.getItem(LANG);
    this.lang = lang === 'eng' || lang === 'rus' ? lang : 'eng';
    const theme = localStorage.getItem(THEME);
    if (theme === CLASSTHEME) {
      document.body.classList.add(CLASSTHEME);
    }
    this.model = new ModelApp(this.lang, this.user);
    this.header = new Header(this.model);
    this.navbar = new Navbar(this.model);
    this.header.on('changeLang', this.changeLang);
    this.wrapper = createHtmlElement('main', 'main__wrapper', '', document.body);
    this.navbarWrap = this.navbar.render();
    this.wrapper.append(this.navbarWrap);
    this.container = createHtmlElement('div', 'main__content', '', this.wrapper);
    const footer = new Footer();
    footer.createFooter();
    this.routes = {
      [PATH.login]: this.loginPage,
      [PATH.errorPage]: this.errorPage,
      [PATH.profilePage]: this.profilePage,
      [PATH.messagesPage]: this.messagesPage,
      [PATH.newsPage]: this.newsPage,
    };

    window.addEventListener('popstate', this.loadPages);
    this.header.on('navigate', this.navigate);
    this.navbar.on('navigate', this.navigate);
  }

  loadPages = () => {
    if (this.user) {
      const path = window.location.pathname.split('/').slice(0, 2).join('/');
      if (this.routes[path]) {
        this.routes[path]();
      } else {
        window.history.pushState({}, 'path', window.location.origin + PATH.errorPage);
        this.routes[PATH.errorPage]();
      }
    } else {
      this.routes[PATH.login]();
    }
  };

  navigate = (path: string) => {
    window.history.pushState({}, 'path', window.location.origin + path);
    this.routes[path.split('/').slice(0, 2).join('/')]();
  };
  private loginPage = async () => {
    this.container.innerHTML = '';
    const main = new LoginPage(PATH.login);
    this.page = main;
    main.on('navigate', this.navigate);
    this.container.append(main.render());
    this.navbarWrap.style.display = 'none';
  };
  private errorPage = () => {
    this.container.innerHTML = '';
    const page = new ErrorPage(PATH.errorPage);
    this.page = page;
    this.container.append(page.render());
  };
  private profilePage = () => {
    this.container.innerHTML = '';
    const page = new myProfile(PATH.profilePage, this.lang, this.user);
    this.page = page;
    this.container.append(page.render());
    this.navbarWrap.style.display = 'block';
  };

  private messagesPage = () => {
    this.container.innerHTML = '';
    const page = new Messages(PATH.messagesPage, this.lang, this.user);
    this.page = page;
    this.container.append(page.render());
  };

  private newsPage = () => {
    this.container.innerHTML = '';
    const page = new NewsPage(PATH.newsPage);
    this.page = page;
    this.container.append(page.render());
  };

  changeLang = () => {
    if (this.lang === 'eng') {
      this.lang = 'rus';
    } else {
      this.lang = 'eng';
    }
    localStorage.setItem(LANG, this.lang);
    this.model.changeLang(this.lang);
    this.page?.changeLang(this.lang);
  };
}

export default App;
