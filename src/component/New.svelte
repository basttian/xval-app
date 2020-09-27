<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
const db = firebase.firestore();
import firebase from "firebase/app";
import moment from 'moment';
import 'moment/locale/es';
import { Router, Route, Link } from 'yrv';

    function add() {
        preguntas = preguntas.concat({ done: false, text: '' });
	}

	function clear() {
		preguntas = preguntas.filter(t => !t.done);
	}

    $: remaining = preguntas.filter(t => !t.done).length;

/* Variables  */
let finaliza;
let inicia;
let titulo = '';
let descripcion ='';
let status = false;
let porFecha = false;

/* Almaceno con el evento change */
let _i,_f;


/* Contar caracteres */
$: l = (v) => {return v.length};
/* Duracion del examen en minutos por fecha*/
$: d = (i,f) => { return  moment.duration(moment.utc(moment(f).diff(moment(i)))).asMinutes(); };


    /* Quill Editor I l it */
    import { quill } from 'svelte-quill'
    var toolbarOptions = [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction
          [{ 'align': [] }],
          ['clean']  
    ];

	let options = { 
          modules: {
            toolbar: toolbarOptions
          },
          placeholder: 'Pregunta...',
    };
    let content = [{ html: '', text: ''}];


let preguntas = [];
let cod = '[Esperando codigo de examen..]';
let arr = [];
let promise;
  const AddData = async (idusuario) => {
         arr = [];
            preguntas.forEach(function(element, index ) {
                arr.push(content[index].html);/* element.text */
            });
    promise = db.collection(`examenes`).add({
          descripcion: descripcion,
          duracion: _f - _i,
          finaliza:moment(_f).valueOf(),
          inicia:moment(_i).valueOf(),
          preguntas: arr,
          status:status,
          titulo:titulo,
          uid: idusuario,
          porfecha: porFecha
        }).then(function(i) {
            cod = i.id;
            UIkit.notification({message: "<span uk-icon='icon: calendar'></span> Examen creado con éxito.", 
            pos: 'bottom-center', 
            status: 'primary',
            timeout: 1000 
            });
        }).catch(error=>{
            console.log(error);
        }) 
    }


</script>
    <svelte:head>
        <title>Crear Examenes</title>
        <link href="/quill.snow.css" rel="stylesheet">
    </svelte:head>
    <!-- Body -->

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
             Crear nuevo examen
        </span>
    </div>
</nav>
</div>
</div>


<div class="uk-container">
<FirebaseApp firebase={firebase}>
    <User let:user={user} let:auth={auth} >

<div class="uk-child-width-1-2@s uk-child-width-1-2@m uk-margin-small-top" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body uk-width-1-1"><span class="uk-text-emphasis">{cod}</span>
        </div>
    </div>  
    <div> 
        <div class="uk-card uk-card-default uk-card-body uk-width-1-1">
            <span>El examen tendrá una duración de {Math.floor( d(_i,_f)<0?0:d(_i,_f) )} minutos.</span>
        </div>
    </div> 
</div>
    <fieldset class="uk-fieldset uk-margin-top">
        <legend class="uk-legend"></legend>
        <div class="uk-grid-small" uk-grid>
        <div class="uk-width-1-1 uk-margin-top uk-background-muted uk-padding-small">

<div class="uk-grid-small" uk-grid>

