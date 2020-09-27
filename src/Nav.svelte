<script>
    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/firestore";
    import "firebase/auth";
    import { Router, Route, Link, router } from 'yrv';
    import sha512 from 'crypto-js/sha512';
    import CryptoJS from "crypto-js";
    import { type } from "./store/store.js";

    // Carbon icons
    import Education24 from "carbon-icons-svelte/lib/Education24";
    import ToolBox24 from "carbon-icons-svelte/lib/ToolBox24";
    import WatsonHealthNominate24 from "carbon-icons-svelte/lib/WatsonHealthNominate24";

    // Modulo
    import MSJ from "./modules/Mensajesnav.svelte";

</script>    

<FirebaseApp {firebase}>
<User let:user={user} let:auth={auth} >
<div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
     <div class="uk-navbar-item uk-logo"><img class="uk-border-circle" width="35" height="35" src={user.photoURL} alt=""></div>
        <div class="uk-navbar-nav uk-width-auto uk-margin-top">
            <div class="uk-width-expand">
                <h4 class="uk-comment-title uk-margin-remove">{user.displayName}</h4>
                <p class="uk-comment-meta uk-margin-remove-top">{user.email}</p>
            </div>
        </div>
    </div>
    <div class="uk-navbar-right uk-margin-right">
        {#if $type === "teacher"}
        
        <!-- module msj -->
        <MSJ/>
        <span uk-icon="icon: grid"></span>
        <div class="uk-margin-right" uk-dropdown="animation: uk-animation-slide-top-small; duration: 500" id="drop">
            <ul class="uk-nav uk-dropdown-nav uk-nav-primary uk-margin-auto-vertical uk-margin-right">
                <li><Link on:click={()=> UIkit.dropdown("#drop").hide()} href="/"><WatsonHealthNominate24 /> Inicio</Link></li>
                <li><Link on:click={()=> UIkit.dropdown("#drop").hide()} href="/{sha512('view')}"><ToolBox24 /> Mis examenes</Link></li>
                <li class="uk-nav-divider"></li>
                <li><a href="javascript:void(0);" 
                    on:click={() => 
                        UIkit.modal.confirm('Cerrar sesión.').then(function() {
                        //console.log('Confirmed.')
                        auth.signOut().then(resp => {
                        UIkit.notification({
                        message: '<span uk-icon=\'icon: check\'></span> Desconexión satisfactoria.', 
                        status: 'secondary',
                        pos: 'bottom-center',
                        timeout: 500
                        });    
                        });
                        }, function () {
                            //console.log('Rejected.')
                        })}
                    ><span uk-icon="icon: sign-out"></span> Salir</a></li>
            </ul>
        </div>
        {:else}
        <span uk-icon="icon: grid"></span>
        <div class="uk-margin-right" uk-dropdown="animation: uk-animation-slide-top-small; duration: 500" id="drop">
            <ul class="uk-nav uk-dropdown-nav uk-nav-primary uk-margin-auto-vertical uk-margin-right">
                <li><Link on:click={()=> UIkit.dropdown("#drop").hide()} href="/"><WatsonHealthNominate24 /> Inicio</Link></li>
                <li><Link on:click={()=> UIkit.dropdown("#drop").hide()} href="/{sha512('evaluaciones')}"><Education24 /> Mis evaluaciones</Link></li>
                <li class="uk-nav-divider"></li>
                <li><a href="javascript:void(0);" 
                    on:click={() => 
                        UIkit.modal.confirm('Cerrar sesión.').then(function() {
                        //console.log('Confirmed.')
                        auth.signOut().then(resp => {
                        UIkit.notification({
                        message: '<span uk-icon=\'icon: check\'></span> Desconexión satisfactoria.', 
                        status: 'secondary',
                        pos: 'bottom-center',
                        timeout: 500
                        });    
                        });
                        }, function () {
                            //console.log('Rejected.')
                        })}
                    ><span uk-icon="icon: sign-out"></span> Salir</a></li>
            </ul>
        </div>
        {/if}
    </div>
</nav>
 </div>




</User>
</FirebaseApp>