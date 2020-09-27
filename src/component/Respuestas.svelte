<script>

    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/auth";
    const db = firebase.firestore();
    import moment from 'moment';
    import 'moment/locale/es';
    import { Router, Route, Link } from 'yrv';
    export let router = {};
    let id = null;
    $: {
        id = router.params ? router.params.id : null;
    }
    import { get } from 'svelte/store';
    import { _userid } from "../store/store.js"
    const _usuario = get(_userid);
    let itemId = '0';

    /* Quill Editor I l it */
    import { quill } from 'svelte-quill'
    var toolbarOptions = [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction
          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean']                                         // remove formatting button
    ];

	let options = { 
          modules: {
            toolbar: toolbarOptions
          },
          placeholder: 'Aqui debes colocar las correcciones que vera el estudiante...',
    };
    let content = { html: '', text: ''};


let corregido = false;
let nota;
import sha512 from 'crypto-js/sha512';
/* por defecto se carga el examen original */
let scoops = false;

/* Pring Test */
import printJS from 'print-js';
const printEvaluacion = (nombre,dni,nota,preguntas,respuestas) => {
    let someJSONdata = [{ "nombre":nombre, "dni":dni, "nota":nota, "preguntas":[preguntas], "respuestas":[respuestas]  }];
    printJS({printable: someJSONdata, properties: [{field:'preguntas', displayName:'Preguntas'},{field:'respuestas', displayName:'Respuestas'}], type: 'json', header: `<p>Evaluacion de ${nombre}, DNI:${dni}, Nota: ${nota} </p>` });
}