{#if porFecha}
<div class="uk-width-1-2@s">
<input class="uk-checkbox" type="checkbox"  bind:checked={status} >
<span class="uk-text-bold"> Al activar la casilla el examen será visible en la página principal.</span>
</div>
{/if}
<div class="uk-width-1-2@s">
<div class="boundary-align uk-panel">
<input class="uk-checkbox" type="checkbox"  bind:checked={porFecha} >
<span class="uk-text-meta"> Programar examen para una fecha determinada.</span>
    <span uk-icon="icon: info"></span>
    <div uk-drop="pos: bottom-center; boundary: .boundary-align; boundary-align: true">
        <div class="uk-card uk-card-body uk-card-secondary">
           Al crear un examen programado, este será visible para cualquier usuario, pero no podrá realizar el examen si no hasta el día en el que se creó
        </div>
    </div>
</div>
</div>
</div>

</div>
        <div class="uk-width-1-2@s uk-margin-top">
            <input class="uk-input {l(titulo)>8?'uk-form-success':'uk-form-danger'}" type="text" bind:value={titulo} placeholder="Título (+8)">
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <textarea class="uk-textarea {l(descripcion)>8?'uk-form-success':'uk-form-danger'}" rows="3" bind:value={descripcion} placeholder="Descripción (+8)"></textarea>
        </div>
        {#if porFecha}
        <!-- Fechas -->
        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Inicio</label>
            <input class="uk-input {inicia>=finaliza?'uk-form-danger':'uk-form-success'}" 
            type="datetime-local" min={moment().format("YYYY-MM-DDTHH:mm")} bind:value={inicia} 
            on:change={({target: {value}})=> _i = moment(value).valueOf() }
            >
        </div>

        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Fin</label>
            <input class="uk-input {inicia>=finaliza?'uk-form-danger':'uk-form-success'}" 
            type="datetime-local" min={moment().format("YYYY-MM-DDTHH:mm")} bind:value={finaliza} 
            on:change={({target: {value}})=> _f = moment(value).valueOf() }
            >
        </div>
        {:else}
            <!-- Relojes -->
        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Inicio</label>
            <input class="uk-input {inicia>=finaliza?'uk-form-danger':'uk-form-success'}" 
            type="time" bind:value={inicia} 
            on:change={({target: {value}})=> _i = moment(value,"HH:mm") }
            >
        </div>

        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Fin</label>
            <input class="uk-input {inicia>=finaliza?'uk-form-danger':'uk-form-success'}" 
            type="time" bind:value={finaliza} 
            on:change={({target: {value}})=> _f = moment(value, "HH:mm") }
            >
        </div>
        {/if}

         <!-- {inicia}<br>{finaliza}<br>{ moment.duration(moment.utc(moment(_f).diff(moment(_i)))).asMinutes()} -->

        </div>
        <!-- Preguntas para el array -->
        <legend class="uk-legend uk-margin-top uk-margin-bottom"> 
        Tiempo del examen: {Math.floor( d(_i,_f)<0?0:d(_i,_f) )} minutos.
        - 
        Preguntas del examen ({remaining}) </legend>
        
    {#each preguntas as pregunta, i}
        <div class="uk-grid-small" uk-grid>
            <div class="uk-width-1-1">
                <label><input class="uk-checkbox" type=checkbox bind:checked={pregunta.done} > Seleccionar para eliminar la pregunta.</label>
            </div>
            <div class="uk-width-1-1 uk-margin-top">
              <!--  <textarea class="uk-textarea" bind:value={pregunta.text}
                disabled={pregunta.done} 
                placeholder="Qué vas a preguntar?"
                ></textarea> -->

                <div class="uk-padding-small">
                <div class="editor" use:quill={options} on:text-change={e => content[i] = e.detail} ></div>
                </div>

            </div>
        </div>
    {/each}

    <button class="uk-button uk-button-default uk-margin-top" on:click={add}>
    <span uk-icon="icon: plus"></span></button>
    <button class="uk-button uk-button-default uk-margin-top" on:click={clear}>
    <span uk-icon="icon: minus"></span></button>


<div uk-grid>
    <div>
        <div class="uk-inline">
        <button class="uk-button uk-button-primary uk-margin-top uk-button-large" 
        disabled={!remaining>=1 || Math.floor(Number(d(_i,_f)))<=0 || titulo.length<8 || descripcion.length<8 }
        on:click|once={()=> AddData(user.uid) }
        >Crear nuevo examen</button> 
        {#await promise}
            <div uk-spinner></div>
        {/await}
    </div>
</div>

  



    </fieldset>
    <!-- info -->
    <p><span uk-icon="info"></span> El código lo obtendra una vez que termine de crear el examen.</p>
     </User>
</FirebaseApp>
</div>
