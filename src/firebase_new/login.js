import { initializeApp } from 'firebase/app'
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
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
const auth = getAuth(app)
const storage = getStorage(app);



  // parameters
    let link = location.origin //window.location.protocol+'//'+window.location.hostname+':'+window.location.port
    const bodyDeactivator = document.getElementById('bodyDeactivate')

    const getQuickUsersFromWebStorage = localStorage.getItem("quickUsersWebStorageArray")
    let userQuickList =  JSON.parse(getQuickUsersFromWebStorage)
  // parameters





// login form submit    
  $(document).ready(function() {
    $('.login').submit(function(event) {
      event.preventDefault(); // Prevent form submission

      $(".login button").prop("disabled", true) // longin form submit button disable true


      // login firebse
        const loginForm = document.querySelector('.login')

        signInWithEmailAndPassword(auth, loginForm.email.value, loginForm.password.value)
        .then((cred) => {
          //console.log('user logged in:', cred.user.uid)
          console.log('user logged in:', cred.user.email)

          // emptied login form
            loginForm.email.value = ''
            loginForm.password.value = ''
          // emptied login form
  
        })
        .catch((err) => {
          console.warn(err.code) 
          console.warn(err.message)
        })
      // login firebse        
        
    });
  });
// login form submit




// signin form submit    
  $(document).ready(function() {
    $('.signup').submit(function(event) {
      event.preventDefault(); // Prevent form submission

        // Get form data
        const formData = $(this).serialize(); // or manually extract form field values
        
        const signinFormObject = {}
        if(document.querySelector('.signup input[name="email"]').value.trim() != ''){
          signinFormObject['email'] = DOMPurify.sanitize( document.querySelector('.signup input[name="email"]').value ).trim()
        } else {
          signinFormObject['email'] = null
        }
        if(document.querySelector('.signup input[name="firstname"]').value.trim() != ''){
          signinFormObject['firstname'] = DOMPurify.sanitize( document.querySelector('.signup input[name="firstname"]').value ).trim()
        } else {
          signinFormObject['firstname'] = null
        }
        if(document.querySelector('.signup input[name="middlename"]').value.trim() != ''){
          signinFormObject['middlename'] = DOMPurify.sanitize( document.querySelector('.signup input[name="middlename"]').value ).trim()
        } else {
          signinFormObject['middlename'] = null
        }
        if(document.querySelector('.signup input[name="lastname"]').value.trim() != ''){
          signinFormObject['lastname'] = DOMPurify.sanitize( document.querySelector('.signup input[name="lastname"]').value ).trim()
        } else {
          signinFormObject['lastname'] = null
        }
        if(document.querySelector('.signup input[name="nickname"]').value.trim() != ''){
          signinFormObject['nickname'] = DOMPurify.sanitize( document.querySelector('.signup input[name="nickname"]').value ).trim()
        } else {
          signinFormObject['nickname'] = null
        }
        if(document.querySelector('.signup input[name="password"]').value.trim() != ''){
          signinFormObject['password'] = DOMPurify.sanitize( document.querySelector('.signup input[name="password"]').value ).trim()
        } else {
          signinFormObject['password'] = null
        }


        
        
        // Send AJAX request to Node.js server
        $.ajax({
          url: '/mongoJs/signin', // Replace with your server endpoint
          type: 'POST',
          data: {signinFormObjectNode: JSON.stringify( signinFormObject )},
          success: function(response) {
            // Handle successful response from server    
            if( response == 'success') {
              createAuthenticateIDinFirebase()
            } else console.error(response)

          },
          error: function(error) {
            // Handle error response from server
            console.error(error);
          }
        });
        
    });
  });
// signin form submit




// create authenticate id in firebase
  async function createAuthenticateIDinFirebase(){
    const signupForm = document.querySelector('.signup')
    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
 	  .then(async (cred) => {  	
      console.log('Account created successfully!')
    })
 	  .catch((error) => {
      console.log(error.code)
      console.log(error.message)
 	  })
  }
