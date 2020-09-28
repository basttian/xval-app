<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";
import { Router, Route, Link, router } from 'yrv';
import sha512 from 'crypto-js/sha512';
import CryptoJS from "crypto-js";
// Carbon icons
import Education24 from "carbon-icons-svelte/lib/Education24";
import UserProfile24 from "carbon-icons-svelte/lib/UserProfile24";

</script>
<svelte:head>
    <link rel="stylesheet" href="./fonts/stylesheet.css" />
</svelte:head>
<FirebaseApp {firebase}>
<User let:user={user} let:auth={auth} >
<main class="uk-background-secondary" uk-height-viewport="expand: true">
<div class="uk-section uk-section-xlarge uk-light uk-background-cover" style="background-image: url(./dark.jpg)">
    <div class="uk-container">
	<h1 class="fontSizeh1">Hola {user.displayName}</h1>

    <div class="uk-child-width-1-2@s uk-grid-match" uk-grid>
        <div>
            <div class="uk-card uk-card-secondary uk-card-hover uk-card-body uk-light">
                <h3 class="uk-card-title paragraphp"><Education24 /> Soy estudiante.</h3>
                <Link 
                href="/{sha512('principal')}/student"
                class="uk-button uk-button-default uk-width-1-1 buttonb">Aprendo</Link>
            </div>
        </div>
        <div>
            <div class="uk-card uk-card-secondary uk-card-hover uk-card-body uk-light">
                <h3 class="uk-card-title paragraphp"><UserProfile24 /> Soy profesor.</h3>
                <Link
                href="/{sha512('principal')}/teacher"
                class="uk-button uk-button-default uk-width-1-1 buttonb">Educo</Link>
            </div>
        </div>
    </div>


	</div>
</div>

</main>
<footer>
    <div class="uk-background-secondary uk-padding uk-panel">
        <span class="uk-float-right uk-text-meta">Cybernetically enhanced web apps | <a href="https://svelte.dev/" target="_blank"><span class="uk-text-warning"> svelte</span></a></span>
    </div>
</footer>
 </User>
</FirebaseApp>