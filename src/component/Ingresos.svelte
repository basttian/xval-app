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
    import sha512 from 'crypto-js/sha512';

    const delIngreso = async (i) => {
    	console.log(i);
    }
 

</script>
    <svelte:head>
        <title>Ingresos</title>
        <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    </svelte:head>
    <!-- Body -->
<FirebaseApp firebase={firebase}>
<User let:user={user} let:auth={auth} >

<nav class="uk-navbar-transparent" uk-navbar>
    <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
            <li class="uk-active"><Link go="back" ><span class="uk-margin-small-right" uk-icon="icon:  arrow-left; ratio: 2" uk-tooltip="title: Atras; pos: right"></span></Link></li>
        </ul>
    </div>
    <div class="uk-navbar-right">
        <ul class="uk-navbar-nav">      
        <li class="uk-active"><Link href="/{sha512('respuestas')}/{id}" ><span class="uk-margin-small-right" uk-icon="icon: folder; ratio: 2" uk-tooltip="title: Corregir examenes; pos: left"></span></Link></li>
        </ul>
    </div>
</nav>



<Collection  path={`examenes`} query={ (ref) => ref.where("uid","==",`${user.uid}`)} let:data let:ref log>
<div class="uk-container uk-margin-top" slot="loading"><div uk-spinner></div></div>
<div class="uk-container uk-margin-top" slot="fallback">
    Unable to display ...
</div>
<!-- Verificamos si puede visualizar el componente ingresos -->
{#if data.length === 0}
    <div class="uk-container uk-margin-top">
        <div class="uk-alert-uk-alert-primary" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: info"></span> Nada para mostrar.</p>
        </div>
    </div>
{:else}

<div class="uk-container">
	
<Collection path={`ingresos`} query={ (ref) => ref.where("codigodeExamen","==",`${id}`)} let:data let:ref log>
<div class="uk-container uk-margin-top" slot="loading"><div uk-spinner></div></div>
<div class="uk-container uk-margin-top" slot="fallback">
    Unable to display ...
</div>

<div class="uk-overflow-auto">
<table class="uk-table uk-table-small uk-table-divider">
	<caption>Administrar ingresos para este examen.</caption>
    <thead>
        <tr>
            <th>Usuario</th>
            <th>Ingreso</th>
            <th>Op.</th>
        </tr>
    </thead>
    <tbody>
    	{#each data as item, index}
	    	<tr>
	            <td>{item.nombre}</td>
	            <td>{moment(item.ingreso).format("LLLL")}</td>
	            <td><button class="uk-button uk-button-text" on:click={()=> {
					UIkit.modal.confirm(`Esta seguro que desea eliminar el ingreso de ${item.nombre}.`).then(function() {
                    item.ref.delete().then(()=>{
                    UIkit.notification({message: `<span uk-icon='icon: trash'></span> Ingreso eliminado éxitosamente.`, pos: 'bottom-center', status: 'danger'})
                    })
                }, function () {
                    UIkit.notification({message: "<span uk-icon='icon: warning'></span> Operación cancelada.", pos: 'bottom-center', status: 'primary'})
                })}}> <span uk-icon="icon: close"></span> </button> </td>
	        </tr>	
    	{/each}
    </tbody>
</table>
<p><span class="uk-label uk-label-danger">Importante!!</span> Para habilitar el ingreso al examen nuevamente, debe eliminar el registro.Una vez eliminado el registro el estudiante podra ingresar al examen, pero no podra realizarlo hasta que se elimine el examen previo.</p>
</div>


</Collection>
</div>


{/if}
</Collection>

</User>
</FirebaseApp>