<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";
const db = firebase.firestore();
import { Router, Route, Link } from 'yrv';
// router not  use
export let router = {};
import sha512 from 'crypto-js/sha512';

let promise;

const delExamen = async(id) =>{
    UIkit.modal.confirm('Si acepta, se eliminarán permanentemente los datos de este examen, incluidos todos los documentos, mensajes, notas e ingresos anidados a el.!').then(async function() {
      promise = db.collection("examenes").doc(`${id}`).delete().then( async function() {
        await db.collection('ingresos').where("codigodeExamen","==", `${id}`).get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc) {
                  db.collection("ingresos").doc(`${doc.id}`).delete();
                });
            });
        await db.collection('respuestas').where("idexamen","==", `${id}`).get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc) {
                  db.collection("respuestas").doc(`${doc.id}`).delete();
                });
            });
        await db.collection('coments').where("examenid","==", `${id}`).get()
            .then(function(querySnapshot){
                querySnapshot.forEach(function(doc) {
                  db.collection("coments").doc(`${doc.id}`).delete();
                });
            });
        UIkit.notification({
                message: '<span uk-icon="icon: trash"></span> Examen eliminado correctamente.',
                status: 'danger',
                pos: 'bottom-center',
                timeout: 1500
            }); 
            console.log("Documents successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        console.log('Confirmed.')
    }, function () {
            UIkit.notification({
                message: '<span uk-icon="icon: check"></span> Cancelado.',
                status: 'primary',
                pos: 'bottom-center',
                timeout: 1500
            });
        console.log('Rejected.')
    })
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
            message: "<span uk-icon='icon: check'></span> Copiado!",
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
        <title>Mis Examenes</title>
    </svelte:head>
 
    <!-- Body -->
<div class="uk-container uk-margin-top">

<FirebaseApp firebase={firebase}>
<User let:user={user} let:auth={auth} >
	<Collection 
    path={'examenes'} 
    query={ (ref) => ref.where("uid","==", user.uid) } 
    log
    let:data
    let:ref
	>
    <div slot="loading"><div uk-spinner></div></div>

{#if data.length === 0}
    <div class="uk-container">
        <div class="uk-alert-uk-alert-primary" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: info"></span> Aun no has creado examenes.</p>
        </div>
    </div>
{:else}
<div class="uk-child-width-1-1@s uk-child-width-1-2@m uk-grid-small uk-grid-match" uk-grid uk-scrollspy="cls: uk-animation-slide-bottom; target: .uk-card; delay: 300; repeat: false">
    {#each data as item}
    <div>
        <div class="uk-card uk-card-secondary uk-card-hover uk-card-body">
            <ul uk-accordion="multiple: true">
                <li>
                    <a class="uk-accordion-title" href="#"><span uk-icon="icon: grid"></span></a>
                    <div class="uk-accordion-content">


                <div class="uk-flex">

                    <Link class="uk-margin-auto-right uk-link-reset uk-icon-link" href="/{sha512('update')}/{item.id}" uk-icon="icon: file-edit; ratio:2" uk-tooltip="Editar." > </Link>
                    <Link class="uk-margin-auto-right uk-link-reset uk-icon-link" href="/{sha512('respuestas')}/{item.id}" uk-icon="icon: folder; ratio:2" uk-tooltip="Corregir examenes."> </Link>
                    <Link class="uk-margin-auto-right uk-link-reset uk-icon-link" href="/{sha512('ingresos')}/{item.id}" uk-icon="icon: database; ratio:2" uk-tooltip="Administrar ingresos."> </Link>
                    <a class="uk-margin-auto-right uk-link-reset uk-icon-link" href="javascript:void(0)" uk-tooltip="Eliminar." uk-icon="icon:trash; ratio:2" on:click={()=> delExamen(item.id) } > </a>

                </div>                  


                    </div>
                </li>
            </ul>
            <h3 class="uk-card-title">{item.titulo}</h3>
            <p>{item.descripcion}</p>
            <div class="uk-margin uk-align-center">
                <div class="uk-inline">
                    <a class="uk-form-icon uk-form-icon-flip" href="javascript:void(0)" uk-icon="icon: copy"
                    on:click={()=> copyTextToClipboard(item.id) } uk-tooltip="Copiar código"> </a>
                    <input class="uk-input uk-form-blank uk-form-width-large" type="text" 
                    value={item.id}
                    disabled={true} >
                </div>
            </div>
        </div>
  
        {#await promise}
            <div class="uk-position-cover uk-overlay 
                        uk-overlay-default uk-flex uk-flex-center uk-flex-middle">
                <div uk-spinner="ratio: 3"></div>
            </div> 
        {/await}

      </div>
    {/each}
</div>
{/if}
<!-- Si hay un error -->
<div slot="fallback">
    Unable to display data...
</div>
</Collection>

<!-- Boton mis examenes -->
<span class="btn-flotante uk-margin"> 
    <Link 
        class="uk-link-reset uk-margin-small-right"  
        href="/{sha512('new')}" 
        uk-tooltip="title: Nuevo examen; pos: top">
        <span class="uk-icon-button uk-background-secondary" uk-icon="icon: plus"></span>
    </Link>
</span>
</User>
</FirebaseApp>
</div>

