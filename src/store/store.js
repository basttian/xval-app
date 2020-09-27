import { derived,  readable, writable } from 'svelte/store'

/* fecha portada */
export const relog = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
    }, 1000);
    return function stop() {
		clearInterval(interval);
	};
});

//I L
export const _userid =  writable();
export const _displayName =  writable();
export const type =  writable('');