<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";
import { Router, Route, Link, router } from 'yrv';
import sha512 from 'crypto-js/sha512';
import CryptoJS from "crypto-js";
// Carbon icons
import Education24 from "carbon-icons-svelte/lib/Education32";
import UserProfile24 from "carbon-icons-svelte/lib/UserProfile32";

</script>
<svelte:head>
    <link rel="stylesheet" href="./fonts/stylesheet.css" />
</svelte:head>
<FirebaseApp {firebase}>
<User let:user={user} let:auth={auth} >

<div class="uk-container uk-margin-small-top uk-margin-xlarge-bottom">    
<main uk-height-viewport="expand: true">

            <div class="uk-child-width-1-2@m" uk-grid>
            <div>
                <div class="uk-card uk-card-default" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
                    <div class="uk-card-media-top">
                        <img class="uk-margin-small-top uk-margin-small-left" src="images/diploma.svg" width="100" height="100" alt="">
                    </div>
                    <div class="uk-card-body">
                        
                        <Link 
                            href="/{sha512('principal')}/student"
                            class="uk-button uk-button-secondary uk-button-large uk-width-1-1">estudiante</Link>
                    </div>
                </div>
            </div>
            <div>
                <div class="uk-card uk-card-default" uk-scrollspy="cls: uk-animation-slide-right; repeat: true">
                     <div class="uk-card-media-top uk-margin-small-left">
                        <img class="uk-margin-small-top" src="images/ensenanza.svg" width="100" height="100" alt="">
                    </div>
                    <div class="uk-card-body">
                        
                        <Link
                            href="/{sha512('principal')}/teacher"
                            class="uk-button uk-button-secondary uk-button-large uk-width-1-1">profesor</Link>
                    </div>
                </div>
            </div>
        </div>
	
</main>
</div>
<footer>
    <div class="uk-background-secondary uk-padding uk-panel uk-position-bottom uk-overlay uk-overlay-default uk-position-fixed">
        <span class="uk-float-right uk-text-meta">Cybernetically enhanced web apps | <a href="https://svelte.dev/" target="_blank"><span class="uk-text-warning"> svelte</span></a></span>
    </div>
</footer>
 </User>
</FirebaseApp>