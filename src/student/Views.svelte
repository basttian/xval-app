<script>
	import { FirebaseApp, User, Doc, Collection } from "sveltefire";
	import firebase from "firebase/app";
	import "firebase/firestore";
	const db = firebase.firestore();
    import { _userid, _displayName } from "../store/store.js"
	//I love moment
	import moment from 'moment';
	import 'moment/locale/es';
	import m from 'moment-timezone';
	let _date = moment().format('dddd Do [de] MMMM [del] YYYY');

	import { onMount } from 'svelte';
	import { Router, Route, Link } from 'yrv';
	let time = new Date();

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});

	/* Funcional */
    $: _tiempo = time;


	import sha512 from 'crypto-js/sha512';
	import Cookies from 'js-cookie';
	let codigo = '';
	let promise;
	let showBtnIra = false;
	let documento;
	
	const addControlTest = async (cod) => {
	/* Verifico si el codigo del examen es correcto */
	if(cod === ""){
		UIkit.notification({
			message:"<span uk-icon='icon: warning'></span> Error!! Solicita al profesor un código.",
			pos: "top-center",
			status: "danger",
			timeout: 2000
		});
	}else{

	let eRef = await db.doc(`examenes/${cod}`);
	promise = eRef.get().then(async function(docSnapshot) {
			if (!docSnapshot.exists) {
					eRef.onSnapshot((doc) => {
						UIkit.notification({
							message:"<span uk-icon='icon: warning'></span> Código de examen incorrecto.",
							pos: "top-center",
							status: "danger",
							timeout: 2000
						});
					});
			} else {
					/* Chequeo si el usuario ya ingreso a esa evaluacion */
					let iRef = await db.collection(`ingresos`).where('uid','==',$_userid).where('codigodeExamen','==',codigo);
					promise = iRef.get().then(async collections => {
					collections.forEach(doc => {
						UIkit.notification({
							message:`<span uk-icon='icon: warning'></span> Error! No puedes ingresar nuevamente al examen. Ingresaste el ${moment(doc.data().ingreso).format("LLL")}` ,
							status: "danger",
							timeout: 5000
							});
						return;
					});
					/* Almaceno el ingreso */
					if(collections.empty){
				 		db.collection(`ingresos`).add({
							ingreso:moment().valueOf(),
							uid: $_userid,
							codigodeExamen: codigo,
							nombre: $_displayName,
							}).then(function(){
								 showBtnIra = true;
								}).catch(function(e){
									showBtnIra =false;
								})
							}
						})
				}
		}).catch(function(error) {
        	console.log("Error getting documents: ", error);
    	});
	}
}

	const copyTextToClipboard = (v) => {
		try{
			var unique = document.querySelectorAll('.unique');
			var msg = `${v}` ;
			unique.forEach(function (unique) {
				msg+=unique.value;
			});
			var temp =document.createElement("textarea");
			var tempMsg = document.createTextNode(msg);
			temp.appendChild(tempMsg);
			document.body.appendChild(temp);
			temp.select();
			document.execCommand("copy");
			document.body.removeChild(temp);
			UIkit.notification({
				message: "<span uk-icon='icon: copy'></span> Copiado!",
				status: 'primary',
				pos: 'bottom-center',
				timeout: 1000
			}); 
			}
		catch(err) {
			console.log("error");
		}
	}


</script>

<svelte:head>
<title>Home</title>
</svelte:head>
<!-- Body -->
<FirebaseApp firebase={firebase} >
<User let:user={user} let:auth={auth} on:user>
<div class="uk-container uk-margin-bottom">

	<div class="uk-alert-primary" uk-alert>
		<button class="uk-alert-close" uk-close></button>
		<span class="uk-text-muted">Hola!! {user.displayName}, si cuentas con el código ingresalo en la casilla de abajo.</span>
		<p><span uk-icon="info"></span> Información !! Al ingresar al examen el tiempo comenzará a correr.</p>
	</div>

	<div class="uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid>
    <div>
	<form on:submit|preventDefault={()=>{addControlTest(codigo)}}>
		<div class="uk-margin">
			<div class="uk-inline">
				<a class="uk-form-icon" uk-icon="icon: unlock" on:click={()=> addControlTest(codigo) } ></a>
				<input class="uk-input uk-form-width-large" type="text" bind:value={codigo} placeholder="Codigo del examen">
			</div>
		</div>
	</form>
	<div class="uk-margin">
		<!-- <button class="uk-button uk-button-primary uk-width-1-1" disabled={!codigo || showBtnIra}
		on:click={()=> addControlTest() }
		> Comenzar con mi examen</button> -->
		{#if showBtnIra}
			<Link href="/{sha512('test')}/{codigo}/{$_userid}" ><button class="uk-button uk-button-primary uk-width-1-1">Ir a mi examen...</button></Link>
		{/if}
	</div>
	</div>
    <div>
	</div>
	</div>
	{#await promise}
        <div class="uk-position-cover uk-overlay 
                    uk-overlay-default uk-flex uk-flex-center uk-flex-middle">
            <div uk-spinner="ratio: 3"></div>
        </div> 
    {/await}

</div>

<div class="uk-section uk-section-muted">
    <div class="uk-container-expand">
		<div class="uk-container">
			<h3>Examenes programados.</h3>

<Collection path={`examenes`} query={ref => ref.where("porfecha","==",true).where("status","==",true)} let:data let:ref log>
<div slot="loading"><div uk-spinner></div></div>
		{#if data.length === 0}
			<div class="uk-container uk-margin-top">
				<div class="uk-alert-uk-alert-primary" uk-alert>
					<p><span uk-icon="icon: info"></span> No hay examenes programados.</p>
				</div>
			</div>
		{:else}	
			<div class="uk-grid-match uk-child-width-1-3@m uk-margin-top" uk-grid>

				{#each data as examen}
					
					<div>
						<h4 class="uk-heading-divider"><span uk-icon="icon: calendar"></span> {examen.titulo} </h4>
						<span class="">{examen.descripcion}</span>
						<span class="uk-text-bold">{moment(examen.inicia).format("LLL")}</span>
						{moment(examen.finaliza).format("LLL")} 
						<span class="uk-text-bold">Duración {moment.duration(examen.duracion).asMinutes()} minutos.</span>
					    <div class="uk-margin">


		{#if (examen.inicia<=_tiempo && examen.finaliza>=_tiempo) }
			<div class="uk-inline">
				<a href="javascript:void(0)" class="uk-form-icon uk-form-icon-flip" uk-icon="icon: copy" on:click={()=>{copyTextToClipboard(examen.id)}}></a>
				<input class="uk-input uk-form-blank uk-form-width-large" value={examen.id} type="text">
			</div>
		{:else if examen.finaliza<=_tiempo }
			<div class="uk-alert-danger" uk-alert>
				<p><span uk-icon="icon: info"></span> El examen finalizo..</p>
			</div>	
		{:else}							
			<div class="uk-alert-primary" uk-alert>
				<p><span uk-icon="icon: warning"></span> El código no se encuentra disponible.</p>
			</div>
		{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
</Collection>
		
		</div>
    </div>
</div>
</User>
</FirebaseApp>