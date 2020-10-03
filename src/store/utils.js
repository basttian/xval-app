import { onDestroy, onMount } from 'svelte';
	import moment from 'moment';
	import 'moment/locale/es';
	import m from 'moment-timezone';

export function onInterval(callback, milliseconds) {
	const interval = setInterval(callback, milliseconds);

	onDestroy(() => {
		clearInterval(interval);
	});
}



// let realTime;
// export function temporizador(){
// 	fetch("https://worldtimeapi.org/api/ip")
// 		.then(response => response.json())
//   		.then(data => 
// 		realTime = data.datetime
// 	);
// 		return moment(realTime).valueOf();
//     }
// const interval = setInterval(() => {
//     now = new Date();
// }, 1000);
// return () => {
//    clearInterval(interval);
// };