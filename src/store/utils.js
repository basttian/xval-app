import { onDestroy } from 'svelte';
	import moment from 'moment';
	import 'moment/locale/es';
	import m from 'moment-timezone';

export function onInterval(callback, milliseconds) {
	const interval = setInterval(callback, milliseconds);

	onDestroy(() => {
		clearInterval(interval);
	});
}


export function temporizador(){
		return m.tz("America/Argentina/Buenos_Aires");
    }