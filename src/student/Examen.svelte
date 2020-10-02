<script>

    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/auth";
    
    const db = firebase.firestore();
    //import moment from 'moment';
    import 'moment/locale/es';
    import moment from 'moment-timezone';
    import { Router, Route, Link } from 'yrv';
    export let router = {};
    let id = null;
    $: {
        id = router.params ? router.params.id : null;
    }
    import { get } from 'svelte/store';
    import { _userid } from "../store/store.js"
    const _usuario = get(_userid);

    import { onMount } from 'svelte';
    //let _inicio, _fin,_duracion;
    let preguntas = [];

    import { temporizador } from "../store/utils.js"
    
   let now;
   onMount(async () => {
      await db.doc(`examenes/${id}`).get().then(function(doc) {
            if (doc.exists) {
                //_inicio = doc.data().inicia;
                //_fin = doc.data().finaliza;
                //_duracion = moment.utc(moment(_fin).diff(moment(_inicio))).format('HH:mm');
                //_duracion = moment.duration(_fin - _inicio).asMinutes();
                preguntas = doc.data().preguntas;
            } else {
                console.log("No such document!");
            }

        // const interval = setInterval(() => {
        //     now = new Date();
        // }, 1000);

        // return () => {
        //     clearInterval(interval);
        // };

        setInterval(() => {
            now = temporizador();
        }, 1000);

        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
   })


    /* Funcional */
    $: _tiempo = now;

    /* Quill Editor I l it */
    import { quill } from 'svelte-quill'
    var toolbarOptions = [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'align': [] }]
    ];
	let options = { 
          modules: {
            toolbar: toolbarOptions
          },
          placeholder: 'Responde aquí...',
    };
    let content = { html: '', text: ''};


let promise;

    /* Data */
    let estudiante = '';
    let dni = '';
    $: l = dni.length;
    let disablebtn = false;
 /* buscamos duplicados  */
 let handlerSecond = 1;//creo la variable que me permitira detenere el tiempo si el estudiante presiono el boton de envio.
const sendDataResponse = async(dni,estudiante,respuesta, useruid) => {
    handlerSecond = 0;
    disablebtn = true;
    let rRef = await db.collection(`respuestas`).where('uid','==', _usuario ).where('idexamen','==',id);
    promise = rRef.get().then(async collections => {
      collections.forEach(collection => {
          console.log('Found with id:', collection.id);
          UIkit.notification({message:"<span uk-icon='icon: warning'></span> Error! Su examen ya se encuentra registrado. ",status: "danger"});
          return;
      });

      if(collections.empty){

        await db.collection(`respuestas`).add({

            fecha:moment().valueOf(),
            idexamen:`${id}`,
            dni:dni,
            nombre:estudiante.value,
            respuestas:`${respuesta}`,
            corregido: false,
            nota: 0,
            preguntas: preguntas,
            uid: _usuario,
            expired: false,

        }).then(resp=>{
            //console.log(resp);
            UIkit.notification({
                message:"<span uk-icon='icon: check'></span> Examen enviado éxitosamente.",
                pos: "bottom-center",
                status: "primary"
                });
        }).catch(error=>{
            console.log(error);
        })

      }

    })
}



import TIMER from "./Timer.svelte";
import CRONOMETRO from "./Cronos.svelte";
/* Importo el temporizador */
import { onInterval } from '../store/utils.js';
let testTime ;
/* Comienza a correr automaticamente con el valor de tiempo para el examen*/
/* handlerSecond se inicializa en 1 */
onInterval(() => testTime -= handlerSecond, 1000);
/* Si testTime llega a cero se ejecuta la funcion Guardar fuera de tiempo */
$: if (testTime === 0){
        SaveTimeOut();
    }

const SaveTimeOut = async() => {
    /* Verificamos que el estudiante no posea respuesta para ese examen */
   let rRef = await db.collection(`respuestas`).where('uid','==', _usuario ).where('idexamen','==',id);
    promise = rRef.get().then(async collections => {
      collections.forEach(collection => {
          console.log('Found with id:', collection.id);
          UIkit.notification({message:"<span uk-icon='icon: warning'></span> Error! Su examen ya se encuentra registrado. ",status: "danger"});
          return;
      });
      /* Si no hay examen previo del alumno guardamos la informacion */
        if(collections.empty){

     await db.collection(`respuestas`).add({

                fecha:moment().valueOf(),
                idexamen:`${id}`,
                dni:dni,
                nombre:estudiante.value,
                respuestas: content.html,
                corregido: false,
                nota: 0,
                preguntas: preguntas,
                uid: _usuario,
                expired: true,
            }).then(()=>{
                UIkit.notification({
                message: '<span uk-icon="icon: warning"></span> El tiempo ha expirado!',
                status: 'danger',
                pos: 'top-center',
                timeout: 5000 });
                /* Disable boton de envio del examen */
                disablebtn=true;
            }).catch(e=>{
                console.log(e);
            });
        }
    });
}

/* No se - despues lo veo */
import Cookies from 'js-cookie';
let uidingreso;

