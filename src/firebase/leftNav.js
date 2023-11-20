import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDoc, doc, getDocs, serverTimestamp, setDoc, 
    query, orderBy, limit,
    onSnapshot,
    addDoc,
    collectionGroup
} from 'firebase/firestore'

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

import { getStorage, ref, getDownloadURL } from "firebase/storage";



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
const auth = getAuth(app)
const storage = getStorage(app);






getDocs(query(collectionGroup(db, 'profileInfo')))
.then((snapshot) => {
  snapshot.docs.forEach((doc) =>{
    console.log(`Name: ${doc.data().name.firstName} ${doc.data().name.lastName}`)

    const idContainer = document.getElementById('profile-container')

       
    const submit = document.createElement('button')
    submit.setAttribute('id', 'button_' + doc.data().key.id )
    submit.innerText = `${doc.data().name.firstName} ${doc.data().name.lastName}`
    idContainer.appendChild(submit)


    document.getElementById( 'button_' + doc.data().key.id ).onclick = goToProfile
    function goToProfile(){
      document.querySelector('#homeButton span').style.color = 'inherit'
      $("#subBodyRightSide-maincontent").load("allProfile", {uId : doc.data().key.id}, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "success")
          console.warn("Profile content loaded successfully!");
        if(statusTxt == "error")
          alert("Error: " + xhr.status + ": " + xhr.statusText);
      })
    }
    
  })
})
.catch(err => {
  console.log(err.code)
  console.log(err.message)
 })



