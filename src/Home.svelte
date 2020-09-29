<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";
const db = firebase.firestore();
import moment from 'moment';
import 'moment/locale/es';
import m from 'moment-timezone';
import { Router, Route, Link } from 'yrv';
export let router = {};
let id = null;
  $: {
    id = router.params ? router.params.id : null;
  }

import CryptoJS from "crypto-js";
import sha512 from 'crypto-js/sha512';
import { type } from "./store/store.js";
import { onMount } from 'svelte';

import { temporizador } from "./store/utils.js"
let now;

	onMount(() => {
		type.set(id);
        setInterval(() => {
            now = temporizador();
        }, 1000);
	});

import teacherViews from "./component/Views.svelte";
import studentViews from "./student/Views.svelte";

/* Funcional */
$: _tiempo = now;

 </script>
    <svelte:head>
        <title>App | {id}</title>
    </svelte:head>
  
<FirebaseApp {firebase}>
<User let:user={user} let:auth={auth} >

<main uk-height-viewport="expand: true">
<div class="uk-preserve-color">
<div uk-sticky="offset: 0; animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent; top: 0">
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
            <li class="uk-active"><Link go="back" ><span class="uk-margin-small-right" uk-icon="icon:  arrow-left; ratio: 2" uk-tooltip="title: Atras; pos: right"></span></Link></li>
        </ul>
    </div>
    <div class="uk-navbar-right">
        <span class="uk-margin-right uk-text-uppercase">
            <span class="uk-text-center uk-text-meta uk-text-uppercase uk-margin-top">
             {moment(_tiempo).format("dddd, D [de] MMMM [de] YYYY, h:mm:ss a")}
             </span>
        </span>
    </div>
</nav>
</div>
</div>

 <Router>
{#if $type === "teacher"}
    <Route path="/" exact component={teacherViews}/>
{:else}
    <Route path="/" exact component={studentViews}/>
{/if}
</Router>


</main>
 <footer>
    <div class="uk-background-muted uk-padding uk-panel">
        


    </div>
 </footer>



</User>
</FirebaseApp>
