export const getTimeDifference = (timestamp: number) => {
    const now = Date.now();
    const difference = now - timestamp;
    const seconds = Math.floor(difference / 1000);
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
}