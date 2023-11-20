import { initializeApp } from 'firebase/app'
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
const storage = getStorage(app)

//end database section








// close
  closeUpdateAllProfile_updateProfile.onclick = ()=>{
    $("#subBodyRightSide-maincontent").load("/profile", {uId : uiD_update_profile, admin: true}, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "success")
          console.warn("Profile content loaded successfully!");
        if(statusTxt == "error")
          alert("Can't load profile page! Error: " + xhr.status + ": " + xhr.statusText);
    })     
  }
// close







/* firebase */

    // profile pic
      // hide profile pic
        document.querySelector('.hideProfilePic').onclick = async ()=>{
            /*
            const getProfilePicRef = query(collection(db, "Moments", uiD, "profilePictures"), where('active', '==', true));
            const showProfilePic = await getDocs(getProfilePicRef);
            showProfilePic.forEach(async (docs) => {
              await setDoc(doc(db, "Moments", uiD, 'profilePictures', docs.id ), {
                  active: false,
              },
              { merge: true })
            })
            */
        }
      // hide profile pic

  
      // add new
        const formAddProfileImg = document.querySelector('#formAddProfileImg')
        const selectNewProfileImage = document.querySelector('#selectNewProfileImage')
          
        let compressed_image_url
  
        formAddProfileImg.onchange = (e)=>{
            displayProfilePreview = true // preview wizard
            profilePicReviewBeforeUpload() //in main.ejs. perpose to reposition preview pop up

            // get raw image dimensions
                const rawImg = document.createElement('img')  // not appended to html

                const reader = new FileReader();
                reader.onload = function() {                  
                    rawImg.src = reader.result;
                    rawImg.onload = (e)=>{                        
                        let retio = 2000/e.target.width
                        let height = Math.round(e.target.height * retio)

                        sendAjaxRequest( 2000, height)
                    }
                    
                };
                reader.readAsDataURL(e.target.files[0]);              
            // get raw image dimensions

  
            function sendAjaxRequest( imgWIDTH, imgHEIGHT){
              const formData = new FormData(formAddProfileImg); // create a FormData object from the form data
              formData.append("width", imgWIDTH)
              formData.append("height", imgHEIGHT)

              $.ajax({
                url: '/resizeNewProfilePic', // your server-side endpoint for handling file uploads
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                  //console.log(data)
                  document.getElementById('previewProfileImgTag').src = "data:image/jpeg;base64," + data.base64image // main.ejs
                
                  // creat context ( only for convert base64 to image url to upload into firestore )             
                    document.getElementById('previewProfileImgTag').onload = (e) => {  // main.ejs
                      const canvas = document.createElement("canvas")
                      canvas.width = imgWIDTH
                      canvas.height = imgHEIGHT
                    
  
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


          // unresized
          /*    
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
                
                  uploadResizedImage()
                
                });
            }
          )
          */
          // unresized

          // resized
            function uploadResizedImage(){
                
                const storageRefMini = ref(storage, 'profilePictures/'+ uiD_update_profile + '/' + new Date() + '_mini_' + file.name  ); //assign the path of pic
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
                          
                        /*
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
                        */

                        $.ajax({
                            url: '/mongoJs/profileUpdate/postProfilePic', // Replace with your server endpoint
                            type: 'PUT',
                            data: {title: downloadURLMini, id: uiD_update_profile},
                            success: async function(response) {
                              if(response == 'success' && response != null){
                                console.warn("Successfully posted profile pic!")
                              
                                setTimeout(()=>{
                                    showImage()
                                }, 1000)
                  
                              } else {
                                console.warn("Can't post profile pic!" + response)
                              }
                            },
                            error: function(error) {
                              if(error == 'error' && error != null){
                                console.warn("Can't post profile pic!" + error) 
                              }
                            }
                        })



                        // changedInProfilePic = true
                        // changedInProfilePicInProfileDescription = true // main.ejs profile link update

                      });
                   }
                )
              
            }
            uploadResizedImage()
          // resized
        }
      // upload new profile pic
        
        /*
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
      */
  
      //show my picture
        const profilePicContainerOnProfilePage = document.querySelector('#profilePicContainerOnProfilePage')
        const profilePicOnProfilePage = document.getElementById('profilePicOnProfilePage')
  
        function showImage(){
          // Send AJAX request to Node.js server
          $(document).ready(function(){
            $.ajax({
              url: '/mongoJs/profileUpdate/getProfilePic', // Replace with your server endpoint
              type: 'POST',
              data: {id: uiD_profile},
              success: async function(response) {
                if(response != 'error' && response != null){
                  console.warn("Successfully received current profile pic!")
           
                  getProfilePic( response )
  
                } else {
                  console.warn("Can't load current profile pic!" + response)

                  cantLoadProfilePic()
                }
              },
              error: function(error) {
                if(error == 'error' && error != null){
                  console.warn("Can't load current profile pic!" + error) 

                  cantLoadProfilePic()
                }
              }
            })
          })


          function cantLoadProfilePic() {
            profilePicContainerOnProfilePage.style.height = '200px'
            profilePicOnProfilePage.style.objectFit = 'contain'
            profilePicOnProfilePage.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
          } 
    
          function getProfilePic(url){
            const storesRef = ref(storage, url)
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
       
/* firebase */



async function initialize() {   
    
      

      /*
      
    */
    
  /*
  // all info
    //name
      // db
      
      // db
      // input keypress
      
      // input keypress
    // name

    // autobiograph
      
    // autobiograph

    // living place
      // db
      
      
      
      // db
      // input keypress
      
      // input keypress
    // living place

    // birth place
      // db
      
      
      
      // db
      // input keypress
      
      // input keypress
    // birth place

    // birth date
      // db
      
      
      
      // db
      // input keypress
      
      // input keypress
    // birth date

    // phone nuber
      // db
      
      
      
      // db
      // input keypress
      
      // input keypress
    // phone nuber

    // email
      // db
      
      
      
      // db
      // input keypress
      
      // input keypress
    // email

    // website
      // db
      
      
      
      // db
      // input keypress
      
      // input keypress
    // website

    // profession
      // db
      
      
      
      // db
      // input keypress
      
      // input keypress
    // profession

    // education
      // db
      
        
      // db


      // input keypress
        
      // input keypress
    // education

    // company
      // db
      
        
        
      // db
      // input keypress
        
      // input keypress
    // company

    // business
      // db
      
        
        
      // db
      // input keypress
        
      // input keypress
    // business

    // passion
      // db
      
      
      // db
      // input keypress
      
      // input keypress
    // passion

    // religion
      // db
      
      
      
      // db
      // input keypress
      
      // input keypress
    // religion

    // politics
      // db
      
      
      
      // db
      // input keypress
      
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

*/



      

}
// initialize() // default execution










// get data form mongodb 
  
    function getCurrentProfileData() {
        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/profileUpdate/getProfile', // Replace with your server endpoint
            type: 'POST',
            data: {id: uiD_profile},
            success: async function(response) {
              if(response != 'error' && response != null){
                console.warn("Successfully received current profile data!")
         
                updateHTML( response )

              } else {
                console.warn("Can't load current profile data!" + response)
              }
            },
            error: function(error) {
              if(error == 'error' && error != null){
                console.warn("Can't load current profile data!" + error) 
              }
            }
          })
        })
    }
    getCurrentProfileData()




    // update html
      function updateHTML(DATA) {
          // name
            document.querySelector('#profile-info-content-fullName-input').value = DOMPurify.sanitize( DATA.name.fullName ) +' (you)'
          
            document.querySelector('#profile-info-content-firstName-input').value = DOMPurify.sanitize( DATA.name.firstName )
      
            document.querySelector('#profile-info-content-middleName-input').value = DOMPurify.sanitize( DATA.name.middleName )
      
            document.querySelector('#profile-info-content-lastName-input').value = DOMPurify.sanitize( DATA.name.lastName )
      
            document.querySelector('#profile-info-content-nickName-input').value = DOMPurify.sanitize( DATA.name.nickName )
          // name

          // autobiograph
            document.querySelector('#profile-info-content-autobiograph-input').value = DOMPurify.sanitize( DATA.autobiograph )
          // autobiograph

          // living place
            document.querySelector('#profile-info-content-village-living-input').value = DOMPurify.sanitize( DATA.livingPlace.village )
            document.querySelector('#profile-info-content-postOffice-living-input').value = DOMPurify.sanitize( DATA.livingPlace.postOffice )
            document.querySelector('#profile-info-content-subDistrice-living-input').value = DOMPurify.sanitize( DATA.livingPlace.subDistrict )
            document.querySelector('#profile-info-content-district-living-input').value = DOMPurify.sanitize( DATA.livingPlace.district )
            document.querySelector('#profile-info-content-country-living-input').value = DOMPurify.sanitize( DATA.livingPlace.country )
          // living place

          // birth place
            document.querySelector('#profile-info-content-village-birthPlace-input').value = DOMPurify.sanitize( DATA.birthPlace.village )
            document.querySelector('#profile-info-content-postOffice-birthPlace-input').value = DOMPurify.sanitize( DATA.birthPlace.postOffice )
            document.querySelector('#profile-info-content-subDistrice-birthPlace-input').value = DOMPurify.sanitize( DATA.birthPlace.subDistrict )
            document.querySelector('#profile-info-content-district-birthPlace-input').value = DOMPurify.sanitize( DATA.birthPlace.district )
            document.querySelector('#profile-info-content-country-birthPlace-input').value = DOMPurify.sanitize( DATA.birthPlace.country )
          // birth place
        
          // birth date
            document.querySelector('#profile-info-content-birthDate-input').value = DOMPurify.sanitize( new Date(DATA.birthDate).toISOString().split('T')[0] )
          // birth date

          // phone nuber      
            document.querySelector('#profile-info-content-phoneNumber-personal-input').value = DOMPurify.sanitize( DATA.phoneNumber.personal )
            document.querySelector('#profile-info-content-phoneNumber-personal2-input').value = DOMPurify.sanitize( DATA.phoneNumber.personal2 )
            document.querySelector('#profile-info-content-phoneNumber-home-input').value = DOMPurify.sanitize( DATA.phoneNumber.home )
            document.querySelector('#profile-info-content-phoneNumber-office-input').value = DOMPurify.sanitize( DATA.phoneNumber.office )
          // phone nuber

          // email      
            document.querySelector('#profile-info-content-email-personal-input').value = DOMPurify.sanitize( DATA.email.personal )
            document.querySelector('#profile-info-content-email-business-input').value = DOMPurify.sanitize( DATA.email.business )
          // email

          // website
            document.querySelector('.profile-info-content-website-title-one').value = DOMPurify.sanitize( DATA.website.one.title )
            document.querySelector('#profile-info-content-website-one-input').value = DOMPurify.sanitize( DATA.website.one.url )
            document.querySelector('.profile-info-content-website-title-two').value = DOMPurify.sanitize( DATA.website.two.title )
            document.querySelector('#profile-info-content-website-two-input').value = DOMPurify.sanitize( DATA.website.two.url )
            document.querySelector('.profile-info-content-website-title-three').value = DOMPurify.sanitize( DATA.website.three.title )
            document.querySelector('#profile-info-content-website-three-input').value = DOMPurify.sanitize( DATA.website.three.url )
            document.querySelector('.profile-info-content-website-title-four').value = DOMPurify.sanitize( DATA.website.four.title )
            document.querySelector('#profile-info-content-website-four-input').value = DOMPurify.sanitize( DATA.website.four.url )
            document.querySelector('.profile-info-content-website-title-five').value = DOMPurify.sanitize( DATA.website.five.title )
            document.querySelector('#profile-info-content-website-five-input').value = DOMPurify.sanitize( DATA.website.five.url )
          // website

          // profession
            document.querySelector('#profile-info-content-profession-input').value = DOMPurify.sanitize( DATA.profession )
          // profession
      
    
          // education 
            // post graduate
              document.querySelector('#profile-info-content-education-postgraduate-institution-input').value = DOMPurify.sanitize( DATA.education.postGraduate.institution )
              if( DATA.education.postGraduate.from != null ){
                document.querySelector('#postgraduate-from input').value = DOMPurify.sanitize( new Date(DATA.education.postGraduate.from).toISOString().split('T')[0] )
              }
              if( DATA.education.postGraduate.to != null ) {
                document.querySelector('#postgraduate-to input').value = DOMPurify.sanitize( new Date(DATA.education.postGraduate.to).toISOString().split('T')[0] )
              }              
              document.querySelector('#profile-info-content-education-postgraduate-institution-location-input').value = DOMPurify.sanitize( DATA.education.postGraduate.location )
            // post graduate
            
            // graduate
              document.querySelector('#profile-info-content-education-graduate-institution-input').value = DOMPurify.sanitize( DATA.education.graduate.institution )
              if( DATA.education.graduate.from != null ){
                document.querySelector('#graduate-from input').value = DOMPurify.sanitize( new Date(DATA.education.graduate.from).toISOString().split('T')[0] )
              }
              if( DATA.education.graduate.to != null ){
                document.querySelector('#graduate-to input').value = DOMPurify.sanitize( new Date(DATA.education.graduate.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-education-graduate-institution-location-input').value = DOMPurify.sanitize( DATA.education.graduate.location )
            // graduate
            
            // higher secondary
              document.querySelector('#profile-info-content-education-higherSeconday-institution-input').value = DOMPurify.sanitize( DATA.education.higherSecondary.institution )
              if( DATA.education.higherSecondary.from != null ){
                document.querySelector('#higherSeconday-from input').value = DOMPurify.sanitize( new Date(DATA.education.higherSecondary.from).toISOString().split('T')[0] )
              }
              if( DATA.education.higherSecondary.to != null ){
                document.querySelector('#higherSeconday-to input').value = DOMPurify.sanitize( new Date(DATA.education.higherSecondary.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-education-higherSeconday-institution-location-input').value = DOMPurify.sanitize( DATA.education.higherSecondary.location )
            // higher secondary
            
            // secondary
              document.querySelector('#profile-info-content-education-seconday-institution-input').value = DOMPurify.sanitize( DATA.education.secondary.institution )
              if( DATA.education.secondary.from != null ){
                document.querySelector('#seconday-from input').value = DOMPurify.sanitize( new Date(DATA.education.secondary.from).toISOString().split('T')[0] )
              }
              if( DATA.education.secondary.to != null ){
                document.querySelector('#seconday-to input').value = DOMPurify.sanitize( new Date(DATA.education.secondary.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-education-seconday-institution-location-input').value = DOMPurify.sanitize( DATA.education.secondary.location )
            // secondary
            
            // elementary
              document.querySelector('#profile-info-content-education-elementary-input').value = DOMPurify.sanitize( DATA.education.elementary.institution )
              if( DATA.education.elementary.from != null ){
                document.querySelector('#elementary-from input').value = DOMPurify.sanitize( new Date(DATA.education.elementary.from).toISOString().split('T')[0] )
              }
              if( DATA.education.elementary.to != null ){
                document.querySelector('#elementary-to input').value = DOMPurify.sanitize( new Date(DATA.education.elementary.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-education-elementary-location-input').value = DOMPurify.sanitize( DATA.education.elementary.location )
            // elementary            
          // education 

          // company      
            // one
              document.querySelector('#profile-info-content-company-one-input').value = DOMPurify.sanitize( DATA.company.one.organization )
              if( DATA.company.one.from != null ){
                document.querySelector('#company-one-from input').value = DOMPurify.sanitize( new Date(DATA.company.one.from).toISOString().split('T')[0] )
              }
              if( DATA.company.one.to != null ){
                document.querySelector('#company-one-to input').value = DOMPurify.sanitize( new Date(DATA.company.one.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-company-one-location-input').value = DOMPurify.sanitize( DATA.company.one.location )
            // one
            // two
              document.querySelector('#profile-info-content-company-two-input').value = DOMPurify.sanitize( DATA.company.two.organization )
              if( DATA.company.two.from != null ){
                document.querySelector('#company-two-from input').value = DOMPurify.sanitize( new Date(DATA.company.two.from).toISOString().split('T')[0] )
              }
              if( DATA.company.two.to != null ){
                document.querySelector('#company-two-to input').value = DOMPurify.sanitize( new Date(DATA.company.two.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-company-two-location-input').value = DOMPurify.sanitize( DATA.company.two.location )
            // two
            // three
              document.querySelector('#profile-info-content-company-three-input').value = DOMPurify.sanitize( DATA.company.three.organization )
              if( DATA.company.three.from != null ){
                document.querySelector('#company-three-from input').value = DOMPurify.sanitize( new Date(DATA.company.three.from).toISOString().split('T')[0] )
              }
              if( DATA.company.three.to != null ){
                document.querySelector('#company-three-to input').value = DOMPurify.sanitize( new Date(DATA.company.three.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-company-three-location-input').value = DOMPurify.sanitize( DATA.company.three.location )
            // three
          // company  

          // business
            // one
              document.querySelector('#profile-info-content-business-one-input').value = DOMPurify.sanitize( DATA.business.one.name )
              if( DATA.business.one.from != null ){
                document.querySelector('#business-one-from input').value = DOMPurify.sanitize( new Date(DATA.business.one.from).toISOString().split('T')[0] )
              }
              if( DATA.business.one.to != null ){
                document.querySelector('#business-one-to input').value = DOMPurify.sanitize( new Date(DATA.business.one.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-business-one-location-input').value = DOMPurify.sanitize( DATA.business.one.location )
            // one
            // two
              document.querySelector('#profile-info-content-business-two-input').value = DOMPurify.sanitize( DATA.business.two.name )
              if( DATA.business.two.from != null ){
                document.querySelector('#business-two-from input').value = DOMPurify.sanitize( new Date(DATA.business.two.from).toISOString().split('T')[0] )
              }
              if( DATA.business.two.to != null ){
                document.querySelector('#business-two-to input').value = DOMPurify.sanitize( new Date(DATA.business.two.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-business-two-location-input').value = DOMPurify.sanitize( DATA.business.two.location )
            // two
            // three
              document.querySelector('#profile-info-content-business-three-input').value = DOMPurify.sanitize( DATA.business.three.name )
              if ( DATA.business.three.from != null ){
                document.querySelector('#business-three-from input').value = DOMPurify.sanitize( new Date(DATA.business.three.from).toISOString().split('T')[0] )
              }
              if( DATA.business.three.to != null ){
                document.querySelector('#business-three-to input').value = DOMPurify.sanitize( new Date(DATA.business.three.to).toISOString().split('T')[0] )
              }
              document.querySelector('#profile-info-content-business-three-location-input').value = DOMPurify.sanitize( DATA.business.three.location )
            // three
          // business

          // passion
            document.querySelector('#profile-info-content-passion-input').value = DOMPurify.sanitize( DATA.passion )
          // passion

          // religion
            document.querySelector('#profile-info-content-religion-input').value = DOMPurify.sanitize( DATA.religion )
          // religion

          // politics
            document.querySelector('#profile-info-content-poitics-input').value = DOMPurify.sanitize( DATA.politics )
          // politics
    
      }
    // update html
  
// get data form mongodb 








// submit updated profile     
    // Send AJAX request to Node.js server
    $(document).ready(function(){
      $("#updateProfileInfo button").click(function(){  

        const serializeObject = {
            id: uiD_profile,

            // name
              firstName: DOMPurify.sanitize( document.querySelector('#profile-info-content-firstName-input').value.trim() ),
              middleName: DOMPurify.sanitize( document.querySelector('#profile-info-content-middleName-input').value.trim() ),
              lastName: DOMPurify.sanitize( document.querySelector('#profile-info-content-lastName-input').value.trim() ),
              nickName: DOMPurify.sanitize( document.querySelector('#profile-info-content-nickName-input').value.trim() ),
            // name

            // autobiograph
              autobiograph: DOMPurify.sanitize( document.querySelector('#profile-info-content-autobiograph-input').value.trim() ),
            // autobiograph

            // living place
               livingPlace_village: DOMPurify.sanitize( document.querySelector('#profile-info-content-village-living-input').value.trim() ),
               livingPlace_postOffice: DOMPurify.sanitize( document.querySelector('#profile-info-content-postOffice-living-input').value.trim() ),
               livingPlace_subDistrict: DOMPurify.sanitize( document.querySelector('#profile-info-content-subDistrice-living-input').value.trim() ),
               livingPlace_district: DOMPurify.sanitize( document.querySelector('#profile-info-content-district-living-input').value.trim() ),
               livingPlace_country: DOMPurify.sanitize( document.querySelector('#profile-info-content-country-living-input').value.trim() ),               
            // living place

            // birth place
               birthPlace_village: DOMPurify.sanitize( document.querySelector('#profile-info-content-village-birthPlace-input').value.trim() ),
               birthPlace_postOffice: DOMPurify.sanitize( document.querySelector('#profile-info-content-postOffice-birthPlace-input').value.trim() ),
               birthPlace_subDistrict: DOMPurify.sanitize( document.querySelector('#profile-info-content-subDistrice-birthPlace-input').value.trim() ),
               birthPlace_district: DOMPurify.sanitize( document.querySelector('#profile-info-content-district-birthPlace-input').value.trim() ),
               birthPlace_country: DOMPurify.sanitize( document.querySelector('#profile-info-content-country-birthPlace-input').value.trim() ),               
            // birth place

            // birth date
                birthDate: DOMPurify.sanitize( document.querySelector('#profile-info-content-birthDate-input').value.trim() ),
            // birth date

            // phone number
                phoneNumber_personal : DOMPurify.sanitize( document.querySelector('#profile-info-content-phoneNumber-personal-input').value.trim() ),
                phoneNumber_personal2 : DOMPurify.sanitize( document.querySelector('#profile-info-content-phoneNumber-personal2-input').value.trim() ),
                phoneNumber_home : DOMPurify.sanitize( document.querySelector('#profile-info-content-phoneNumber-home-input').value.trim() ),
                phoneNumber_office : DOMPurify.sanitize( document.querySelector('#profile-info-content-phoneNumber-office-input').value.trim() ),
            // phone number

            // email
                email_personal: DOMPurify.sanitize( document.querySelector('#profile-info-content-email-personal-input').value.trim() ),
                email_business: DOMPurify.sanitize( document.querySelector('#profile-info-content-email-business-input').value.trim() ),
            // email

            // website
                website_one_title: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-one').value.trim() ),
                website_one_url: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-one-input').value.trim() ),
                website_two_title: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-two').value.trim() ),
                website_two_url: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-two-input').value.trim() ),
                website_three_title: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-three').value.trim() ),
                website_three_url: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-three-input').value.trim() ),
                website_four_title: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-four').value.trim() ),
                website_four_url: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-four-input').value.trim() ),
                website_five_title: DOMPurify.sanitize( document.querySelector('.profile-info-content-website-title-five').value.trim() ),
                website_five_url: DOMPurify.sanitize( document.querySelector('#profile-info-content-website-five-input').value.trim() ),
            // website

            // profession
                profession: DOMPurify.sanitize( document.querySelector('#profile-info-content-profession-input').value.trim() ),
            // profession

            // education
              // post graduate
                education_postGraduate_institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-postgraduate-institution-input').value.trim() ),
                education_postGraduate_from: DOMPurify.sanitize( document.querySelector('#postgraduate-from input').value.trim() ),
                education_postGraduate_to: DOMPurify.sanitize( document.querySelector('#postgraduate-to input').value.trim() ),
                education_postGraduate_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-postgraduate-institution-location-input').value.trim() ),
              // post graduate

              // graduate
                education_graduate_institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-graduate-institution-input').value.trim() ),
                education_graduate_from: DOMPurify.sanitize( document.querySelector('#graduate-from input').value.trim() ),
                education_graduate_to: DOMPurify.sanitize( document.querySelector('#graduate-to input').value.trim() ),
                education_graduate_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-graduate-institution-location-input').value.trim() ),
              // graduate

              // higher secondary
                education_higherSecondary_institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-higherSeconday-institution-input').value.trim() ),
                education_higherSecondary_from: DOMPurify.sanitize( document.querySelector('#higherSeconday-from input').value.trim() ),
                education_higherSecondary_to: DOMPurify.sanitize( document.querySelector('#higherSeconday-to input').value.trim() ),
                education_higherSecondary_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-higherSeconday-institution-location-input').value.trim() ),
              // higher secondary

              // secondary
                education_secondary_institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-seconday-institution-input').value.trim() ),
                education_secondary_from: DOMPurify.sanitize( document.querySelector('#seconday-from input').value.trim() ),
                education_secondary_to: DOMPurify.sanitize( document.querySelector('#seconday-to input').value.trim() ),
                education_secondary_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-seconday-institution-location-input').value.trim() ),
              // secondary

              // elementary
                education_elementary_institution: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-elementary-input').value.trim() ),
                education_elementary_from: DOMPurify.sanitize( document.querySelector('#elementary-from input').value.trim() ),
                education_elementary_to: DOMPurify.sanitize( document.querySelector('#elementary-to input').value.trim() ),
                education_elementary_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-education-elementary-location-input').value.trim() ),
              // elementary
            // education
            
            // company
              // one
                company_one_organization: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-one-input').value.trim() ),
                company_one_from: DOMPurify.sanitize( document.querySelector('#company-one-from input').value.trim() ),
                company_one_to: DOMPurify.sanitize( document.querySelector('#company-one-to input').value.trim() ),
                company_one_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-one-location-input').value.trim() ),
              // one
              // two
                company_two_organization: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-two-input').value.trim() ),
                company_two_from: DOMPurify.sanitize( document.querySelector('#company-two-from input').value.trim() ),
                company_two_to: DOMPurify.sanitize( document.querySelector('#company-two-to input').value.trim() ),
                company_two_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-two-location-input').value.trim() ),
              // two
              // three
                company_three_organization: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-three-input').value.trim() ),
                company_three_from: DOMPurify.sanitize( document.querySelector('#company-three-from input').value.trim() ),
                company_three_to: DOMPurify.sanitize( document.querySelector('#company-three-to input').value.trim() ),
                company_three_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-company-three-location-input').value.trim() ),
              // three
            // company
            
            // business
              // one
                business_one_name: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-one-input').value.trim() ),
                business_one_from: DOMPurify.sanitize( document.querySelector('#business-one-from input').value.trim() ),
                business_one_to: DOMPurify.sanitize( document.querySelector('#business-one-to input').value.trim() ),
                business_one_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-one-location-input').value.trim() ),
              // one
              // two
                business_two_name: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-two-input').value.trim() ),
                business_two_from: DOMPurify.sanitize( document.querySelector('#business-two-from input').value.trim() ),
                business_two_to: DOMPurify.sanitize( document.querySelector('#business-three-to input').value.trim() ),
                business_two_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-two-location-input').value.trim() ),
              // two
              // three
                business_three_name: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-three-input').value.trim() ),
                business_three_from: DOMPurify.sanitize( document.querySelector('#business-three-from input').value.trim() ),
                business_three_to: DOMPurify.sanitize( document.querySelector('#business-three-to input').value.trim() ),
                business_three_location: DOMPurify.sanitize( document.querySelector('#profile-info-content-business-three-location-input').value.trim() ),
              // three
            // business

            // passion
              passion: DOMPurify.sanitize( document.querySelector('#profile-info-content-passion-input').value.trim() ),
            // passion

            // religion
              religion: DOMPurify.sanitize( document.querySelector('#profile-info-content-religion-input').value.trim() ),
            // religion

            // politics
              politics: DOMPurify.sanitize( document.querySelector('#profile-info-content-poitics-input').value.trim() ),
            // politics
        }

        


        $.ajax({
          url: '/mongoJs/profileUpdate/postProfile', // Replace with your server endpoint
          type: 'PUT',
          data: serializeObject,
          success: async function(response) {
            if(response == 'success' && response != null){
              console.warn("Successfully posted current profile data!")
            
              setTimeout(()=>{
                getCurrentProfileData()
              }, 3000)

            } else {
              console.warn("Can't post current profile data!" + response)
            }
          },
          error: function(error) {
            if(error == 'error' && error != null){
              console.warn("Can't post current profile data!" + error) 
            }
          }
        })
      })
    })





    // on key press
      // show submit button
        function showSubmitButton(){
          const updateButton = document.querySelector('#updateProfileInfo')
          updateButton.style.right = '10px'
          updateButton.style.bottom = '5px'
        }
      // show submit button



      // maxlength 
        function checkMaxLen( fieldId, maxLength ){
          if( document.querySelector( fieldId ).value.length > maxLength){
            document.querySelector( fieldId ).value = document.querySelector( fieldId ).value.slice(0, maxLength)
          }
        }
      // maxlength 



      // name
        document.querySelector('#profile-info-content-firstName-input').onkeyup = nameChange
        document.querySelector('#profile-info-content-middleName-input').onkeyup = nameChange
        document.querySelector('#profile-info-content-lastName-input').onkeyup = nameChange
        document.querySelector('#profile-info-content-nickName-input').onkeyup = nameChange
      
        function nameChange(){
          document.querySelector('#profile-info-content-fullName-input').value = DOMPurify.sanitize( document.querySelector('#profile-info-content-firstName-input').value.trim() ) + ' ' + DOMPurify.sanitize( document.querySelector('#profile-info-content-middleName-input').value.trim() ) + ' ' + DOMPurify.sanitize( document.querySelector('#profile-info-content-lastName-input').value.trim() ) + ' ' + DOMPurify.sanitize( document.querySelector('#profile-info-content-nickName-input').value.trim() ) +' (you)'

          showSubmitButton()
        }
      // name

      // autobiograph
        document.querySelector('#profile-info-content-autobiograph-input').onkeyup = showSubmitButton
      // autobiograph

      // living place
        document.querySelector('#profile-info-content-village-living-input').onkeyup = showSubmitButton
        document.querySelector('#profile-info-content-postOffice-living-input').onkeyup = showSubmitButton
        document.querySelector('#profile-info-content-subDistrice-living-input').onkeyup = showSubmitButton
        document.querySelector('#profile-info-content-district-living-input').onkeyup = showSubmitButton
        document.querySelector('#profile-info-content-country-living-input').onkeyup = showSubmitButton    
      // living place

      // birth place
        document.querySelector('#profile-info-content-village-birthPlace-input').onkeyup = showSubmitButton
        document.querySelector('#profile-info-content-postOffice-birthPlace-input').onkeyup = showSubmitButton
        document.querySelector('#profile-info-content-subDistrice-birthPlace-input').onkeyup = showSubmitButton
        document.querySelector('#profile-info-content-district-birthPlace-input').onkeyup = showSubmitButton
        document.querySelector('#profile-info-content-country-birthPlace-input').onkeyup = showSubmitButton
      // birth place

      // birth date
        document.querySelector('#profile-info-content-birthDate-input').onchange = showSubmitButton
      // birth date

      // phone number
        document.querySelector('#profile-info-content-phoneNumber-personal-input').onkeydown = ()=>{ 
          showSubmitButton()
          checkMaxLen( '#profile-info-content-phoneNumber-personal-input', 19 )
        }
        document.querySelector('#profile-info-content-phoneNumber-personal2-input').onkeydown = ()=>{ 
          showSubmitButton()
          checkMaxLen( '#profile-info-content-phoneNumber-personal2-input', 19 )
        }
        document.querySelector('#profile-info-content-phoneNumber-home-input').onkeydown = ()=>{ 
          showSubmitButton()
          checkMaxLen( '#profile-info-content-phoneNumber-home-input', 19 )
        }
        document.querySelector('#profile-info-content-phoneNumber-office-input').onkeydown = ()=>{ 
          showSubmitButton()
          checkMaxLen( '#profile-info-content-phoneNumber-office-input', 19 )
        }        
      // phone number

      // email
        document.querySelector('#profile-info-content-email-personal-input').onkeyup = ()=>{ showSubmitButton()}
        document.querySelector('#profile-info-content-email-business-input').onkeyup = ()=>{ showSubmitButton()}     
      // email

      // website
        document.querySelector('.profile-info-content-website-title-one').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '.profile-info-content-website-title-one', 50 )
        }
        document.querySelector('#profile-info-content-website-one-input').onkeyup = ()=>{ showSubmitButton()}
        document.querySelector('.profile-info-content-website-title-two').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '.profile-info-content-website-title-two', 50 )
        }
        document.querySelector('#profile-info-content-website-two-input').onkeyup = ()=>{ showSubmitButton()}
        document.querySelector('.profile-info-content-website-title-three').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '.profile-info-content-website-title-three', 50 )
        }
        document.querySelector('#profile-info-content-website-three-input').onkeyup = ()=>{ showSubmitButton()}
        document.querySelector('.profile-info-content-website-title-four').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '.profile-info-content-website-title-four', 50 )
        }
        document.querySelector('#profile-info-content-website-four-input').onkeyup = ()=>{ showSubmitButton()}
        document.querySelector('.profile-info-content-website-title-five').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '.profile-info-content-website-title-five', 50 )
        }
        document.querySelector('#profile-info-content-website-five-input').onkeyup = ()=>{ showSubmitButton()}      
      // website

      // profession
        document.querySelector('#profile-info-content-profession-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-profession-input', 100 )
        }
      // profession


      // education
        // post graduate
          document.querySelector('#profile-info-content-education-postgraduate-institution-input').onkeyup = ()=>{  
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-postgraduate-institution-input', 150)
          }
          document.querySelector('#postgraduate-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#postgraduate-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-education-postgraduate-institution-location-input').onkeyup = ()=>{   
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-postgraduate-institution-location-input', 300)
          }
        // post graduate
        // graduate
          document.querySelector('#profile-info-content-education-graduate-institution-input').onkeyup = ()=>{  
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-graduate-institution-input', 150)
          }
          document.querySelector('#graduate-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#graduate-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-education-graduate-institution-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-graduate-institution-location-input', 300)
          }
        // graduate
        // higher secondary
          document.querySelector('#profile-info-content-education-higherSeconday-institution-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-higherSeconday-institution-input', 150)
          }
          document.querySelector('#higherSeconday-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#higherSeconday-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-education-higherSeconday-institution-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-higherSeconday-institution-location-input', 300)
          }
        // higher secondary
        // secondary
          document.querySelector('#profile-info-content-education-seconday-institution-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-seconday-institution-input', 150)
          }
          document.querySelector('#seconday-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#seconday-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-education-seconday-institution-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-seconday-institution-location-input', 300)
          }
        // secondary
        // elementary
          document.querySelector('#profile-info-content-education-elementary-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-elementary-input', 150)
          }
          document.querySelector('#elementary-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#elementary-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-education-elementary-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-education-elementary-location-input', 300)
          }
        // elementary
      // education

      // company
        // one
          document.querySelector('#profile-info-content-company-one-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-company-one-input', 150)
          }
          document.querySelector('#company-one-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#company-one-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-company-one-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-company-one-location-input', 300)
          }
        // one
        // two
          document.querySelector('#profile-info-content-company-two-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-company-two-input', 150)
          }
          document.querySelector('#company-two-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#company-two-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-company-two-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-company-two-location-input', 300)
          }
        // two
        // three
          document.querySelector('#profile-info-content-company-three-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-company-three-input', 150)
          }
          document.querySelector('#company-three-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#company-three-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-company-three-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-company-three-location-input', 300)
          }
        // three
      // company

      // business
        // one
          document.querySelector('#profile-info-content-business-one-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-business-one-input', 150)
          }
          document.querySelector('#business-one-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#business-one-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-business-one-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-business-one-location-input', 300)
          }
        // one
        // two
          document.querySelector('#profile-info-content-business-two-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-business-two-input', 150)
          }
          document.querySelector('#business-two-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#business-two-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-business-two-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-business-two-location-input', 300)
          }
        // two
        // three
          document.querySelector('#profile-info-content-business-three-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-business-three-input', 150)
          }
          document.querySelector('#business-three-from input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#business-three-to input').onkeyup = ()=>{ showSubmitButton()}
          document.querySelector('#profile-info-content-business-three-location-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-business-three-location-input', 300)
          }
        // three
      // business

      // passion
        document.querySelector('#profile-info-content-passion-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-passion-input', 200)
        }
      // passion

      // religion
        document.querySelector('#profile-info-content-religion-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-religion-input', 20)
        }
      // religion

      // politics
        document.querySelector('#profile-info-content-poitics-input').onkeyup = ()=>{ 
            showSubmitButton()
            checkMaxLen( '#profile-info-content-poitics-input', 100)
        }
      // politics

    // on key press
// submit updated profile 







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




