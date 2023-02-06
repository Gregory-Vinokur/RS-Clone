export const getTimeDifference = (timestamp: number) => {
    const now = Date.now();
    const difference = now - timestamp;
    const seconds = Math.floor(difference / 1000);
    if (seconds < 60) {
        return seconds === 0 ? 'right now' : `${seconds} seconds ago`;
    }
    const minutes = Math.floor(difference / 1000 / 60);
    if (minutes < 60) {
        return `${minutes} minutes ago`;
    }
    const hours = Math.floor(difference / 1000 / 60 / 60);
    if (hours < 24) {
        return `${hours} hours ago`;
    }
    const days = Math.floor(difference / 1000 / 60 / 60 / 24);
    return `${days} days ago`;
}