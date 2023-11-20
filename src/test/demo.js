import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs, getDoc, doc, query, where, 
    setDoc,
    onSnapshot,
    updateDoc,
    deleteField,
    orderBy, limit, serverTimestamp,
    collectionGroup, addDoc
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




const signupForm = document.querySelector('.signup')

signupForm.addEventListener('submit', (e) => {
 	e.preventDefault()

 	const email = signupForm.email.value
  const password = signupForm.password.value
  const firstname = signupForm.firstname.value
  const lastname = signupForm.lastname.value
  console.log( email + password + firstname + lastname)
  localStorage.setItem("mail", email)


  $.ajax({
    url: '/ggg',
    method: "POST",
    data: $(".signup").serialize(),
    success: function(data){
      console.log("in ajax form submitted successfully")
    },
    error: function(data) {
                      
      // Some error in ajax call
      console.log("some Error");
  }
  })
  
})

$(document).ready(function(){

  $("#demoForm").submit(function(ev) {
    ev.preventDefault()
  $.ajax({
    url: '/demoupload',
    type: "POST",
    data: new FormData(this),
    contentType: false,
    processData: false,
    success: function(data){
      console.log("in ajax form submitted successfully")
    },
    error: function(data) {
                      
      // Some error in ajax call
      console.log("some Error");
  }
  })

  })

});




async function go(){

  const q = query(collection(db, "1"), where("dummy", "==", "/edison*"));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data().dummy);
})
}
go()












const WIDTH = 100
const input = document.getElementById("input")

input.addEventListener("change", (event) =>{
  const image_file = event.target.files[0]
  

  const reader = new FileReader
  /*
  ** read the image file
  */
  reader.readAsDataURL(image_file)
  /*
  ** return the data as img tage source URL
  */


  /*
  ** display unchanged image in preview
  */
  reader.onload = (event) => {

    const image_url = event.target.result
    const image = document.createElement("img")
    image.src = image_url



    image.onload = (e) => {
      const canvas = document.createElement("canvas")
      let ratio = WIDTH / e.target.width
      canvas.width = WIDTH
      canvas.height = e.target.height * ratio


      const context = canvas.getContext("2d")
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      
      

      const new_image_url = context.canvas.toDataURL("image/jpeg", 100) // 100 is % of image quality

      urlToFile(new_image_url)

      /*
      ** this is the output of resized image

      const new_image = document.createElement("img")
      new_image.src = new_image_url
      document.getElementById('wrapper').appendChild(new_image)
      */
    }

    //document.getElementById('wrapper').appendChild(image)
    
  }
  
})

const urlToFile = (url) => {
  const arr = url.split(',')
  const mime = arr[0]
  const data = arr[1]
  //console.log(data)

  $.ajax({
    url: '/resizeupload',
    method: "POST",
    data: {croppedImage: data},
    success: function(data){
      console.log(data.afterSuccess)
    },
    error: function(data) {
                      
      // Some error in ajax call
      console.log("some Error in send cropped image");
  }
  })
}






