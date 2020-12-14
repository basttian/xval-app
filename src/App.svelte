<script>

import { Router, Route, Link, router } from 'yrv';
// router.subscribe(e => {
//   if (!e.initial) console.log(e);
// });
import sha512 from 'crypto-js/sha512';
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { _userid, _displayName, type } from "./store/store.js"
// Your web app's Firebase configuration
var firebaseConfig = {
		apiKey: "AIzaSyAuom8AD1lt1W5AGnnJj8yedgwb7UV_C2c",
		authDomain: "test-app-5025d.firebaseapp.com",
		databaseURL: "https://test-app-5025d.firebaseio.com",
		projectId: "test-app-5025d",
		storageBucket: "test-app-5025d.appspot.com",
		messagingSenderId: "831965365779",
		appId: "1:831965365779:web:5016e345b71133566e61e6",
		measurementId: "G-PZ1B8M9X5N"
	};
	// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      var tel = user.phoneNumber;
      _userid.set(user.uid);
      _displayName.set(user.displayName);
      console.log(email);
    } else {
      console.log("No user in line");
    }
  });

import home from "./Home.svelte";
import front from "./Front.svelte";
import newx from "./component/New.svelte";
import views from "./component/Views.svelte";
import update from "./component/Update.svelte";
import test from "./student/Examen.svelte";
import evaluaciones from "./student/Evaluaciones.svelte";
import respuestas from "./component/Respuestas.svelte";
import ingresos from "./component/Ingresos.svelte";

var provider = new firebase.auth.GoogleAuthProvider();

import NAV from "./Nav.svelte";
// Modulo
import msj from "./modules/Mensajesfront.svelte";


/* No refresh */
document.onkeydown = function(){
  switch (event.keyCode){
        case 116 : //F5 button
            event.returnValue = false;
            event.keyCode = 0;
            return false;
        case 82 : //R button
            if (event.ctrlKey){ 
                event.returnValue = false;
                event.keyCode = 0;
                return false;
            }
    }
}

</script>
<svelte:head>
<title>Home</title>
<style>
    body{
        overscroll-behavior: none;
    }
</style>
</svelte:head>


<FirebaseApp {firebase}>
  <User let:user={user} let:auth={auth} >

  {#if $type === "student" && $router.path != "/" || $type === "teacher" && $router.path != "/"}
    <NAV/>
  {/if}
 
  <Router>
  	<Route path="/" exact component={front}/>
	  <Route exact path="/{sha512('principal')}/:id" component={home}/>
    <!-- Teacher -->
    <Route exact path="/{sha512('view')}" component={views}/>
    <Route path="/{sha512('update')}/:id" exact component={update} />
    <Route path="/{sha512('new')}" exact component={newx} />
    <Route path="/{sha512('ingresos')}/:id" exact component={ingresos} />
    <Route path="/{sha512('respuestas')}/:id" exact component={respuestas} />
    <!-- Student -->
    <Route path="/{sha512('evaluaciones')}" exact component={evaluaciones} />
    <Route path="/{sha512('test')}/:id/:user" exact component={test} />
    <!-- module msj -->
    <Route path="/{sha512('mensajes')}/:id" component={msj} />
  </Router> 


<div  slot="signed-out">
<main class="uk-background-secondary" uk-height-viewport="expand: true">
  <div class="uk-section uk-section-xlarge uk-light ">
  <div class="uk-container">
  <h1 class="fontSizeh1">Hola!</h1>
  <p class="paragraphp">Debes iniciar sesion antes de comenzar.</p>
  <div class="uk-position-top-right uk-overlay">
  <a on:click={() => auth.signInWithPopup(provider)} class="uk-padding-small" uk-icon="icon: google; ratio: 2"></a>
  </div>
  </div>
  </div>
</main>
<footer>
    <div class="uk-background-secondary uk-padding uk-panel">
        <span class="uk-float-right uk-text-meta">Cybernetically enhanced web apps | <a href="https://svelte.dev/" target="_blank"><span class="uk-text-warning"> svelte</span></a></span>
    </div>
</footer>
</div>




 </User>
</FirebaseApp>
