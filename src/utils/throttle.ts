export default function throttle(fn: Function, timeout: number) {
    let timer: NodeJS.Timeout | null = null;

    return function perform(this: unknown, ...args: unknown[]) {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply(this, args);

            if (timer && typeof timer === 'number') {
                clearTimeout(timer);
                timer = null;
            }
        }, timeout);
    };
}
