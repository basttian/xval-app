<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/auth";
  import { tweened } from 'svelte/motion';
  export let minut;
  let original = minut * 60; 
  let timer = tweened(original)
  setInterval(() => {
    if ($timer > 0) $timer--;
  }, 1000);
  $: seconds = Math.floor($timer%60);
  $: minutes = Math.floor(($timer / 60)%60);
  $: hours =   Math.floor(($timer / 60)/60);
 
  
    function pad(num) {
        return ("0"+num).slice(-2);
    }

  
</script>

    {#if timer < 1}
      <h1>Starting soon....</h1>
    {:else}
      <span class="uk-margin-right">Tiempo del examen: {pad(hours)}:{pad(minutes)}:{pad(seconds)} <span uk-icon="future"></span></span>
    {/if}