</script>
    <svelte:head>
        <title>Examen</title>
        <link href="/quill.snow.css" rel="stylesheet">
    </svelte:head>

    <!-- Body -->
<FirebaseApp firebase={firebase}>
<User let:user={user} let:auth={auth} >

<!-- {Cookies.get('CO-ROUTE')} -->

<Collection path={`ingresos`} 
query={ (ref) => ref.where("codigodeExamen","==",`${id}`).where("uid","==",`${_usuario}`) }  
let:data let:ref log on:data={(e) =>  e.detail.data[0] === void 0 ? 0 : uidingreso = e.detail.data[0].id}  > 
<div class="uk-container uk-margin-top" slot="loading"><div uk-spinner></div></div>
<div class="uk-container uk-margin-top" slot="fallback">
    Unable to display ...
</div>

{#if data.length === 0}
    <div class="uk-container uk-margin-top">
        <div class="uk-alert-danger" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: warning"></span>Error!! El examen no se encuentra disponible. Consulte a su profesor.</p>
        </div>
    </div>
{:else if data.length === 1 }

<Doc path={`ingresos/${uidingreso}`} let:data let:ref >
<div slot="loading"><div uk-spinner></div></div>
<!-- Oculto el examen con la condicion  -->
{#if moment(data.ingreso).add(10, 'seconds').valueOf() <= moment().valueOf()  }<!-- para revisar -->
    <div class="uk-container uk-margin-top">
        <div class="uk-alert-danger" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: warning"></span>Error!! El examen ya no se encuentra disponible. Consulte a su profesor.</p>
        </div>
    </div>
{:else}



<!-- Verificacion que el examen este dentro de lo programado -->
<Doc path={`examenes/${id}`} let:data={examenesData} let:ref={examenesReference} >
<div slot="loading"><div uk-spinner></div></div>

<!-- Si fue programado -->
{#if examenesData.porfecha && examenesData.inicia <= _tiempo && examenesData.finaliza >= _tiempo}


<!-- Muestro el examen  -->
<Doc path={`examenes/${id}`} let:data let:ref log on:data={(e) =>  e.empty ? 0 : testTime = moment.duration(e.detail.data.finaliza - e.detail.data.inicia).asSeconds() } >
<div class="uk-float-right" slot="loading"><div uk-spinner></div></div>
<div class="uk-preserve-color">
    <div uk-sticky="offset: 0; animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent; top: 0">
    <nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
            <ul class="uk-navbar-nav">
                <li class="uk-active"><Link go="back" ><span class="uk-margin-small-right" 
                uk-icon="icon:  arrow-left; ratio: 2" uk-tooltip="title: Atras; pos: right"></span></Link></li>
            </ul>
        </div>
        <div class="uk-navbar-right">
            <span class="uk-margin-right">Tiempo del examen: {moment.utc(moment(data.finaliza).diff(moment(_tiempo))).format('HH:mm:ss') } <span uk-icon="icon: history"></span></span>
        </div>
    </nav>
    </div>
</div>
    <div class="uk-container">
        
    </div>
</Doc>

<div class="uk-container uk-margin-top">
<Doc path={`examenes/${id}`} let:data let:ref log >
<div slot="loading"><div uk-spinner></div></div>
<!-- Aviso -->
<div class="uk-alert-primary" uk-alert>
    <a class="uk-alert-close" uk-close></a>
    <p>Bienvenido!! Debes colocar tu DNI antes de comenzar con el examen.</p>
</div>
<!-- Formulario  -->
<form on:submit|preventDefault={()=>sendDataResponse(Number(dni),estudiante,content.html,user.uid)}>
<div class="uk-background-muted uk-margin">
    
    <div  class="uk-grid-small" uk-grid>
    <div class="uk-width-1-2@s">
        <input class="uk-input uk-disabled" 
        value={user.displayName}
        bind:this={estudiante} 
        type="text" 
        placeholder="Nombre y apellido" disabled={true}>
    </div>
    <div class="uk-width-1-2@s">
        <input class="uk-input" bind:value={dni} type="text" placeholder="DNI" pattern="[0-9]*" inputmode="numeric">
        <span class="uk-text-meta uk-float-right">{l} | {l == 8?"DNI Válido":"DNI Inválido."}</span>
    </div>
    </div>
</div>
<!-- Panel de preguntas -->
<article class="uk-article uk-margin-bottom">
<h1 class="uk-article-title">{data.titulo}</h1>
<p class="uk-article-meta">{moment().format('dddd')} {moment().format('Do [de] MMMM [del] YYYY, h:mm:ss a')}</p>
{#each { length:data.preguntas.length } as item,i}
     <p class="uk-text-bold">{@html data.preguntas[i]}</p>
{/each}

</article>
<!-- Panel de respuestas -->
<div class="editor" use:quill={options} on:text-change={e => content = e.detail}></div>
<!-- {@html content.html} -->
<button class="uk-button uk-button-primary uk-margin" 
disabled={Number(content.text.length)<=3 || disablebtn || Number(l)!=8 || !estudiante} >Enviar respuesta</button>

{#await promise}
        <div uk-spinner></div>
{/await}


</form>
<p><span class="uk-label uk-label-warning">Nota</span> Asegúrate de colocar tu DNI antes de enviar el examen.</p>

<!-- Si no se encuentra -->
<div slot="fallback">
    <div class="uk-alert-danger" uk-alert>
    <a class="uk-alert-close" uk-close></a>
        <p><span uk-icon="warning"></span> Error! Código incorrecto. Intente nuevamente o póngase en contacto con su profesor.</p>
    </div>
</div>
</Doc>
</div>


<!-- Si no fue programado -->
{:else if !examenesData.porfecha}


<!-- Muestro el examen  -->
<Doc path={`examenes/${id}`} let:data let:ref log on:data={(e) =>  e.empty ? 0 : testTime = moment.duration(e.detail.data.finaliza - e.detail.data.inicia).asSeconds() } >
<div class="uk-float-right" slot="loading"><div uk-spinner></div></div>
<div class="uk-preserve-color">
    <div uk-sticky="offset: 0; animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent; top: 0">
    <nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
            <ul class="uk-navbar-nav">
                <li class="uk-active"><Link go="back" ><span class="uk-margin-small-right" 
                uk-icon="icon:  arrow-left; ratio: 2" uk-tooltip="title: Atras; pos: right"></span></Link></li>
            </ul>
        </div>
        <div class="uk-navbar-right">
            <CRONOMETRO minut={moment.duration(data.finaliza - data.inicia).asMinutes() } />
        </div>
    </nav>
    </div>
</div>
    <div class="uk-container">
        <TIMER minut={moment.duration(data.finaliza - data.inicia).asMinutes()} />
    </div>
</Doc>

<div class="uk-container uk-margin-top">
<Doc path={`examenes/${id}`} let:data let:ref log >
<div slot="loading"><div uk-spinner></div></div>
<!-- Aviso -->
<div class="uk-alert-primary" uk-alert>
    <a class="uk-alert-close" uk-close></a>
    <p>Bienvenido!! Debes colocar tu DNI antes de comenzar con el examen. 
    <span uk-icon="icon: clock"></span> Tienes {moment.duration(data.finaliza - data.inicia).asMinutes()} minutos.</p>
</div>
<!-- Formulario  -->
<form on:submit|preventDefault={()=>sendDataResponse(Number(dni),estudiante,content.html,user.uid)}>
<div class="uk-background-muted uk-margin">
    
    <div  class="uk-grid-small" uk-grid>
    <div class="uk-width-1-2@s">
        <input class="uk-input uk-disabled" 
        value={user.displayName}
        bind:this={estudiante} 
        type="text" 
        placeholder="Nombre y apellido" disabled={true}>
    </div>
    <div class="uk-width-1-2@s">
        <input class="uk-input" bind:value={dni} type="text" placeholder="DNI" pattern="[0-9]*" inputmode="numeric">
        <span class="uk-text-meta uk-float-right">{l} | {l == 8?"DNI Válido":"DNI Inválido."}</span>
    </div>
    </div>
</div>
<!-- Panel de preguntas -->
<article class="uk-article uk-margin-bottom">
<h1 class="uk-article-title">{data.titulo}</h1>
<p class="uk-article-meta">{moment().format('dddd')} {moment().format('Do [de] MMMM [del] YYYY, h:mm:ss a')}</p>
{#each { length:data.preguntas.length } as item,i}
     <p class="uk-text-bold">{@html data.preguntas[i]}</p>
{/each}

</article>
<!-- Panel de respuestas -->
<div class="editor" use:quill={options} on:text-change={e => content = e.detail}></div>
<!-- {@html content.html} -->
<button class="uk-button uk-button-primary uk-margin" 
disabled={Number(content.text.length)<=3 || disablebtn || Number(l)!=8 || !estudiante} >Enviar respuesta</button>

{#await promise}
        <div uk-spinner></div>
{/await}

</form>
<p><span class="uk-label uk-label-warning">Nota</span> Asegúrate de colocar tu DNI antes de enviar el examen.</p>

<!-- Si no se encuentra -->
<div slot="fallback">
    <div class="uk-alert-danger" uk-alert>
    <a class="uk-alert-close" uk-close></a>
        <p><span uk-icon="warning"></span> Error! Código incorrecto. Intente nuevamente o póngase en contacto con su profesor.</p>
    </div>
</div>
</Doc>
</div>

    <!-- Solucionado con parche a mejorar -->
    {:else}
        <div class="uk-container uk-margin-top">
            <div class="uk-alert-danger" uk-alert>
            <a class="uk-alert-close" uk-close></a>
                <p><span uk-icon="warning"></span> Error!! El tiempo del examen expiró. Consulte a su profesor.</p>
            </div>
        </div>
    {/if}
</Doc>
{/if}
</Doc>
{/if}
</Collection>
</User>
</FirebaseApp>