// create authenticate id in firebase

  

  let promptQuickUserSelection = true
  let currentLoggedUser = localStorage.getItem('currentLoggedUser')
  let setFromQuickUsers = 'no'

  // check auth state
  async function checkAuthState() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {

        if(user.emailVerified == true){
            user.providerData.forEach(async (profile) => {
              
              console.log("Sign-in provider: " + profile.providerId);
              console.log("  Provider-specific UID: " + profile.uid);
              console.log("  Name: " + profile.displayName);
              console.log("  Email: " + profile.email);
              console.log("  Photo URL: " + profile.photoURL);

              if( currentLoggedUser != profile.uid && setFromQuickUsers == 'no'  ){
                localStorage.setItem('currentLoggedUser', profile.uid )
                promptQuickUserSelection = false
              }
              
              
      
              const quickUserConfirmDiv = document.getElementById('quickUserConfirmDiv')
      
              if( promptQuickUserSelection == false){
                bodyDeactivator.style.display = 'inline-block'
      
                rePositionQuickUserSelectionBox() // center quick user selection prompt from bottom -1000px
      
                promptQuickUserSelection = true
              } else {
                //when no quick user selected and already loged in
                if( (userQuickList instanceof Array) == false || userQuickList.includes( profile.uid ) == false  ){
                  window.open( link + "/main", "_self") //all done then redirect to home
                }
              }
              
              
      
      
              document.getElementById('quickLoginTrue').onclick = ()=>{
                quickUserConfirmDiv.style.bottom = '-500px'
                setTimeout(()=>{
                  storeInQuickLogin()
                }, 1000)          
              }
      
              document.getElementById('quickLoginFalse').onclick = ()=>{
                quickUserConfirmDiv.style.bottom = '-500px'
                setTimeout(()=>{
                  window.open( link + "/main", "_self") //all done then redirect to home
                }, 1000)          
              }
      
      
              
              //store in quick login list
              function storeInQuickLogin(){
                if( (userQuickList instanceof Array) == true ){ 
                  console.warn('array true in varified')
                
                  if( userQuickList.includes( profile.uid ) == false ) { 
      
                    userQuickList.push( profile.uid )
      
                    localStorage.setItem("quickUsersWebStorageArray", JSON.stringify(userQuickList) ) //set back
      
                    window.open( link + "/main", "_self") //all done then redirect to home
                  } else { 
                    window.open( link + "/main", "_self") //all done then redirect to home
                  }
                } else { 
                  userQuickList = []
                  userQuickList.push( profile.uid )
      
                  localStorage.setItem("quickUsersWebStorageArray", JSON.stringify(userQuickList) ) //set back
      
                  window.open( link + "/main", "_self") //all done then redirect to home
                }
              }
              //store in quick login list
              
              
            })
        } else {
            
            sendEmailVerification(auth.currentUser)
            .then(() => {
              // Email verification sent!
              document.querySelector('.mail-to-varify').innerText = user.email
              emailVerificationPrompt() // draw email prompt in center from right -1000 px

              // I did it button click
                document.querySelector('#email-varification-prompt button').onclick = ()=>{
                  document.querySelector('#email-varification-prompt').style.top = '-1000px'

                  setTimeout(()=>{
                    location.reload()
                  }, 1000)
                }
              // I did it button click
            })
        }

      } else {
        console.warn('No user logged yet')
      }
    })
  }
  checkAuthState()
  // check auth state



  //show quick user login list
  async function showQuickUseres(){
    if( (userQuickList instanceof Array) == true && userQuickList.length > 0 ){

      console.warn( userQuickList +' array' )
      
      document.getElementById( 'allQuickUsers' ).innerHTML = '' // clear quick user list

      for (let i = 0; i < userQuickList.length; i++) {
        await displayAllQuickUsers( userQuickList[i] )
      }
      
      async function displayAllQuickUsers( personId ){ 
        // Send AJAX request to Node.js server
        $.ajax({
            url: '/mongoJs/login', // Replace with your server endpoint
            type: 'POST',
            data: {id: personId},
            success: async function(response) { 
              if(response != 'error' && response != null){

                const personBox = document.createElement( 'div' )
                personBox.setAttribute('id', `personBox_${ personId }`)
                personBox.setAttribute('class', `personBox`)
                document.getElementById( 'allQuickUsers' ).appendChild( personBox )

                const personBoxName = document.createElement( 'span' )
                personBoxName.setAttribute('id', `personBoxName_${ personId }`)
                personBoxName.setAttribute('class', `personBoxName`)
                personBoxName.innerText = response.name.fullName
                personBox.appendChild( personBoxName )

                // check currently loged in id
                  onAuthStateChanged(auth, async (user) => {
                    if (user) { // if signed in
                      user.providerData.forEach(async (profile) => { 
                        if( profile.uid == personId ) {
                          document.getElementById( 'currentlyLoggedInUser' ).innerHTML = ''
                          document.getElementById( 'currentlyLoggedInUser' ).appendChild( personBox )

                          const currentLogedIn = document.createElement( 'span' )
                          currentLogedIn.setAttribute('id', `currentLogedIn_${ personId }`)
                          currentLogedIn.setAttribute('class', `currentLogedIn`)
                          currentLogedIn.innerText = 'Currently Logged Id.'
                          personBox.appendChild( currentLogedIn )
                        }
                      })
                    }
                  })
                // check currently loged in id

                const personBoxImgHolder = document.createElement( 'div' )
                personBoxImgHolder.setAttribute('id', `personBoxImgHolder_${ personId }`)
                personBoxImgHolder.setAttribute('class', `personBoxImgHolder`)
                personBox.appendChild( personBoxImgHolder )

                const personBoxImg = document.createElement('img')
                personBoxImg.setAttribute('id', `personBoxImg_${ personId }`)
                personBoxImg.setAttribute('class', `personBoxImg_`)
                personBoxImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
                personBoxImgHolder.appendChild( personBoxImg )

                const deleteButton = document.createElement( 'span' )
                deleteButton.setAttribute('id', `deleteButton_${ personId }`)
                deleteButton.setAttribute('class', `material-icons-outlined deleteButton_`)
                deleteButton.innerText = 'delete'
                personBox.appendChild( deleteButton )
                  /*
                //profile pic handlers 
                  if( picName!= null && picName!= undefined && picName!= '' ){
                    //pic
                    const storesRef = ref(storage, picName)
                    getDownloadURL(storesRef)
                    .then((URL) => {
                      // Insert url into an <img> tag to "download"
                      personBoxImg.setAttribute('src', URL)        
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
                    //pic
                  }
                //profile pic handlers
                */


                //quick login by click here
                  document.getElementById( `personBoxName_${ personId }` ).onclick = goQuickLogIn
                  document.getElementById( `personBoxImgHolder_${ personId }` ).onclick = goQuickLogIn

                  function goQuickLogIn() {
                    bodyDeactivator.style.display = 'inline-block'

                    setFromQuickUsers = 'yes'
                    localStorage.setItem('currentLoggedUser', personId )
                    promptQuickUserSelection = true
              

                    signInWithEmailAndPassword(auth, response.key.id, response.key.password)
                    .then((cred) => {
                      //console.log('user logged in:', cred.user.uid)
                      console.log('user logged in:', cred.user.email)
                
                      window.open( link + "/main", "_self") //all done then redirect to home

                      bodyDeactivator.style.display = 'none'
                    })
                    .catch((err) => {
                      bodyDeactivator.style.display = 'none'

                      console.warn(err.code) 
                      console.warn(err.message)
                    })
                  }
                //quick login by click here


                //delete from quick user
                  document.getElementById( `deleteButton_${ personId }` ).onclick = ()=>{ 
                    deleterFromQuickUser( personId )
                  }
                //delete from quick user
              } else { 
                //delete from quick user
                  deleterFromQuickUser( personId )
                //delete from quick user
              }
            },
            error: function(error) {
              console.warn(error)

              if(error == 'error' && error != null){ 
                //delete from quick user
                  deleterFromQuickUser( personId )
                //delete from quick user
              }
            }
        });


        /*
        const getQuickPersonsDetails = await getDoc( doc(db, 'Moments', personId, 'profileInfo', 'credentials' ) )
        if (getQuickPersonsDetails.exists()) {

          const personBox = document.createElement( 'div' )
          personBox.setAttribute('id', `personBox_${ personId }`)
          personBox.setAttribute('class', `personBox`)
          document.getElementById( 'allQuickUsers' ).appendChild( personBox )

          const personBoxName = document.createElement( 'span' )
          personBoxName.setAttribute('id', `personBoxName_${ personId }`)
          personBoxName.setAttribute('class', `personBoxName`)
          personBoxName.innerText = getQuickPersonsDetails.data().name.fullName
          personBox.appendChild( personBoxName )

          // check currently loged in id
          onAuthStateChanged(auth, async (user) => {
            if (user) { // if signed in
              user.providerData.forEach(async (profile) => { 
                if( profile.uid == personId ) {
                  document.getElementById( 'currentlyLoggedInUser' ).innerHTML = ''
                  document.getElementById( 'currentlyLoggedInUser' ).appendChild( personBox )

                  const currentLogedIn = document.createElement( 'span' )
                  currentLogedIn.setAttribute('id', `currentLogedIn_${ personId }`)
                  currentLogedIn.setAttribute('class', `currentLogedIn`)
                  currentLogedIn.innerText = 'Currently Logged Id.'
                  personBox.appendChild( currentLogedIn )
                }
              })
            }
          })
          // check currently loged in id

          const personBoxImgHolder = document.createElement( 'div' )
          personBoxImgHolder.setAttribute('id', `personBoxImgHolder_${ personId }`)
          personBoxImgHolder.setAttribute('class', `personBoxImgHolder`)
          personBox.appendChild( personBoxImgHolder )

          const personBoxImg = document.createElement('img')
          personBoxImg.setAttribute('id', `personBoxImg_${ personId }`)
          personBoxImg.setAttribute('class', `personBoxImg_`)
          personBoxImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
          personBoxImgHolder.appendChild( personBoxImg )

          const deleteButton = document.createElement( 'span' )
          deleteButton.setAttribute('id', `deleteButton_${ personId }`)
          deleteButton.setAttribute('class', `material-icons-outlined deleteButton_`)
          deleteButton.innerText = 'delete'
          personBox.appendChild( deleteButton )

          //profile pic handlers 
          const getProfilePicName = query(collection(db, "Moments", personId, "profilePictures"), where('active', '==', true));
          let picName
          const showProfilePicName = await getDocs(getProfilePicName);
          showProfilePicName.forEach((doc) => {
            picName = doc.data().title
          })

          if( picName!= null && picName!= undefined && picName!= '' ){
            //pic
            const storesRef = ref(storage, picName)
            getDownloadURL(storesRef)
            .then((URL) => {
              // Insert url into an <img> tag to "download"
              personBoxImg.setAttribute('src', URL)        
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
            //pic
          }
          //profile pic handlers


          //quick login by click here
            document.getElementById( `personBoxName_${ personId }` ).onclick = goQuickLogIn
            document.getElementById( `personBoxImgHolder_${ personId }` ).onclick = goQuickLogIn

            function goQuickLogIn() {
              bodyDeactivator.style.display = 'inline-block'

              setFromQuickUsers = 'yes'
              localStorage.setItem('currentLoggedUser', personId )
              promptQuickUserSelection = true
              

              signInWithEmailAndPassword(auth, getQuickPersonsDetails.data().key.id, getQuickPersonsDetails.data().key.password)
              .then((cred) => {
                //console.log('user logged in:', cred.user.uid)
                console.log('user logged in:', cred.user.email)
                
                window.open( link + "/main", "_self") //all done then redirect to home

                bodyDeactivator.style.display = 'none'
              })
              .catch((err) => {
                bodyDeactivator.style.display = 'none'

                console.warn(err.code) 
                console.warn(err.message)
              })
            }
          //quick login by click here


          //delete from quick user
          document.getElementById( `deleteButton_${ personId }` ).onclick = ()=>{
            deleterFromQuickUser( personId )
          }
          //delete from quick user
          
        } else {
          //delete from quick user
            deleterFromQuickUser( personId )
          //delete from quick user
        }
        */
      }

      console.warn( 'quick user array true' )
    } else {
      document.getElementById( 'rightSideBar' ).innerHTML = 'Quick users has not selected yet.' // when there is no quick user
    }
  }
  showQuickUseres()
