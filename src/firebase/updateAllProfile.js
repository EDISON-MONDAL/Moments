import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs, getDoc, doc, query, where, 
    setDoc,
    onSnapshot,
    updateDoc,
    deleteField,
    deleteDoc,
    orderBy, limit, serverTimestamp,
    collectionGroup, addDoc,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore'
import {
    getAuth,
    onAuthStateChanged,
    signOut
  } from 'firebase/auth'
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
  


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

const collRef = collection(db, "Moments")

//end database section





//start client side coding
let myId
onAuthStateChanged(auth, (user) => {
  if (user) {
    myId = user.email;

    initialize()
  }
})



const freindButton =  document.getElementById('freindButton') 
const cancelButton =  document.getElementById('cancelButton') 
const messageButton = document.getElementById('messaging')

const audioCallButton = document.getElementById('audioCallButton')
const videoCallButton =  document.getElementById('videoCallButton')



const closeUpdateAllProfile = document.querySelector('#closeUpdateAllProfile')


async function initialize() {
  unsubUpdateProfileData = onSnapshot(doc(db, "Moments", uiD, 'profileInfo', 'credentials'), async (docu) => {
    console.log(docu.data(), docu.id)
    let isThatYou = ''
    if( uiD == myId ){
      isThatYou = '<you>'
      // close
      closeUpdateAllProfile.onclick = ()=>{
        stopAllSnapshot() // in main.ejs

        $("#subBodyRightSide-maincontent").load("allProfile", {uId : myId}, function(responseTxt, statusTxt, xhr){
            if(statusTxt == "success")
              console.warn("Profile content loaded successfully!");
            if(statusTxt == "error")
              alert("Error: " + xhr.status + ": " + xhr.statusText);
        })        
      }
      // close
      // profile pic
        // hide profile pic
        document.querySelector('.hideProfilePic').onclick = async ()=>{
          const getProfilePicRef = query(collection(db, "Moments", uiD, "profilePictures"), where('active', '==', true));
          const showProfilePic = await getDocs(getProfilePicRef);
          showProfilePic.forEach(async (docs) => {
            await setDoc(doc(db, "Moments", uiD, 'profilePictures', docs.id ), {
                active: false,
            },
            { merge: true })
          })
        }
        // hide profile pic

        // add new
        const formAddProfileImg = document.querySelector('#formAddProfileImg')
        const selectNewProfileImage = document.querySelector('#selectNewProfileImage')
        
        let compressed_image_url

        formAddProfileImg.onchange = (e)=>{
          displayProfilePreview = true // preview wizard
          profilePicReviewBeforeUpload() //in main.ejs. perpose to reposition preview pop up

          //resize the raw image
          const formData = new FormData(formAddProfileImg); // create a FormData object from the form data
          $.ajax({
            url: '/resizeNewProfilePic', // your server-side endpoint for handling file uploads
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
              //console.log(data)
              document.getElementById('previewProfileImgTag').src = "data:image/jpeg;base64," + data.base64image
              
              // creat context ( only for convert base64 to image url to upload into firestore )             
                document.getElementById('previewProfileImgTag').onload = (e) => {
                  const canvas = document.createElement("canvas")
                  canvas.width = 1000
                  canvas.height = 500

                  const context = canvas.getContext("2d")
                  context.drawImage(document.getElementById('previewProfileImgTag'), 0, 0, canvas.width, canvas.height)
                  canvas.toBlob((blob) => {
                    compressed_image_url = blob
                  }, 'image/jpeg')
                }
              // creat context ( only for convert base64 to image url to upload into firestore )  
            },
            error: function(xhr, status, error) {
              console.error('Error uploading file:', error);
            }
          });          
        }
        // add new
      // close preview and upload
      document.getElementById("closeaddNewProfileImageWizard").onclick = ()=>{
        displayProfilePreview = false
        document.getElementById('addNewProfileImageWizard').style.top = '-1000px'
      }
      // close preview and upload
      // upload new profile pic
      document.getElementById('submitNewProfileImage').onclick = ()=>{
        
        const file = selectNewProfileImage.files[0]
        
        const metadata = {
          contentType: 'image/jpeg'
        }
  
        const storageRef = ref(storage, 'profilePictures/'+ myId + '/' + file.name + new Date() ); //assign the path of pic
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.warn('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.warn('Upload is paused');
                break;
              case 'running':
                console.warn('Upload is running');
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
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.warn('Original image link: ', downloadURL);
              
              
              // resized and compressed image upoload now
                const storageRefMini = ref(storage, 'profilePictures/'+ myId + '/' + file.name + new Date() + 'mini' ); //assign the path of pic
                const uploadTaskMini = uploadBytesResumable(storageRefMini, compressed_image_url, metadata);
      
                // Listen for state changes, errors, and completion of the upload.
                uploadTaskMini.on('state_changed',
                    (snapshot) => {
                      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                      const progressMini = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.warn('Upload mini is ' + progressMini + '% done');
                      switch (snapshot.state) {
                        case 'paused':
                          console.warn('Upload is paused mini');
                        break;
                        case 'running':
                          console.warn('Upload is running mini');
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
                      // Upload completed successfully, now we can get the download URL
                      getDownloadURL(uploadTaskMini.snapshot.ref).then(async (downloadURLMini) => {
                        console.warn('compressed image available: ', downloadURLMini);

                        const getActiveProfile = query(collection(db, 'Moments', myId, 'profilePictures'), where('active', '==', true));
                        const querySnapshotActiveProfile = await getDocs(getActiveProfile);
                        querySnapshotActiveProfile.forEach(async (docs) => {
                          await setDoc(doc(db, "Moments", myId, "profilePictures", docs.id), {
                            active: false
                          },
                          {merge: true})
                        })

                        await addDoc(collection(db, "Moments", myId, "profilePictures"), {
                          title: downloadURLMini,
                          fullImage: downloadURL,
                          time: serverTimestamp(),
                          active: true
                        })

                        changedInProfilePic = true
                        changedInProfilePicInProfileDescription = true // main.ejs profile link update

                      });
                   }
                )
              // resized and compressed image upoload now
            });
          }
        )
      }
      // upload new profile pic
      // from collection
      const reuseProfilePic = document.querySelector('.reuseProfilePic')
      const closeReuseProfilePic = document.getElementById('closeaAllProfileImageWizard')
      const allPicturesWizard = document.getElementById('allPicturesUpdateProfile')

      reuseProfilePic.onclick = ()=>{
        allPicWizardUpdateProfile = true
        allPicPreviewUpadateAllProfile() //main.ejs
        document.getElementById('body').style.overflow = 'hidden'

        // select all from db
          const subAllPicturesUpdateProfile = document.getElementById('subAllPicturesUpdateProfile')
          let time = null
          let getAllImagesFromDB = null
          function timeUndefined(){
            getAllImagesFromDB = query(collection(db, "Moments", uiD, 'profilePictures'), orderBy("time", "desc"), limit(12) );
            showAllPictures()
          }
          timeUndefined()
          function timeDefined(){
            getAllImagesFromDB = query(collection(db, "Moments", uiD, 'profilePictures'), where('time', '<', time), orderBy("time", "desc"), limit(12) );
            showAllPictures()
          }
          
          let albumPicNumber = 0
          async function showAllPictures(){
          const unsubscribeGetAllImagesFromDB = onSnapshot( getAllImagesFromDB, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
              albumPicNumber++
              time = doc.data().time

              const albumImgHolder = document.createElement('div')              
              albumImgHolder.setAttribute('class', `albumPic albumPic_${albumPicNumber}`)
              subAllPicturesUpdateProfile.appendChild( albumImgHolder )
              

              const browserWidth = document.getElementById('body').offsetWidth
              if ( browserWidth >= 1000) {
                albumImgHolder.style.width = '32%'
                albumImgHolder.style.marginLeft = '0.66%'
                albumImgHolder.style.marginRight = '0.66%'
                albumImgHolder.style.marginTop = '0.5%'
                albumImgHolder.style.marginBottom = '0.5%'
                albumImgHolder.style.height = '33%'
              }


              const img = document.createElement('img')
              img.src = doc.data().title
              albumImgHolder.appendChild( img )
              img.style.width = '100%'
              img.style.height = '100%'
              img.style.objectFit = 'cover'
              img.onclick = ()=>{ onImageSelect( tickImg ); reusePofilePicAgain( doc.id ) }

              

              const tickImg = document.createElement('input')
              tickImg.setAttribute('type', 'checkbox')
              tickImg.setAttribute('class', 'albumCheckbox')
              tickImg.disabled = true
              albumImgHolder.appendChild( tickImg )
            });
          })
          }
          //show more on scroll end
          subAllPicturesUpdateProfile.onscroll = ()=>{
            const length = document.getElementsByClassName('albumPic').length
            let ten = 10
            let eleven = 11
            let twelve = 12
            function increLet(){
                ten + 12
                eleven + 12
                twelve + 12
            }
            if(length >= 12){
                document.querySelector(`.albumPic_${ten}`).onmouseover = ()=>{timeDefined(); increLet() }
                document.querySelector(`.albumPic_${eleven}`).onmouseover = ()=>{timeDefined(); increLet() }
                document.querySelector(`.albumPic_${twelve}`).onmouseover = ()=>{timeDefined(); increLet() }
            }
          }
          //show more on scroll end
          // on Image select uncheck other and select this.
            function onImageSelect( tickImg ){
              const grabTickElem = document.querySelectorAll('.albumCheckbox')                    
              for( let i=0; i< grabTickElem.length; i++){
                grabTickElem[i].checked = false

                if( i+1 == grabTickElem.length){
                    tickImg.checked = true
                }
              }
            }
          // on Image select uncheck other and select this.
          // reuse profile image
            async function reusePofilePicAgain( picId ){
              const uploadProfileFromAlbum = document.querySelector('#uploadProfileFromAlbum')
              uploadProfileFromAlbum.style.right = '1%'
              uploadProfileFromAlbum.style.bottom = '1%'

              const selectReuseButton = document.querySelector('#uploadProfileFromAlbum button')
              selectReuseButton.onclick = async ()=>{
                const getActiveProfile = query(collection(db, 'Moments', myId, 'profilePictures'), where('active', '==', true));
                const querySnapshotActiveProfile = await getDocs(getActiveProfile);
                querySnapshotActiveProfile.forEach(async (docs) => {
                  await setDoc(doc(db, "Moments", myId, "profilePictures", docs.id), {
                    active: false
                  },
                  {merge: true})
                })
                
                changedInProfilePic = true
                changedInProfilePicInProfileDescription = true // main.ejs profile link update

                await setDoc(doc(db, "Moments", myId, "profilePictures", picId ), {
                  active: true
                },
                {merge: true})

                uploadProfileFromAlbum.style.right = '-100px'
                uploadProfileFromAlbum.style.bottom = '-100px'
              }  
            }         
          // reuse profile image
        // select all from db
      }

      closeReuseProfilePic.onclick = ()=>{
        allPicWizardUpdateProfile = false
        allPicturesWizard.style.top = '-1000px'
        document.getElementById('subAllPicturesUpdateProfile').innerHTML = ''
        document.getElementById('body').style.overflow = 'auto'
      }
      // from collection
    }

    //show my picture
      const profilePicContainerOnProfilePage = document.querySelector('#profilePicContainerOnProfilePage')
      const profilePicOnProfilePage = document.getElementById('profilePicOnProfilePage')

      
      const getProfilePicChange = query(collection(db, "Moments", uiD, "profilePictures"));
      let picName = null
      let changedInProfilePic = true
      onSnapshot( getProfilePicChange, (querySnapshot) => {
        picName = null

        querySnapshot.forEach( async (docs) => {
          if( changedInProfilePic == true ){
            changedInProfilePic = false

            const getProfilePicName = query(collection(db, "Moments", uiD, "profilePictures"), where('active', '==', true));

            const showProfilePicName = await getDocs(getProfilePicName);
            showProfilePicName.forEach((doc) => {
                picName = doc.data().title
                showImage()                                
            })  
          }          
        });
        
        showImage()
      })
      
      
      

      function showImage(){
      if( picName == null){
        profilePicContainerOnProfilePage.style.height = '200px'
        profilePicOnProfilePage.style.objectFit = 'contain'
        profilePicOnProfilePage.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
      } else {
  
        const storesRef = ref(storage, picName)
        getDownloadURL(storesRef)
        .then((url) => {
          // Insert url into an <img> tag to "download"
          profilePicOnProfilePage.src = url
          if(document.getElementById('subBodyRightSide-maincontent').offsetWidth >= 1000){
            profilePicContainerOnProfilePage.style.height = '500px'
          } else if(document.getElementById('subBodyRightSide-maincontent').offsetWidth >= 481 && document.getElementById('subBodyRightSide-maincontent').offsetWidth <= 999){
            profilePicContainerOnProfilePage.style.height = '500px'
          } else if( document.getElementById('subBodyRightSide-maincontent').offsetWidth <= 480){
            profilePicContainerOnProfilePage.style.height = '350px'
          }
          profilePicOnProfilePage.style.objectFit = 'cover'
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
            break;
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
            break;
            case 'storage/canceled':
              // User canceled the upload
            break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
            break;
          }
        })
      }
      }
      showImage()
    //show my picture
      
    
  
  // all info
    //name
      // db
      document.querySelector('#profile-info-content-fullName-input').value = DOMPurify.sanitize( docu.data().name.firstName )+' '+ DOMPurify.sanitize( docu.data().name.middleName ) +' '+ DOMPurify.sanitize( docu.data().name.lastName )+' '+ DOMPurify.sanitize( docu.data().name.nickName ) +' '+ isThatYou
      document.querySelector('#profile-info-content-firstName-input').value = DOMPurify.sanitize( docu.data().name.firstName )
      document.querySelector('#profile-info-content-middleName-input').value = DOMPurify.sanitize( docu.data().name.middleName )
      document.querySelector('#profile-info-content-lastName-input').value = DOMPurify.sanitize( docu.data().name.lastName )
      document.querySelector('#profile-info-content-nickName-input').value = DOMPurify.sanitize( docu.data().name.nickName )
      // db
      // input keypress
      document.querySelector('#profile-info-content-firstName-input').onchange = ()=>{nameChange(), updateProfileInfo()}
      document.querySelector('#profile-info-content-middleName-input').onchange = ()=>{nameChange(), updateProfileInfo()}
      document.querySelector('#profile-info-content-lastName-input').onchange = ()=>{nameChange(), updateProfileInfo()}
      document.querySelector('#profile-info-content-nickName-input').onchange = ()=>{nameChange(), updateProfileInfo()}
      function nameChange(){
        

        document.querySelector('#profile-info-content-fullName-input').value = DOMPurify.sanitize( document.querySelector('#profile-info-content-firstName-input').value.trim() ) + ' ' + DOMPurify.sanitize( document.querySelector('#profile-info-content-middleName-input').value.trim() ) + ' ' + DOMPurify.sanitize( document.querySelector('#profile-info-content-lastName-input').value.trim() ) + ' ' + DOMPurify.sanitize( document.querySelector('#profile-info-content-nickName-input').value.trim() ) +' '+ isThatYou
      }
      // input keypress
    // name

    // autobiograph
      document.querySelector('#profile-info-content-autobiograph-input').value = DOMPurify.sanitize( docu.data().autobiograph )
      document.querySelector('#profile-info-content-autobiograph-input').onchange = ()=>{ updateProfileInfo()}
    // autobiograph

    // living place
      // db
      document.querySelector('#profile-info-content-village-living-input').value = DOMPurify.sanitize( docu.data().livingPlace.village )
      document.querySelector('#profile-info-content-postOffice-living-input').value = DOMPurify.sanitize( docu.data().livingPlace.postOffice )
      document.querySelector('#profile-info-content-subDistrice-living-input').value = DOMPurify.sanitize( docu.data().livingPlace.subDistrict )
      document.querySelector('#profile-info-content-district-living-input').value = DOMPurify.sanitize( docu.data().livingPlace.district )
      document.querySelector('#profile-info-content-country-living-input').value = DOMPurify.sanitize( docu.data().livingPlace.country )
      // db
      // input keypress
      document.querySelector('#profile-info-content-village-living-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-postOffice-living-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-subDistrice-living-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-district-living-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-country-living-input').onchange = ()=>{ updateProfileInfo()}
      // input keypress
    // living place

    // birth place
      // db
      document.querySelector('#profile-info-content-village-birthPlace-input').value = DOMPurify.sanitize( docu.data().birthPlace.village )
      document.querySelector('#profile-info-content-postOffice-birthPlace-input').value = DOMPurify.sanitize( docu.data().birthPlace.postOffice )
      document.querySelector('#profile-info-content-subDistrice-birthPlace-input').value = DOMPurify.sanitize( docu.data().birthPlace.subDistrict )
      document.querySelector('#profile-info-content-district-birthPlace-input').value = DOMPurify.sanitize( docu.data().birthPlace.district )
      document.querySelector('#profile-info-content-country-birthPlace-input').value = DOMPurify.sanitize( docu.data().birthPlace.country )
      // db
      // input keypress
      document.querySelector('#profile-info-content-village-birthPlace-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-postOffice-birthPlace-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-subDistrice-birthPlace-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-district-birthPlace-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-country-birthPlace-input').onchange = ()=>{ updateProfileInfo()}
      // input keypress
    // birth place

    // birth date
      // db
      document.querySelector('#profile-info-content-birthDate-input').value = DOMPurify.sanitize( docu.data().birthDate )
      // db
      // input keypress
      document.querySelector('#profile-info-content-birthDate-input').onchange = ()=>{ updateProfileInfo()}
      // input keypress
    // birth date

    // phone nuber
      // db
      document.querySelector('#profile-info-content-phoneNumber-personal-input').value = DOMPurify.sanitize( docu.data().phoneNumber.personal )
      document.querySelector('#profile-info-content-phoneNumber-personal2-input').value = DOMPurify.sanitize( docu.data().phoneNumber.personal2 )
      document.querySelector('#profile-info-content-phoneNumber-home-input').value = DOMPurify.sanitize( docu.data().phoneNumber.home )
      document.querySelector('#profile-info-content-phoneNumber-office-input').value = DOMPurify.sanitize( docu.data().phoneNumber.office )
      // db
      // input keypress
      document.querySelector('#profile-info-content-phoneNumber-personal-input').onkeydown = ()=>{ 
        updateProfileInfo()
        checkPhoneNumberMaxLen( '#profile-info-content-phoneNumber-personal-input' )
      }
      document.querySelector('#profile-info-content-phoneNumber-personal2-input').onkeydown = ()=>{ 
        updateProfileInfo()
        checkPhoneNumberMaxLen( '#profile-info-content-phoneNumber-personal2-input' )
      }
      document.querySelector('#profile-info-content-phoneNumber-home-input').onkeydown = ()=>{ 
        updateProfileInfo()
        checkPhoneNumberMaxLen( '#profile-info-content-phoneNumber-home-input' )
      }
      document.querySelector('#profile-info-content-phoneNumber-office-input').onkeydown = ()=>{ 
        updateProfileInfo()
        checkPhoneNumberMaxLen( '#profile-info-content-phoneNumber-office-input' )
      }

        // maxlength 20
        function checkPhoneNumberMaxLen( fieldId ){
          if( document.querySelector( fieldId ).value.length > 19){
            document.querySelector( fieldId ).value = document.querySelector( fieldId ).value.slice(0,19)
          }
        }
        // maxlength 20
      // input keypress
    // phone nuber

    // email
      // db
      document.querySelector('#profile-info-content-email-personal-input').value = DOMPurify.sanitize( docu.data().email.personal )
      document.querySelector('#profile-info-content-email-business-input').value = DOMPurify.sanitize( docu.data().email.business )
      // db
      // input keypress
      document.querySelector('#profile-info-content-email-personal-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-email-business-input').onchange = ()=>{ updateProfileInfo()}
      // input keypress
    // email

    // website
      // db
      document.querySelector('.profile-info-content-website-title-one').value = DOMPurify.sanitize( docu.data().website.oneTitle )
      document.querySelector('#profile-info-content-website-one-input').value = DOMPurify.sanitize( docu.data().website.one )
      document.querySelector('.profile-info-content-website-title-two').value = DOMPurify.sanitize( docu.data().website.twoTitle )
      document.querySelector('#profile-info-content-website-two-input').value = DOMPurify.sanitize( docu.data().website.two )
      document.querySelector('.profile-info-content-website-title-three').value = DOMPurify.sanitize( docu.data().website.threeTitle )
      document.querySelector('#profile-info-content-website-three-input').value = DOMPurify.sanitize( docu.data().website.three )
      document.querySelector('.profile-info-content-website-title-four').value = DOMPurify.sanitize( docu.data().website.fourTitle )
      document.querySelector('#profile-info-content-website-four-input').value = DOMPurify.sanitize( docu.data().website.four )
      document.querySelector('.profile-info-content-website-title-five').value = DOMPurify.sanitize( docu.data().website.fiveTitle )
      document.querySelector('#profile-info-content-website-five-input').value = DOMPurify.sanitize( docu.data().website.five )
      // db
      // input keypress
      document.querySelector('.profile-info-content-website-title-one').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-website-one-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('.profile-info-content-website-title-two').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-website-two-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('.profile-info-content-website-title-three').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-website-three-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('.profile-info-content-website-title-four').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-website-four-input').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('.profile-info-content-website-title-five').onchange = ()=>{ updateProfileInfo()}
      document.querySelector('#profile-info-content-website-five-input').onchange = ()=>{ updateProfileInfo()}
      // input keypress
    // website

    // profession
      // db
      document.querySelector('#profile-info-content-profession-input').value = DOMPurify.sanitize( docu.data().profession )
      // db
      // input keypress
      document.querySelector('#profile-info-content-profession-input').onchange = ()=>{ updateProfileInfo()}
      // input keypress
    // profession

    // education
      // db
        // post graduate
        document.querySelector('#profile-info-content-education-postgraduate-institution-input').value = DOMPurify.sanitize( docu.data().education.postGraduate.institution )
        document.querySelector('#postgraduate-from input').value = DOMPurify.sanitize( docu.data().education.postGraduate.from )
        document.querySelector('#postgraduate-to input').value = DOMPurify.sanitize( docu.data().education.postGraduate.to )
        document.querySelector('#profile-info-content-education-postgraduate-institution-location-input').value = DOMPurify.sanitize( docu.data().education.postGraduate.location )
        // post graduate
        // graduate
        document.querySelector('#profile-info-content-education-graduate-institution-input').value = DOMPurify.sanitize( docu.data().education.graduate.institution )
        document.querySelector('#graduate-from input').value = DOMPurify.sanitize( docu.data().education.graduate.from )
        document.querySelector('#graduate-to input').value = DOMPurify.sanitize( docu.data().education.graduate.to )
        document.querySelector('#profile-info-content-education-graduate-institution-location-input').value = DOMPurify.sanitize( docu.data().education.graduate.location )
        // graduate
        // higher secondary
        document.querySelector('#profile-info-content-education-higherSeconday-institution-input').value = DOMPurify.sanitize( docu.data().education.higherSecondary.institution )
        document.querySelector('#higherSeconday-from input').value = DOMPurify.sanitize( docu.data().education.higherSecondary.from )
        document.querySelector('#higherSeconday-to input').value = DOMPurify.sanitize( docu.data().education.higherSecondary.to )
        document.querySelector('#profile-info-content-education-higherSeconday-institution-location-input').value = DOMPurify.sanitize( docu.data().education.higherSecondary.location )
        // higher secondary
        // secondary
        document.querySelector('#profile-info-content-education-seconday-institution-input').value = DOMPurify.sanitize( docu.data().education.secondary.institution )
        document.querySelector('#seconday-from input').value = DOMPurify.sanitize( docu.data().education.secondary.from )
        document.querySelector('#seconday-to input').value = DOMPurify.sanitize( docu.data().education.secondary.to )
        document.querySelector('#profile-info-content-education-seconday-institution-location-input').value = DOMPurify.sanitize( docu.data().education.secondary.location )
        // secondary
        // elementary
        document.querySelector('#profile-info-content-education-elementary-input').value = DOMPurify.sanitize( docu.data().education.elementary.institution )
        document.querySelector('#elementary-from input').value = DOMPurify.sanitize( docu.data().education.elementary.from )
        document.querySelector('#elementary-to input').value = DOMPurify.sanitize( docu.data().education.elementary.to )
        document.querySelector('#profile-info-content-education-elementary-location-input').value = DOMPurify.sanitize( docu.data().education.elementary.location )
        // elementary
      // db
      // input keypress
        // post graduate
        document.querySelector('#profile-info-content-education-postgraduate-institution-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#postgraduate-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#postgraduate-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-education-postgraduate-institution-location-input').onchange = ()=>{ updateProfileInfo()}
        // post graduate
        // graduate
        document.querySelector('#profile-info-content-education-graduate-institution-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#graduate-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#graduate-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-education-graduate-institution-location-input').onchange = ()=>{ updateProfileInfo()}
        // graduate
        // higher secondary
        document.querySelector('#profile-info-content-education-higherSeconday-institution-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#higherSeconday-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#higherSeconday-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-education-higherSeconday-institution-location-input').onchange = ()=>{ updateProfileInfo()}
        // higher secondary
        // secondary
        document.querySelector('#profile-info-content-education-seconday-institution-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#seconday-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#seconday-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-education-seconday-institution-location-input').onchange = ()=>{ updateProfileInfo()}
        // secondary
        // elementary
        document.querySelector('#profile-info-content-education-elementary-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#elementary-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#elementary-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-education-elementary-location-input').onchange = ()=>{ updateProfileInfo()}
        // elementary
      // input keypress
    // education

    // company
      // db
        // one
        document.querySelector('#profile-info-content-company-one-input').value = DOMPurify.sanitize( docu.data().company.one.organization )
        document.querySelector('#company-one-from input').value = DOMPurify.sanitize( docu.data().company.one.from )
        document.querySelector('#company-one-to input').value = DOMPurify.sanitize( docu.data().company.one.to )
        document.querySelector('#profile-info-content-company-one-location-input').value = DOMPurify.sanitize( docu.data().company.one.location )
        // one
        // two
        document.querySelector('#profile-info-content-company-two-input').value = DOMPurify.sanitize( docu.data().company.two.organization )
        document.querySelector('#company-two-from input').value = DOMPurify.sanitize( docu.data().company.two.from )
        document.querySelector('#company-two-to input').value = DOMPurify.sanitize( docu.data().company.two.to )
        document.querySelector('#profile-info-content-company-two-location-input').value = DOMPurify.sanitize( docu.data().company.two.location )
        // two
        // three
        document.querySelector('#profile-info-content-company-three-input').value = DOMPurify.sanitize( docu.data().company.three.organization )
        document.querySelector('#company-three-from input').value = DOMPurify.sanitize( docu.data().company.three.from )
        document.querySelector('#company-three-to input').value = DOMPurify.sanitize( docu.data().company.three.to )
        document.querySelector('#profile-info-content-company-three-location-input').value = DOMPurify.sanitize( docu.data().company.three.location )
        // three
      // db
      // input keypress
        // one
        document.querySelector('#profile-info-content-company-one-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#company-one-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#company-one-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-company-one-location-input').onchange = ()=>{ updateProfileInfo()}
        // one
        // two
        document.querySelector('#profile-info-content-company-two-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#company-two-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#company-two-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-company-two-location-input').onchange = ()=>{ updateProfileInfo()}
        // two
        // three
        document.querySelector('#profile-info-content-company-three-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#company-three-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#company-three-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-company-three-location-input').onchange = ()=>{ updateProfileInfo()}
        // three
      // input keypress
    // company

    // business
      // db
        // one
        document.querySelector('#profile-info-content-business-one-input').value = DOMPurify.sanitize( docu.data().business.one.name )
        document.querySelector('#business-one-from input').value = DOMPurify.sanitize( docu.data().business.one.from )
        document.querySelector('#business-one-to input').value = DOMPurify.sanitize( docu.data().business.one.to )
        document.querySelector('#profile-info-content-business-one-location-input').value = DOMPurify.sanitize( docu.data().business.one.location )
        // one
        // two
        document.querySelector('#profile-info-content-business-two-input').value = DOMPurify.sanitize( docu.data().business.two.name )
        document.querySelector('#business-two-from input').value = DOMPurify.sanitize( docu.data().business.two.from )
        document.querySelector('#business-two-to input').value = DOMPurify.sanitize( docu.data().business.two.to )
        document.querySelector('#profile-info-content-business-two-location-input').value = DOMPurify.sanitize( docu.data().business.two.location )
        // two
        // three
        document.querySelector('#profile-info-content-business-three-input').value = DOMPurify.sanitize( docu.data().business.three.name )
        document.querySelector('#business-three-from input').value = DOMPurify.sanitize( docu.data().business.three.from )
        document.querySelector('#business-three-to input').value = DOMPurify.sanitize( docu.data().business.three.to )
        document.querySelector('#profile-info-content-business-three-location-input').value = DOMPurify.sanitize( docu.data().business.three.location )
        // three
      // db
      // input keypress
        // one
        document.querySelector('#profile-info-content-business-one-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#business-one-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#business-one-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-business-one-location-input').onchange = ()=>{ updateProfileInfo()}
        // one
        // two
        document.querySelector('#profile-info-content-business-two-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#business-two-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#business-two-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-business-two-location-input').onchange = ()=>{ updateProfileInfo()}
        // two
        // three
        document.querySelector('#profile-info-content-business-three-input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#business-three-from input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#business-three-to input').onchange = ()=>{ updateProfileInfo()}
        document.querySelector('#profile-info-content-business-three-location-input').onchange = ()=>{ updateProfileInfo()}
        // three
      // input keypress
    // business

    // passion
      // db
      document.querySelector('#profile-info-content-passion-input').value = DOMPurify.sanitize( docu.data().passion )
      // db
      // input keypress
      document.querySelector('#profile-info-content-passion-input').onchange = ()=>{ updateProfileInfo()}
      // input keypress
    // passion

    // religion
      // db
      document.querySelector('#profile-info-content-religion-input').value = DOMPurify.sanitize( docu.data().religion )
      // db
      // input keypress
      document.querySelector('#profile-info-content-religion-input').onchange = ()=>{ updateProfileInfo()}
      // input keypress
    // religion

    // politics
      // db
      document.querySelector('#profile-info-content-poitics-input').value = DOMPurify.sanitize( docu.data().politics )
      // db
      // input keypress
      document.querySelector('#profile-info-content-poitics-input').onchange = ()=>{ updateProfileInfo()}
      // input keypress
    // politics



    // submit
      async function updateProfileInfo(){
        const updateButton = document.querySelector('#updateProfileInfo')
        updateButton.style.right = '10px'
        updateButton.style.bottom = '5px'

        document.querySelector('#updateProfileInfo button').onclick = async ()=>{

            await setDoc(doc(db, "Moments", myId, 'profileInfo', 'credentials'), {
                name: {
                    fullName: DOMPurify.sanitize( document.querySelector('#profile-info-content-firstName-input').value.trim() ) + ' ' + DOMPurify.sanitize( document.querySelector('#profile-info-content-middleName-input').value.trim() ) + ' ' + DOMPurify.sanitize( document.querySelector('#profile-info-content-lastName-input').value.trim() ) + ' ' + DOMPurify.sanitize( document.querySelector('#profile-info-content-nickName-input').value.trim() ),
                    firstName: DOMPurify.sanitize( document.querySelector('#profile-info-content-firstName-input').value.trim() ),
                    middleName: DOMPurify.sanitize( document.querySelector('#profile-info-content-middleName-input').value.trim() ),
                    lastName: DOMPurify.sanitize( document.querySelector('#profile-info-content-lastName-input').value.trim() ),
                    nickName: DOMPurify.sanitize( document.querySelector('#profile-info-content-nickName-input').value.trim() )
                },
                autobiograph: DOMPurify.sanitize( document.querySelector('#profile-info-content-autobiograph-input').value ),
                livingPlace: {
                  village: DOMPurify.sanitize( document.querySelector('#profile-info-content-village-living-input').value ),
                  postOffice: DOMPurify.sanitize( document.querySelector('#profile-info-content-postOffice-living-input').value ),
                  subDistrict: DOMPurify.sanitize( document.querySelector('#profile-info-content-subDistrice-living-input').value ),
                  district: DOMPurify.sanitize( document.querySelector('#profile-info-content-district-living-input').value ),
                  country: DOMPurify.sanitize( document.querySelector('#profile-info-content-country-living-input').value )
                },
                birthPlace: {
                  village: DOMPurify.sanitize( document.querySelector('#profile-info-content-village-birthPlace-input').value ),
                  postOffice: DOMPurify.sanitize( document.querySelector('#profile-info-content-postOffice-birthPlace-input').value ),
                  subDistrict: DOMPurify.sanitize( document.querySelector('#profile-info-content-subDistrice-birthPlace-input').value ),
                  district: DOMPurify.sanitize( document.querySelector('#profile-info-content-district-birthPlace-input').value ),
                  country: DOMPurify.sanitize( document.querySelector('#profile-info-content-country-birthPlace-input').value )
                },
                birthDate : DOMPurify.sanitize( document.querySelector('#profile-info-content-birthDate-input').value ),
                phoneNumber: {
                  personal: DOMPurify.sanitize( document.querySelector('#profile-info-content-phoneNumber-personal-input').value ),
                  personal2: DOMPurify.sanitize( document.querySelector('#profile-info-content-phoneNumber-personal2-input').value ),
                  home: DOMPurify.sanitize( document.querySelector('#profile-info-content-phoneNumber-home-input').value ),
                  office: DOMPurify.sanitize( document.querySelector('#profile-info-content-phoneNumber-office-input').value )
                },
                email: {
                  personal: DOMPurify.sanitize( document.querySelector('#profile-info-content-email-personal-input').value),
                  business: DOMPurify.sanitize( document.querySelector('#profile-info-content-email-business-input').value)
                },
                website: {
                  oneTitle: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-one').value),
                  one: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-one-input').value),
                  twoTitle: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-two').value),
                  two: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-two-input').value),
                  threeTitle: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-three').value),
                  three: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-three-input').value),
                  fourTitle: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-four').value),
                  four: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-four-input').value),
                  fiveTitle: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-five').value),
                  five: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-five-input').value)
                },
                profession: DOMPurify.sanitize( document.querySelector('#profile-info-content-profession-input').value),
                education: {
                  postGraduate: {
                    institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-postgraduate-institution-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#postgraduate-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#postgraduate-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-postgraduate-institution-location-input').value),
                  },
                  graduate: {
                    institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-graduate-institution-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#graduate-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#graduate-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-graduate-institution-location-input').value),
                  },
                  higherSecondary: {
                    institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-higherSeconday-institution-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#higherSeconday-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#higherSeconday-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-higherSeconday-institution-location-input').value),
                  },
                  secondary: {
                    institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-seconday-institution-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#seconday-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#seconday-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-seconday-institution-location-input').value),
                  },
                  elementary: {
                    institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-elementary-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#elementary-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#elementary-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-elementary-location-input').value),
                  }
                },
                company: {
                  one: {
                    organization: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-one-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#company-one-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#company-one-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-one-location-input').value),
                  },
                  two: {
                    organization: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-two-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#company-two-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#company-two-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-two-location-input').value),
                  },
                  three: {
                    organization: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-three-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#company-three-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#company-three-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-three-location-input').value),
                  }
                },
                business: {
                  one: {
                    name: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-one-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#business-one-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#business-one-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-one-location-input').value),
                  },
                  two: {
                    name: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-two-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#business-two-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#business-two-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-two-location-input').value),
                  },
                  three: {
                    name: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-three-input').value),
                    from: DOMPurify.sanitize( document.querySelector('#business-three-from input').value),
                    to: DOMPurify.sanitize( document.querySelector('#business-three-to input').value),
                    location: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-three-location-input').value),
                  }
                },
                passion: DOMPurify.sanitize( document.querySelector('#profile-info-content-passion-input').value),
                religion: DOMPurify.sanitize( document.querySelector('#profile-info-content-religion-input').value),
                politics: DOMPurify.sanitize( document.querySelector('#profile-info-content-poitics-input').value)
            },
            {merge: true})
        }
      }
    // submit
  // all info

  // lookup for change in subdody width and adjust css  in pc only
    if( window.innerWidth >= 1000){
      let changeInFullWidth_updateProfile = true     
      let changeInReducedWidth_updateProfile = true

      setInterval(()=>{
        const subBodyRightSideMainContent = document.getElementById('subBodyRightSide-maincontent').offsetWidth
        if(subBodyRightSideMainContent == 1000 && changeInFullWidth_updateProfile == true){
          fullWidth()   
        } else if (subBodyRightSideMainContent == 765 && changeInReducedWidth_updateProfile == true){
          reducedWidth()
        }
      },1000)

      function fullWidth(){
        changeInFullWidth_updateProfile = false
        changeInReducedWidth_updateProfile = true

        if(document.querySelector('.profile-info-content-name-two')){
          document.querySelector('.profile-info-content-name-two').style.width = '878px'
        }
        if(document.querySelector('.profile-info-content-autobiograph-two')){
          document.querySelector('.profile-info-content-autobiograph-two').style.width = '848px'
          document.querySelector('.profile-info-content-autobiograph-two').style.height = '320px'
          document.querySelector('.profile-info-content-autobiograph-one').style.height = '320px'
        }
        if(document.querySelector('.profile-info-content-livingPlace-two')){
          document.querySelector('.profile-info-content-livingPlace-two').style.width = '848px'
        }
        if(document.querySelector('.profile-info-content-birthPlace-two')){
          document.querySelector('.profile-info-content-birthPlace-two').style.width = '848px'
        }
        if(document.querySelector('.profile-info-content-birthDate-two')){
          document.querySelector('.profile-info-content-birthDate-two').style.width = '868px'
        }
        if(document.querySelector('.profile-info-content-phoneNumber-two')){
          document.querySelector('.profile-info-content-phoneNumber-two').style.width = '848px'
        }
        if(document.querySelector('.profile-info-content-email-two')){
          document.querySelector('.profile-info-content-email-two').style.width = '878px'
        }
        if(document.querySelector('.profile-info-content-website-two')){
          document.querySelector('.profile-info-content-website-two').style.width = '878px'
        }
        if(document.querySelector('.profile-info-content-profession-two')){
          document.querySelector('.profile-info-content-profession-two').style.width = '858px'
        }
        if(document.querySelector('.profile-info-content-education-two')){
          document.querySelector('.profile-info-content-education-two').style.width = '868px'
          document.querySelector('.profile-info-content-education-one').style.height = '1290px'
          document.querySelector('.profile-info-content-education-one span').style.marginTop = '620px'
          const nodeList = document.querySelectorAll(".education-location-textarea");
          for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].style.height = '80px'
          }
        }
        if(document.querySelector('.profile-info-content-company-two')){
          document.querySelector('.profile-info-content-company-two').style.width = '858px'
          document.querySelector('.profile-info-content-company-one').style.height = '782px'
          document.querySelector('.profile-info-content-company-one span').style.marginTop = '380px'
        }
        if(document.querySelector('.profile-info-content-business-two')){
          document.querySelector('.profile-info-content-business-two').style.width = '858px'
          document.querySelector('.profile-info-content-business-one').style.height = '782px'
          document.querySelector('.profile-info-content-business-one span').style.marginTop = '380px'
        }
        if(document.querySelector('.profile-info-content-passion-two')){
          document.querySelector('.profile-info-content-passion-two').style.width = '868px'
        }
        if(document.querySelector('.profile-info-content-religion-two')){
          document.querySelector('.profile-info-content-religion-two').style.width = '878px'
        }
        if(document.querySelector('.profile-info-content-poitics-two')){
          document.querySelector('.profile-info-content-poitics-two').style.width = '888px'
        }
      }
      function reducedWidth(){
        changeInFullWidth_updateProfile = true
        changeInReducedWidth_updateProfile = false

        if(document.querySelector('.profile-info-content-name-two')){
          document.querySelector('.profile-info-content-name-two').style.width = '648px'
        }
        if(document.querySelector('.profile-info-content-autobiograph-two')){
          document.querySelector('.profile-info-content-autobiograph-two').style.width = '618px'
          document.querySelector('.profile-info-content-autobiograph-two').style.height = '400px'
          document.querySelector('.profile-info-content-autobiograph-one').style.height = '400px'
        }
        if(document.querySelector('.profile-info-content-livingPlace-two')){
          document.querySelector('.profile-info-content-livingPlace-two').style.width = '618px'
        }
        if(document.querySelector('.profile-info-content-birthPlace-two')){
          document.querySelector('.profile-info-content-birthPlace-two').style.width = '618px'
        }
        if(document.querySelector('.profile-info-content-birthDate-two')){
          document.querySelector('.profile-info-content-birthDate-two').style.width = '638px'
        }
        if(document.querySelector('.profile-info-content-phoneNumber-two')){
          document.querySelector('.profile-info-content-phoneNumber-two').style.width = '618px'
        }
        if(document.querySelector('.profile-info-content-email-two')){
          document.querySelector('.profile-info-content-email-two').style.width = '648px'
        }
        if(document.querySelector('.profile-info-content-website-two')){
          document.querySelector('.profile-info-content-website-two').style.width = '648px'
        }
        if(document.querySelector('.profile-info-content-profession-two')){
          document.querySelector('.profile-info-content-profession-two').style.width = '628px'
        }
        if(document.querySelector('.profile-info-content-education-two')){
          document.querySelector('.profile-info-content-education-two').style.width = '638px'
          document.querySelector('.profile-info-content-education-one').style.height = '1390px'
          document.querySelector('.profile-info-content-education-one span').style.marginTop = '660px'
          const nodeList = document.querySelectorAll(".education-location-textarea");
          for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].style.height = '100px'
          }
        }
        if(document.querySelector('.profile-info-content-company-two')){
          document.querySelector('.profile-info-content-company-two').style.width = '628px'
          document.querySelector('.profile-info-content-company-one').style.height = '842px'
          document.querySelector('.profile-info-content-company-one span').style.marginTop = '400px'
        }
        if(document.querySelector('.profile-info-content-business-two')){
          document.querySelector('.profile-info-content-business-two').style.width = '628px'
          document.querySelector('.profile-info-content-business-one').style.height = '842px'
          document.querySelector('.profile-info-content-business-one span').style.marginTop = '400px'
        }
        if(document.querySelector('.profile-info-content-passion-two')){
          document.querySelector('.profile-info-content-passion-two').style.width = '638px'
        }
        if(document.querySelector('.profile-info-content-religion-two')){
          document.querySelector('.profile-info-content-religion-two').style.width = '648px'
        }
        if(document.querySelector('.profile-info-content-poitics-two')){
          document.querySelector('.profile-info-content-poitics-two').style.width = '658px'
        }
      }
    }
  // lookup for change in subdody width and adjust css  in pc only

     
    
})
}









