<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";
const db = firebase.firestore();
import moment from 'moment';
import 'moment/locale/es';
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
	onMount(() => {
		type.set(id)
	});

import teacherViews from "./component/Views.svelte";
import studentViews from "./student/Views.svelte";



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
