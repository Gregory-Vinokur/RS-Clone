import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';
import { createHtmlElement } from '../utils/createElement';
import ErrorPage from './../pages/ErrorPage/errorPage';
import LoginPage from './../pages/Login/login';
import Navbar from './../components/Navbar/navbar';
import myProfile from './../pages/MyProfile/myProfile';

export const PATH = {
    login: '/',
    errorPage: '/404',
    profilePage: '/profile'
};

class App {
    private container: HTMLElement;
    private routes;
    header: Header;
    navbar: Navbar;
    constructor() {
        this.header = new Header();
        this.navbar = new Navbar();
        this.container = createHtmlElement('main', 'main__content', '', document.body);
        const footer = new Footer();
        footer.createFooter();
        this.routes = {
            [PATH.login]: this.loginPage,
            [PATH.errorPage]: this.errorPage,
            [PATH.profilePage]: this.profilePage,
        };

        window.addEventListener('popstate', () => {
            this.routes[window.location.pathname.split('/').slice(0, 2).join('/')]();
        });
        window.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname.split('/').slice(0, 2).join('/');
            if (this.routes[path]) {
                this.routes[path]();
            } else {
                window.history.pushState({}, 'path', window.location.origin + PATH.errorPage);
                this.routes[PATH.errorPage]();
            }
        });

        this.header.on('navigate', this.navigate);
        this.navbar.on('navigate', this.navigate);
    }

    navigate = (path: string) => {
        window.history.pushState({}, 'path', window.location.origin + path);
        this.routes[path.split('/').slice(0, 2).join('/')]();
    };
    private loginPage = async () => {
        this.container.innerHTML = '';
        const main = new LoginPage(PATH.login);
        this.container.append(main.render());
    };
    private errorPage = () => {
        this.container.innerHTML = '';
        const page = new ErrorPage(PATH.errorPage);
        this.container.append(page.render());
    };
    private profilePage = () => {
        this.container.innerHTML = '';
        const page = new myProfile(PATH.profilePage);
        this.container.append(page.render());
    };
}

export default App;