const printEvaluaciones = async() => {
    var docRef = await db.doc(`examenes/${id}`);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            printJS({ printable: 'printJS-lista', 
                type: 'html', 
                header: `${doc.data().titulo} - ${doc.data().descripcion} `,
                ignoreElements:['noPrint']
            })
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


</script>

    <svelte:head>
        <title>Corregir examenes</title>
        <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
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
             <li class="uk-active"><Link href="/{sha512('ingresos')}/{id}" ><span class="uk-margin-small-right" uk-icon="icon: cog; ratio: 2" uk-tooltip="title: Administrar ingresos; pos: left"></span></Link></li>
            
            </ul>
        </div>
</nav>
</div>
</div>

<div class="uk-container uk-margin-bottom">
<Collection path={`examenes`} let:data let:ref query={ (ref) => ref.where("uid","==",`${user.uid}`)}  >
<div slot="loading"><div uk-spinner></div></div>

<!-- Verificamos si puede visualizar el componente respuestas -->
{#if data.length === 0}
    <div class="uk-container uk-margin-top">
        <div class="uk-alert-uk-alert-primary" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: info"></span> Nada Para corregir.</p>
        </div>
    </div>
{:else}



<div class="uk-container uk-margin-bottom">
<Doc path={`examenes/${id}`} let:data let:ref log >
<div slot="loading"><div uk-spinner></div></div>


<h4 class="uk-heading-divider">{data.titulo} - {data.descripcion}</h4>
<p class="uk-text-meta"><span uk-icon="icon: calendar"></span> {moment(data.inicia).format("LLLL")} <span uk-icon="icon: calendar"></span> {moment(data.finaliza).format("LLLL")}. <span uk-icon="icon: clock"></span> 
{moment.duration(data.finaliza - data.inicia).asMinutes() === 1 ? moment.duration(data.finaliza - data.inicia).asMinutes() +' minuto.' : moment.duration(data.finaliza - data.inicia).asMinutes() +' minutos.' }</p>


<div class="uk-container uk-margin-top" slot="fallback">
    Unable to display ...
</div>
</Doc>
</div>

<div class="uk-container">
<Collection path={`respuestas`} query={ (ref) => ref.where("idexamen","==",`${id}`)} let:data let:ref log>
<div class="uk-container uk-margin-top" slot="loading"><div uk-spinner></div></div>
<div class="uk-container uk-margin-top" slot="fallback">
    Unable to display ...
</div>
<!-- Si no hay datos -->
{#if data.length === 0}
    <div class="uk-container uk-margin-top">
        <div class="uk-alert-uk-alert-primary" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: info"></span> Nada que corregir.</p>
        </div>
    </div>
{:else}
<div class="uk-grid-divider uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid>
<div class="uk-width-auto@m">

<table class="uk-table uk-table-divider uk-table-small" id="printJS-lista">
<caption><button class="uk-button uk-button-text" on:click={()=> printEvaluaciones() }> <span uk-icon="icon: print"></span> </button></caption>
    <thead>
    <tr id="noPrint">
        <th>-</th>
        <th>Nombre</th>
        <th>Ev</th>
        <th>Nota</th>
        <th>Ver</th>
    </tr>
    </thead>
    <tbody>
{#each data as item}
    <tr>
        <td>
            
            <button class="uk-button uk-button-text" id="noPrint" on:click={() => {
                    UIkit.modal.confirm(`Esta seguro que desea eliminar el examen de ${item.nombre}`).then(function() {
                        item.ref.delete().then(()=>{
                    UIkit.notification({message: `<span uk-icon='icon: trash'></span> Examen eliminado éxitosamente.`, pos: 'top-center', status: 'primary'})
                        })
                }, function () {
                    UIkit.notification({message: "<span uk-icon='icon: warning'></span> Operación cancelada.", pos: 'top-center', status: 'danger'})
                })
            }}><span uk-icon="icon: trash" ></span></button>

        </td>
        <td>{item.nombre}</td>
        <td id="noPrint"><span class="{item.corregido?'uk-label':'uk-label uk-label-danger'} ">{item.corregido?'Si':'No'}</span></td>
        <td>{item.nota}</td>
        <td id="noPrint"><button class="uk-button uk-button-text" on:click={()=> itemId = item.id }><span uk-icon="icon: search"></span> </button></td>
    </tr>
{/each}
    </tbody>
</table>


</div>

<div class="uk-width-expand@m">

<Doc path={`respuestas/${itemId}`} let:data let:ref log >
<div slot="loading"><span class="uk-text-italic">Buscando..</span></div>
<div slot="fallback">
    <div uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <h3>Información</h3>
        <p><span uk-icon="icon: search" ></span> Debe seleccionar un examen.</p>
    </div>
</div>

    <ul class="uk-iconnav uk-margin-small-bottom">
        <li><button class="uk-button uk-button-text" on:click={() => printEvaluacion(data.nombre,data.dni,data.nota,data.preguntas,data.respuestas) }><span uk-icon="icon: print"></span></button>
        </li>
    </ul>

<div class="uk-background-muted uk-padding-small uk-panel">
    <div class="uk-clearfix">
        <div class="uk-float-right">

        </div>
        <div class="uk-float-left">
            {data.nombre}. DNI:{data.dni}
        </div>
    </div>
</div>

<div class="uk-background-muted uk-padding-small uk-panel uk-margin-top">
<div class="uk-child-width-1-2@s uk-child-width-1-2@m" uk-grid>
    <div>
        <label><input class="uk-checkbox" type="checkbox" bind:this={corregido} checked={data.corregido} on:change={async ()=> await ref.update({corregido: corregido.checked}) }> Marcar como Evaluado</label> 
    </div>
    <div>
      <span class="uk-float-right" uk-icon="icon: file-edit; ratio: 2"></span>
      <input class="uk-float-right uk-input uk-form-width-small" min="1" type="number" value={data.nota===0?'':data.nota} bind:this={nota} step="0.5" max="10" placeholder="Nota" on:change={()=> ref.update({nota: Number(nota.value)}) }>
    </div>
</div>
</div>

<span class="uk-text-large">Preguntas</span>
{#each { length:data.preguntas.length } as item,i}
    <span class="uk-text-bold">{@html data.preguntas[i]}</span>
{/each}

<div class="uk-clearfix uk-background-muted uk-padding-small uk-margin-top">
    <div class="uk-float-left">
        <h3 class="uk-float-left">Respuestas</h3>
    </div>
    <div class="uk-float-right">
        <label><input class="uk-radio uk-child-width-auto" type="radio" name="radio2" bind:group={scoops} value={false}> Evaluación </label>
        <label><input class="uk-radio uk-child-width-auto" type="radio" name="radio2" bind:group={scoops} value={true}> Correcciones </label>
    </div>
</div>

<!-- Editor Quill -->
 {#if scoops} 
<main>
    <div class="editor" use:quill={options} on:text-change={e => content = e.detail} >
        {@html data.correcciones}   
    </div>
</main>
{:else}
<main>
    <div class="editor" use:quill={options} on:text-change={e => content = e.detail} >
        {@html data.respuestas}
    </div>
</main> 
{/if}

    <div class="uk-background-muted uk-padding-small uk-panel uk-margin-small-top">
        <button class="uk-button uk-button-text"
        on:click={()=> ref.update({correcciones:content.html})
        .then(resp=>{UIkit.notification("<span uk-icon='icon: check'></span> Correcciones enviadas exitosamente")}) }
         disabled={Number(content.text.length)<=3} >Enviar correcciones</button>
    </div> 

<p>El examen se realizo {data.expired?" fuera de tiempo":" en tiempo programado"} el dia {moment(data.fecha).format("LLLL")}</p>
<p><span class="uk-label uk-label">Nota</span> No olvidar enviar las correcciones.</p>
</Doc>
</div>
</div>
{/if}
</Collection>
</div>
{/if}
</Collection>
</div>
</User>
</FirebaseApp>
