<script>
	
    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/auth";
    const db = firebase.firestore();
    import moment from 'moment';
    import 'moment/locale/es';
    import { Router, Route, Link } from 'yrv';
    import sha512 from 'crypto-js/sha512';

</script>


<FirebaseApp firebase={firebase}>
<User let:user={user} let:auth={auth} >

<Collection path={`coments`} query={ref=>ref.where("para", "==", `${user.uid}` ).where("leido", "==", false) } let:data let:ref>
    <Link href="/{sha512('mensajes')}/{user.uid}"> 
        <span class="uk-badge uk-background-secondary">{data.length}</span><span class="uk-margin-right uk-text-secondary" uk-icon="icon: commenting"></span>
    </Link> 
</Collection>
</User>
</FirebaseApp>