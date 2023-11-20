import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs, getDoc, doc, query, where, 
    setDoc, addDoc, arrayRemove, arrayUnion
} from 'firebase/firestore'
  


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAsbuIIP-ioY7Bcw92t7T4U2zVSdIhSWeU",
    authDomain: "fir-rtc-53633.firebaseapp.com",
    projectId: "fir-rtc-53633",
    storageBucket: "fir-rtc-53633.appspot.com",
    messagingSenderId: "1003982801167",
    appId: "1:1003982801167:web:2e7d1c40b478a67238567a",
    measurementId: "G-7JBN7RRSN8"
  };

//init firebase app
const app = initializeApp(firebaseConfig)

//init services
const db = getFirestore(app)
const collRef = collection(db, "Moments")




for( let i = 0; i < localStorage.getItem("getShowPeerLength"); i++ ) {
    const getForm = document.getElementById('addPeerForm_' + i)

    if(getForm) {
      console.log('exist' + i)
    }

    getForm.addEventListener('submit',async (e) => {
        e.preventDefault()
        
        //console.log(getForm.id.value)
        
        await setDoc(doc(db, 'Moments', localStorage.getItem("myidForAddPeer") ), {
            'call': {
              'to': arrayUnion(getForm.id.value),
              'group': false
            }
        }, {merge:true})

        await setDoc(doc(db, 'Moments', getForm.id.value), {
            'call': {
              'from': arrayUnion( localStorage.getItem("myidForAddPeer") ),
              'status': 'rigning',
              'group': true
            }
        }, {merge:true})
        
    })
}