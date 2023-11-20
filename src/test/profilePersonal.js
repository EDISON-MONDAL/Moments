import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs,
    query, orderBy, limit,
    addDoc, serverTimestamp
} from 'firebase/firestore'

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth'

import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL  } from "firebase/storage"


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
const storage = getStorage(app)

let myId
onAuthStateChanged(auth, (user) => {
  if (user) {
    myId = user.email;

    displayPosts()
  }
})


//Display posts
async function displayPosts(){
  const getPost = query(collection(db, "Moments", myId, "posts"), orderBy("time", "desc"), limit(12));
  const extractPost = await getDocs(getPost);
  extractPost.forEach((doc) => {
    console.log(doc.id+" "+ doc.data().postText)

    const createParagraph = document.createElement('p')
    createParagraph.innerText = doc.data().postText
    document.getElementById('displayPosts').appendChild(createParagraph)
  })
}
//end of display posts




//upload profile picture
$(document).ready(function(){

$("#uploadProfilePic").submit(function (ev){
  ev.preventDefault()
  
  const file = document.getElementById('photo').files[0]

  const metadata = {
    contentType: 'image/jpeg'
  }

  
const storageRef = ref(storage, 'profilePictures/'+ myId + '/' + file.name); //firebase storage sarver
const uploadTask = uploadBytesResumable(storageRef, file, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, 
  async () => {
    await addDoc(collection(db, "Moments", myId, "profilePictures"), {
      title: file.name,
      time: serverTimestamp()
    })
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });

    

    //now upload in mySql
    
    const WIDTH = 200

  const image_file = file
  

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
  


const urlToFile = (url) => {
  const arr = url.split(',')
  const mime = arr[0]
  const data = arr[1]
  //console.log(data)

  $.ajax({
    url: '/uploadProfilePictureInMysql',
    method: "POST",
    data: {
      croppedImage: data,
      myid : myId
    },
    success: function(data){
      console.log(data.mysqlSuccess)
    },
    error: function(data) {
                      
      // Some error in ajax call
      console.log("some Error in uploading profile picture in mysql");
  }
  })
}
 //now upload in mysql


  }
)
})

})
//upload profile picture