//show quick user login list


  //logging out
    function signOutCurrentUser(){
      signOut(auth)
      .then(() => {
        console.warn('the user signed out')
        checkAuthState() 
      })
      .catch((err) => {
        console.log(err.message)
      })
    }
    //signOutCurrentUser()
  //logging out



  //delete from quick user
function deleterFromQuickUser( personId ){
    const grabThePersonBox = document.getElementById(`personBox_${ personId }`)
    if(grabThePersonBox){
      if( grabThePersonBox.parentNode === document.getElementById( 'currentlyLoggedInUser' ) ){ // check parent element
        document.getElementById( 'currentlyLoggedInUser' ).removeChild( document.getElementById(`personBox_${ personId }`) )
      } else {
        document.getElementById( 'allQuickUsers' ).removeChild( document.getElementById(`personBox_${ personId }`) )
      }
    }
  
    userQuickList.splice(userQuickList.indexOf( personId ), 1)
    console.warn('userQuickList after deleting by delete : '+ userQuickList)
    localStorage.setItem("quickUsersWebStorageArray", JSON.stringify(userQuickList) ) //set back
  
    showQuickUseres() //update remaining quick users
  
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        user.providerData.forEach(async (profile) => {
            if( profile.uid == personId ){
              signOutCurrentUser()
            }
        })
      }
    })
  
    if (currentLoggedUser == personId){
      localStorage.setItem('currentLoggedUser', null )
    }
  
    location.reload() // used this reload for localStorage reset
  }
  //delete from quick user