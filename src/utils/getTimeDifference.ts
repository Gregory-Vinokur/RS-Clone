export const getTimeDifference = (timestamp: number) => {
    const now = Date.now();
    const difference = now - timestamp;
    const seconds = Math.floor(difference / 1000);
    const lang = localStorage.getItem('LANG');
    if (lang === 'eng') {
        if (seconds < 60) {
            if (seconds === 1) {
                return `1 second ago`;
            }
            return seconds === 0 ? 'right now' : `${seconds} seconds ago`;
        }
        const minutes = Math.floor(difference / 1000 / 60);
        if (minutes < 60) {
            if (minutes === 1) {
                return `1 minute ago`;
            }
            return `${minutes} minutes ago`;
        }
        const hours = Math.floor(difference / 1000 / 60 / 60);
        if (hours < 24) {
            if (hours === 1) {
                return `1 hour ago`;
            }
            return `${hours} hours ago`;
        }
        const days = Math.floor(difference / 1000 / 60 / 60 / 24);
        if (days === 1) {
            return `1 day ago`;
        }
        return `${days} days ago`;
    } else if (lang === 'rus') {
        if (seconds < 60) {
            if (seconds === 1) {
                return `1 секунду назад`;
            }
            if (seconds >= 2 && seconds <= 4) {
                return `${seconds} секунды назад`;
            }
            return `${seconds} секунд назад`;
        }
        const minutes = Math.floor(difference / 1000 / 60);
        if (minutes < 60) {
            if (minutes === 1) {
                return `1 минуту назад`;
            }
            if (minutes >= 2 && minutes <= 4) {
                return `${minutes} минуты назад`;
            }
            return `${minutes} минут назад`;
        }
        const hours = Math.floor(difference / 1000 / 60 / 60);
        if (hours < 24) {
            if (hours === 1) {
                return `1 час назад`;
            }
            if (hours >= 2 && hours <= 4) {
                return `${hours} часа назад`;
            }
            return `${hours} часов назад`;
        }
        const days = Math.floor(difference / 1000 / 60 / 60 / 24);
        if (days === 1) {
            return `1 день назад`;
        }
        if (days >= 2 && days <= 4) {
            return `${days} дня назад`;
        }
        return `${days} дней назад`;
    }
}