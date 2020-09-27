<script>
	
    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/auth";
    const db = firebase.firestore();
    import moment from 'moment';
    import 'moment/locale/es';
    import { Router, Route, Link } from 'yrv';
    import sha512 from 'crypto-js/sha512';
 
    // Prop
    export let examenid;
    export let parauser;
    let promise;

    /* Variable mensaje */
    let mssje = '';
    $: l = mssje.length;

    const sendmsj = async (msj,usuarioid,usuarionombre,urlphoto) =>{
    if(msj==''){
        console.log("El mensaje no pudo ser enviado.")
    }else{
        promise = db.collection(`coments`).add({
            leido:false,
            entregado:false,
            create_at:moment().valueOf(),
            update_at:'',
            examenid:`${examenid}`,
            mensaje: `${msj}`,
            deuserid:`${usuarioid}`, 
            de: `${usuarionombre}`,
            para: `${parauser}`,
            urlphoto:urlphoto,
            devolucion:"",
        }).then(()=>{
        console.log("Mensaje enviado.");
        mssje="";
       }).catch(error=>{
           console.log(error);
       })
     }   
    }

</script>

<FirebaseApp firebase={firebase}>
<User let:user={user} let:auth={auth} >

 <div class="uk-margin">
    <form on:submit|preventDefault={()=>{sendmsj(mssje, user.uid, user.displayName, user.photoURL)}}>
        <div class="uk-margin">
            <div class="uk-inline">
                <a class="uk-form-icon uk-form-icon-flip {l > 60 ? 'uk-disabled uk-text-danger' : '' }" on:click={()=>{sendmsj(mssje, user.uid, user.displayName, user.photoURL)}} href="javascript:void(0)" uk-icon="icon: commenting"></a>
                <input class="uk-input uk-form-width-large" type="text" placeholder="Descargo." bind:value={mssje}>
            </div>
            {#await promise }
                <div uk-spinner></div>
            {/await}
        </div>
        <span class="uk-text-muted uk-float-left">{l} carácteres | {l>60?'Sobrepaso los 60 carácteres.':'No sobrepasar los 60 carácteres.'}</span>
    </form>

    <Collection path={`coments`} query={ref=> ref.where("deuserid","==",`${user.uid}`).where("examenid","==",`${examenid}`) } let:data let:ref >
    <div slot="loading">Cargando..</div>
    	{#each data as doc, index}
        <div class="uk-placeholder">
           <a class="uk-float-right" href="javascript:void(0)" uk-icon="icon: trash" on:click={() => doc.ref.delete() }></a> 
            <dl class="uk-description-list uk-description-list-divider">
                <dt>{ moment(doc.create_at).calendar() }</dt>
                <dd>{doc.mensaje}</dd>
                <dt>{ moment(doc.update_at).isValid()?moment(doc.update_at).calendar():" " }</dt>
                <dd>{doc.devolucion==""?" ": doc.devolucion}</dd>
            </dl>
        </div>
		{/each}
    </Collection>
 </div>
</User>
</FirebaseApp>
