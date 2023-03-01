const createHtmlElement = (type: string, newclass?: string, innerText?: string, parrent?: HTMLElement): HTMLElement => {
    const element = document.createElement(type);
    if (newclass) {
        element.className = newclass;
    }
    if (innerText) {
        element.innerText = innerText;
    }
    if (parrent) {
        parrent.append(element);
    }

    return element;
};

export { createHtmlElement };