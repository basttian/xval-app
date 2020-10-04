<script>

    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/auth";
    const db = firebase.firestore();
    import moment from 'moment';
    import 'moment/locale/es';
    import { Router, Route, Link } from 'yrv';
    // router not  use
    export let router = {};
    /* Quill Editor I l it */
    import { quill } from 'svelte-quill'
    var toolbarOptions = [
          ['clean']
    ];
	let options = { 
          modules: {
            toolbar: toolbarOptions
          },
          placeholder: 'Aqui debes colocar las correcciones que vera el estudiante...',
    };
    let content = { html: '', text: ''};

    import sha512 from 'crypto-js/sha512';
    let idExamen=[{idex:'',idDoc:''}];

    // Modulo
    import MSJBACK from "../modules/Mensajesback.svelte";

</script>

    <svelte:head>
        <title>Mis evaluaciones</title>
        <link href="/quill.snow.css" rel="stylesheet">
    </svelte:head>
    <!-- Body -->
<FirebaseApp firebase={firebase}>
<User let:user={user} let:auth={auth} >

<div class="uk-preserve-color">
<div uk-sticky="offset: 0; animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent; top: 0">
<nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
            <ul class="uk-navbar-nav">
                <li class="uk-active"><Link go="back" ><span class="uk-margin-small-right" uk-icon="icon:  arrow-left; ratio: 2" uk-tooltip="title: Atras; pos: right"></span></Link></li>
            </ul>
        </div>
        <div class="uk-navbar-right">
            <ul class="uk-navbar-nav">
             <span class="uk-text-uppercase uk-margin-right">Mis evaluaciones</span>
            </ul>
        </div>
</nav>
</div>
</div>

<div class="uk-container">
<Collection path={`respuestas`} query={ (ref) => ref.where("uid","==",`${user.uid}`)} let:data let:ref log>
<div slot="loading"><div uk-spinner></div></div>
<div slot="fallback">
    Unable to display ...
</div>
{#if data.length === 0}
    <div class="uk-container uk-margin-top">
        <div class="uk-alert-uk-alert-primary" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: info"></span> Aun no has realizado ninguna evaluación.</p>
        </div>
    </div>
{:else}

<div class="uk-grid-divider uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid>
<div class="uk-width-auto@m">


<div uk-filter="target: .js-filter">
    <ul class="uk-subnav uk-subnav-pill">
        <li uk-filter-control="sort: data-date"><a uk-icon="icon: triangle-up"></a></li>
        <li uk-filter-control="sort: data-date; order: desc"><a uk-icon="icon: triangle-down"></a></li>
    </ul>

<ul class="js-filter uk-list uk-list-striped">
{#each data as item} 
    <li data-date={item.fecha}>
    <a href="javascript:void(0)" on:click={()=> {

        UIkit.modal.confirm('<em>¿Eliminar este examen?</em><br>Si realizas esta acción, se eliminarán de forma permanente los datos.').then(function() {
            item.ref.delete();
        }, function () {
            console.log('Rejected.')
        })

    }} uk-icon="icon: trash"> </a>
    <span class="{item.nota <= 6?'uk-label uk-label-danger':'uk-label uk-label-success'} ">{item.nota}</span>
    <span class="{item.corregido?'uk-label':'uk-label uk-label-danger'} ">{item.corregido?'Si':'No'}</span>
    {moment(item.fecha).format("lll")}  <a uk-icon="icon: search" on:click={() =>  idExamen={idex:`${item.idexamen}`,idDoc:`${item.id}`}  }></a></li>
{/each}
</ul>
</div>



</div>
    <div class="uk-width-expand@m">
    <Doc path={`examenes/${idExamen.idex}`} let:data={values} let:ref log>
    <div slot="loading"><div uk-spinner></div></div>
    <h4 class="uk-heading-divider">{values.titulo} - {values.descripcion}</h4>

    <div slot="fallback">
        <div uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p>Nada para mostar.</p>
        </div>
    </div>
   
    <Doc path={`respuestas/${idExamen.idDoc}`} let:data let:ref log>
    <div slot="loading"><div uk-spinner></div></div>
    <div slot="fallback">
        Doc unable to display...
    </div>
        <div class="uk-background-muted uk-padding-small uk-panel uk-margin-bottom">
            <p class="uk-h4">{data.nota===0?'Aun no tiene nota.': `Calificación: ${data.nota}`}</p>
        </div>
    <span class="uk-text-large">Preguntas del examen:</span>
    {#each { length:data.preguntas.length } as item,i}
     <p class="uk-text-small">{@html data.preguntas[i]}</p>
    {/each}


    <div uk-grid>
        <div>
            <span class="uk-text-large">Tus respuestas:</span>
            <main>
                <div class="editor" use:quill={options} on:text-change={e => content = e.detail} >
                    {@html data.respuestas}
                </div>
            </main>
        </div>
        <div>
            {#if data.correcciones === void 0}
                 El examen no presenta correcciones.
            {:else}
            <span class="uk-text-large">Correcciones:</span>
            <main>
                <div class="editor" use:quill={options} on:text-change={e => content = e.detail} >
                    {@html data.correcciones}
                </div>
            </main>
            {/if}
        </div>
    </div>

        <!-- Mensaje al profesor -->
        <MSJBACK examenid={data.idexamen} parauser={values.uid}/>

    </Doc> 
    </Doc>
    </div>
</div>
{/if}
</Collection>
</div>
</User>
</FirebaseApp>
