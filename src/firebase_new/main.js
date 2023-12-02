import { initializeApp } from 'firebase/app'
import {
    getAuth,
    onAuthStateChanged,
    signOut
  } from 'firebase/auth'
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from "firebase/storage";
  


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
const storage = getStorage(app)










onAuthStateChanged(auth, (user) => {
  if (user) {
    if(user.emailVerified == true){

      user.providerData.forEach(async (profile) => {
        myId = profile.uid

        // get my profile data from mongoDB by ajax
            // Send AJAX request to Node.js server
            $.ajax({
              url: '/mongoJs/main', // Replace with your server endpoint
              type: 'POST',
              data: {id: myId},
              success: async function(response) {
                if(response != 'error' && response != null){
                    profileFromMongoDB = JSON.parse( response.profileInfo )
                    
                    showMyProfileName()
                    findPeople()                 
                } else{
                    console.warn('profile data collecting erron in mongodb ' + response)
                }
              },
              error: function(error) {
                console.warn('profile data collecting erron in mongodb '+ error)
                if(error == 'error' && error != null){
                    console.warn('profile data collecting erron in mongodb '+ error) 
                }
              }
            });
        // get my profile data from mongoDB by ajax

        
        // callAlertFunction()
        // setInterval(resetAudioVideoData, 1000)

        messengerButtonAndPanel()
        friendsAndFollowersRequestPanel()
        subBodyLeftSideNavigator()
        
        backgroundPic()
      })

    } else {
      backToLogInLandingPage()
    }
    
  } else {
    backToLogInLandingPage()
  }
})
function backToLogInLandingPage(){
  window.open( location.origin , '_self' ) //back to landing page
}









// Header bar

  const findPeopleButton = document.querySelector('#findPeople span')

  //home button
    //document.getElementById('homeButton').onclick = loadHome
  //home button

  // profile button & description
    //show my name and picture in control bar
    async function showMyProfileName(){
      
      //pic
      const profilePic = document.querySelector('#profilePic')
      const profilePicDescription = document.querySelector('#profilePicDescription')

      let picName = null
      if(profileFromMongoDB.profilePics.active != null){
        picName = profileFromMongoDB.profilePics.active
      }
      

      function showImage(){
        if( picName == null){
          profilePic.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
          profilePicDescription.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
        } else {

          const storesRef = ref(storage, picName)
          getDownloadURL(storesRef)
          .then((url) => {
            // Insert url into an <img> tag to "download"
            profilePic.src = url
            profilePicDescription.src = url
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
      //pic    

      // name
        document.getElementById('profileName').innerText = profileFromMongoDB.name.fullName
      // name

      // when click on profile image on top bar
      document.getElementById('myProfileLink').onclick = ()=>{
        document.getElementById('profileDescription').style.top = '60px'
      }
      document.getElementById('closeProfileDescription').onclick = ()=>{
        document.getElementById('profileDescription').style.top = '-700px'
      }
      // when click on profile image on top bar
    }

    document.getElementById('profilePicDescription').onclick = ()=> { goToProfile( myId, true) }
    document.getElementById('profileName').onclick = ()=> { goToProfile( myId, true) }

    function goToProfile( UID, isAdmin ){
      document.querySelector('#homeButton span').style.color = 'inherit'


      $("#subBodyRightSide-maincontent").load("/profile", {uId : UID, admin: isAdmin}, function(responseTxt, statusTxt, xhr){
          if(statusTxt == "success")
            console.warn("Profile content loaded successfully!");
          if(statusTxt == "error")
            alert("Can't load profile page! Error: " + xhr.status + ": " + xhr.statusText);
      })

    }
    //show my name and picture in control bar

    //profile description
      document.getElementById('logout').onclick = ()=>{
        signOut(auth)
        .then(() => {
          console.warn('the user signed out')
        })
        .catch((err) => {
          console.log(err.message)
        })
      }
    //profile description
  // profile button & description










  // messenger button & panel
  function messengerButtonAndPanel(){
    // unseen message indication on header control bar and message sound
      let numberOfUnseenMessage = 0
      function unseenMessageIndicationOnHeaderBar(){
        if( numberOfUnseenMessage != 0 ){
          document.querySelector('#numberOfUnseenMessageHolder').innerText = numberOfUnseenMessage
          document.querySelector('#numberOfUnseenMessageHolder').style.display = 'inline-block'
        } else document.querySelector('#numberOfUnseenMessageHolder').style.display = 'none'
      }
      
      async function showUnseenSMSindicatorHeader(){
      // check unseen sms
        // remove special charecters form email
          const escapeAtTheRate = myId.replaceAll('@',"_")
          const escapedDotEmail = escapeAtTheRate.replaceAll('.',"_")
        // remove special charecters from email

        // where('send.id', '!=', myId), where(`seenBy.${escapedDotEmail}`, '==', false), limit(1)      
        const unsubCheckUnseenSMSIndicator = onSnapshot( query(collectionGroup(db, 'sms'), where(`seenBy.${escapedDotEmail}`, '==', false) ), async (querySnapshot) => {    

          for (let i = 0; i < querySnapshot.docs.length; i++) {
            console.warn(querySnapshot.docs[i].id)
          }

        })
      // check unseen sms
      }
    // unseen message indication on header control bar and message sound  


    // panel
      // show personal and group sms in left side list
      const messengerPanel = document.getElementById( 'messengerPanel' )
      document.getElementById( 'messengerButton' ).onclick = ()=>{
        messengerPanel.style.top = '55px'
        messengerPanel.style.opacity = 1

        isMessengerDisplay = true
        resezizeMessenger() //height

        goToMessageList()
      
      }
      // show personal and group sms in left side list


      // close panel
      document.getElementById( 'closeMessenger' ).onclick = ()=>{
        messengerPanel.style.top = -100 + 'px'
        messengerPanel.style.height = 0
        messengerPanel.style.opacity = 0

        isMessengerDisplay = false
      }
      // close panel




      // search person
        document.querySelector('.searchPersonMessage').onclick = showSerchPersonMessage

        async function showSerchPersonMessage(){
          // panel height, Right
          const leftSideHeight = document.querySelector('#messegeLeftSide').offsetHeight
          const deductHeight = leftSideHeight - 52
          document.querySelector('#searchToSendMessage').style.height = deductHeight + 'px'


          document.querySelector('#searchToSendMessage').style.right = 0
          // panel height, Right

          // search field width
          const leftSideWidth = document.querySelector('#messegeLeftSide').offsetWidth
          const deductedWidth = leftSideWidth - 60
          document.querySelector('#searchToSendMessageForm input').style.width = deductedWidth + 'px'
          // search field width
        }

        // close/ hide
        document.getElementById('closeSearchToSendMessage').onclick = hideSearchPersonMessagePanel

        function hideSearchPersonMessagePanel() {
          if(messengerPanel.offsetWidth <= 799){
            document.querySelector('#searchToSendMessage').style.right = '-1100px'
          } else document.querySelector('#searchToSendMessage').style.right = '-500px'
        }
        // close/ hide

        // search button
          // in messenger room
          document.querySelector('#searchToSendMessageForm button').onclick = async ()=>{
            // search in my message friends
            $.ajax({
              url: '/mongoJs/main/getAmongMessengerFriends', // Replace with your server endpoint
              type: 'POST',
              data: {
                my_id: myId,
                form_input : DOMPurify.sanitize( document.querySelector('#searchToSendMessageForm input').value ) 
              },
              success: function(response) {
                if(response == 'error' && response != null ){
                  console.warn("Error in getting among messenger friends!" + response)  
                
                } else if(response == 'not friend' && response != null){
                  console.warn("Not messenger friend. Checking successful!")
                } else{
                  console.warn("successfully get among messenger friends!")
                
                  document.querySelector('#searchToSendMessageForm-output').innerHTML = '' // reset old search data
                  searchedProfileBar( response )
                }
              },
              error: function(error) {
                if(error == 'error' && error != null ){
                  console.warn("Err in getting among messenger friends!" + error)               
                }
              }
            })
            // search in my message friends
            /*
            const getMessengerRoom = await getDocs( query(collection(db, "Messenger"), where(`membersList`, "array-contains", myId) ) );
            getMessengerRoom.forEach(async (doc1) => {

              const getMessengerRoom_peerId = await getDocs( query(collection(db, "Messenger"), where(`membersList`, "array-contains", document.querySelector('#searchToSendMessageForm input').value) ) );
              getMessengerRoom_peerId.forEach(async (doc2) => {
                if( doc1.id == doc2.id ){

                  messengerRoomRef = doc2.id

                  document.querySelector('#searchToSendMessageForm-output').innerHTML = '' // reset old search data
                  searchedProfileBar( document.querySelector('#searchToSendMessageForm input').value )
                }
              })
            })
            */
          }
          // in messenger room

          // show search profile bar
            async function searchedProfileBar( searchdId ){
              for (let i = 0; i < searchdId.length; i++) {

                const perProfileBar = document.createElement('div')
                perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-searchToSendMessage' )
                document.querySelector('#searchToSendMessageForm-output').appendChild( perProfileBar )

                const perProfileBarHolder = document.createElement('div')
                perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
                perProfileBar.appendChild( perProfileBarHolder )

                const perProfileBarImg = document.createElement('img')
                perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
                perProfileBarHolder.appendChild( perProfileBarImg )
                perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

                const perProfileBarContent = document.createElement('div')
                perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
                perProfileBar.appendChild( perProfileBarContent )

                const perProfileBarContentName = document.createElement('div')
                perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName profilesSingelBar-searchToSendMessage')
                perProfileBarContent.appendChild( perProfileBarContentName )

                const perProfileBarContentControl = document.createElement('div')
                perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl profilesSingelBar-contentControl-searchToSendMessage')
                perProfileBarContentControl.innerText = 'Click/ Tap to select.'
                perProfileBarContent.appendChild( perProfileBarContentControl )

                // css
                  function fixWidthOfNameAndContent(){
                    const getWidth = perProfileBar.offsetWidth
                    const deductWidth = getWidth - 65

                    perProfileBarContent.style.width = deductWidth + 'px'
                    perProfileBarContentControl.style.width = deductWidth + 'px'
                  }
                  fixWidthOfNameAndContent()
                // css


              

                const peerId = searchdId[i].key.id




                // retrive data from db
                  // Send AJAX request to Node.js server              
                  $.ajax({
                    url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                    type: 'POST',
                    data: {
                      peer_id: peerId,
                    },
                    success: function(response) {
                      if(response != 'error' && response != null ){
                        console.warn("successfully get friends!")
              
                        showProfile(response)
              
                      } else{
                        console.warn("Error in getting friends!" + response)              
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Err in getting friends!" + error)               
                      }
                    }
                  })
              


                  function showProfile(singleDATA){  
                    // name
                    perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                
                    // pic   
                      if ( singleDATA.profileInfo.profilePics.active != 'null') {           
                        perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                      }              
                    // pic
              
                    // controls

                    // controls
                  }
                // retrive data from db


                // select profile bar to send message
                  perProfileBar.onclick = selectProfileBarMessenger

                  async function selectProfileBarMessenger(){
                      

                      $.ajax({
                        url: '/mongoJs/main/updateMessengerActivity', // Replace with your server endpoint
                        type: 'PUT',
                        data: {
                          my_id: myId,
                          peer_id: peerId
                        },
                        success: function(response) {
                          if(response == 'error' && response != null ){
                            console.warn("Error in updating messenger activity!" + response)  
                          
                          } else{
                            console.warn("successfully updated messenger activity!")
                          
                            hideSearchPersonMessagePanel()
                          }
                        },
                        error: function(error) {
                          if(error == 'error' && error != null ){
                            console.warn("Err in updating messenger activity!" + error)               
                          }
                        }
                      })                      
                    
                  }
                // select profile bar to send message
              }
            }
          // show search profile bar
        // search button
      // search person

      



      // show message list (default)

        const showMessageList_SubHolder = document.querySelector('#showMessageList_subHolder')        
        
        // result list
        async function goToMessageList(){

          showMessageList_SubHolder.style.padding = '5px' // set padding to message list subholder
          showMessageList_SubHolder.innerHTML = '' // clear old values

          
          // inbox loop
            // get all message (constant update)
              setInterval(()=>{
                $.ajax({
                  url: '/mongoJs/main/getAllSMSamongMessengerFriends', // Replace with your server endpoint
                  type: 'POST',
                  data: {
                    my_id: myId,
                  },
                  success: function(response) {
                    if(response == 'error' && response != null ){
                      console.warn("Error in getting sms among messenger friends!" + response)  
                
                    } else if(response == 'no sms' && response != null){
                      console.warn("No Sms among messenger friends!")
                    } else if( response != null ){
                      console.warn("successfully get sms among messenger friends!")
                    
                                     
                      showProfileOneByOne(response)
                      
                    }
                  },
                  error: function(error) {
                    if(error == 'error' && error != null ){
                      console.warn("Err in getting sms among messenger friends!" + error)               
                    }
                  }
                })
              }, 2000)
            // get all message (constant update)


            // get message glimps including unseen sms
              function getMessageGlimps( messengerRoomId, SMSs){
                if ( SMSs.length > 0 ) {
                  for(let G = SMSs.length -1; G >= 0 ; G--){
                    if( SMSs[G].sendStatus == 'uploaded'){ 
                      // sender name
                        if( SMSs[G].send.id == myId ){
                          if( document.querySelector('#messengerProfilesSingelBar-contentControl-senderName-' + messengerRoomId ) ){
                            document.querySelector('#messengerProfilesSingelBar-contentControl-senderName-' + messengerRoomId ).innerText = 'You :'
                          }                      
                        } else {
                          // Send AJAX request to Node.js server              
                          $.ajax({
                            url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                            type: 'POST',
                            data: {
                              peer_id: SMSs[G].send.id,
                            },
                            success: function(response) {
                              if(response != 'error' && response != null ){
                                console.warn("successfully peer profile pic and name!")
        
                                showProfile(response)
        
                              } else{
                                console.warn("Error in getting peer profile pic and name!" + response)              
                              }
                            },
                            error: function(error) {
                              if(error == 'error' && error != null ){
                                console.warn("Err in getting peer profile pic and name!" + error)               
                              }
                            }
                          })
        


                          function showProfile(singleDATA){                
                            // name
                            if( document.querySelector('#messengerProfilesSingelBar-contentControl-senderName-' + messengerRoomId ) ) {
                              document.querySelector('#messengerProfilesSingelBar-contentControl-senderName-' + messengerRoomId ).innerText = singleDATA.profileInfo.name.firstName + ':' 
                            }     
                            
                          }
                        }
                      // sender name




                      let text = "";

                      for (let i = 0; i < SMSs[G].messengerData.length; i++) {
                        if( SMSs[G].messengerData[i].text != null ){
                          text += SMSs[G].messengerData[i].text + " ";
                        } else if( SMSs[G].messengerData[i].media.image != null ) {
                          text += "Pic ";
                        }
                      }

                            

                      // message
                        // trim string in 10 words
                          let trimedText = text.substr(0,20)
                        // trim string in 10 words

                        if( document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + messengerRoomId ) ){
                          document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + messengerRoomId ).innerText = trimedText + '...'
                        }
                      // message


                      // message time
                        const sendAtTimestamp = new Date(SMSs[G].send.time)
                        let hours = 0
                        let amPm = 'AM'
                        switch ( sendAtTimestamp.getHours() ) {
                          default:
                            hours = sendAtTimestamp.getHours() ;
                            amPm = 'AM'
                            break;
                          case 12:
                            hours = 12 ;
                            amPm = 'PM'
                            break;
                          case 13:
                            hours = 1 ;
                            amPm = 'PM'
                            break;
                          case 14:
                            hours = 2 ;
                            amPm = 'PM'
                            break;
                          case 15:
                            hours = 3 ;
                            amPm = 'PM'
                            break;
                          case 16:
                            hours = 4 ;
                            amPm = 'PM'
                            break;
                          case 17:
                            hours = 5 ;
                            amPm = 'PM'
                            break;
                          case 18:
                            hours = 6 ;
                            amPm = 'PM'
                            break;                            
                          case 19:
                            hours = 7 ;
                            amPm = 'PM'
                            break;
                          case 20:
                            hours = 8 ;
                            amPm = 'PM'
                            break;
                          case 21:
                            hours = 9 ;
                            amPm = 'PM'
                            break;
                          case 22:
                            hours = 10 ;
                            amPm = 'PM'
                            break;
                          case 23:
                            hours = 11 ;
                            amPm = 'PM'
                            break;
                          case  24:
                            hours = 12 ;
                            amPm = 'PM'
                        }

                        const perProfileBarContentControl_messageTime = document.querySelector('#messengerProfilesSingelBar-contentControl-messageTime-' + messengerRoomId )

                        if( perProfileBarContentControl_messageTime ){
                          perProfileBarContentControl_messageTime.innerText = '🕝 ' + hours + ':' + sendAtTimestamp.getMinutes() + ' ' + amPm + '. ' + sendAtTimestamp.getDate() + '-' + (sendAtTimestamp.getMonth() + 1) + '-' + sendAtTimestamp.getFullYear()  
                    
                          perProfileBarContentControl_messageTime.style.padding = '1px 3px'
                        }
                      // message time


                      break // stop the loop
                    } // blank sms
                    else {                      
                      if( document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + messengerRoomId ) ){
                        document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + messengerRoomId ).innerText = "No sms yet!"
                      }                      
                    }
                  }                 
                }
              }
            // get message glimps including unseen sms



            const alreadyViewingList = []
            
            function showProfileOneByOne(DATA){
              for(let i = 0; i < DATA.messengerRoomContents.length; i++) {
                
                // check group or not
                  if( DATA.messengerRoomContents[i].group == false ){
                    let peerID = null

                    for(let x = 0; x < DATA.messengerRoomContents[i].membersList.length; x++) {
                      if( DATA.messengerRoomContents[i].membersList[x] != myId ){
                        peerID = DATA.messengerRoomContents[i].membersList[x]
                      }
                    }
                    
                    
                    // chcek in messenger friend list
                      if( DATA.myMessengerFriendList.includes( peerID ) == true){
                        // put in already viewing list
                          if( alreadyViewingList.includes(DATA.messengerRoomContents[i]._id) == false ){

                            alreadyViewingList.push(DATA.messengerRoomContents[i]._id)

                            showProfileBar() //creates the profile bar
                          } else {
                            if( document.querySelector( `#messengerProfilesSingelBar_${ DATA.messengerRoomContents[i]._id }` ) ){
                              document.querySelector( `#messengerProfilesSingelBar_${ DATA.messengerRoomContents[i]._id }` ).onclick = ()=>{ 
                                listContentInRightSideView( DATA.messengerRoomContents[i] ) // right side view on onclick with updated value
                              } 
                            }
                          }
                        // put in already viewing list                          
                      }
                    // check in messenger friend list
                    
                  } else if (DATA.messengerRoomContents[i].group == true){
                    // put in already viewing list
                      if( alreadyViewingList.includes(DATA.messengerRoomContents[i]._id) == false ){

                        alreadyViewingList.push(DATA.messengerRoomContents[i]._id)

                        showProfileBar() //creates the profile bar
                      } else {
                        if( document.querySelector( `#messengerProfilesSingelBar_${ DATA.messengerRoomContents[i]._id }` ) ){
                          document.querySelector( `#messengerProfilesSingelBar_${ DATA.messengerRoomContents[i]._id }` ).onclick = ()=>{ 
                            listContentInRightSideView( DATA.messengerRoomContents[i] ) // right side view on onclick with updated value
                          } 
                        }
                      }
                    // put in already viewing list
                  }
                // check group or not
                




                // show profile bar
                function showProfileBar() {
                  const perProfileBar = document.createElement('div')
                  perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody messengerProfilesSingelBarBody messengerProfilesSingelBarNo-' + DATA.messengerRoomContents[i]._id )
                  perProfileBar.setAttribute('id', `messengerProfilesSingelBar_${ DATA.messengerRoomContents[i]._id }`)
                  showMessageList_SubHolder.appendChild( perProfileBar )
                  perProfileBar.onclick = ()=>{ listContentInRightSideView( DATA.messengerRoomContents[i] ) } // right side view on onclik
  
                        
                  const perProfileBarHolder = document.createElement('div')
                  perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
                  perProfileBarHolder.setAttribute('id', 'messengerProfilesSingelBar-imageHolder-' + DATA.messengerRoomContents[i]._id )
                  perProfileBar.appendChild( perProfileBarHolder )
  
                  const perProfileBarImg = document.createElement('img')
                  perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
                  perProfileBarImg.setAttribute('id', 'messengerProfilesSingelBar-img-' + DATA.messengerRoomContents[i]._id )
                  perProfileBarHolder.appendChild( perProfileBarImg )
                  perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
  
                  const perProfileBarContent = document.createElement('div')
                  perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
                  perProfileBarContent.setAttribute('id', 'messengerProfilesSingelBar-content-' + DATA.messengerRoomContents[i]._id )
                  perProfileBar.appendChild( perProfileBarContent )

                  // style js
                    // set content bar width
                    const getPerProfileBarContentWidth = document.querySelector('.messengerProfilesSingelBarBody').offsetWidth
                    const deductPerProfileBarContentWidth = getPerProfileBarContentWidth - 65

                    perProfileBarContent.style.width = deductPerProfileBarContentWidth + 'px'                    
                  // style js

                  const perProfileBarUnseenSMSindex = document.createElement('div')
                  perProfileBarUnseenSMSindex.setAttribute('class', 'messengerProfilesSingelBar-unseenSMSindex')
                  perProfileBarUnseenSMSindex.setAttribute('id', 'messengerProfilesSingelBar-unseenSMSindex-' + DATA.messengerRoomContents[i]._id )
                  perProfileBarUnseenSMSindex.innerHTML= '<span class="material-icons-outlined mail-icon">mail</span>' + '<span class="unreadSMSindex"></span>'
                  perProfileBarContent.appendChild( perProfileBarUnseenSMSindex )
  
                  const perProfileBarContentName = document.createElement('div')
                  perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName messengerProfilesSingelBar-contentName')
                  perProfileBarContentName.setAttribute('id', 'messengerProfilesSingelBar-contentName-' + DATA.messengerRoomContents[i]._id )
                  perProfileBarContent.appendChild( perProfileBarContentName )
  
                  const perProfileBarContentControl = document.createElement('div')
                  perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
                  perProfileBarContentControl.setAttribute('id', 'messengerProfilesSingelBar-contentControl-' + DATA.messengerRoomContents[i]._id )
                  perProfileBarContent.appendChild( perProfileBarContentControl )

                    const perProfileBarContentControl_subSection = document.createElement('div')
                    perProfileBarContentControl_subSection.setAttribute('class', 'profilesSingelBar-contentControl-subSection')
                    perProfileBarContentControl_subSection.setAttribute('id', 'messengerProfilesSingelBar-contentControl-subSection-' + DATA.messengerRoomContents[i]._id )
                    perProfileBarContentControl.appendChild( perProfileBarContentControl_subSection )

                      const perProfileBarContentControl_subSection_2 = document.createElement('div')
                      perProfileBarContentControl_subSection_2.setAttribute('class', 'profilesSingelBar-contentControl-subSection-2')
                      perProfileBarContentControl_subSection_2.setAttribute('id', 'messengerProfilesSingelBar-contentControl-subSection-2-' + DATA.messengerRoomContents[i]._id )
                      perProfileBarContentControl_subSection.appendChild( perProfileBarContentControl_subSection_2 )

                        const perProfileBarContentControl_senderName = document.createElement('div')
                        perProfileBarContentControl_senderName.setAttribute('class', 'profilesSingelBar-contentControl_senderName')
                        perProfileBarContentControl_senderName.setAttribute('id', 'messengerProfilesSingelBar-contentControl-senderName-' + DATA.messengerRoomContents[i]._id )
                        perProfileBarContentControl_subSection_2.appendChild( perProfileBarContentControl_senderName )

                        const perProfileBarContentControl_unseenMsg = document.createElement('div')
                        perProfileBarContentControl_unseenMsg.setAttribute('class', 'profilesSingelBar-contentControl_unseenMsg')
                        perProfileBarContentControl_unseenMsg.setAttribute('id', 'messengerProfilesSingelBar-contentControl-unseenMsg-' + DATA.messengerRoomContents[i]._id )
                        perProfileBarContentControl_subSection_2.appendChild( perProfileBarContentControl_unseenMsg )

                    const perProfileBarContentControl_messageTime = document.createElement('div')
                    perProfileBarContentControl_messageTime.setAttribute('class', 'profilesSingelBar-contentControl-messageTime')
                    perProfileBarContentControl_messageTime.setAttribute('id', 'messengerProfilesSingelBar-contentControl-messageTime-' + DATA.messengerRoomContents[i]._id )
                    perProfileBarContentControl.appendChild( perProfileBarContentControl_messageTime )


                  
                  // check messenger room group or not
                    // pro pic and name                    
                    if( DATA.messengerRoomContents[i].group == false ){ 
                      for (let x = 0; x < DATA.messengerRoomContents[i].membersList.length; x++) { 
                        if( DATA.messengerRoomContents[i].membersList.length == 2 && DATA.messengerRoomContents[i].membersList[x] != myId) { 
                          // retrive data from db
                            // Send AJAX request to Node.js server              
                            $.ajax({
                              url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                              type: 'POST',
                              data: {
                                peer_id: DATA.messengerRoomContents[i].membersList[x],
                              },
                              success: function(response) {
                                if(response != 'error' && response != null ){
                                  console.warn("successfully peer profile pic and name!")
              
                                  showProfile(response)
              
                                } else{
                                  console.warn("Error in getting peer profile pic and name!" + response)              
                                }
                              },
                              error: function(error) {
                                if(error == 'error' && error != null ){
                                  console.warn("Err in getting peer profile pic and name!" + error)               
                                }
                              }
                            })
              


                            function showProfile(singleDATA){                
                              // name
                              perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                
                              // pic   
                                if ( singleDATA.profileInfo.profilePics.active != null) {           
                                  perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                                }              
                              // pic
              
                            }                          
                          // retrive data from db
                        }
                      }
                    } else {
                      // name
                      perProfileBarContentName.innerText = DATA.messengerRoomContents[i].groupProfile.name
                    }
                    // pro pic and name
                  // check messenger room group or not


                  


                  // message update only for this room
                    const unseenSMSindex = []

                    // object friendly email
                      function objectFriendlyEmail(email_Id){
                        const escapeAtTheRate = email_Id.replaceAll('@',"_")
                        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
                        return escapedDot
                      } 
                    // object friendly email


                    setInterval(()=>{                      
                      $.ajax({
                        url: '/mongoJs/main/getMessages', // Replace with your server endpoint
                        type: 'POST',
                        data: {
                          my_id: myId,
                          room_id: DATA.messengerRoomContents[i]._id
                        },
                        success: function(response) {
                          if(response == 'error' && response != null ){
                            console.warn("Error in getting sms!" + response) 

                          } else if( response == 'no sms' && response != null ){

                            if( document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + DATA.messengerRoomContents[i]._id ) ){
                              document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + DATA.messengerRoomContents[i]._id ).innerText = "No sms yet!"
                            }

                          } else {    
                            console.warn("successfully get sms!")

                            findOutUnseenSMS(response) 
                            
                            // get message glimps including unseen sms 
                              getMessageGlimps( response._id, response.sms)                      
                            // get message glimps including unseen sms
                          }
                        },
                        error: function(error) {
                          if(error == 'error' && error != null ){
                            console.warn("Err in getting sms!" + error)               
                          }
                        }
                      })
                      
                    }, 2000)
              
              
                    
                    const thisMessengerRoomRef = DATA.messengerRoomContents[i]._id
                    
                    function findOutUnseenSMS(unseenSmsDATA){
                      for (let i = 0; i < unseenSmsDATA.sms.length; i++) {
                        if( unseenSmsDATA.sms[i].send.id != myId 
                          && unseenSmsDATA.sms[i].seenBy[ objectFriendlyEmail(myId) ] == false  
                          && unseenSmsDATA.sms[i].sendStatus == 'uploaded'
                        ){ 
                          if( unseenSMSindex.includes( unseenSmsDATA.sms[i]._id ) == false ) {
                            unseenSMSindex.push( unseenSmsDATA.sms[i]._id )

                            
                            if(unseenSMSindex.length > 0){
                              perProfileBarUnseenSMSindex.style.display = 'inline-block'
                              
                              if( document.querySelector( `#messengerProfilesSingelBar-unseenSMSindex-${thisMessengerRoomRef} .unreadSMSindex`) ){
                                document.querySelector( `#messengerProfilesSingelBar-unseenSMSindex-${thisMessengerRoomRef} .unreadSMSindex`).innerText = unseenSMSindex.length   
                              }                              
                            }
                          }
                        } else if( unseenSmsDATA.sms[i].send.id != myId 
                          && unseenSmsDATA.sms[i].seenBy[ objectFriendlyEmail(myId) ] == true
                          && unseenSmsDATA.sms[i].sendStatus == 'uploaded'
                        ){
                          if( unseenSMSindex.includes( unseenSmsDATA.sms[i]._id ) == true ) {
                            unseenSMSindex.splice( unseenSMSindex.indexOf( unseenSmsDATA.sms[i]._id ), 1)

                            
                            if(unseenSMSindex.length == 0){
                              perProfileBarUnseenSMSindex.style.display = 'none'
                            }
                          }
                        }
                      }
                    }

                      /*
                    // check messenger room group or not                    
                    if( DATA.messengerRoomContents[i].group == false ){ 
                      // check unseen sms                                    
                      let peerID = null

                      // get peer id
                        for (let x = 0; x < DATA.messengerRoomContents[i].membersList.length; x++) {
                          if( DATA.messengerRoomContents[i].membersList[x] != myId ){
                            peerID = DATA.messengerRoomContents[i].membersList[x]
                          }
                        }
                      // get peer id

                      setInterval(()=>{
                        // retrive sms with this peer message room
                        $.ajax({
                          url: '/mongoJs/main/getMessagesPersonal', // Replace with your server endpoint
                          type: 'POST',
                          data: {
                            my_id: myId,
                            peer_id: peerID
                          },
                          success: function(response) {
                            if(response == 'error' && response != null ){
                              console.warn("Error in getting sms!" + response) 

                            } else if( response == 'no sms' && response != null ){

                              if( document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + DATA.messengerRoomContents[i]._id ) ){
                                document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + DATA.messengerRoomContents[i]._id ).innerText = "No sms yet!"
                              }

                            } else {    
                              console.warn("successfully get sms!")

                              findOutUnseenSMS(response) 
                              
                              // get message glimps including unseen sms 
                                getMessageGlimps( response._id, response.sms)                      
                              // get message glimps including unseen sms
                            }
                          },
                          error: function(error) {
                            if(error == 'error' && error != null ){
                              console.warn("Err in getting sms!" + error)               
                            }
                          }
                        })
                        // retrive sms with this peer message room
                      }, 2000)
                
                
                      
                      const thisMessengerRoomRef = DATA.messengerRoomContents[i]._id
                      
                      function findOutUnseenSMS(unseenSmsDATA){
                        for (let i = 0; i < unseenSmsDATA.sms.length; i++) {
                          if( unseenSmsDATA.sms[i].send.id != myId 
                            && unseenSmsDATA.sms[i].seenBy[ objectFriendlyEmail(myId) ] == false  
                          ){ 
                            if( unseenSMSindex.includes( unseenSmsDATA.sms[i]._id ) == false ) {
                              unseenSMSindex.push( unseenSmsDATA.sms[i]._id )

                              
                              if(unseenSMSindex.length > 0){
                                perProfileBarUnseenSMSindex.style.display = 'inline-block'
                                
                                if( document.querySelector( `#messengerProfilesSingelBar-unseenSMSindex-${thisMessengerRoomRef} .unreadSMSindex`) ){
                                  document.querySelector( `#messengerProfilesSingelBar-unseenSMSindex-${thisMessengerRoomRef} .unreadSMSindex`).innerText = unseenSMSindex.length   
                                }                              
                              }
                            }
                          } else if( unseenSmsDATA.sms[i].send.id != myId 
                            && unseenSmsDATA.sms[i].seenBy[ objectFriendlyEmail(myId) ] == true
                          ){
                            if( unseenSMSindex.includes( unseenSmsDATA.sms[i]._id ) == true ) {
                              unseenSMSindex.splice( unseenSMSindex.indexOf( unseenSmsDATA.sms[i]._id ), 1)

                              
                              if(unseenSMSindex.length == 0){
                                perProfileBarUnseenSMSindex.style.display = 'none'
                              }
                            }
                          }
                        }
                      }              
                      // check unseen sms  

                    } else {
                      // check unseen sms in sms group
                      setInterval(()=>{
                        // retrive sms from group message room
                        $.ajax({
                          url: '/mongoJs/main/getGroupMessages', // Replace with your server endpoint
                          type: 'POST',
                          data: {
                            my_id: myId,
                            room_id: DATA.messengerRoomContents[i]._id
                          },
                          success: function(response) {
                            if(response == 'error' && response != null ){
                              console.warn("Error in getting group sms!" + response) 

                            } else if( response == 'no sms' && response != null ){

                              if( document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + DATA.messengerRoomContents[i]._id ) ){
                                document.querySelector('#messengerProfilesSingelBar-contentControl-unseenMsg-' + DATA.messengerRoomContents[i]._id ).innerText = "No sms yet!"
                              }

                            } else {    
                              console.warn("successfully get group sms!")

                              findOutUnseenSMS(response) 
                              
                              // get message glimps including unseen sms 
                                getMessageGlimps( response._id, response.sms)                      
                              // get message glimps including unseen sms
                            }
                          },
                          error: function(error) {
                            if(error == 'error' && error != null ){
                              console.warn("Err in getting group sms!" + error)               
                            }
                          }
                        })
                        // retrive sms from group message room
                      }, 2000)
                
                
                      
                      const thisMessengerRoomRef = DATA.messengerRoomContents[i]._id
                      
                      function findOutUnseenSMS(unseenSmsDATA){
                        for (let i = 0; i < unseenSmsDATA.sms.length; i++) {
                          if( unseenSmsDATA.sms[i].send.id != myId 
                            && unseenSmsDATA.sms[i].seenBy[ objectFriendlyEmail(myId) ] == false  
                          ){ 
                            if( unseenSMSindex.includes( unseenSmsDATA.sms[i]._id ) == false ) {
                              unseenSMSindex.push( unseenSmsDATA.sms[i]._id )

                              
                              if(unseenSMSindex.length > 0){
                                perProfileBarUnseenSMSindex.style.display = 'inline-block'
                                
                                if( document.querySelector( `#messengerProfilesSingelBar-unseenSMSindex-${thisMessengerRoomRef} .unreadSMSindex`) ){
                                  document.querySelector( `#messengerProfilesSingelBar-unseenSMSindex-${thisMessengerRoomRef} .unreadSMSindex`).innerText = unseenSMSindex.length   
                                }                              
                              }
                            }
                          } else if( unseenSmsDATA.sms[i].send.id != myId 
                            && unseenSmsDATA.sms[i].seenBy[ objectFriendlyEmail(myId) ] == true
                          ){
                            if( unseenSMSindex.includes( unseenSmsDATA.sms[i]._id ) == true ) {
                              unseenSMSindex.splice( unseenSMSindex.indexOf( unseenSmsDATA.sms[i]._id ), 1)

                              
                              if(unseenSMSindex.length == 0){
                                perProfileBarUnseenSMSindex.style.display = 'none'
                              }
                            }
                          }
                        }
                      }              
                      // check unseen sms in sms group
                    }
                    // check messenger room group or not     
                    */
                  // message update only for this room
                }  
                // show profile bar
              
              }
            }
            
          // inbox loop
        }
        // result list



        
        // list content in right side view
        const messageRightSide = document.querySelector('#messegeRightSide')
        

          // hide right side on small device default
            document.getElementById('closeMessengerRightSide').onclick = ()=>{
              messageRightSide.style.right = '-810px'              

              document.getElementById('closeMessenger').style.right = 0 // show messenger close button again
            }
          // hide right side on small device default

          
          function listContentInRightSideView( messengerRoomContents ){
            messageRightSide.style.left = 0
            document.querySelector('#groupDashboardRightSide').style.right = '-' + document.querySelector('#groupDashboardRightSide').offsetWidth + 'px'

            // make unseen sms seen
            /*
            if( messengerRoomContents.group == false ){ 
              for (let x = 0; x < messengerRoomContents.membersList.length; x++) { 
                if( messengerRoomContents.membersList.length == 2 && messengerRoomContents.membersList[x] != myId) {
                  function makeUnseenSMSseen(){
                    $.ajax({
                      url: '/mongoJs/main/makeUnseenSMSseen', // Replace with your server endpoint
                      type: 'PUT',
                      data: {
                        my_id: myId,
                        peer_id: messengerRoomContents.membersList[x]
                      },
                      success: function(response) {
                        if(response == 'error' && response != null ){
                          console.warn("Error in make sms seen!" + response) 
        
                        }  else {    
                          console.warn("successfully maked sms seen!")
                       
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in make sms seen!" + error)               
                        }
                      }
                    })
                  }
                  makeUnseenSMSseen()

                  messageRightSide.onclick = ()=>{
                    makeUnseenSMSseen()
                  }
                }
              }
            }
            */
            function makeUnseenSMSseen(){
              $.ajax({
                url: '/mongoJs/main/makeUnseenSMSseen', // Replace with your server endpoint
                type: 'PUT',
                data: {
                  my_id: myId,
                  room_id: messengerRoomContents._id
                },
                success: function(response) {
                  if(response == 'error' && response != null ){
                    console.warn("Error in make sms seen!" + response) 
  
                  }  else {    
                    console.warn("successfully maked sms seen!")
                 
                  }
                },
                error: function(error) {
                  if(error == 'error' && error != null ){
                    console.warn("Err in make sms seen!" + error)               
                  }
                }
              })
            }
            makeUnseenSMSseen()

            messageRightSide.onclick = ()=>{
              makeUnseenSMSseen()
            }
            // make unseen sms seen

            
            // on small device show right side by slide
              if(messengerPanel.offsetWidth <= 799){
                messageRightSide.style.right = 0

                document.getElementById('closeMessenger').style.right = '-50px' // hide messenger close button
              }
            // on small device show right side by slide

            messageRightSide.innerHTML = '' // reset old data


            // messenger right side background
              messageRightSide.style.background = `url( 'https://firebasestorage.googleapis.com/v0/b/fir-rtc-53633.appspot.com/o/messengerBackground%2Fdark_1.jpg?alt=media&token=ea729e64-1eef-441f-8881-337b9afdd0f0' ) center no-repeat`;

              messageRightSide.style.backgroundSize =  '100% 100%'
            // messenger right side background


            // right side header section              
              const createRightSideHeader = document.createElement('div')
              createRightSideHeader.setAttribute('class', 'messengerRightSideHeaderBar')
              messageRightSide.appendChild( createRightSideHeader )

              const createRightSideHeader_name = document.createElement('div')
              createRightSideHeader_name.setAttribute('class', 'messengerRightSideHeaderBar_name')
              createRightSideHeader.appendChild( createRightSideHeader_name )

              const createRightSideHeader_img = document.createElement('img')
              createRightSideHeader_img.setAttribute('class', 'messengerRightSideHeaderBar_img')
              createRightSideHeader.appendChild( createRightSideHeader_img )
              createRightSideHeader_img.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

              const createRightSideHeader_controls = document.createElement('div')
              createRightSideHeader_controls.setAttribute('class', 'messengerRightSideHeaderBar_controls')
              createRightSideHeader.appendChild( createRightSideHeader_controls )

                const createRightSideHeader_controls_subSection = document.createElement('div')
                createRightSideHeader_controls_subSection.setAttribute('class', 'messengerRightSideHeaderBar_controls_subSection')
                createRightSideHeader_controls.appendChild( createRightSideHeader_controls_subSection )

                // audio call icon
                const createAudioCallInRightSideHeaderControls = document.createElement('span')
                createAudioCallInRightSideHeaderControls.setAttribute('class', 'material-icons-outlined rightSideHeaderControlsButton')
                createAudioCallInRightSideHeaderControls.innerText = 'local_phone'
                createRightSideHeader_controls_subSection.appendChild( createAudioCallInRightSideHeaderControls )
                // audio call icon

                // video call icon
                const createVideoCallInRightSideHeaderControls = document.createElement('span')
                createVideoCallInRightSideHeaderControls.setAttribute('class', 'material-icons-outlined rightSideHeaderControlsButton')
                createVideoCallInRightSideHeaderControls.innerText = 'video_camera_front'
                createRightSideHeader_controls_subSection.appendChild( createVideoCallInRightSideHeaderControls )
                // video call icon

                // group setting icon
                  if( messengerRoomContents.group == true ){
                    const createGroupSettingInRightSideHeaderControls = document.createElement('span')
                    createGroupSettingInRightSideHeaderControls.setAttribute('class', 'material-icons-outlined rightSideHeaderControlsButton')
                    createGroupSettingInRightSideHeaderControls.innerText = 'design_services'
                    createRightSideHeader_controls_subSection.appendChild( createGroupSettingInRightSideHeaderControls )

                    // group setting

                      const createGroupDashboardSettingPanel = document.createElement('div')
                      createGroupDashboardSettingPanel.setAttribute('class', 'messengerGroupSettingPanel')
                      messageRightSide.appendChild( createGroupDashboardSettingPanel )

                      // hide default  
                        function hide(){                      
                          createGroupDashboardSettingPanel.style.top = messageRightSide.offsetHeight + 'px'
                          createGroupDashboardSettingPanel.style.left = messageRightSide.offsetWidth + 'px'
                        }
                        hide()
                      // hide default

                      // hide button
                        const createHideButton = document.createElement('div')
                        createHideButton.setAttribute('class', 'material-icons-outlined messengerGroupSettingPanelHide')
                        createHideButton.innerText = 'south_east'
                        createGroupDashboardSettingPanel.appendChild( createHideButton )

                        createHideButton.onclick = hide
                      // hide button
                      
                      // show
                        createGroupSettingInRightSideHeaderControls.onclick = ()=>{
                          createGroupDashboardSettingPanel.style.top = 0
                          createGroupDashboardSettingPanel.style.left = 0
                        }
                      // show 
                      
                      // setting panel header
                        const createHeader = document.createElement('header')
                        createHeader.setAttribute('class', 'groupSettingHeader')
                        createGroupDashboardSettingPanel.appendChild(createHeader)

                        // group name
                          const groupName = document.createElement('div')
                          groupName.setAttribute('class', 'groupSettinPanel-groupName')
                          groupName.innerText = messengerRoomContents.groupProfile.name
                          createHeader.appendChild(groupName)
                        // group name

                        // main nav
                          const groupSettingMainNav = document.createElement('nav')
                          groupSettingMainNav.setAttribute('class', 'groupSettingMainNav')
                          createHeader.appendChild(groupSettingMainNav)

                            const groupSettingMainNavSubSection = document.createElement('nav')
                            groupSettingMainNavSubSection.setAttribute('class', 'groupSettingMainNavSubSection')
                            groupSettingMainNav.appendChild(groupSettingMainNavSubSection)

                              const allMembersButton = document.createElement('div')
                              allMembersButton.setAttribute('class', 'messengerGroupSettingAllMembersButton')
                              allMembersButton.innerText = 'All members list'
                              groupSettingMainNavSubSection.appendChild(allMembersButton)

                              const adminsButton = document.createElement('div')
                              adminsButton.setAttribute('class', 'messengerGroupSettingAdminsButton')
                              adminsButton.innerText = 'Admins'
                              groupSettingMainNavSubSection.appendChild(adminsButton)

                              const addMemberButton = document.createElement('div')
                              addMemberButton.setAttribute('class', 'messengerGroupSettingAddMemberButton')
                              addMemberButton.innerText = 'Add member'
                              groupSettingMainNavSubSection.appendChild(addMemberButton)
                        // main nav
                      // setting panel header

                      // setting panel main
                        const createMain = document.createElement('main')
                        createMain.setAttribute('class', 'groupSettingMain')
                        createGroupDashboardSettingPanel.appendChild(createMain)

                        // show all group members
                          allMembersButton.onclick = ()=>{
                            // get updated data from db
                              $.ajax({
                                url: '/mongoJs/main/getMessengerGroupMembersAndAdmins', // Replace with your server endpoint
                                type: 'POST',
                                data: {
                                  group_id: messengerRoomContents._id,
                                },
                                success: function(response) {
                                  if(response == 'error' && response != null ){
                                    console.warn("Error in getting messenger group updated members and admins!" + response)  
                              
                                  } else if( response != null ){
                                    console.warn("successfully get messenger group updated members and admins!")
                                  
                                                  
                                    showProfileOneByOne(response)
              
                                    
                                  }
                                },
                                error: function(error) {
                                  if(error == 'error' && error != null ){
                                    console.warn("Err in getting messenger group updated members and admins!" + error)               
                                  }
                                }
                              })
                            // get updated data from db


                            function showProfileOneByOne(DATA){
                              createMain.innerHTML = '' // reset old data

                              // admins profile bar holder
                                const adminsProfileBarContainer = document.createElement('div')
                                adminsProfileBarContainer.setAttribute('class', 'adminsProfileContainerInAllMembers' )
                                createMain.appendChild(adminsProfileBarContainer)

                                // admin label
                                  const adminsProfileBarContainerLabel = document.createElement('div')
                                  adminsProfileBarContainerLabel.setAttribute('class', 'adminsProfileContainerLabel-InAllMembers' )
                                  adminsProfileBarContainerLabel.innerHTML = "<span>Admins <span></span></span>"
                                  adminsProfileBarContainer.appendChild(adminsProfileBarContainerLabel)
                                // admin label

                                let totalAdminNumber = 0
                              // admins profile bar holder

                              // general members profile bar holder
                                const generalMembersProfileBarContainer = document.createElement('div')
                                generalMembersProfileBarContainer.setAttribute('class', 'generalMembersProfileContainerInAllMembers' )
                                createMain.appendChild(generalMembersProfileBarContainer)

                                // members label
                                  const generalMembersProfileBarContainerLabel = document.createElement('div')
                                  generalMembersProfileBarContainerLabel.setAttribute('class', 'generalMembersProfileContainerLabel-InAllMembers' )
                                  generalMembersProfileBarContainerLabel.innerHTML = "<span>Members <span></span></span>"
                                  generalMembersProfileBarContainer.appendChild(generalMembersProfileBarContainerLabel)
                                // members label 
                                
                                let totalMembersNumber = 0
                              // general members profile bar holder

                              // show searched profile one by one
                                for (let i = 0; i < DATA.membersList.length; i++) {
                                   
                                    const perProfileBar = document.createElement('div')
                                    perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody allMembersMessengerGroupMemberProfileSingleBar' )
                                    perProfileBar.setAttribute('id', 'allMembersMessengerGroupMemberProfileSingleBar_' + DATA.membersList[i] )

                                    if( DATA.groupProfile.admins.includes( DATA.membersList[i] ) == true  ){
                                      adminsProfileBarContainer.appendChild( perProfileBar )

                                      // show admins total numbers
                                        totalAdminNumber++
                                        adminsProfileBarContainerLabel.querySelector('span span').innerText = ' ( '+ totalAdminNumber + ' )'
                                      // show admins total numbers

                                    } else {
                                      generalMembersProfileBarContainer.appendChild( perProfileBar )

                                      // show members total numbers
                                        totalMembersNumber++
                                        generalMembersProfileBarContainerLabel.querySelector('span span').innerText = ' ( '+ totalMembersNumber + ' )'
                                      // show members total numbers
                                    }                                    
                                                      
                                          
                                    const perProfileBarHolder = document.createElement('div')
                                    perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
                                    //perProfileBarHolder.setAttribute('id', 'allMembersMessengerGroupMemberProfileSingleBar-imageHolder-' + DATA[i] )
                                    perProfileBar.appendChild( perProfileBarHolder )
                    
                                    const perProfileBarImg = document.createElement('img')
                                    perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
                                    //perProfileBarImg.setAttribute('id', 'allMembersMessengerGroupMemberProfileSingleBar-img-' + DATA[i] )
                                    perProfileBarHolder.appendChild( perProfileBarImg )
                                    perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
                    
                                    const perProfileBarContent = document.createElement('div')
                                    perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
                                    //perProfileBarContent.setAttribute('id', 'allMembersMessengerGroupMemberProfileSingleBar-content-' + DATA[i] )
                                    perProfileBar.appendChild( perProfileBarContent )

                                    // style js
                                      // set content bar width
                                      const getPerProfileBarContentWidth = document.querySelector('.allMembersMessengerGroupMemberProfileSingleBar').offsetWidth
                                      const deductPerProfileBarContentWidth = getPerProfileBarContentWidth - 65

                                      perProfileBarContent.style.width = deductPerProfileBarContentWidth + 'px'                    
                                    // style js

                                    
                    
                                    const perProfileBarContentName = document.createElement('div')
                                    perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName allMembersMessengerGroupMemberProfileSingleBar-contentName')
                                    //perProfileBarContentName.setAttribute('id', 'messengerProfilesSingelBar-contentName-' + DATA.messengerRoomContents[i]._id )
                                    perProfileBarContent.appendChild( perProfileBarContentName )
                    
                                    const perProfileBarContentControl = document.createElement('div')
                                    perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
                                    //perProfileBarContentControl.setAttribute('id', 'messengerProfilesSingelBar-contentControl-' + DATA.messengerRoomContents[i]._id )
                                    perProfileBarContent.appendChild( perProfileBarContentControl )


                                      const memberAddRemoveButton = document.createElement('div')
                                      memberAddRemoveButton.setAttribute('class', 'profilesSingelBar-contentControl-memberAddRemoveButton')
                                      //perProfileBarContentControl_subSection.setAttribute('id', 'addMessengerGroupMemberProfileSingleBar-contentControl-subSection-' + DATA[i] )
                                      memberAddRemoveButton.innerHTML = '<span class="material-icons-outlined">person_remove</span> Leave'                                    
                                      perProfileBarContentControl.appendChild( memberAddRemoveButton ) 
                                      memberAddRemoveButton.onclick = removeMessengerGroupMember

                                      const memberAddAsAdminButton = document.createElement('div')
                                      memberAddAsAdminButton.setAttribute('class', 'profilesSingelBar-contentControl-memberAddAsAdminButton')
                                      //perProfileBarContentControl_subSection.setAttribute('id', 'addMessengerGroupMemberProfileSingleBar-contentControl-subSection-' + DATA[i] )
                                      memberAddAsAdminButton.innerHTML = '<span class="material-icons-outlined">person_add</span> Add As Admin'                                    
                                      perProfileBarContentControl.appendChild( memberAddAsAdminButton ) 


                                      // is it your id
                                        if(DATA.membersList[i] == myId){
                                          const isItYourId = document.createElement('div')
                                          isItYourId.setAttribute('class', 'isItYourIdGroupMembersList')
                                          isItYourId.innerText = '( You )'
                                          perProfileBarContentControl.appendChild( isItYourId )

                                          
                                          memberAddRemoveButton.innerHTML = '<span class="material-icons-outlined">person_remove</span> Leave'  

                                          // hide add as admin for myId
                                            memberAddAsAdminButton.style.display = 'none'
                                          // hide add as admin for myId
                                          
                                          // when I leave group hide this group from my messenger
                                            memberAddRemoveButton.onclick = ()=>{
                                              removeMessengerGroupMember()

                                              // hide profile bar from message list in messenger left side
                                                if( document.querySelector( `#messengerProfilesSingelBar_${ messengerRoomContents._id }` ) ){
                                                  document.querySelector( `#messengerProfilesSingelBar_${ messengerRoomContents._id }` ).style.display = 'none'
                                                }
                                              // hide profile bar from message list in messenger left side

                                              // clear messenger right side
                                                messageRightSide.innerHTML = '' 
                                              // clear messenger right side
                                            }
                                          // when I leave group hide this group from my messenger
                                          
                                          
                                        }
                                      // is it your id
                                        
                                      // as an admin                                        
                                        else if( DATA.groupProfile.admins.includes(myId) == true  ){
                                          // remove member
                                            memberAddRemoveButton.innerHTML = '<span class="material-icons-outlined">person_remove</span> Remove'
                                          // remove member
                                          
                                        }                                        
                                      // as an admin

                                      // as ordinary member
                                        else {
                                          // hide leave button on others profile bar
                                            memberAddRemoveButton.style.display = 'none'
                                          // hide leave button on others profile bar
                                        }
                                      // as ordinary member


                                      // check this member admin or 
                                        checkAdmin()

                                        function checkAdmin(){
                                          $.ajax({
                                            url: '/mongoJs/main/getMessengerGroupMembersAndAdmins', // Replace with your server endpoint
                                            type: 'POST',
                                            data: {
                                              group_id: messengerRoomContents._id,
                                              peer_id: DATA.membersList[i]
                                            },
                                            success: function(response) {
                                              if(response == 'error' && response != null ){
                                                console.warn("Error in getting messenger group updated admin!" + response)  
                                          
                                              } else if( response != null ){
                                                console.warn("successfully get messenger group updated admin!")
                                              
                                                              
                                                memberStatus(response)
                          
                                                
                                              }
                                            },
                                            error: function(error) {
                                              if(error == 'error' && error != null ){
                                                console.warn("Err in getting messenger group admin!" + error)               
                                              }
                                            }
                                          })
    
    
                                          function memberStatus(membersDATA){
                                                
                                            // admin
                                              if(DATA.membersList[i] != myId && membersDATA.groupProfile.admins.includes(DATA.membersList[i]) == true && membersDATA.groupProfile.admins.includes(myId) == true ) {
                                                memberAddAsAdminButton.innerHTML = '<span class="material-icons-outlined">person_remove</span> Remove Admin'

                                                adminsProfileBarContainer.appendChild( perProfileBar )

                                                
                                                memberAddAsAdminButton.onclick = ()=>{ 
                                                  removeAdmin()                                                  
                                                }
                                              } else if( DATA.membersList[i] != myId && membersDATA.groupProfile.admins.includes(DATA.membersList[i]) == false && membersDATA.groupProfile.admins.includes(myId) == true){
                                                memberAddAsAdminButton.innerHTML = '<span class="material-icons-outlined">person_add</span> Add As Admin'

                                                generalMembersProfileBarContainer.appendChild( perProfileBar )

                                                
    
                                                memberAddAsAdminButton.onclick = ()=>{ 
                                                  addInMembersList(true)   
                                                }
                                              } else if( DATA.membersList[i] != myId && membersDATA.groupProfile.admins.includes(myId) == false){
                                                memberAddAsAdminButton.style.display = 'none'
                                              }
                                            // admin
                                              
                                          }
                                        }
                                      // check this member admin or not


                                      // remove member
                                        function removeMessengerGroupMember(){
                                          $.ajax({
                                            url: '/mongoJs/main/removeMemberFromMessengerGroup', // Replace with your server endpoint
                                            type: 'PUT',
                                            data: {
                                              group_id: messengerRoomContents._id,
                                              meetingRoom_id: messengerRoomContents.meetingRoomUrl,
                                              peer_id: DATA.membersList[i]
                                            },
                                            success: function(response) {
                                              if(response == 'error' && response != null ){
                                                console.warn("Error in removing member from messenger group!" + response)  
                                          
                                              } else if( response != null ){
                                                console.warn("successfully removed member from messenger group!")
                                              
                                                              
                                                perProfileBar.style.visibility = 'hidden'                          
                                                

                                              }
                                            },
                                            error: function(error) {
                                              if(error == 'error' && error != null ){
                                                console.warn("Err in removing member from messenger group!" + error)               
                                              }
                                            }
                                          })
                                        }
                                      // remove member

                                      // add admin only                                      
                                        function addInMembersList(admin) {
                                          $.ajax({
                                            url: '/mongoJs/main/addMessengerGroupMember', // Replace with your server endpoint
                                            type: 'PUT',
                                            data: {
                                              group_id: messengerRoomContents._id,
                                              peer_id: DATA.membersList[i],
                                              Admin: admin
                                            },
                                            success: function(response) {
                                              if(response != 'error' && response != null ){
                                                console.warn("successfully added in group admin!")
                            
                                                checkAdmin()

                                                // show admins total numbers
                                                  totalAdminNumber++
                                                  adminsProfileBarContainerLabel.querySelector('span span').innerText = ' ( '+ totalAdminNumber + ' )'
                                                // show admins total numbers
                                                // show members total numbers
                                                  totalMembersNumber--
                                                  generalMembersProfileBarContainerLabel.querySelector('span span').innerText = ' ( '+ totalMembersNumber + ' )'
                                                // show members total numbers
                            
                                              } else{
                                                console.warn("Error in adding in group admin!" + response)              
                                              }
                                            },
                                            error: function(error) {
                                              if(error == 'error' && error != null ){
                                                console.warn("Err in adding in group admin!" + error)               
                                              }
                                            }
                                          })
                                        }                                  
                                      // add admin only

                                      // remove admin
                                        function removeAdmin(){
                                          $.ajax({
                                            url: '/mongoJs/main/removeAdminFromMessengerGroup', // Replace with your server endpoint
                                            type: 'PUT',
                                            data: {
                                              group_id: messengerRoomContents._id,
                                              peer_id: DATA.membersList[i]
                                            },
                                            success: function(response) {
                                              if(response == 'error' && response != null ){
                                                console.warn("Error in removing admin from messenger group!" + response)  
                                          
                                              } else if( response != null ){
                                                console.warn("successfully removed admin from messenger group!")
                                              
                                                              
                                                checkAdmin()

                                                // show admins total numbers
                                                  totalAdminNumber--
                                                  adminsProfileBarContainerLabel.querySelector('span span').innerText = ' ( '+ totalAdminNumber + ' )'
                                                // show admins total numbers
                                                // show members total numbers
                                                  totalMembersNumber++
                                                  generalMembersProfileBarContainerLabel.querySelector('span span').innerText = ' ( '+ totalMembersNumber + ' )'
                                                // show members total numbers
                          
                                                
                                              }
                                            },
                                            error: function(error) {
                                              if(error == 'error' && error != null ){
                                                console.warn("Err in removing member from messenger group!" + error)               
                                              }
                                            }
                                          })
                                        }
                                      // remove admin
                                       

                                    
                                    // pro pic and name 
                                      // Send AJAX request to Node.js server              
                                      $.ajax({
                                        url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                                        type: 'POST',
                                        data: {
                                          peer_id: DATA.membersList[i],
                                        },
                                        success: function(response) {
                                          if(response != 'error' && response != null ){
                                            console.warn("successfully peer profile pic and name!")
                        
                                            showProfile(response)
                        
                                          } else{
                                            console.warn("Error in getting peer profile pic and name!" + response)              
                                          }
                                        },
                                        error: function(error) {
                                          if(error == 'error' && error != null ){
                                            console.warn("Err in getting peer profile pic and name!" + error)               
                                          }
                                        }
                                      })
                        


                                      function showProfile(singleDATA){                
                                        // name
                                        perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                          
                                        // pic   
                                          if ( singleDATA.profileInfo.profilePics.active != null) {           
                                            perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                                          }              
                                        // pic
                        
                                      }                                         
                                    // pro pic and name

                                }
                              // show searched profile one by one
                            }
                          }                        
                        // show all group members
                        

                        // add member
                          addMemberButton.onclick = ()=>{
                            createMain.innerHTML = '' // reset old data

                            const searchFieldLabel = document.createElement('label')
                            searchFieldLabel.setAttribute('for', 'groupSettingAddNewMemberSearchField')
                            searchFieldLabel.setAttribute('class', 'groupSettingAddNewMemberSearchFieldLabel')
                            searchFieldLabel.innerText = 'Search among your friends...'
                            createMain.appendChild(searchFieldLabel)

                            const searchField = document.createElement('input')
                            searchField.setAttribute('type', 'text')
                            searchField.setAttribute('id', 'groupSettingAddNewMemberSearchField')
                            searchField.setAttribute('placeholder', 'Type your friend name...')
                            createMain.appendChild(searchField)

                            const searchBtton = document.createElement('div')
                            searchBtton.setAttribute('id', 'groupSettingAddNewMemberSearchButton')
                            searchBtton.innerText = 'Search'
                            createMain.appendChild(searchBtton)

                            // search
                              searchBtton.onclick = ()=>{
                                $.ajax({
                                  url: '/mongoJs/main/searchAmongFriendsToAddInGroup', // Replace with your server endpoint
                                  type: 'POST',
                                  data: {
                                    my_id: myId,
                                    field_val: DOMPurify.sanitize(searchField.value.trim())
                                  },
                                  success: function(response) {
                                    if(response == 'error' && response != null ){
                                      console.warn("Error in searching among messenger friends!" + response)  
                                
                                    } else if( response != null ){
                                      console.warn("successfully get among messenger friends!")
                                    
                                                     
                                      showSearchedMember(response)
                
                                    
                                    }
                                  },
                                  error: function(error) {
                                    if(error == 'error' && error != null ){
                                      console.warn("Err in searching among messenger friendss!" + error)               
                                    }
                                  }
                                })
                              }
                            // search


                            const searchedProfileBarContainer = document.createElement('div')
                            searchedProfileBarContainer.setAttribute('id', 'groupSettingAddNewMemberSearchedProfileBarContainer')
                            createMain.appendChild(searchedProfileBarContainer)


                            // show searched member
                              function showSearchedMember(DATA){
                                for (let i = 0; i < DATA.length; i++) {
                                  searchedProfileBarContainer.innerHTML = '' // reset old data
                                  
                                  const perProfileBar = document.createElement('div')
                                  perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody addMessengerGroupMemberProfileSingleBar' )
                                  searchedProfileBarContainer.appendChild( perProfileBar )
                                                    
                                        
                                  const perProfileBarHolder = document.createElement('div')
                                  perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
                                  perProfileBarHolder.setAttribute('id', 'addMessengerGroupMemberProfileSingleBar-imageHolder-' + DATA[i] )
                                  perProfileBar.appendChild( perProfileBarHolder )
                  
                                  const perProfileBarImg = document.createElement('img')
                                  perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
                                  perProfileBarImg.setAttribute('id', 'addMessengerGroupMemberProfileSingleBar-img-' + DATA[i] )
                                  perProfileBarHolder.appendChild( perProfileBarImg )
                                  perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
                  
                                  const perProfileBarContent = document.createElement('div')
                                  perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
                                  perProfileBarContent.setAttribute('id', 'addMessengerGroupMemberProfileSingleBar-content-' + DATA[i] )
                                  perProfileBar.appendChild( perProfileBarContent )

                                  // style js
                                    // set content bar width
                                    const getPerProfileBarContentWidth = document.querySelector('.addMessengerGroupMemberProfileSingleBar').offsetWidth
                                    const deductPerProfileBarContentWidth = getPerProfileBarContentWidth - 65

                                    perProfileBarContent.style.width = deductPerProfileBarContentWidth + 'px'                    
                                  // style js

                                  
                  
                                  const perProfileBarContentName = document.createElement('div')
                                  perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName addMessengerGroupMemberProfileSingleBar-contentName')
                                  //perProfileBarContentName.setAttribute('id', 'messengerProfilesSingelBar-contentName-' + DATA.messengerRoomContents[i]._id )
                                  perProfileBarContent.appendChild( perProfileBarContentName )
                  
                                  const perProfileBarContentControl = document.createElement('div')
                                  perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
                                  //perProfileBarContentControl.setAttribute('id', 'messengerProfilesSingelBar-contentControl-' + DATA.messengerRoomContents[i]._id )
                                  perProfileBarContent.appendChild( perProfileBarContentControl )

                                    const memberAddRemoveButton = document.createElement('div')
                                    memberAddRemoveButton.setAttribute('class', 'profilesSingelBar-contentControl-memberAddRemoveButton')
                                    //perProfileBarContentControl_subSection.setAttribute('id', 'addMessengerGroupMemberProfileSingleBar-contentControl-subSection-' + DATA[i] )
                                    memberAddRemoveButton.innerHTML = '<span class="material-icons-outlined">person_add</span> Add'                                    
                                    perProfileBarContentControl.appendChild( memberAddRemoveButton ) 


                                    const memberAddAsAdminButton = document.createElement('div')
                                    memberAddAsAdminButton.setAttribute('class', 'profilesSingelBar-contentControl-memberAddAsAdminButton')
                                    //perProfileBarContentControl_subSection.setAttribute('id', 'addMessengerGroupMemberProfileSingleBar-contentControl-subSection-' + DATA[i] )
                                    memberAddAsAdminButton.innerHTML = '<span class="material-icons-outlined">person_add</span> Add As Admin'                                    
                                    perProfileBarContentControl.appendChild( memberAddAsAdminButton ) 
                                                  

                                    // check already member
                                    checkAlreadyMember()

                                    function checkAlreadyMember(){
                                      $.ajax({
                                        url: '/mongoJs/main/getMessengerGroupMembersAndAdmins', // Replace with your server endpoint
                                        type: 'POST',
                                        data: {
                                          group_id: messengerRoomContents._id,
                                          peer_id: DATA[i]
                                        },
                                        success: function(response) {
                                          if(response == 'error' && response != null ){
                                            console.warn("Error in getting messenger group updated members and admins!" + response)  
                                      
                                          } else if( response != null ){
                                            console.warn("successfully get messenger group updated members and admins!")
                                          
                                                          
                                            memberStatus(response)
                      
                                            
                                          }
                                        },
                                        error: function(error) {
                                          if(error == 'error' && error != null ){
                                            console.warn("Err in getting messenger group updated members and admins!" + error)               
                                          }
                                        }
                                      })


                                      function memberStatus(membersDATA){
                                        // check member
                                          if(membersDATA.membersList.includes(DATA[i]) == true && membersDATA.groupProfile.admins.includes(myId) == false ) {
                                            memberAddRemoveButton.innerHTML = '<span class="material-icons-outlined">group</span> Member'
                                          } else if( membersDATA.membersList.includes(DATA[i]) == true && membersDATA.groupProfile.admins.includes(myId) == true ){
                                            memberAddRemoveButton.innerHTML = '<span class="material-icons-outlined">person_remove</span> Remove'

                                            memberAddRemoveButton.onclick = removeFromMemberList
                                          } else{
                                            memberAddRemoveButton.innerHTML = '<span class="material-icons-outlined">person_add</span> Add'

                                            memberAddRemoveButton.onclick = ()=>{
                                              addInMembersList(false)
                                            }
                                          } 
                                        // check member

                                        // admin
                                          if(membersDATA.groupProfile.admins.includes(DATA[i]) == true && membersDATA.groupProfile.admins.includes(myId) == true ) {
                                            memberAddAsAdminButton.innerHTML = '<span class="material-icons-outlined">person_remove</span> Remove Admin'

                                            memberAddAsAdminButton.onclick = ()=>{ 
                                              removeAdmin()
                                            }
                                          } else if(membersDATA.groupProfile.admins.includes(DATA[i]) == false && membersDATA.groupProfile.admins.includes(myId) == true){
                                            memberAddAsAdminButton.innerHTML = '<span class="material-icons-outlined">person_add</span> Add As Admin'

                                            memberAddAsAdminButton.onclick = ()=>{ 
                                              addInMembersList(true)
                                            }
                                          } else if(membersDATA.groupProfile.admins.includes(myId) == false){
                                            memberAddAsAdminButton.style.display = 'none'
                                          }
                                        // admin
                                      }
                                    }
                                    // check already member


                                  
                                  // pro pic and name 
                                    // Send AJAX request to Node.js server              
                                    $.ajax({
                                      url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                                      type: 'POST',
                                      data: {
                                        peer_id: DATA[i],
                                      },
                                      success: function(response) {
                                        if(response != 'error' && response != null ){
                                          console.warn("successfully peer profile pic and name!")
                      
                                          showProfile(response)
                      
                                        } else{
                                          console.warn("Error in getting peer profile pic and name!" + response)              
                                        }
                                      },
                                      error: function(error) {
                                        if(error == 'error' && error != null ){
                                          console.warn("Err in getting peer profile pic and name!" + error)               
                                        }
                                      }
                                    })
                      


                                    function showProfile(singleDATA){                
                                      // name
                                      perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                        
                                      // pic   
                                        if ( singleDATA.profileInfo.profilePics.active != null) {           
                                          perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                                        }              
                                      // pic
                      
                                    }                                         
                                  // pro pic and name


                                  // add in memberslist
                                    function addInMembersList(admin) {
                                      $.ajax({
                                        url: '/mongoJs/main/addMessengerGroupMember', // Replace with your server endpoint
                                        type: 'PUT',
                                        data: {
                                          group_id: messengerRoomContents._id,
                                          peer_id: DATA[i],
                                          Admin: admin
                                        },
                                        success: function(response) {
                                          if(response != 'error' && response != null ){
                                            console.warn("successfully added in group members!")
                        
                                            checkAlreadyMember()
                        
                                          } else{
                                            console.warn("Error in adding in group members!" + response)              
                                          }
                                        },
                                        error: function(error) {
                                          if(error == 'error' && error != null ){
                                            console.warn("Err in adding in group members!" + error)               
                                          }
                                        }
                                      })
                                    }
                                  // add in memberslist

                                  // remove from memberslist
                                    function removeFromMemberList(){
                                      $.ajax({
                                        url: '/mongoJs/main/removeMemberFromMessengerGroup', // Replace with your server endpoint
                                        type: 'PUT',
                                        data: {
                                          group_id: messengerRoomContents._id,
                                          peer_id: DATA[i]
                                        },
                                        success: function(response) {
                                          if(response == 'error' && response != null ){
                                            console.warn("Error in removing member from messenger group!" + response)  
                                      
                                          } else if( response != null ){
                                            console.warn("successfully removed member from messenger group!")
                                          
                                                          
                                            checkAlreadyMember()
                      
                                            
                                          }
                                        },
                                        error: function(error) {
                                          if(error == 'error' && error != null ){
                                            console.warn("Err in removing member from messenger group!" + error)               
                                          }
                                        }
                                      })
                                    }
                                  // remove from memberslist  
                                  
                                  // remove admin
                                    function removeAdmin(){
                                      $.ajax({
                                        url: '/mongoJs/main/removeAdminFromMessengerGroup', // Replace with your server endpoint
                                        type: 'PUT',
                                        data: {
                                          group_id: messengerRoomContents._id,
                                          peer_id: DATA[i]
                                        },
                                        success: function(response) {
                                          if(response == 'error' && response != null ){
                                            console.warn("Error in removing admin from messenger group!" + response)  
                                      
                                          } else if( response != null ){
                                            console.warn("successfully removed admin from messenger group!")
                                          
                                                          
                                            checkAlreadyMember()
                      
                                            
                                          }
                                        },
                                        error: function(error) {
                                          if(error == 'error' && error != null ){
                                            console.warn("Err in removing member from messenger group!" + error)               
                                          }
                                        }
                                      })
                                    }
                                  // remove admin

                                  
                                  
                                  // fit single profile bar width according to device size
                                    if(messengerPanel.offsetWidth <= 799){
                                      
                                    }
                                  // fit single profile bar width according to device size
                                }                               
                              }
                            // show searched member
                          }
                        // add member
                      // setting panel main
                      
                    // group setting
                  }
                // group setting icon
              

              

              // right side header pro pic & name    
                // check messenger room group or not               
                if( messengerRoomContents.group == false ){ 
                  for (let x = 0; x < messengerRoomContents.membersList.length; x++) { 
                    if( messengerRoomContents.membersList.length == 2 && messengerRoomContents.membersList[x] != myId) { 
                      // retrive data from db
                        // Send AJAX request to Node.js server              
                        $.ajax({
                          url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                          type: 'POST',
                          data: {
                            peer_id: messengerRoomContents.membersList[x],
                          },
                          success: function(response) {
                            if(response != 'error' && response != null ){
                              console.warn("successfully peer profile pic and name!")
        
                              showProfile(response)
        
                            } else{
                              console.warn("Error in getting peer profile pic and name!" + response)              
                            }
                          },
                          error: function(error) {
                            if(error == 'error' && error != null ){
                              console.warn("Err in getting peer profile pic and name!" + error)               
                            }
                          }
                        })
        


                        function showProfile(singleDATA){                
                          // name
                          createRightSideHeader_name.innerText = singleDATA.profileInfo.name.fullName
          
                          // pic   
                            if ( singleDATA.profileInfo.profilePics.active != null) {           
                              createRightSideHeader_img.src = singleDATA.profileInfo.profilePics.active  
                            }              
                          // pic
        
                        }                          
                      // retrive data from db
                    }
                  }
                } else {
                  // name
                  createRightSideHeader_name.innerText = messengerRoomContents.groupProfile.name
                }
                // check messenger room group or not
              // right side header pro pic & name
            // right side header section







            // sub setcion scroll to bottom
              function personalMessageInboxScrollToBottom(){
                setTimeout(()=>{
                  if(document.querySelector('.messengerRightSideMessageViewMiddlePart')){
                    document.querySelector('.messengerRightSideMessageViewMiddlePart').scrollTo(0, document.querySelector('.messengerRightSideMessageViewMiddlePart_subSection').scrollHeight)
                  }                  
                }, 2000)
              }      
              personalMessageInboxScrollToBottom()            
            // sub setcion scroll to bottom







            // messages view middle part

              // confirm delatation mood (delete sms)
              const confirmDelatationMood = document.createElement('div')
              confirmDelatationMood.setAttribute('class', 'confirmDelatationMood')
              messageRightSide.appendChild( confirmDelatationMood )

                // center position
                  function centerConfirmDelatationMood() {
                    const containerWidth = messageRightSide.offsetWidth
                    const containerHeight = messageRightSide.offsetHeight

                    const containerWidthHalf = containerWidth / 2
                    const containerHeightHalf = containerHeight / 2

                    const thisElemWidthHalf = confirmDelatationMood.offsetWidth / 2
                    const thisElemHeightHalf = confirmDelatationMood.offsetHeight / 2

                    confirmDelatationMood.style.left = containerWidthHalf - thisElemWidthHalf + 'px'
                    confirmDelatationMood.style.top = containerHeightHalf - thisElemHeightHalf + 'px'
                  }
                // center position
                
                
                // send delete request to db
                const closeButton = '<div><span class="material-icons-outlined">cancel</span></div>'
                const deleteFromYou = '<div>Delete only from you!</div>'
                const deleteFromEveryone = '<div>Delete from everyone!</div>'

                confirmDelatationMood.innerHTML = closeButton + deleteFromYou // default popup

                
                function sendDeleteRequest2DB(messngerRoomId, sms, smsIndex, areYouSender, myOwnId) {
                  if( areYouSender == true) {
                    confirmDelatationMood.innerHTML = closeButton + deleteFromYou + deleteFromEveryone

                    document.querySelector('.confirmDelatationMood').querySelector('div:nth-child(2)').style.borderBottom = '1px solid azure' // set bottom border in delete conformation popup

                    document.querySelector('.confirmDelatationMood').querySelector('div:nth-child(2)').onclick = ()=>{ 
                      sendAJAXrequest2DB('delete only from me')
                      hideDeletePopUp()
                    }

                    document.querySelector('.confirmDelatationMood').querySelector('div:nth-child(3)').onclick = ()=>{ 
                      sendAJAXrequest2DB('delete from everyone')
                      hideDeletePopUp()
                    }
                  } else {
                    document.querySelector('.confirmDelatationMood').querySelector('div').onclick = ()=>{ 
                      sendAJAXrequest2DB('delete only from me')
                      hideDeletePopUp()
                    }
                  }

                  centerConfirmDelatationMood() // center again


                  // hide
                    document.querySelector('.confirmDelatationMood').querySelector('div:first-child').onclick = ()=>{ hideDeletePopUp() }

                    function hideDeletePopUp(){
                      confirmDelatationMood.style.left = '-600px'
                    }
                  // hide

                  

                  function sendAJAXrequest2DB(deleteFrom){
                    // console.log('messngerRoomId ---1111----222222222-------333333333---- '+ messngerRoomId)
                    // console.log('smsID ---- '+ sms._id)
                    // console.log('areYouSender '+ areYouSender)
                    // console.log('deleteFrom '+ deleteFrom)

                    
                    $.ajax({
                      url: '/mongoJs/main/deleteSMS', // Replace with your server endpoint
                      type: 'DELETE',
                      data: {
                        my_email_Id: myOwnId,
                        messenger_room_id: messngerRoomId,
                        sms_id: sms._id,
                        delete_from: deleteFrom,
                      },
                      success: async function(response) {
                        if(response != 'error' && response != null ){
                          console.warn("successfully deleted sms in messenger panel! >>>>>>>>>>>>>>>>>>>>>>")

                          
                          function arraysAreEqual(arr1, arr2) {
                            if (arr1.length !== arr2.length) return false;
                          
                            for (let i = 0; i < arr1.length; i++) {
                              if (arr1[i] !== arr2[i]) return false;
                            }
                          
                            return true;
                          }
                          const areEqual = arraysAreEqual(messengerRoomContents.membersList, response.sms[smsIndex].deletedBy);

                          // check if there is any media
                          let hasMEDIA = false
                            for(let k=0; k< sms.messengerData.length; k++){
                              if( sms.messengerData[k].media.image != null){
                                hasMEDIA = true
                                break
                              }
                            }
                          // check if there is any media
                            
                          
                          if( areEqual == true && hasMEDIA == true){                          
                            const storageReference = ref(storage, 'message/id' + messngerRoomId + '/sms' + smsIndex + '/' ); //assign the path of pic
                            try {
                              const files = await listAll(storageReference);
                          
                              files.items.forEach(async (item) => {
                                // Delete the file
                                await deleteObject(item).then(() => {
                                  console.log('File deleted successfully')

                                  // delay
                                  setTimeout(()=>{ 
                                    getUpdateMessage( messngerRoomId ) // show updated sms after delation. the function is below
                                  }, 1000)
                                  
                                }).catch((error) => {
                                  console.log('Uh-oh, an error occurred!')
                                })

                                console.log(`Deleted file: ${item.fullPath}`);
                              });
                          
                              console.log(`All files in ${storageReference} deleted.`);
                            } catch (error) {
                              console.error(`Error deleting files in ${storageReference}: ${error.message}`);
                            }
                          }

                          
                                                   
      
                        } else{
                          console.warn("Error in deleting sms in messenger panel!" + response)              
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in deleting sms in messenger panel!" + error)               
                        }
                      }
                    })


                    function getUpdateMessage( messngerRoomId ) {
                      $.ajax({
                        url: '/mongoJs/main/getUpdateSMSinMessengerPanel', // Replace with your server endpoint
                        type: 'POST',
                        data: {
                          messenger_room_id: messngerRoomId,
                        },
                        success: function(response) {
                          if(response != 'error' && response != null ){
                            showEveryMessages( response )
                          } else{
                            console.warn("Error in getting updated sms in messenger!" + response)              
                          }
                        },
                        error: function(error) {
                          if(error == 'error' && error != null ){
                            console.warn("Err in getting updated sms in messenger!" + error)               
                          }
                        }
                      })
                    }
                    
                  }
                }
              // confirm delatation mood (delete sms)



              // share sms
                let storeIdToForwardSMS = []
                let messengerRoomToForwardSMS = []

                const shareSMSpanel = document.createElement('div')
                shareSMSpanel.setAttribute('class', 'shareSMSpanel')
                messageRightSide.appendChild( shareSMSpanel )

                // set dyna size
                  shareSMSpanel.style.height = messageRightSide.offsetHeight - 120 + 'px'
                  shareSMSpanel.style.marginTop = '80px'
                  shareSMSpanel.style.width = messageRightSide.offsetWidth - 20 + 'px'                  
                // set dyna size

                // close button
                  const closeButtonHolder = document.createElement('div')
                  closeButtonHolder.setAttribute('class', 'shareSMSpanelCloseButtonHolder')
                  closeButtonHolder.innerHTML = '<span class="material-icons-outlined">cancel</span>'
                  shareSMSpanel.appendChild( closeButtonHolder )

                  closeButtonHolder.onclick = hideShareSMSpanel
                // close button

                // search field
                  const createSearchFieldContainer = document.createElement('div')
                  createSearchFieldContainer.setAttribute('class', 'shareSMSpanelSearchFieldContainer')
                  shareSMSpanel.appendChild( createSearchFieldContainer )

                  // field
                    const inputText = document.createElement('input')
                    inputText.setAttribute('type', 'text')
                    inputText.setAttribute('placeholder', 'Type name of your messenger friends whom you want to share...')
                    createSearchFieldContainer.appendChild( inputText )
                  // field

                  // search button
                    const searchButton = document.createElement('button')
                    searchButton.innerHTML = '<span class="material-icons-outlined">person_search</span>'
                    createSearchFieldContainer.appendChild( searchButton )
                  // search button

                  // set dyna field size
                    inputText.style.width = ((createSearchFieldContainer.offsetWidth - searchButton.offsetWidth) - 10) + 'px'
                  // set dyna field size
                // search field

                // searched profile holder
                  const searchdProfileHolder = document.createElement('div')
                  searchdProfileHolder.setAttribute('class', 'searchdProfileHolderSharePanel')
                  shareSMSpanel.appendChild( searchdProfileHolder )

                  // set dyna height
                    searchdProfileHolder.style.height = shareSMSpanel.offsetHeight - 30 + 'px'
                  // set dyna height
                // searched profile holder

                // send button
                  const shareSMS = document.createElement('div')
                  shareSMS.setAttribute('class', 'shareSMSbutton')
                  shareSMS.innerText = 'Send'
                  shareSMSpanel.appendChild( shareSMS )

                  // center align button
                    const buttonWidthHalf = (shareSMS.offsetWidth /2)
                    const spareSpaceContainerHalf = ((shareSMSpanel.offsetWidth - shareSMS.offsetWidth) / 2)

                    shareSMS.style.left = (spareSpaceContainerHalf - buttonWidthHalf) + 'px'
                  // center align button

                  function showShareSMSsendButton(){
                    if( storeIdToForwardSMS.length > 0 || messengerRoomToForwardSMS.length > 0){
                      shareSMS.style.bottom = '10px'
                    } else {
                      shareSMS.style.bottom = '-50px'
                    }
                  }                  
                // send button


                // shutter to hide
                  const hideShareSMSpanle = document.createElement('div')
                  hideShareSMSpanle.setAttribute('class', 'hideShareSMSpanle')
                  shareSMSpanel.appendChild( hideShareSMSpanle )
                // shutter to hide


                // show/ hide share panel
                  function showShareSMSpanel(){
                    shareSMSpanel.style.marginLeft = '10px'
                  }
                  function hideShareSMSpanel(){
                    shareSMSpanel.style.marginLeft = '-600px'
                  }
                // show/ hide share panel

                function shareThisSMS(sms_DATA, sms_id){

                  showShareSMSpanel()
                  
                  searchButton.onclick = ()=>{
                    storeIdToForwardSMS = [] // delete old Ids
                    messengerRoomToForwardSMS = [] // delete old room references

                    $.ajax({
                      url: '/mongoJs/main/searchProfileToShareSMS', // Replace with your server endpoint
                      type: 'POST',
                      data: {
                        my_id: myId,
                        field_val: DOMPurify.sanitize( inputText.value.trim() )
                      },
                      success: function(response) {
                        if(response == 'error' && response != null ){
                          console.warn("Error in searching among messenger friends!" + response)  
                    
                        } else if( response != null ){
                          console.warn("successfully get among messenger friends!")

                          searchdProfileHolder.innerHTML = '' // clean old data

                          showShareSmsSearchResult( response['foundFriendId'], response['messengerRooms'] )                        
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in searching among messenger friendss!" + error)               
                        }
                      }
                    })
                  }



                  async function showShareSmsSearchResult(DATA_1, DATA_2){ 
                    for(let i=0; i < DATA_1.length; i++){
                      perProfileBar( DATA_1[i], false )
                    }

                    for(let i=0; i < DATA_2.length; i++){
                      perProfileBar( DATA_2[i], true )
                    }
                  }


                  // get name and pic  
                    async function getNameAndPic(ID){  
                      let result = null
                      
                      
                      // Send AJAX request to Node.js server              
                      await $.ajax({
                        url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                        type: 'POST',
                        data: {
                          peer_id: ID,
                        },
                        success: function(response) {
                          if(response != 'error' && response != null ){
                            console.warn("successfully get profile pic and name!")
        
                            result = response
        
                          } else{
                            console.warn("Error in getting profile pic and name!" + response)              
                          }
                        },
                        error: function(error) {
                          if(error == 'error' && error != null ){
                            console.warn("Err in getting profile pic and name!" + error)               
                          }
                        }
                      })
                      

                      return result
                    }
                  // get name and pic

                  async function perProfileBar(DATA, Group){ 
                    let getProfileData = null

                    if( Group == false){
                      getProfileData = await getNameAndPic( DATA )
                    }

                    const profileBar = document.createElement('div')
                    profileBar.setAttribute('class', 'searcdProfileBarToShareSMS')
                    searchdProfileHolder.appendChild( profileBar )

                    // set dyna width
                      profileBar.style.width = (searchdProfileHolder.offsetWidth - 20) + 'px'
                      profileBar.style.marginLeft = '10px'
                    // set dyna width

                    // pic
                      const profileImgHolder = document.createElement('div')
                      profileImgHolder.setAttribute('class', 'searcdProfileImgHolder_ToShareSMS')
                      profileBar.appendChild( profileImgHolder )

                      // image
                        const profileImg = document.createElement('img')
                        profileImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png' 
                        if ( Group == false && getProfileData.profileInfo.profilePics.active != null) {           
                          profileImg.src = getProfileData.profileInfo.profilePics.active  

                          profileImgHolder.style.width = '42px'
                          profileImgHolder.style.height = '42px'
                          profileImgHolder.style.marginTop = '4px'
                          profileImgHolder.style.marginLeft = '4px'
                        }
                        profileImgHolder.appendChild( profileImg )   
                      // image
                    // pic

                    // name
                      const profileName = document.createElement('div')
                      profileName.setAttribute('class', 'searcdProfileName_ToShareSMS')
                      profileBar.appendChild( profileName )

                      const profileNameSubDiv = document.createElement('div')
                      if( Group == false ){
                        profileNameSubDiv.innerText = DOMPurify.sanitize( getProfileData.profileInfo.name.fullName )
                      } else {
                        profileNameSubDiv.innerText = DOMPurify.sanitize( DATA.groupProfile.name )
                      }
                      profileName.appendChild( profileNameSubDiv )

                      // set text align
                        profileNameSubDiv.style.paddingTop = ((profileName.offsetHeight - profileNameSubDiv.offsetHeight)/ 2) + 'px'
                      // set text align
                    // name

                    // checkbox
                      const inputCheckbox = document.createElement('input')
                      inputCheckbox.setAttribute('type', 'checkbox')
                      profileBar.appendChild( inputCheckbox )

                      // set dyna checkbox vertical align
                        inputCheckbox.style.marginTop = ((profileBar.offsetHeight - inputCheckbox.offsetHeight )/ 2) + 'px'
                      // set dyna checkbox vertical align

                      // onclick event
                        inputCheckbox.onclick = ()=>{
                          if(getProfileData != null) {
                            if( storeIdToForwardSMS.includes( getProfileData.key.id ) == false ){
                              storeIdToForwardSMS.push( getProfileData.key.id )

                              showShareSMSsendButton()
                            } else {
                              storeIdToForwardSMS.splice(storeIdToForwardSMS.indexOf( getProfileData.key.id ), 1)

                              showShareSMSsendButton()
                            }
                          }

                          if(Group == true){
                            if( messengerRoomToForwardSMS.includes( DATA._id ) == false ){
                              messengerRoomToForwardSMS.push( DATA._id )

                              showShareSMSsendButton()
                            } else {
                              messengerRoomToForwardSMS.splice(messengerRoomToForwardSMS.indexOf( DATA._id ), 1)
                              showShareSMSsendButton()
                            }
                          }
                        }
                      // onclick event
                    // checkbox
                  
                  }


                  // share sms send button click
                    let hasMEDIA = false
                    for(let i=0; i < sms_DATA.sms[sms_id].messengerData.length; i++){
                      if(sms_DATA.sms[sms_id].messengerData[i].media.image != null){
                        hasMEDIA = true
                        break
                      }
                    }

                    shareSMS.onclick = ()=>{
                      hideShareSMSpanle.style.height = '100%'
                      shareSMS.style.bottom = '-50px'


                      $.ajax({
                        url: '/mongoJs/main/shareSMS', // Replace with your server endpoint
                        type: 'POST',
                        data: {
                          my_id: myId,
                          sms_data: JSON.stringify( sms_DATA ),
                          sms_id: sms_id,
                          share_members_list : JSON.stringify( storeIdToForwardSMS ),
                          rooms_list: JSON.stringify( messengerRoomToForwardSMS ),
                        },
                        success: function(response) {
                          if(response == 'error' && response != null ){
                            console.warn("Error in sharing sms!" + response)  
                      
                          } else if( response != null ){
                            console.warn("successfully shared sms!")
  
                            // showShareSmsSearchResult( response )  
                            if(hasMEDIA == true){ 
                              uploadImageToFirebaseAndMongoDB( response )
                            } else { 
                              hideShareSMSpanle.style.height = 0
                            }
                          }
                        },
                        error: function(error) {
                          if(error == 'error' && error != null ){
                            console.warn("Err in sharing sms!" + error)               
                          }
                        }
                      })
                    }
                  // share sms send button click


                  let firestoreSharedImageUrl = []
                  let sharedImageIndexArray = []

                  function uploadImageToFirebaseAndMongoDB( messengerRoomInfo ){                    
                    for(let i=0; i< messengerRoomInfo.sms[messengerRoomInfo.sms.length-1].messengerData.length; i++){
                      if(messengerRoomInfo.sms[messengerRoomInfo.sms.length-1].messengerData[i].media.image != null){
                        
                        // Reference to the source file.
                          const sourcePath = messengerRoomInfo.sms[messengerRoomInfo.sms.length-1].messengerData[i].media.image
                          const storageReference = ref(storage, sourcePath  );



                          // Reference to the destination file.
                          const destinationPath = `message/id${messengerRoomInfo._id}/sms${messengerRoomInfo.sms.length-1}/pic${i}.jpg`; 
                          const destinationRef = ref(storage, destinationPath  )


                          getDownloadURL( storageReference )
                          .then((url) => {                            
                              // This can be downloaded directly:
                              const xhr = new XMLHttpRequest();
                              xhr.responseType = 'blob';
                              xhr.onload = (event) => {
                                const blob = xhr.response;
                                
                                firestoreSharedImageUrl = [] // clean old data
                                
                                const metadata = {
                                  contentType: 'image/jpeg'
                                }
                                const uploadTask = uploadBytesResumable(destinationRef, blob, metadata);
              
                                // Listen for state changes, errors, and completion of the upload.
                                uploadTask.on('state_changed',
                                  (snapshot) => {
                                      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                      const progressMini = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                      console.warn('Upload in shared sms is ' + progressMini + '% done');
                                      switch (snapshot.state) {
                                        case 'paused':
                                          console.warn('Upload is paused in shared sms');
                                        break;
                                        case 'running':
                                          console.warn('Upload is running in shared sms');
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
                                      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURLMini) => {
                                        console.warn('messenger image available: ', downloadURLMini);
                                          
                                        firestoreSharedImageUrl.push( downloadURLMini )
                                        sharedImageIndexArray.push( i )
                                        
                                        setTimeout(()=>{
                                          if(i+1 == messengerRoomInfo.sms[messengerRoomInfo.sms.length-1].messengerData.length){

                                            uploadImageUrlIntoMongodbMessageRoom( messengerRoomInfo._id, messengerRoomInfo.sms.length - 1)
                                          }
                                        }, 1000)
                                        
                                      });
                                  }
                                )


                              };
                              xhr.open('GET', url);
                              xhr.send();                            
                          })
                          .catch((error) => {
                            // Handle any errors
                            console.error('Error getDownloadURL:', error);
                          });                                                    
                      }
                    }                    
                  }



                  function uploadImageUrlIntoMongodbMessageRoom(roomId, smsIndex){ 
                    $.ajax({
                      url: '/mongoJs/main/sendFirestoreImageUrlMessenger', // Replace with your server endpoint
                      type: 'PUT',
                      data: {
                        messageRoom_Id: roomId,
                        sms_id: smsIndex,
                        messageDataIndex : JSON.stringify( sharedImageIndexArray ),
                        imageUrl_Array: JSON.stringify( firestoreSharedImageUrl )
                      },
                      success: function(response) {
                        if(response != 'error' && response != null ){
                          console.warn("successfully send shared image url in mongodb!")

                          // clean old data
                            storeIdToForwardSMS = []
                          // clean old data


                          // uncheck all check boxs
                            const nodeList = document.querySelectorAll(".searcdProfileBarToShareSMS");
                            for(let i=0; i < nodeList.length; i++ ){

                              nodeList[i].querySelector('input[type="checkbox"]').checked = false
                            }
                          // uncheck all check boxs

                        
                          // hide panel shutter
                            hideShareSMSpanle.style.height = 0
                          // hide panel shutter
                        
                        } else{
                          console.warn("Error in sending shared image url in mongodb!" + response)              
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in sending shared image url in mongodb!" + error)               
                        }
                      }
                    })
                  }
                  
                }
              // share sms


              // reply sms
                let smsForReply = null
                
                function replySMS(sms_DATA){
                  smsForReply = sms_DATA   
                  
                  const replyBar = document.querySelector('.replyToBar')

                  
                  // pic                          
                    // Send AJAX request to Node.js server              
                    $.ajax({
                      url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                      type: 'POST',
                      data: {
                        peer_id: sms_DATA.send.id,
                      },
                      success: function(response) {
                        if(response != 'error' && response != null ){
                          console.warn("successfully get profile pic and name!")
      
                          showProfile(response)
      
                        } else{
                          console.warn("Error in getting profile pic and name!" + response)              
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in getting profile pic and name!" + error)               
                        }
                      }
                    })
      

                    function showProfile(singleDATA){                                 
                      // name
                      replyBar.querySelector('.replyToName').innerText = singleDATA.profileInfo.name.fullName
        
                      // pic   
                      if ( singleDATA.profileInfo.profilePics.active != null) {     
                        replyBar.querySelector('img').src = singleDATA.profileInfo.profilePics.active  
                      }      
                      // pic
                    }
                  // pic

                  // show (css)
                    replyBar.style.display = 'inline-block'
                  // show (css)

                  // hide (css)
                    replyBar.querySelector('.replyToCancel').onclick = ()=>{
                      smsForReply = null

                      replyBar.style.display = 'none'
                    }
                  // hide (css)
                }                
              // reply sms



              const createRightSideMessageViewMiddlePart = document.createElement('div')
              createRightSideMessageViewMiddlePart.setAttribute('class', 'messengerRightSideMessageViewMiddlePart')
              messageRightSide.appendChild( createRightSideMessageViewMiddlePart )

              const createRightSideMessageViewMiddlePart_subSection = document.createElement('div')
              createRightSideMessageViewMiddlePart_subSection.setAttribute('class', 'messengerRightSideMessageViewMiddlePart_subSection')
              createRightSideMessageViewMiddlePart.appendChild( createRightSideMessageViewMiddlePart_subSection )

                            
              // message update
                // check unseen sms                   
                  setInterval(()=>{
                    // retrive sms with this peer message room
                      $.ajax({
                        url: '/mongoJs/main/getMessages', // Replace with your server endpoint
                        type: 'POST',
                        data: {
                          my_id: myId,
                          room_id: messengerRoomContents._id
                        },
                        success: function(response) {
                          if(response == 'error' && response != null ){
                            console.warn("Error in getting sms!" + response) 

                          } else if( response == 'no sms' && response != null ){

                            console.warn("No sms yet!")

                          } else {    
                            console.warn("successfully get sms!")

                            findOutUnseenSMS(response)                     
                          }
                        },
                        error: function(error) {
                          if(error == 'error' && error != null ){
                            console.warn("Err in getting sms!" + error)               
                          }
                        }
                      })
                    // retrive sms with this peer message room
                  }, 2000)
                  
                    
                  const unseenSMSindex = []
                  
                
                  // object friendly email
                    function objectFriendlyEmail(email_Id){
                      const escapeAtTheRate = email_Id.replaceAll('@',"_")
                      const escapedDot = escapeAtTheRate.replaceAll('.',"_")
                      return escapedDot
                    } 
                  // object friendly email

                  
                  function findOutUnseenSMS(DATA){
                    for (let i = 0; i < DATA.sms.length; i++) {
                        if( DATA.sms[i].send.id != myId 
                          && DATA.sms[i].seenBy[ objectFriendlyEmail(myId) ] == false
                          && DATA.sms[i].sendStatus == 'uploaded'
                        ){ 
                          if( unseenSMSindex.includes( DATA.sms[i]._id ) == false ) {
                            unseenSMSindex.push( DATA.sms[i]._id )

                            showEveryMessages(DATA) // loop below only unseen
                          }
                        } else if( DATA.sms[i].send.id != myId 
                          && DATA.sms[i].seenBy[ objectFriendlyEmail(myId) ] == true
                          && DATA.sms[i].sendStatus == 'uploaded'
                        ){
                          if( unseenSMSindex.includes( DATA.sms[i]._id ) == true ) {
                            unseenSMSindex.splice( unseenSMSindex.indexOf( DATA.sms[i]._id ), 1)                            
                          }
                        }
                    }
                  }                  
                  
                // check unseen sms
              // message update

                 
              // loop
                showEveryMessages(messengerRoomContents) // default execution
                
                async function showEveryMessages(DATA){
                  createRightSideMessageViewMiddlePart_subSection.innerHTML = '' // clear middle part sub section

                  for (let i = 0; i < DATA.sms.length; i++) {
                    
                    // my message (sender)
                    if( DATA.sms[i].send.id == myId ){
                      // my message holder
                      const createRightSideMessageView_Holder_myMessage = document.createElement('div')
                      createRightSideMessageView_Holder_myMessage.setAttribute('class', 'createRightSideMessageView_Holder_myMessage')
                      createRightSideMessageViewMiddlePart_subSection.appendChild( createRightSideMessageView_Holder_myMessage )
                      // my message holder

                      // when its a reply
                        if( DATA.sms[i].replyOf != null ){
                          let getParestSMS = null

                          for(let m=0; m < DATA.sms.length; m++ ){

                            if( DATA.sms[m]._id == DATA.sms[i].replyOf ){
                              getParestSMS = DATA.sms[m]
                              break
                            }
                          }


                          const replyFor = document.createElement('div')
                          replyFor.setAttribute('class', 'replyForPanel')
                          createRightSideMessageView_Holder_myMessage.appendChild( replyFor )

                          replyFor.style.display = 'inline-block'


                          if( getParestSMS != null){
                            for (let x = 0; x < 4; x++) { 
                          
                              let createMessagePortion = null
                              
                              if(getParestSMS.messengerData[x].text != null ){
                                createMessagePortion = document.createElement('span')
                                createMessagePortion.setAttribute('class', 'messageMainPartPices')
                                createMessagePortion.innerText = getParestSMS.messengerData[x].text
    
                                apeendAndStyle()
                              }
                              else if( getParestSMS.messengerData[x].media.image != null ) {
                                createMessagePortion = document.createElement('img')
                                createMessagePortion.setAttribute('class', 'messageMainPartPices messageMainPartPicesImg')
                                createMessagePortion.src = getParestSMS.messengerData[x].media.image
    
                                apeendAndStyle()
                              } 
                              
                              function apeendAndStyle(){
                                createMessagePortion.setAttribute('id', 'messageMainPartPices_smsId_'+ i +'_messageData_'+ x)
                              
    
                                  const createNBSP = document.createElement('span')
                                  createNBSP.innerHTML = '&nbsp;'
                                  createMessagePortion.appendChild(createNBSP)
                                
                                replyFor.appendChild( createMessagePortion )
    
                                
                                // bold
                                  if( getParestSMS.messengerData[x].bold == true){
                                    createMessagePortion.style.fontWeight = 'bold'
                                  }
                                // bold
    
                                // italic
                                  if( getParestSMS.messengerData[x].italic == true){
                                    createMessagePortion.style.fontStyle = 'italic'
                                  }
                                // italic
    
                                // fontFamily
                                  if( getParestSMS.messengerData[x].fontFamily != 'default' ){
                                    createMessagePortion.style.fontFamily = DATA.sms[i].messengerData[x].fontFamily
                                  }
                                // fontFamily
    
                                // align
                                  // left
                                    if( getParestSMS.messengerData[x].align == 'left' ){
                                      createMessagePortion.style.marginLeft = 0
                                      createMessagePortion.style.float = 'left'
    
                                      previousNextPortion( i, x )
                                    }
                                  // left
    
                                  // center
                                    if( getParestSMS.messengerData[x].align == 'center' ){
                                                                  
                                      const containerWidthPixel = createRightSideMessageView_myMessage.offsetWidth - 20 // exclude pad 10+10
    
                                      //const perPercentOfPixel = 100/containerWidthPixel
                                      const containerWidthPixel_half = containerWidthPixel / 2
    
                                      const thisPortionWidthPixel = createMessagePortion.offsetWidth 
    
                                      const thisPortionWidthPixel_half = thisPortionWidthPixel / 2
    
                                      // previous message portion
    
                                        let previousPortionWidthPixel = 0
    
                                        const deductIndex = x - 1
                                        if( getParestSMS.messengerData[ deductIndex ] != undefined && getParestSMS.messengerData[ deductIndex ].align == 'left' ){
                                          if( document.getElementById(`messageMainPartPices_smsId_${i}_messageData_${deductIndex}`) != null ){
                                            previousPortionWidthPixel = document.getElementById(`messageMainPartPices_smsId_${i}_messageData_${deductIndex}`).offsetWidth
                                          }
                                        }
    
                                      // previous message portion
    
                                      //const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion
    
                                      //const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2
    
                                    //   console.warn('container width half ---------- -------- ----------- '+ containerWidthPixel_half )
                                    // console.warn('previous portion width  ---------- -------- ----------- '+ previousPortionWidthPixel )
                                    // console.warn('this portion width half  ---------- -------- ----------- '+ thisPortionWidthPixel_half )
                                    // console.warn('this portion id  ---------- -------- ----------- '+ createMessagePortion.id )
                                    
    
                                      if(previousPortionWidthPixel + thisPortionWidthPixel_half <= containerWidthPixel_half ){
                                        const totalWidth = previousPortionWidthPixel + thisPortionWidthPixel_half
    
                                        const remainingWidth = containerWidthPixel_half - totalWidth
    
    
                                        createMessagePortion.style.display = 'inline-table'
                                        createMessagePortion.style.marginLeft = remainingWidth + 'px'
                                      } else {
                                        // float left
                                        createMessagePortion.style.display = 'inline'
                                        createMessagePortion.style.marginLeft = 0
                                        createMessagePortion.style.float = 'left'
                                        // float left
                                      }
    
                                      //createMessagePortion.style.display = 'table'
                                      //createMessagePortion.style.position = 'absolute'  
                                      //createMessagePortion.style.left = deductedOuterWideHalfPercent + '%'
    
    
                                      previousNextPortion( i, x )
                                    }                          
                                  // center
    
                                  // right
                                    if( getParestSMS.messengerData[x].align == 'right' ){
                                      createMessagePortion.style.marginLeft = 0
                                      createMessagePortion.style.float = 'right'
    
                                      previousNextPortion( i, x )
                                    }
                                  // right
                                // align
                                
    
                                // link
                                  if( getParestSMS.messengerData[x].link == true ){
                                    createMessagePortion.innerHTML = ''
    
                                    const createAnchor = document.createElement('a')
                                    createAnchor.innerText = getParestSMS.messengerData[x].text
                                    createAnchor.setAttribute('href', getParestSMS.messengerData[x].text )
                                    createAnchor.setAttribute('target', '_blank' )
                                    createMessagePortion.appendChild(createAnchor)
    
                                    const createNBSP = document.createElement('span')
                                    createNBSP.innerHTML = '&nbsp;'
                                    createMessagePortion.appendChild(createNBSP)
                
                                  }
                                // link
                              }
                              
                            }
                          } else {
                            const createMessagePortion = document.createElement('span')
                            createMessagePortion.setAttribute('class', 'messageMainPartPices')
                            createMessagePortion.innerText = '[ Deleted ]'
                            createMessagePortion.setAttribute('style', 'color:red; text-align:center; display:block;')

                            replyFor.appendChild( createMessagePortion )
                          }
                        }                        
                      // when its a reply


                      // forwarded status bar
                        if(DATA.sms[i].forwarded == true){
                          const forwardStatusBar = document.createElement('div')
                          forwardStatusBar.setAttribute('class', 'forwardStatusBar')
                          forwardStatusBar.innerText = 'Forwarded'
                          createRightSideMessageView_Holder_myMessage.appendChild( forwardStatusBar )
                        }
                      // forwarded status bar


                      const createRightSideMessageView_myMessage = document.createElement('div')
                      createRightSideMessageView_myMessage.setAttribute('class', 'messengerRightSideMessageView_myMessage')
                      createRightSideMessageView_Holder_myMessage.appendChild( createRightSideMessageView_myMessage )


                      // previous next message portion
                        function previousNextPortion( SMSindex, messageDataINDEX ){  
                          // previous
                            const dummySpaceBefore = document.createElement('div')
                            dummySpaceBefore.setAttribute('class', 'dummySpaceBeforeMessageMainPartPices')
                            dummySpaceBefore.setAttribute('title', messageDataINDEX )               
            

                            // onle reason why I used condition is for check if exist pervisios message portion. If so then what it's align 
                            const deductIndex = messageDataINDEX - 1
                            if( DATA.sms[SMSindex].messengerData[ deductIndex ] != undefined ){
                              if( DATA.sms[SMSindex].messengerData[ deductIndex ].align == 'default'){
                
                                document.getElementById( 'messageMainPartPices_smsId_'+ SMSindex +'_messageData_'+ messageDataINDEX  ).insertAdjacentElement("beforebegin", dummySpaceBefore)
                              }
                            } else  document.getElementById( 'messageMainPartPices_smsId_'+ SMSindex +'_messageData_'+ messageDataINDEX  ).insertAdjacentElement("beforebegin", dummySpaceBefore) 
                          // previous

                          // next
                            const dummySpaceAfter = document.createElement('div')
                            dummySpaceAfter.setAttribute('class', 'dummySpaceAfterMessageMainPartPices') 
                            dummySpaceAfter.setAttribute('title', messageDataINDEX )                   

                            // onle reason why I used condition is for check if exist next message portion. If so then what it's align 
                            const addIndex = messageDataINDEX + 1                                                        
            
                            if( DATA.sms[SMSindex].messengerData[ addIndex ] != undefined ){ 
                              if( DATA.sms[SMSindex].messengerData[ addIndex ].align == 'default'){
              
                                document.getElementById( 'messageMainPartPices_smsId_'+ SMSindex +'_messageData_'+ messageDataINDEX ).insertAdjacentElement("afterend", dummySpaceAfter)
                              }
                            } else  document.getElementById( 'messageMainPartPices_smsId_'+ SMSindex +'_messageData_'+ messageDataINDEX ).insertAdjacentElement("afterend", dummySpaceAfter) 
                          // next

                        }
                      // previous next message portion

                      // retrive messages pices from object  
                      if( DATA.sms[i].deletedBy.includes(myId) == false ){ 
                        for (let x = 0; x < DATA.sms[i].messengerData.length; x++) { 
                          
                          let createMessagePortion = null
                          
                          if(DATA.sms[i].messengerData[x].text != null ){
                            createMessagePortion = document.createElement('span')
                            createMessagePortion.setAttribute('class', 'messageMainPartPices')
                            createMessagePortion.innerText = DATA.sms[i].messengerData[x].text

                            apeendAndStyle()
                          }
                          else if( DATA.sms[i].messengerData[x].media.image != null ) {
                            createMessagePortion = document.createElement('img')
                            createMessagePortion.setAttribute('class', 'messageMainPartPices messageMainPartPicesImg')
                            createMessagePortion.src = DATA.sms[i].messengerData[x].media.image

                            apeendAndStyle()
                          } 
                          
                          function apeendAndStyle(){
                            createMessagePortion.setAttribute('id', 'messageMainPartPices_smsId_'+ i +'_messageData_'+ x)
                          

                              const createNBSP = document.createElement('span')
                              createNBSP.innerHTML = '&nbsp;'
                              createMessagePortion.appendChild(createNBSP)
                            
                            createRightSideMessageView_myMessage.appendChild( createMessagePortion )

                            
                            // bold
                              if( DATA.sms[i].messengerData[x].bold == true){
                                createMessagePortion.style.fontWeight = 'bold'
                              }
                            // bold

                            // italic
                              if( DATA.sms[i].messengerData[x].italic == true){
                                createMessagePortion.style.fontStyle = 'italic'
                              }
                            // italic

                            // fontFamily
                              if( DATA.sms[i].messengerData[x].fontFamily != 'default' ){
                                createMessagePortion.style.fontFamily = DATA.sms[i].messengerData[x].fontFamily
                              }
                            // fontFamily

                            // align
                              // left
                                if( DATA.sms[i].messengerData[x].align == 'left' ){
                                  createMessagePortion.style.marginLeft = 0
                                  createMessagePortion.style.float = 'left'

                                  previousNextPortion( i, x )
                                }
                              // left

                              // center
                                if( DATA.sms[i].messengerData[x].align == 'center' ){
                                                              
                                  const containerWidthPixel = createRightSideMessageView_myMessage.offsetWidth - 20 // exclude pad 10+10

                                  //const perPercentOfPixel = 100/containerWidthPixel
                                  const containerWidthPixel_half = containerWidthPixel / 2

                                  const thisPortionWidthPixel = createMessagePortion.offsetWidth 

                                  const thisPortionWidthPixel_half = thisPortionWidthPixel / 2

                                  // previous message portion

                                    let previousPortionWidthPixel = 0

                                    const deductIndex = x - 1
                                    if( DATA.sms[i].messengerData[ deductIndex ] != undefined && DATA.sms[i].messengerData[ deductIndex ].align == 'left' ){
                                      if( document.getElementById(`messageMainPartPices_smsId_${i}_messageData_${deductIndex}`) != null ){
                                        previousPortionWidthPixel = document.getElementById(`messageMainPartPices_smsId_${i}_messageData_${deductIndex}`).offsetWidth
                                      }
                                    }

                                  // previous message portion

                                  //const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion

                                  //const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2

                                //   console.warn('container width half ---------- -------- ----------- '+ containerWidthPixel_half )
                                // console.warn('previous portion width  ---------- -------- ----------- '+ previousPortionWidthPixel )
                                // console.warn('this portion width half  ---------- -------- ----------- '+ thisPortionWidthPixel_half )
                                // console.warn('this portion id  ---------- -------- ----------- '+ createMessagePortion.id )
                                

                                  if(previousPortionWidthPixel + thisPortionWidthPixel_half <= containerWidthPixel_half ){
                                    const totalWidth = previousPortionWidthPixel + thisPortionWidthPixel_half

                                    const remainingWidth = containerWidthPixel_half - totalWidth


                                    createMessagePortion.style.display = 'inline-table'
                                    createMessagePortion.style.marginLeft = remainingWidth + 'px'
                                  } else {
                                    // float left
                                    createMessagePortion.style.display = 'inline'
                                    createMessagePortion.style.marginLeft = 0
                                    createMessagePortion.style.float = 'left'
                                    // float left
                                  }

                                  //createMessagePortion.style.display = 'table'
                                  //createMessagePortion.style.position = 'absolute'  
                                  //createMessagePortion.style.left = deductedOuterWideHalfPercent + '%'


                                  previousNextPortion( i, x )
                                }                          
                              // center

                              // right
                                if( DATA.sms[i].messengerData[x].align == 'right' ){
                                  createMessagePortion.style.marginLeft = 0
                                  createMessagePortion.style.float = 'right'

                                  previousNextPortion( i, x )
                                }
                              // right
                            // align
                            

                            // link
                              if( DATA.sms[i].messengerData[x].link == true ){
                                createMessagePortion.innerHTML = ''

                                const createAnchor = document.createElement('a')
                                createAnchor.innerText = DATA.sms[i].messengerData[x].text
                                createAnchor.setAttribute('href', DATA.sms[i].messengerData[x].text )
                                createAnchor.setAttribute('target', '_blank' )
                                createMessagePortion.appendChild(createAnchor)

                                const createNBSP = document.createElement('span')
                                createNBSP.innerHTML = '&nbsp;'
                                createMessagePortion.appendChild(createNBSP)
            
                              }
                            // link
                          }
                          
                        }
                      } else { // if true
                        const createMessagePortion = document.createElement('span')
                        createMessagePortion.setAttribute('class', 'messageMainPartPices')
                        createMessagePortion.innerText = '[ Deleted ]'
                        createMessagePortion.setAttribute('style', 'color:red; text-align:center; display:block;')

                        createRightSideMessageView_myMessage.appendChild( createMessagePortion )
                      }                      
                      // retive messages pices from object


                      // sending time
                        const createSendAtHolder = document.createElement('div')
                        createSendAtHolder.setAttribute('class', 'messageSendAt')

                        createRightSideMessageView_Holder_myMessage.appendChild( createSendAtHolder )

                        const sendAtTimestamp = new Date( DATA.sms[i].send.time )
                        let hours = 0
                        let amPm = 'AM'
                        switch ( sendAtTimestamp.getHours() ) {
                          default:
                            hours = sendAtTimestamp.getHours();
                            amPm = 'AM'
                            break;
                          case 12:
                            hours = 12 ;
                            amPm = 'PM'
                            break;
                          case 13:
                            hours = 1 ;
                            amPm = 'PM'
                            break;
                          case 14:
                            hours = 2 ;
                            amPm = 'PM'
                            break;
                          case 15:
                            hours = 3 ;
                            amPm = 'PM'
                            break;
                          case 16:
                            hours = 4 ;
                            amPm = 'PM'
                            break;
                          case 17:
                            hours = 5 ;
                            amPm = 'PM'
                            break;
                          case 18:
                            hours = 6 ;
                            amPm = 'PM'
                            break;                            
                          case 19:
                            hours = 7 ;
                            amPm = 'PM'
                            break;
                          case 20:
                            hours = 8 ;
                            amPm = 'PM'
                            break;
                          case 21:
                            hours = 9 ;
                            amPm = 'PM'
                            break;
                          case 22:
                            hours = 10 ;
                            amPm = 'PM'
                            break;
                          case 23:
                            hours = 11 ;
                            amPm = 'PM'
                            break;
                          case  24:
                            hours = 12 ;
                            amPm = 'PM'
                        }
                        createSendAtHolder.innerText = 'Sent at: ' + hours + ':' + sendAtTimestamp.getMinutes() + ':' + sendAtTimestamp.getSeconds() + ' ' + amPm + ' ' + sendAtTimestamp.toDateString()

                          const containerWidthPixel = createRightSideMessageView_myMessage.offsetWidth

                          const perPercentOfPixel = 100/containerWidthPixel

                          const percentageOfThisPortion = createSendAtHolder.offsetWidth * perPercentOfPixel

                          const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion

                          const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2

                          createSendAtHolder.style.left = deductedOuterWideHalfPercent + '%'
                      // sending time
                      
                      // sender description
                        const senderDescription = document.createElement('div')
                        senderDescription.setAttribute('class', 'senderDescription')
                        createRightSideMessageView_Holder_myMessage.appendChild( senderDescription )

                        // sender profile pic
                          const senderProfilePicContainer = document.createElement('div')
                          senderProfilePicContainer.setAttribute('class', 'senderProfilePicContainer')
                          senderProfilePicContainer.setAttribute('id', 'senderProfilePicContainer_' + DATA.sms[i].send.id )

                          senderDescription.appendChild( senderProfilePicContainer )

                        
                        // sender name
                          const senderNameContainer = document.createElement('div')
                          senderNameContainer.setAttribute('class', 'senderNameContainer')
                          senderNameContainer.setAttribute('id', 'senderNameContainer' + DATA.sms[i].send.id )
                          senderDescription.appendChild( senderNameContainer )



                            const createImgElement = document.createElement('img')
                            createImgElement.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
                            senderProfilePicContainer.appendChild( createImgElement )                          

                            // pic                          
                              // Send AJAX request to Node.js server              
                              $.ajax({
                                url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                                type: 'POST',
                                data: {
                                  peer_id: DATA.sms[i].send.id,
                                },
                                success: function(response) {
                                  if(response != 'error' && response != null ){
                                    console.warn("successfully get profile pic and name!")
                
                                    showProfile(response)
                
                                  } else{
                                    console.warn("Error in getting profile pic and name!" + response)              
                                  }
                                },
                                error: function(error) {
                                  if(error == 'error' && error != null ){
                                    console.warn("Err in getting profile pic and name!" + error)               
                                  }
                                }
                              })
                

                              function showProfile(singleDATA){                                 
                                // name
                                senderNameContainer.innerText = singleDATA.profileInfo.name.fullName
                  
                                // pic   
                                if ( singleDATA.profileInfo.profilePics.active != null) {           
                                  createImgElement.src = singleDATA.profileInfo.profilePics.active  
                                }      
                                // pic
                              }
                            // pic  
                        // sender profile pic

                        // set dyna width                       
                        const checkNameContainerWidth = setInterval(()=>{
                          if( senderNameContainer.offsetWidth > 10){
                            // console.log('senderNameContainer.offsetWidth ----- ----------- ---------- -------- --------- --------- -------- '+ senderNameContainer.offsetWidth)

                            senderDescription.style.width = senderProfilePicContainer.offsetWidth + senderNameContainer.offsetWidth + 10 + 'px'

                            senderDescription.style.marginLeft = createRightSideMessageView_Holder_myMessage.offsetWidth - senderDescription.offsetWidth - 10 + 'px'

                            clearInterval( checkNameContainerWidth )
                          }
                        }, 1000)
                      // sender description
                      
                      // hover controls
                      function showHoverControls(){
                        const hoverControls = document.createElement('div')
                        hoverControls.setAttribute('class', 'hoverControls')
                        createRightSideMessageView_Holder_myMessage.appendChild( hoverControls )

                        hoverControls.innerHTML = `<span class="material-icons-outlined share_sms">share</span>` + 
                        `<span class="material-icons-outlined delete_sms">delete_forever</span>` +
                        `<span class="material-icons-outlined reply_sms">reply</span>`; 
                        hoverControls.querySelector('.share_sms').onclick = ()=>{ shareThisSMS( DATA, i ) }    
                        hoverControls.querySelector('.delete_sms').onclick = ()=>{ sendDeleteRequest2DB(  DATA._id, DATA.sms[i], i, true, myId ) }
                        hoverControls.querySelector('.reply_sms').onclick = ()=>{ replySMS( DATA.sms[i] ) } 
                        

                          // show hover controls (hidden to visible)
                            let pressTimer;

                            function displayHoverControl() {
                              // Start a timer when the mouse button is pressed down
                              pressTimer = setTimeout(function() {
                                // Your long-press event code goes here
                                hoverControls.style.display = 'inline-block'
                              }, 1000); // Adjust the duration as needed (in milliseconds)
                            }

                            createRightSideMessageView_Holder_myMessage.addEventListener("mousedown", displayHoverControl )
                            createRightSideMessageView_Holder_myMessage.addEventListener("touchstart", ()=>{
                              displayHoverControl()

                              createRightSideMessageView_Holder_myMessage.removeEventListener("mouseleave", hideHoverControlBar );

                            })
                            createRightSideMessageView_Holder_myMessage.addEventListener('contextmenu', (e) => {
                              e.preventDefault();
                            })
                            

                            function clearDelay(){
                              // Cancel the timer if the mouse button is released before the threshold
                              clearTimeout(pressTimer);
                            }
                            createRightSideMessageView_Holder_myMessage.addEventListener("mouseup", clearDelay );


                            function hideHoverControlBar(){                              
                              // hide hover controls
                              hoverControls.style.display = 'none'                              
                            }
                            createRightSideMessageView_Holder_myMessage.addEventListener("mouseleave", hideHoverControlBar );
                            createRightSideMessageView_Holder_myMessage.addEventListener("touchmove", hideHoverControlBar );

                            
                            createRightSideMessageView_Holder_myMessage.addEventListener("touchend", ()=>{
                              clearDelay()

                              setTimeout(()=>{
                                createRightSideMessageView_Holder_myMessage.addEventListener("mouseleave", hideHoverControlBar );
                              }, 3000)
                            });
                            
                          // show hover controls (hidden to visible)
                      }

                      if( DATA.sms[i].deletedBy.includes(myId) == false ){
                        showHoverControls()
                      }
                      // hover controls

                    }// my message (sender)
                    // peer message (receiver)
                    else {
                      // receiver message holder
                      const createRightSideMessageView_Holder_receiver = document.createElement('div')
                      createRightSideMessageView_Holder_receiver.setAttribute('class', 'createRightSideMessageView_Holder_receiver')
                      createRightSideMessageViewMiddlePart_subSection.appendChild( createRightSideMessageView_Holder_receiver )
                      // receiver message holder 


                      // when its a reply
                        if( DATA.sms[i].replyOf != null ){
                          let getParestSMS = null

                          for(let m=0; m < DATA.sms.length; m++ ){

                            if( DATA.sms[m]._id == DATA.sms[i].replyOf ){
                              getParestSMS = DATA.sms[m]
                              break
                            }
                          }


                          const replyFor = document.createElement('div')
                          replyFor.setAttribute('class', 'replyForPanel')
                          createRightSideMessageView_Holder_receiver.appendChild( replyFor )

                          replyFor.style.display = 'inline-block'


                          if( getParestSMS != null){
                            for (let x = 0; x < 4; x++) { 
                          
                              let createMessagePortion = null
                              
                              if(getParestSMS.messengerData[x].text != null ){
                                createMessagePortion = document.createElement('span')
                                createMessagePortion.setAttribute('class', 'messageMainPartPices')
                                createMessagePortion.innerText = getParestSMS.messengerData[x].text
    
                                apeendAndStyle()
                              }
                              else if( getParestSMS.messengerData[x].media.image != null ) {
                                createMessagePortion = document.createElement('img')
                                createMessagePortion.setAttribute('class', 'messageMainPartPices messageMainPartPicesImg')
                                createMessagePortion.src = getParestSMS.messengerData[x].media.image
    
                                apeendAndStyle()
                              } 
                              
                              function apeendAndStyle(){
                                createMessagePortion.setAttribute('id', 'messageMainPartPices_smsId_'+ i +'_messageData_'+ x)
                              
    
                                  const createNBSP = document.createElement('span')
                                  createNBSP.innerHTML = '&nbsp;'
                                  createMessagePortion.appendChild(createNBSP)
                                
                                replyFor.appendChild( createMessagePortion )
    
                                
                                // bold
                                  if( getParestSMS.messengerData[x].bold == true){
                                    createMessagePortion.style.fontWeight = 'bold'
                                  }
                                // bold
    
                                // italic
                                  if( getParestSMS.messengerData[x].italic == true){
                                    createMessagePortion.style.fontStyle = 'italic'
                                  }
                                // italic
    
                                // fontFamily
                                  if( getParestSMS.messengerData[x].fontFamily != 'default' ){
                                    createMessagePortion.style.fontFamily = DATA.sms[i].messengerData[x].fontFamily
                                  }
                                // fontFamily
    
                                // align
                                  // left
                                    if( getParestSMS.messengerData[x].align == 'left' ){
                                      createMessagePortion.style.marginLeft = 0
                                      createMessagePortion.style.float = 'left'
    
                                      previousNextPortion( i, x )
                                    }
                                  // left
    
                                  // center
                                    if( getParestSMS.messengerData[x].align == 'center' ){
                                                                  
                                      const containerWidthPixel = createRightSideMessageView_myMessage.offsetWidth - 20 // exclude pad 10+10
    
                                      //const perPercentOfPixel = 100/containerWidthPixel
                                      const containerWidthPixel_half = containerWidthPixel / 2
    
                                      const thisPortionWidthPixel = createMessagePortion.offsetWidth 
    
                                      const thisPortionWidthPixel_half = thisPortionWidthPixel / 2
    
                                      // previous message portion
    
                                        let previousPortionWidthPixel = 0
    
                                        const deductIndex = x - 1
                                        if( getParestSMS.messengerData[ deductIndex ] != undefined && getParestSMS.messengerData[ deductIndex ].align == 'left' ){
                                          if( document.getElementById(`messageMainPartPices_smsId_${i}_messageData_${deductIndex}`) != null ){
                                            previousPortionWidthPixel = document.getElementById(`messageMainPartPices_smsId_${i}_messageData_${deductIndex}`).offsetWidth
                                          }
                                        }
    
                                      // previous message portion
    
                                      //const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion
    
                                      //const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2
    
                                    //   console.warn('container width half ---------- -------- ----------- '+ containerWidthPixel_half )
                                    // console.warn('previous portion width  ---------- -------- ----------- '+ previousPortionWidthPixel )
                                    // console.warn('this portion width half  ---------- -------- ----------- '+ thisPortionWidthPixel_half )
                                    // console.warn('this portion id  ---------- -------- ----------- '+ createMessagePortion.id )
                                    
    
                                      if(previousPortionWidthPixel + thisPortionWidthPixel_half <= containerWidthPixel_half ){
                                        const totalWidth = previousPortionWidthPixel + thisPortionWidthPixel_half
    
                                        const remainingWidth = containerWidthPixel_half - totalWidth
    
    
                                        createMessagePortion.style.display = 'inline-table'
                                        createMessagePortion.style.marginLeft = remainingWidth + 'px'
                                      } else {
                                        // float left
                                        createMessagePortion.style.display = 'inline'
                                        createMessagePortion.style.marginLeft = 0
                                        createMessagePortion.style.float = 'left'
                                        // float left
                                      }
    
                                      //createMessagePortion.style.display = 'table'
                                      //createMessagePortion.style.position = 'absolute'  
                                      //createMessagePortion.style.left = deductedOuterWideHalfPercent + '%'
    
    
                                      previousNextPortion( i, x )
                                    }                          
                                  // center
    
                                  // right
                                    if( getParestSMS.messengerData[x].align == 'right' ){
                                      createMessagePortion.style.marginLeft = 0
                                      createMessagePortion.style.float = 'right'
    
                                      previousNextPortion( i, x )
                                    }
                                  // right
                                // align
                                
    
                                // link
                                  if( getParestSMS.messengerData[x].link == true ){
                                    createMessagePortion.innerHTML = ''
    
                                    const createAnchor = document.createElement('a')
                                    createAnchor.innerText = getParestSMS.messengerData[x].text
                                    createAnchor.setAttribute('href', getParestSMS.messengerData[x].text )
                                    createAnchor.setAttribute('target', '_blank' )
                                    createMessagePortion.appendChild(createAnchor)
    
                                    const createNBSP = document.createElement('span')
                                    createNBSP.innerHTML = '&nbsp;'
                                    createMessagePortion.appendChild(createNBSP)
                
                                  }
                                // link
                              }
                              
                            }
                          } else {
                            const createMessagePortion = document.createElement('span')
                            createMessagePortion.setAttribute('class', 'messageMainPartPices')
                            createMessagePortion.innerText = '[ Deleted ]'
                            createMessagePortion.setAttribute('style', 'color:red; text-align:center; display:block;')

                            replyFor.appendChild( createMessagePortion )
                          }
                        }                        
                      // when its a reply


                      // forwarded status bar
                        if(DATA.sms[i].forwarded == true){
                          const forwardStatusBar = document.createElement('div')
                          forwardStatusBar.setAttribute('class', 'forwardStatusBar forwardStatusBar_leftSide')
                          forwardStatusBar.innerText = 'Forwarded'
                          createRightSideMessageView_Holder_receiver.appendChild( forwardStatusBar )

                          // set margin
                            const holderWidth = createRightSideMessageView_Holder_receiver.offsetWidth
                            forwardStatusBar.style.marginLeft = ((holderWidth - forwardStatusBar.offsetWidth) - 30) + 'px'
                          // set margin
                        }
                      // forwarded status bar



                      const createLeftSideMessageView = document.createElement('div')
                      createLeftSideMessageView.setAttribute('class', 'messengerLefttSideMessageView')
                      createRightSideMessageView_Holder_receiver.appendChild( createLeftSideMessageView )

                      // previous next message portion
                        function previousNextPortion( SMSindex, messageDataINDEX ){                          
                          // previous
                            const dummySpaceBefore = document.createElement('div')
                            dummySpaceBefore.setAttribute('class', 'dummySpaceBeforeMessageMainPartPices')
                            dummySpaceBefore.setAttribute('title', messageDataINDEX )               
            

                            // onle reason why I used condition is for check if exist pervisios message portion. If so then what it's align 
                            const deductIndex = messageDataINDEX - 1
                            if( DATA.sms[SMSindex].messengerData[ deductIndex ] != undefined ){
                              if(DATA.sms[SMSindex].messengerData[ deductIndex ].align == 'default'){
                
                                document.getElementById( 'messageMainPartPices_smsId_'+ SMSindex +'_messageData_'+ messageDataINDEX ).insertAdjacentElement("beforebegin", dummySpaceBefore)
                              }
                            } else  document.getElementById( 'messageMainPartPices_smsId_'+ SMSindex +'_messageData_'+ messageDataINDEX ).insertAdjacentElement("beforebegin", dummySpaceBefore) 
                          // previous

                          // next
                            const dummySpaceAfter = document.createElement('div')
                            dummySpaceAfter.setAttribute('class', 'dummySpaceAfterMessageMainPartPices') 
                            dummySpaceAfter.setAttribute('title', messageDataINDEX )                   

                            // onle reason why I used condition is for check if exist next message portion. If so then what it's align 
                            const addIndex = messageDataINDEX + 1                                                        
            
                            if( DATA.sms[SMSindex].messengerData[ addIndex ] != undefined ){ 
                              if(DATA.sms[SMSindex].messengerData[ addIndex ].align == 'default'){
              
                                document.getElementById( 'messageMainPartPices_smsId_'+ SMSindex +'_messageData_'+ messageDataINDEX ).insertAdjacentElement("afterend", dummySpaceAfter)
                              }
                            } else  document.getElementById( 'messageMainPartPices_smsId_'+ SMSindex +'_messageData_'+ messageDataINDEX ).insertAdjacentElement("afterend", dummySpaceAfter) 
                          // next

                        }
                      // previous next message portion

                      // retive messages pices from object
                      if( DATA.sms[i].deletedBy.includes(myId) == false ){
                        for (let x = 0; x < DATA.sms[i].messengerData.length; x++) {                        
                          
                          let createMessagePortion = null

                          if(DATA.sms[i].messengerData[x].text != null){
                            createMessagePortion = document.createElement('span')
                            createMessagePortion.setAttribute('class', 'messageMainPartPices')
                            createMessagePortion.innerText = DATA.sms[i].messengerData[x].text

                            apeendAndStyle()
                          } else if( DATA.sms[i].messengerData[x].media.image != null ) {
                            createMessagePortion = document.createElement('img')
                            createMessagePortion.setAttribute('class', 'messageMainPartPices messageMainPartPicesImg')
                            createMessagePortion.src = DATA.sms[i].messengerData[x].media.image

                            apeendAndStyle()
                          }


                          function apeendAndStyle(){
                            createMessagePortion.setAttribute('id', 'messageMainPartPices_smsId_'+ i +'_messageData_'+ x)

                              const createNBSP = document.createElement('span')
                              createNBSP.innerHTML = '&nbsp;'
                              createMessagePortion.appendChild(createNBSP)
                          
                            createLeftSideMessageView.appendChild( createMessagePortion )

                              
                              // bold
                                if( DATA.sms[i].messengerData[x].bold == true){
                                  createMessagePortion.style.fontWeight = 'bold'
                                }
                              // bold

                              // italic
                                if( DATA.sms[i].messengerData[x].italic == true){
                                  createMessagePortion.style.fontStyle = 'italic'
                                }
                              // italic

                              // fontFamily
                                if( DATA.sms[i].messengerData[x].fontFamily != 'default' ){
                                  createMessagePortion.style.fontFamily = DATA.sms[i].messengerData[x].fontFamily
                                }
                              // fontFamily

                              // align
                                // left
                                if( DATA.sms[i].messengerData[x].align == 'left' ){
                                  createMessagePortion.style.marginLeft = 0
                                  createMessagePortion.style.float = 'left'

                                  previousNextPortion( i, x )
                                }
                              // left

                              // center
                                if( DATA.sms[i].messengerData[x].align == 'center' ){
                                                              
                                  const containerWidthPixel = createLeftSideMessageView.offsetWidth - 20 // exclude pad 10+10

                                  //const perPercentOfPixel = 100/containerWidthPixel
                                  const containerWidthPixel_half = containerWidthPixel / 2

                                  const thisPortionWidthPixel = createMessagePortion.offsetWidth 

                                  const thisPortionWidthPixel_half = thisPortionWidthPixel / 2

                                  // previous message portion

                                    let previousPortionWidthPixel = 0

                                    const deductIndex = x - 1
                                    if( DATA.sms[i].messengerData[ deductIndex ] != undefined && DATA.sms[i].messengerData[ deductIndex ].align == 'left' ){
                                      if( document.getElementById(`messageMainPartPices_smsId_${i}_messageData_${deductIndex}`) != null ){
                                        previousPortionWidthPixel = document.getElementById(`messageMainPartPices_smsId_${i}_messageData_${deductIndex}`).offsetWidth
                                      }
                                    }

                                  // previous message portion

                                  //const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion

                                  //const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2

                                  if(previousPortionWidthPixel + thisPortionWidthPixel_half <= containerWidthPixel_half ){
                                    const totalWidth = previousPortionWidthPixel + thisPortionWidthPixel_half

                                    const remainingWidth = containerWidthPixel_half - totalWidth


                                    createMessagePortion.style.display = 'inline-table'
                                    createMessagePortion.style.marginLeft = remainingWidth + 'px'
                                  } else {
                                    // float left
                                    createMessagePortion.style.display = 'inline'
                                    createMessagePortion.style.marginLeft = 0
                                    createMessagePortion.style.float = 'left'
                                    // float left
                                  }

                                  //createMessagePortion.style.display = 'table'
                                  //createMessagePortion.style.position = 'absolute'  
                                  //createMessagePortion.style.left = deductedOuterWideHalfPercent + '%'


                                  previousNextPortion( i, x )
                                }                          
                              // center

                              // right
                                if( DATA.sms[i].messengerData[x].align == 'right' ){
                                  createMessagePortion.style.marginLeft = 0
                                  createMessagePortion.style.float = 'right'

                                  previousNextPortion( i, x )
                                }
                              // right
                            // align

                            // link
                              if( DATA.sms[i].messengerData[x].link == true ){
                                createMessagePortion.innerHTML = ''

                                const createAnchor = document.createElement('a')
                                createAnchor.innerText = DATA.sms[i].messengerData[x].text
                                createAnchor.setAttribute('href', DATA.sms[i].messengerData[x].text )
                                createAnchor.setAttribute('target', '_blank' )
                                createMessagePortion.appendChild(createAnchor)

                                const createNBSP = document.createElement('span')
                                createNBSP.innerHTML = '&nbsp;'
                                createMessagePortion.appendChild(createNBSP)
            
                              }
                            // link
                          }
                        }
                      } else { // if true
                        const createMessagePortion = document.createElement('span')
                        createMessagePortion.setAttribute('class', 'messageMainPartPices')
                        createMessagePortion.innerText = '[ Deleted ]'
                        createMessagePortion.setAttribute('style', 'color:red; text-align:center; display:block;')

                        createLeftSideMessageView.appendChild( createMessagePortion )
                      }                       
                      // retive messages pices from object


                      // sending time
                        const createSendAtHolder = document.createElement('div')
                        createSendAtHolder.setAttribute('class', 'messageSendAt messageSendAtLeft')

                        createRightSideMessageView_Holder_receiver.appendChild( createSendAtHolder )

                        const sendAtTimestamp = new Date( DATA.sms[i].send.time )
                        let hours = 0
                        let amPm = 'AM'
                        switch ( sendAtTimestamp.getHours() ) {
                          default:
                            hours = sendAtTimestamp.getHours() ;
                            amPm = 'AM'
                            break;
                          case 12:
                            hours = 12 ;
                            amPm = 'PM'
                            break;
                          case 13:
                            hours = 1 ;
                            amPm = 'PM'
                            break;
                          case 14:
                            hours = 2 ;
                            amPm = 'PM'
                            break;
                          case 15:
                            hours = 3 ;
                            amPm = 'PM'
                            break;
                          case 16:
                            hours = 4 ;
                            amPm = 'PM'
                            break;
                          case 17:
                            hours = 5 ;
                            amPm = 'PM'
                            break;
                          case 18:
                            hours = 6 ;
                            amPm = 'PM'
                            break;                            
                          case 19:
                            hours = 7 ;
                            amPm = 'PM'
                            break;
                          case 20:
                            hours = 8 ;
                            amPm = 'PM'
                            break;
                          case 21:
                            hours = 9 ;
                            amPm = 'PM'
                            break;
                          case 22:
                            hours = 10 ;
                            amPm = 'PM'
                            break;
                          case 23:
                            hours = 11 ;
                            amPm = 'PM'
                            break;
                          case  24:
                            hours = 12 ;
                            amPm = 'PM'
                        }

                        createSendAtHolder.innerText = 'Sent at: ' + hours + ':' + sendAtTimestamp.getMinutes() + ':' + sendAtTimestamp.getSeconds() + ' ' + amPm + ' ' + sendAtTimestamp.toDateString()

                          const containerWidthPixel = createLeftSideMessageView.offsetWidth

                          const perPercentOfPixel = 100/containerWidthPixel

                          const percentageOfThisPortion = createSendAtHolder.offsetWidth * perPercentOfPixel

                          const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion

                          const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2

                          createSendAtHolder.style.left = deductedOuterWideHalfPercent + '%'
                      // sending time


                      // sender description
                        const senderDescription = document.createElement('div')
                        senderDescription.setAttribute('class', 'senderDescription senderDescriptionLeft')
                        createRightSideMessageView_Holder_receiver.appendChild( senderDescription )


                        // sender profile pic
                          const senderProfilePicContainer = document.createElement('div')
                          senderProfilePicContainer.setAttribute('class', 'senderProfilePicContainer senderProfilePicContainer_leftSide')
                          senderProfilePicContainer.setAttribute('id', 'senderProfilePicContainer_' + DATA.sms[i].send.id )

                          senderDescription.appendChild( senderProfilePicContainer )


                        // sender name
                          const senderNameContainer = document.createElement('div')
                          senderNameContainer.setAttribute('class', 'senderNameContainer senderNameContainer_leftSide')
                          senderNameContainer.setAttribute('id', 'senderNameContainer_leftSide' + DATA.sms[i].send.id )
                          senderDescription.appendChild( senderNameContainer )


                            const createImgElement = document.createElement('img')
                            createImgElement.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
                            senderProfilePicContainer.appendChild( createImgElement )                          
                            
                            // pic
                              // Send AJAX request to Node.js server              
                              $.ajax({
                                url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                                type: 'POST',
                                data: {
                                  peer_id: DATA.sms[i].send.id,
                                },
                                success: function(response) {
                                  if(response != 'error' && response != null ){
                                    console.warn("successfully get profile pic and name!")
                
                                    showProfile(response)
                
                                  } else{
                                    console.warn("Error in getting profile pic and name!" + response)              
                                  }
                                },
                                error: function(error) {
                                  if(error == 'error' && error != null ){
                                    console.warn("Err in getting profile pic and name!" + error)               
                                  }
                                }
                              })
                


                              function showProfile(singleDATA){                
                                // name
                                senderNameContainer.innerText = singleDATA.profileInfo.name.fullName
                  
                                // pic   
                                if ( singleDATA.profileInfo.profilePics.active != null) {           
                                  createImgElement.src = singleDATA.profileInfo.profilePics.active  
                                }              
                                // pic
                              }
                            // pic  
                        // sender profile pic

                        // set dyna width                       
                        const checkNameContainerWidth = setInterval(()=>{
                          if( senderNameContainer.offsetWidth > 10){
                            // console.log('senderNameContainer.offsetWidth ----- ----------- ---------- -------- --------- --------- -------- '+ senderNameContainer.offsetWidth)

                            senderDescription.style.width = senderProfilePicContainer.offsetWidth + senderNameContainer.offsetWidth + 10 + 'px'

                            //senderDescription.style.marginLeft = createRightSideMessageView_Holder_receiver.offsetWidth - senderDescription.offsetWidth - 10 + 'px'

                            clearInterval( checkNameContainerWidth )
                          }
                        }, 1000)
                      // sender description 
                      
                      
                      // hover controls
                        function showHoverControls(){
                          const hoverControls = document.createElement('div')
                          hoverControls.setAttribute('class', 'hoverControls')
                          createRightSideMessageView_Holder_receiver.appendChild( hoverControls )

                          hoverControls.innerHTML = `<span class="material-icons-outlined share_sms">share</span>` + 
                          `<span class="material-icons-outlined delete_sms">delete_forever</span>` +
                          `<span class="material-icons-outlined reply_sms">reply</span>`;  
                          hoverControls.querySelector('.share_sms').onclick = ()=>{ shareThisSMS( DATA, i ) }     
                          hoverControls.querySelector('.delete_sms').onclick = ()=>{ sendDeleteRequest2DB(  DATA._id, DATA.sms[i], i, true, myId ) }
                          hoverControls.querySelector('.reply_sms').onclick = ()=>{ replySMS( DATA.sms[i] ) }  

                            // show hover controls (hidden to visible)
                              let pressTimer;

                              function displayHoverControl() {
                                // Start a timer when the mouse button is pressed down
                                pressTimer = setTimeout(function() {
                                  // Your long-press event code goes here
                                  hoverControls.style.display = 'inline-block'
                                }, 1000); // Adjust the duration as needed (in milliseconds)
                              }


                              createRightSideMessageView_Holder_receiver.addEventListener("mousedown", displayHoverControl )
                              createRightSideMessageView_Holder_receiver.addEventListener("touchstart", ()=>{
                                displayHoverControl()
  
                                createRightSideMessageView_Holder_receiver.removeEventListener("mouseleave", hideHoverControlBar );
  
                              })
                              createRightSideMessageView_Holder_receiver.addEventListener('contextmenu', (e) => {
                                e.preventDefault();
                              })

                              function clearDelay(){
                                // Cancel the timer if the mouse button is released before the threshold
                                clearTimeout(pressTimer);
                              }
                              createRightSideMessageView_Holder_receiver.addEventListener("mouseup", clearDelay );


                              function hideHoverControlBar(){                              
                                // hide hover controls
                                hoverControls.style.display = 'none'                              
                              }
                              createRightSideMessageView_Holder_receiver.addEventListener("mouseleave", hideHoverControlBar );
                              createRightSideMessageView_Holder_receiver.addEventListener("touchmove", hideHoverControlBar );


                              createRightSideMessageView_Holder_receiver.addEventListener("touchend", ()=>{
                                clearDelay()
  
                                setTimeout(()=>{
                                  createRightSideMessageView_Holder_receiver.addEventListener("mouseleave", hideHoverControlBar );
                                }, 3000)
                              });
                              
                            // show hover controls (hidden to visible)
                        }

                        if( DATA.sms[i].deletedBy.includes(myId) == false ){
                          showHoverControls()
                        }
                      // hover controls
                    }
                    // peer message (receiver)
                  }



                  // sub setcion scroll to bottom
                    personalMessageInboxScrollToBottom()
                  // sub setcion scroll to bottom

                }
              // loop
            // messages view middle part






            // right side footer
              const createRightSideFooter = document.createElement('div')
              createRightSideFooter.setAttribute('class', 'messengerRightSideFooter')
              messageRightSide.appendChild( createRightSideFooter )


              // textarea
              const createRightSideFooter_textarea = document.createElement('textarea')
              createRightSideFooter_textarea.setAttribute('class', 'messengerRightSideFooter_textarea')
              createRightSideFooter_textarea.setAttribute('placeholder', 'write message here...')
              createRightSideFooter.appendChild( createRightSideFooter_textarea )
              
                // style
                  // on click change height
                  createRightSideFooter_textarea.onfocus = ()=>{
                    createRightSideFooter_textarea.style.height = '100px'
                    createRightSideFooter_textarea.style.padding = '10px'

                    // edit button
                    createRightSideFooter_editPreviewButton.style.bottom = '95px'

                    // edit panel
                    createRightSideFooter_editPreview.style.bottom = '100px'

                    // replyToBar
                    replyToBar.style.bottom = '100px'
                  }
                  createRightSideFooter_textarea.onblur = ()=>{
                    createRightSideFooter_textarea.style.height = '30px'
                    createRightSideFooter_textarea.style.padding = '5px 10px'

                    // edit button
                    createRightSideFooter_editPreviewButton.style.bottom = '25px'

                    // edit panel
                    createRightSideFooter_editPreview.style.bottom = '32px'

                    // replyToBar
                    replyToBar.style.bottom = '30px'
                  }
                  // on click change height
                // style
              // textarea


              // add and show array and object and pass data in textarea
                let messagesArray = []
                let messagesObject = {}
                let viewingDevice = 'phone'
                let createLink = false

                function addArrayObjectTextarea( val, previousPiceVal, blob ){

                  if( messagesArray.includes( `"${val}"` ) == false && val != null) {
                    // array
                    if( previousPiceVal == null ){
                      messagesArray.push( `"${val}"` )
                    } else {
                      const perviousPiceIndex = messagesArray.indexOf( `"${previousPiceVal}"` ) + 1
                      messagesArray.splice( perviousPiceIndex, 0, `"${val}"`) // insert before previous pice pushing it higher index
                    }
                    // array
                    
                    // object
                      messagesObject[ `"${val}"` ] = {} // sub object
                      messagesObject[ `"${val}"` ].text = null
                      messagesObject[ `"${val}"` ].bold = false
                      messagesObject[ `"${val}"` ].italic = false
                      messagesObject[ `"${val}"` ].fontFamily = 'default'
                      messagesObject[ `"${val}"` ].align = 'default'
                      messagesObject[ `"${val}"` ].link = false
                      messagesObject[ `"${val}"` ].fontSize = 12
                      messagesObject[ `"${val}"` ].image = {blob: blob}                      
                    // object

                    createRightSideFooter_textarea.value = '' // clean textarea

                  } else { // edit preview section (retrive data from array and object)
                    // works after selection by users
                                       
                      // check view device type
                        getViewingDevice()
                      // check view device type



                      // array & object loop
                        // style per message portion
                      for(let i = 0; i < messagesArray.length; i++){
                        const selectTheMessagePortion = document.getElementById( `messagePortion_${messagesArray[i]}` )
                                                                        
                        // bold
                          if( messagesObject[ messagesArray[i] ].bold == true ) {
                            selectTheMessagePortion.style.fontWeight = 'bold'
                          } else selectTheMessagePortion.style.fontWeight = 'normal'
                        // bold

                        // italic
                          if( messagesObject[ messagesArray[i] ].italic == true ) {
                            selectTheMessagePortion.style.fontStyle = 'italic'
                          } else selectTheMessagePortion.style.fontStyle = 'normal'
                        // italic

                        // fontFamily
                          if( messagesObject[ messagesArray[i] ].fontFamily != 'default' ) {
                            selectTheMessagePortion.style.fontFamily = messagesObject[ messagesArray[i] ].fontFamily
                          } else selectTheMessagePortion.style.fontFamily = 'inherit'
                        // fontFamily

                        // align                        
                          // previous next message portion
                            function previousNextMessagePortion(){                              
                              if( messagesArray.indexOf(messagesArray[i]) != -1){ 
                                
                                // previous message portion
                                const deductIndex = messagesArray.indexOf(messagesArray[i]) - 1
                                
                                if( messagesObject[ messagesArray[deductIndex] ] == undefined || messagesObject[ messagesArray[deductIndex] ].align == 'default' ) { 
                                  if( document.getElementById( "dummySpaceBefore_" + messagesArray[i]) == null ){ // if not exiest yet
                                    const dummySpaceBeforeThisElem = document.createElement('div')
                                    dummySpaceBeforeThisElem.setAttribute('id', "dummySpaceBefore_" + messagesArray[i] )
                                    dummySpaceBeforeThisElem.setAttribute('style', "display: block; clear: both; ")

                                    selectTheMessagePortion.insertAdjacentElement("beforebegin", dummySpaceBeforeThisElem )
                                  }
                                }else {
                                  if( document.getElementById( "dummySpaceAfter_" + messagesArray[ deductIndex ] ) ){ // if exist after pevios message sibling and before this
                                    document.getElementById( "dummySpaceAfter_" + messagesArray[ deductIndex ] ).remove()               
                                  }

                                  if( document.getElementById( "dummySpaceBefore_" + messagesArray[i] ) ) { // if exist before this
                                    document.getElementById( "dummySpaceBefore_" + messagesArray[i] ).remove()
                                  }
                                }
                                // previous message portion

                                // next message portion                                
                                  const addIndex = messagesArray.indexOf(messagesArray[i]) + 1

                                  if( messagesObject[ messagesArray[addIndex] ] == undefined || messagesObject[ messagesArray[addIndex] ].align == 'default' ) { 
                                    if( document.getElementById( "dummySpaceAfter_" + messagesArray[i] ) == null ){ // if not exist yet
                                      const dummySpaceAfterThisElem = document.createElement('div')
                                      dummySpaceAfterThisElem.setAttribute('id', "dummySpaceAfter_" + messagesArray[i] )
                                      dummySpaceAfterThisElem.setAttribute('style', "display: block; clear: both;")

                                      selectTheMessagePortion.insertAdjacentElement("afterend", dummySpaceAfterThisElem)
                                    }
                                  } else { 
                                    if( document.getElementById( "dummySpaceBefore_" + messagesArray[ addIndex ] ) ) { // if exist before next pice
                                      document.getElementById( "dummySpaceBefore_" + messagesArray[ addIndex ] ).remove()
                                    }

                                    if( document.getElementById( "dummySpaceAfter_" + messagesArray[i] ) ){
                                      document.getElementById( "dummySpaceAfter_" + messagesArray[i] ).remove()               
                                    } 
                                  }                             
                                // next message portion
                              }                             
                            }
                          // previous next message portion

                          // left
                            if( messagesObject[ messagesArray[i] ].align == 'left' ){

                              selectTheMessagePortion.style.display = 'inline'  
                              //selectTheMessagePortion.style.position = 'relative'
                              //selectTheMessagePortion.style.left = 0
                              selectTheMessagePortion.style.marginLeft = 0
                              selectTheMessagePortion.style.float = 'left'

                              previousNextMessagePortion()
                              
                            }
                          // left

                          // center
                            else if( messagesObject[ messagesArray[i] ].align == 'center' ){  
                              

                              const containerWidthPixel = createRightSideFooter_editPreview_mainSubSection_childSubSection3.offsetWidth - 20 // exclude pad 10+10

                              const containerWidthPixel_half = containerWidthPixel / 2

                              const thisPortionWidthPixel = selectTheMessagePortion.offsetWidth 

                              const thisPortionWidthPixel_half = thisPortionWidthPixel / 2

                              // previous message portion
                                let previousPortionWidthPixel = 0

                                const deductIndex = messagesArray.indexOf(messagesArray[i]) - 1
                                  
                                if( messagesObject[ messagesArray[deductIndex] ] != undefined && messagesObject[ messagesArray[deductIndex] ].align == 'left' ) { 
                                  if( document.getElementById( `messagePortion_${messagesArray[deductIndex]}` ) != null ){ // if exiest 
                                    
                                    previousPortionWidthPixel = document.getElementById( `messagePortion_${messagesArray[deductIndex]}` ).offsetWidth
                                  }
                                }
                              // previous message portion

                              // console.warn('container width half '+ containerWidthPixel_half )
                              // console.warn('previous portion width '+ previousPortionWidthPixel )
                              // console.warn('this portion width half '+ thisPortionWidthPixel_half )
                              // console.warn('this portion id '+ selectTheMessagePortion.id )

                              if( previousPortionWidthPixel + thisPortionWidthPixel_half <= containerWidthPixel_half ){
                                const totalWidth = previousPortionWidthPixel + thisPortionWidthPixel_half
                                const remainingWidth = containerWidthPixel_half - totalWidth
                                // console.warn('total portion width ' + totalWidth )

                                selectTheMessagePortion.style.display = 'inline-table'
                                selectTheMessagePortion.style.marginLeft = remainingWidth + 'px'
                              } else {
                                // float left
                                selectTheMessagePortion.style.display = 'inline'
                                selectTheMessagePortion.style.marginLeft = 0
                                selectTheMessagePortion.style.float = 'left'
                                // float left
                              }
                              

                              //selectTheMessagePortion.style.display = 'inline-table'
                              //selectTheMessagePortion.style.position = 'relative'  
                              //selectTheMessagePortion.style.left = 0
                              //selectTheMessagePortion.style.marginLeft = '105px'
                              //selectTheMessagePortion.style.left = deductedOuterWideHalfPercent + '%'


                              previousNextMessagePortion()
                              
                              
                            }
                          // center

                          // right
                            else if( messagesObject[ messagesArray[i] ].align == 'right' ){
                              

                              selectTheMessagePortion.style.display = 'inline'  
                              //selectTheMessagePortion.style.position = 'relative'
                              //selectTheMessagePortion.style.left = 0
                              selectTheMessagePortion.style.marginLeft = 0
                              selectTheMessagePortion.style.float = 'right'

                              previousNextMessagePortion()
                              
                            }
                          // right

                          // default
                            else {
                              
                              selectTheMessagePortion.style.display = 'inline'
                              //selectTheMessagePortion.style.position = 'relative'
                              //selectTheMessagePortion.style.left = 0
                              selectTheMessagePortion.style.marginLeft = 0
                              selectTheMessagePortion.style.float = 'none'
                              
                              if( document.getElementById( "dummySpaceBefore_" + messagesArray[i] ) ){
                                document.getElementById( "dummySpaceBefore_" + messagesArray[i] ).remove()
                              }                              

                              if( document.getElementById( "dummySpaceAfter_" + messagesArray[i] ) ){
                                document.getElementById( "dummySpaceAfter_" + messagesArray[i] ).remove()
                              }                              
                            }
                          // default
                        // align

                        // font size
                          selectTheMessagePortion.style.fontSize = messagesObject[ messagesArray[i] ].fontSize + 'px'
                        // font size

                        // anchor                          
                          if(messagesObject[ messagesArray[i] ].link == true){        
                          
                            if ( selectTheMessagePortion.querySelector('a') == null ) {
                            

                              const createAnchor = document.createElement('a')
                              createAnchor.setAttribute('href', messagesObject[ messagesArray[i] ].text )
                              createAnchor.setAttribute('target', '_blank' )
                              createAnchor.innerText = messagesObject[ messagesArray[i] ].text

                              selectTheMessagePortion.appendChild( createAnchor )                            
                            }                               
                            
                          } else if(messagesObject[ messagesArray[i] ].link == false){
                            if ( selectTheMessagePortion.querySelector('a') !== null ) {                              

                              selectTheMessagePortion.removeChild( selectTheMessagePortion.querySelector('a') )                           
                            }                        
                          }                          
                        // anchor
                        
                      }
                        // style per message portion
                      // array & object loop

                  } // edit preview section (retrive data from array and object)
                  // works after selection by users


                  console.warn('see array arrangement'+ messagesArray)
                  const bla = messagesObject[ `"${val}"` ].image['blob']
                  console.log('see object arrangement ' + bla)
                  
                  
                  if(val != null){

                    // textarea
                      // fill
                        if( messagesObject[ `"${val}"` ].text != null ) {
                          createRightSideFooter_textarea.value = messagesObject[ `"${val}"` ].text
                        } else createRightSideFooter_textarea.value = ''
                      // fill

                      // preview on onkeypress
                        createRightSideFooter_textarea.onkeyup = ()=>{ 
                          if ( document.getElementById( `messagePortion_"${val}"`).querySelector('a') !== null && messagesObject[ `"${val}"` ].link == true ) {
                            console.log('The parent element has a <a> child.');

                            document.getElementById( `messagePortion_"${val}"`).querySelector('a').innerText = createRightSideFooter_textarea.value
                          } else if( document.getElementById( `messagePortion_"${val}"`).querySelector('a') == null && messagesObject[ `"${val}"` ].link == false) {
                            console.log('The parent element does not have a <a> child.');

                            document.getElementById( `messagePortion_"${val}"` ).innerText = createRightSideFooter_textarea.value
                          }
                          
                                                
                          messagesObject[ `"${val}"` ].text = createRightSideFooter_textarea.value.trim()
                        }
                      // preview on onkeypress
                    // textarea
                    

                    // focused on active message portion
                      const selectAllPerMessageBar = document.querySelectorAll('.messengerRightSideFooter_editPreview_mainPics')

                      for (let i = 0; i < selectAllPerMessageBar.length; i++) {
                        selectAllPerMessageBar[i].style.borderColor = "rgb(198, 198, 198)";
                      }

                      if(document.getElementById( `messagePortion_"${val}"` )){
                        document.getElementById( `messagePortion_"${val}"` ).style.borderColor = 'red'
                      }                      
                    // focused on active message portion


                  
                    // edit header style buttons action

                      // add another message portion button
                        createRightSideFooter_editPreview_header_addAnotherMessagePortion.onclick = ()=>{
                          addAnotherPicesMsgPortion( `messagePortion_"${val}"` )
                        }
                      
                      // add another message portion button
                      
                      // anchor
                        createRightSideFooter_editPreview_anchor.onclick = ()=>{
                          createLink = true

                          addAnotherPicesMsgPortion( `messagePortion_"${val}"` )                          
                        }



                        if( messagesObject[ `"${val}"` ].link == true ) {
                          createRightSideFooter_editPreview_anchor.style.backgroundColor = 'yellow'
                        } else createRightSideFooter_editPreview_anchor.style.backgroundColor = 'white'



                        // create link
                          if( createLink == true){
                            createLink = false

                            if( messagesObject[ `"${val}"` ].link == true ) {
                              messagesObject[ `"${val}"` ].link = false
  
                              addArrayObjectTextarea( val, null, null ) // update message portion
                            } else {
                              messagesObject[ `"${val}"` ].link = true
  
                              addArrayObjectTextarea( val, null, null ) // update message portion
                            }
                          }
                        // create link
                      // anchor


                      // image
                        document.getElementById('addMessengerMultiImages').title = val
                      // image


                      // bold
                        if( messagesObject[ `"${val}"` ].bold == true ) {
                          createRightSideFooter_editPreview_header_bold.style.backgroundColor = 'yellow'
                        } else createRightSideFooter_editPreview_header_bold.style.backgroundColor = 'white'


                        createRightSideFooter_editPreview_header_bold.onclick = ()=>{
                          if( messagesObject[ `"${val}"` ].bold == true ) {
                            messagesObject[ `"${val}"` ].bold = false

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          } else {
                            messagesObject[ `"${val}"` ].bold = true

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          }
                        }
                      // bold


                      // italic
                        if( messagesObject[ `"${val}"` ].italic == true ) {
                          createRightSideFooter_editPreview_header_italic.style.backgroundColor = 'yellow'
                        } else createRightSideFooter_editPreview_header_italic.style.backgroundColor = 'white'


                        createRightSideFooter_editPreview_header_italic.onclick = ()=>{
                          if( messagesObject[ `"${val}"` ].italic == true ) {
                            messagesObject[ `"${val}"` ].italic = false

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          } else {
                            messagesObject[ `"${val}"` ].italic = true

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          }
                        }
                      // italic

                      // fontFamily
                        if( messagesObject[ `"${val}"` ].fontFamily != 'default' ) {
                          createRightSideFooter_editPreview_header_font.style.backgroundColor = 'yellow'
                        } else createRightSideFooter_editPreview_header_font.style.backgroundColor = 'white'
                    
                        createRightSideFooter_editPreview_header_font.onchange = ()=>{                   
                          messagesObject[ `"${val}"` ].fontFamily = createRightSideFooter_editPreview_header_font.value

                          addArrayObjectTextarea( val, null, null ) // update message portion
                        }
                      // fontFamily

                      // align
                        // left
                          if( messagesObject[ `"${val}"` ].align == 'left' ){
                            createRightSideFooter_editPreview_header_alignLeft.style.backgroundColor = 'yellow'                                 
                          } else {
                            createRightSideFooter_editPreview_header_alignLeft.style.backgroundColor = 'white'
                          }


                          createRightSideFooter_editPreview_header_alignLeft.onclick = ()=>{
                            if( messagesObject[ `"${val}"` ].align != 'left' ){
                              messagesObject[ `"${val}"` ].align = 'left' 

                            } else if( messagesObject[ `"${val}"` ].align == 'left' ) {
                              messagesObject[ `"${val}"` ].align = 'default' 
                            }

                            addArrayObjectTextarea( val, null, null ) // update message portion                            
                          }
                        // left

                        // center
                          if( messagesObject[ `"${val}"` ].align == 'center' ){
                            createRightSideFooter_editPreview_header_alignCenter.style.backgroundColor = 'yellow'                                 
                          } else {
                            createRightSideFooter_editPreview_header_alignCenter.style.backgroundColor = 'white'
                          }


                          createRightSideFooter_editPreview_header_alignCenter.onclick = ()=>{
                            if( messagesObject[ `"${val}"` ].align != 'center' ){
                              messagesObject[ `"${val}"` ].align = 'center' 

                            } else if( messagesObject[ `"${val}"` ].align == 'center' ) {
                              messagesObject[ `"${val}"` ].align = 'default' 
                            }

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          }
                        // center

                        // right
                          if( messagesObject[ `"${val}"` ].align == 'right' ){
                            createRightSideFooter_editPreview_header_alignRight.style.backgroundColor = 'yellow'                                 
                          } else {
                            createRightSideFooter_editPreview_header_alignRight.style.backgroundColor = 'white'
                          }


                          createRightSideFooter_editPreview_header_alignRight.onclick = ()=>{
                            if( messagesObject[ `"${val}"` ].align != 'right' ){
                              messagesObject[ `"${val}"` ].align = 'right' 

                            } else if( messagesObject[ `"${val}"` ].align == 'right' ) {
                              messagesObject[ `"${val}"` ].align = 'default' 
                            }

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          }
                        // right
                      // align


                      // font size
                        createRightSideFooter_editPreview_header_fontSize.onkeyup = ()=>{
                          const fontSize = Number( createRightSideFooter_editPreview_header_fontSize.value )

                          if(fontSize >= 10 && fontSize <= 72){

                            messagesObject[ `"${val}"` ].fontSize = fontSize 

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          } else if( fontSize > 72 ) {
                            messagesObject[ `"${val}"` ].fontSize = 72 

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          } else if( fontSize < 10 ) {
                            messagesObject[ `"${val}"` ].fontSize = 10 

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          } else if( isNaN( fontSize ) ){

                            createRightSideFooter_editPreview_header_fontSize.value = 14
                            messagesObject[ `"${val}"` ].fontSize = 14

                            addArrayObjectTextarea( val, null, null ) // update message portion
                          }                          
                        }
                      // font size
                    // edit header style buttons action
                  }
                }
              // add and show array and object and pass data in textarea

              

              // reply to bar
                const replyToBar = document.createElement('div')
                replyToBar.setAttribute('class', 'replyToBar')
                createRightSideFooter.appendChild( replyToBar )

                // dyna style
                  const footerWidth = createRightSideFooter.offsetWidth
                  replyToBar.style.width = (footerWidth - 65) + 'px'
                // dyna style

                // image
                  const replyToImage = document.createElement('img')
                  replyToImage.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
                  replyToBar.appendChild( replyToImage )
                // image

                // name
                  const replyToName = document.createElement('div')
                  replyToName.setAttribute('class', 'replyToName')
                  replyToBar.appendChild( replyToName )

                  // set dyna width
                    replyToName.style.width = ( replyToBar.offsetWidth - 65) + 'px'
                  // set dyna width
                // name

                // cancel button
                  const replyToCancel = document.createElement('div')
                  replyToCancel.setAttribute('class', 'replyToCancel')
                  replyToCancel.innerHTML = '<span class="material-icons-outlined">cancel</span>'
                  replyToBar.appendChild( replyToCancel )
                // cancel button
              // reply to bar



              
              // edit
              const createRightSideFooter_editPreview = document.createElement('div')
              createRightSideFooter_editPreview.setAttribute('class', 'messengerRightSideFooter_editPreview')
              createRightSideFooter.appendChild( createRightSideFooter_editPreview )
                
                // edit button
                  const createRightSideFooter_editPreviewButton = document.createElement('span')
                  createRightSideFooter_editPreviewButton.setAttribute('class', 'material-icons-outlined messengerRightSideFooter_editPreviewButton')
                  createRightSideFooter_editPreviewButton.innerText = 'edit_note'
                  createRightSideFooter.appendChild( createRightSideFooter_editPreviewButton )

                  // click
                    createRightSideFooter_editPreviewButton.onclick = ()=>{
                      const getHeight = createRightSideFooter_editPreview.offsetHeight
                      
                      if (getHeight == 0){
                        const messengerRightSideHeight = messageRightSide.offsetHeight
                        const deductHeight = messengerRightSideHeight - 105
                        createRightSideFooter_editPreview.style.height = deductHeight + 'px'

                        setTimeout(()=>{
                          footerEditPreviewMainDynaHeight()

                          setTimeout(()=>{
                            getViewingDevice()
                          }, 1000)
                        }, 2500)
                        
                      } else {
                        createRightSideFooter_editPreview.style.height = 0
                      }
                    }
                  // click
                // edit button


                // hearder controls
                  const createRightSideFooter_editPreview_header = document.createElement('div')
                  createRightSideFooter_editPreview_header.setAttribute('class', 'messengerRightSideFooter_editPreview_header')
                  createRightSideFooter_editPreview.appendChild( createRightSideFooter_editPreview_header )

                  const createRightSideFooter_editPreview_header_SubSection = document.createElement('div')
                  createRightSideFooter_editPreview_header_SubSection.setAttribute('class', 'messengerRightSideFooter_editPreview_header_SubSection')
                  createRightSideFooter_editPreview_header.appendChild( createRightSideFooter_editPreview_header_SubSection )

                    // add another message portion button
                      const createRightSideFooter_editPreview_header_addAnotherMessagePortion = document.createElement('span')
                      createRightSideFooter_editPreview_header_addAnotherMessagePortion.setAttribute('class', 'material-icons-outlined messengerRightSideFooter_editPreview_header_addAnotherMessagePortion')
                      createRightSideFooter_editPreview_header_addAnotherMessagePortion.innerText = 'app_registration'
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_addAnotherMessagePortion )
                    // add another message portion button

                    // bold button
                      const createRightSideFooter_editPreview_header_bold = document.createElement('b')
                      createRightSideFooter_editPreview_header_bold.setAttribute('class', 'messengerRightSideFooter_editPreview_header_boldButton')
                      createRightSideFooter_editPreview_header_bold.innerText = 'B'
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_bold )
                    // bold button

                    // italic button
                      const createRightSideFooter_editPreview_header_italic = document.createElement('b')
                      createRightSideFooter_editPreview_header_italic.setAttribute('class', 'messengerRightSideFooter_editPreview_header_italicButton')
                      createRightSideFooter_editPreview_header_italic.innerText = 'I'
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_italic )
                    // italic button

                    // font selection
                      const createRightSideFooter_editPreview_header_font = document.createElement('select')
                      createRightSideFooter_editPreview_header_font.setAttribute('class', 'messengerRightSideFooter_editPreview_header_fontSelection')
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_font )

                        const createRightSideFooter_editPreview_header_fontOption = document.createElement('option')
                        createRightSideFooter_editPreview_header_fontOption.setAttribute('value', 'arial')
                        createRightSideFooter_editPreview_header_fontOption.innerText = 'Arial'
                        createRightSideFooter_editPreview_header_font.appendChild( createRightSideFooter_editPreview_header_fontOption )

                        const createRightSideFooter_editPreview_header_fontOption2 = document.createElement('option')
                        createRightSideFooter_editPreview_header_fontOption2.setAttribute('value', 'times new roman')
                        createRightSideFooter_editPreview_header_fontOption2.innerText = 'Times New Roman'
                        createRightSideFooter_editPreview_header_font.appendChild( createRightSideFooter_editPreview_header_fontOption2 )
                    // font selection

                    // align
                      // left
                        const createRightSideFooter_editPreview_header_alignLeft = document.createElement('span')
                        createRightSideFooter_editPreview_header_alignLeft.setAttribute('class', 'material-icons-outlined messengerRightSideFooter_editPreview_header_alignButton')
                        createRightSideFooter_editPreview_header_alignLeft.innerText = 'format_align_left'
                        createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_alignLeft )
                      // left

                      // center
                        const createRightSideFooter_editPreview_header_alignCenter = document.createElement('span')
                        createRightSideFooter_editPreview_header_alignCenter.setAttribute('class', 'material-icons-outlined messengerRightSideFooter_editPreview_header_alignButton')
                        createRightSideFooter_editPreview_header_alignCenter.innerText = 'format_align_center'
                        createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_alignCenter )
                      // center

                      // right
                        const createRightSideFooter_editPreview_header_alignRight = document.createElement('span')
                        createRightSideFooter_editPreview_header_alignRight.setAttribute('class', 'material-icons-outlined messengerRightSideFooter_editPreview_header_alignButton')
                        createRightSideFooter_editPreview_header_alignRight.innerText = 'format_align_right'
                        createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_alignRight )
                      // right
                    // align

                    // font size
                      // label
                        const createRightSideFooter_editPreview_header_fontSize_label = document.createElement('label')
                        createRightSideFooter_editPreview_header_fontSize_label.setAttribute('class', 'createRightSideFooter_editPreview_header_fontSize_label')
                        createRightSideFooter_editPreview_header_fontSize_label.setAttribute('for', 'createRightSideFooter_editPreview_header_fontSize')
                        createRightSideFooter_editPreview_header_fontSize_label.innerHTML = '<span class="material-icons-outlined">format_size</span>'
                        createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_fontSize_label )
                      // label

                      const createRightSideFooter_editPreview_header_fontSize = document.createElement('input')
                      createRightSideFooter_editPreview_header_fontSize.setAttribute('type', 'text')
                      createRightSideFooter_editPreview_header_fontSize.setAttribute('class', 'createRightSideFooter_editPreview_header_fontSize')
                      createRightSideFooter_editPreview_header_fontSize.setAttribute('id', 'createRightSideFooter_editPreview_header_fontSize')
                      createRightSideFooter_editPreview_header_fontSize.setAttribute('placeholder', 12)
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_fontSize )
                    // font size

                    // device
                      // phone
                        const createRightSideFooter_editPreview_header_android = document.createElement('img')
                        createRightSideFooter_editPreview_header_android.setAttribute('class', ' messengerRightSideFooter_editPreview_header_deviceType androidMessage')
                        createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_android )


                        createRightSideFooter_editPreview_header_android.src = 'https://firebasestorage.googleapis.com/v0/b/fir-rtc-53633.appspot.com/o/messengerBackground%2Fedit%20panel%20device%2Fsmart%20phone%20sqare.png?alt=media&token=8856edfc-c5db-4e03-a9f4-0b76d9b46a7c'


                        // onclick
                          createRightSideFooter_editPreview_header_android.onclick = ()=>{
                            if(viewingDevice != 'phone' ){
                              createRightSideFooter_editPreview_header_android.style.backgroundColor = 'yellow' // set active device header button active
                              createRightSideFooter_editPreview_header_tab.style.backgroundColor = 'white'
                              createRightSideFooter_editPreview_header_pc.style.backgroundColor = 'white'

                              viewingDevice = 'phone'
                              addArrayObjectTextarea( null, null, null ) // update message portion
                            }
                          }
                        // onclick
                      // phone

                      // tab
                        const createRightSideFooter_editPreview_header_tab = document.createElement('img')
                        createRightSideFooter_editPreview_header_tab.setAttribute('class', ' messengerRightSideFooter_editPreview_header_deviceType tabMessage')
                        createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_tab )

                        createRightSideFooter_editPreview_header_tab.src = 'https://firebasestorage.googleapis.com/v0/b/fir-rtc-53633.appspot.com/o/messengerBackground%2Fedit%20panel%20device%2Ftablet%20pc.png?alt=media&token=4282d0a8-0d6a-401e-850a-146fcea9b431'

                        // onclick
                          createRightSideFooter_editPreview_header_tab.onclick = ()=>{
                            if(viewingDevice != 'tab' ){
                              createRightSideFooter_editPreview_header_android.style.backgroundColor = 'white' 
                              createRightSideFooter_editPreview_header_tab.style.backgroundColor = 'yellow' // set active device header button active
                              createRightSideFooter_editPreview_header_pc.style.backgroundColor = 'white'

                              viewingDevice = 'tab'
                              addArrayObjectTextarea( null, null, null ) // update message portion
                            }
                          }
                        // onclick
                      // tab

                      // pc
                        const createRightSideFooter_editPreview_header_pc = document.createElement('img')
                        createRightSideFooter_editPreview_header_pc.setAttribute('class', ' messengerRightSideFooter_editPreview_header_deviceType pcMessage')
                        createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_pc )

                        createRightSideFooter_editPreview_header_pc.src = 'https://firebasestorage.googleapis.com/v0/b/fir-rtc-53633.appspot.com/o/messengerBackground%2Fedit%20panel%20device%2Fpngwing.com.png?alt=media&token=a81a5ae9-e70e-485e-86c5-04bdd78e8334'

                        // onclick
                          createRightSideFooter_editPreview_header_pc.onclick = ()=>{
                            if(viewingDevice != 'pc' ){
                              createRightSideFooter_editPreview_header_android.style.backgroundColor = 'white' 
                              createRightSideFooter_editPreview_header_tab.style.backgroundColor = 'white'
                              createRightSideFooter_editPreview_header_pc.style.backgroundColor = 'yellow' // set active device header button active

                              viewingDevice = 'pc'
                              addArrayObjectTextarea( null, null, null ) // update message portion
                            }
                          }
                        // onclick
                      // pc

                      // check device size to activate device buttons in footer edit preview header bar
                        if(window.innerWidth <= 579) {
                          createRightSideFooter_editPreview_header_tab.style.display = 'none'
                          createRightSideFooter_editPreview_header_pc.style.display = 'none'
                        } else if(window.innerWidth >= 580 && window.innerWidth <= 799 ) {
                          createRightSideFooter_editPreview_header_tab.style.display = 'inline-block'
                          createRightSideFooter_editPreview_header_pc.style.display = 'none'
                        } else if(window.innerWidth <= 800){
                          createRightSideFooter_editPreview_header_tab.style.display = 'inline-block'
                          createRightSideFooter_editPreview_header_pc.style.display = 'inline-block'
                        }
                      // check device size to activate device buttons in footer edit preview header bar

                      // check viewing device                    
                        function getViewingDevice(){
                          if( viewingDevice == 'phone' ){

                            createRightSideFooter_editPreview_header_android.style.backgroundColor = 'yellow' // set active device header button active

                            createRightSideFooter_editPreview_mainSubSection.style.minWidth = '350px'
                            createRightSideFooter_editPreview_mainSubSection.style.width = '350px'
                            createRightSideFooter_editPreview_mainSubSection.style.maxWidth = '350px'

                            createRightSideFooter_editPreview_mainSubSection.style.background = ` url( 'https://firebasestorage.googleapis.com/v0/b/fir-rtc-53633.appspot.com/o/messengerBackground%2Fedit%20panel%20device%2Fsmart%20phone%20sqare.png?alt=media&token=8856edfc-c5db-4e03-a9f4-0b76d9b46a7c' )`
                            createRightSideFooter_editPreview_mainSubSection.style.backgroundSize = '100% 100%' 


                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.width = '84%'
                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.top = '10.5%'
                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.left = '8%'
                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.height = '80.4%'

                            createRightSideFooter_editPreview_mainSubSection_childSubSection3.style.width = '85%'
                      
                          } else if ( viewingDevice == 'tab' ) {
                            createRightSideFooter_editPreview_header_tab.style.backgroundColor = 'yellow' // set active device header button active

                            createRightSideFooter_editPreview_mainSubSection.style.minWidth = '480px'
                            createRightSideFooter_editPreview_mainSubSection.style.width = '100%'
                            createRightSideFooter_editPreview_mainSubSection.style.maxWidth = '550px'

                            createRightSideFooter_editPreview_mainSubSection.style.background = ` url( 'https://firebasestorage.googleapis.com/v0/b/fir-rtc-53633.appspot.com/o/messengerBackground%2Fedit%20panel%20device%2Ftablet%20pc.png?alt=media&token=4282d0a8-0d6a-401e-850a-146fcea9b431' )`
                            createRightSideFooter_editPreview_mainSubSection.style.backgroundSize = '100% 100%'

                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.width = '84%'
                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.top = '10.8%'
                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.left = '8%'
                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.height = '78.5%'

                            createRightSideFooter_editPreview_mainSubSection_childSubSection3.style.width = '85%'
                          } else if ( viewingDevice == 'pc' ) {
                            createRightSideFooter_editPreview_header_pc.style.backgroundColor = 'yellow' // set active device header button active

                            createRightSideFooter_editPreview_mainSubSection.style.minWidth = '550px'
                            createRightSideFooter_editPreview_mainSubSection.style.width = '100%'
                            createRightSideFooter_editPreview_mainSubSection.style.maxWidth = '1000px'

                            createRightSideFooter_editPreview_mainSubSection.style.background = ` url( 'https://firebasestorage.googleapis.com/v0/b/fir-rtc-53633.appspot.com/o/messengerBackground%2Fedit%20panel%20device%2Fpngwing.com.png?alt=media&token=a81a5ae9-e70e-485e-86c5-04bdd78e8334' ) top center`
                            createRightSideFooter_editPreview_mainSubSection.style.backgroundSize = '135% 106%'

                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.width = '84%'
                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.top = '7.5%'
                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.left = '8%'
                            createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.height = '81.8%'

                            createRightSideFooter_editPreview_mainSubSection_childSubSection3.style.width = '85%'
                          }
                        }                      
                      // check viewing device
                    // device
                    
                    // anchor
                      const createRightSideFooter_editPreview_anchor = document.createElement('span')
                      createRightSideFooter_editPreview_anchor.setAttribute('class', 'material-icons-outlined messengerRightSideFooter_editPreview_header_anchorButton')
                      createRightSideFooter_editPreview_anchor.innerText = 'add_link'
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_anchor )
                    // anchor

                    // add image
                      const createRightSideFooter_editPreview_addImage = document.createElement('label')
                      createRightSideFooter_editPreview_addImage.setAttribute('class', 'material-icons-outlined messengerRightSideFooter_editPreview_header_addImageButton')
                      createRightSideFooter_editPreview_addImage.setAttribute('for', 'addMessengerMultiImages')
                      createRightSideFooter_editPreview_addImage.innerText = 'add_photo_alternate'
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_addImage )

                        const createRightSideFooter_editPreview_addImage_file = document.createElement('input')
                        createRightSideFooter_editPreview_addImage_file.setAttribute('type', 'file')
                        createRightSideFooter_editPreview_addImage_file.setAttribute('style', 'display:none')
                        createRightSideFooter_editPreview_addImage_file.setAttribute('id', 'addMessengerMultiImages')
                        createRightSideFooter_editPreview_addImage_file.setAttribute('accept', 'image/*') // .jpg, .jpeg, .png, .gif
                        createRightSideFooter_editPreview_addImage_file.setAttribute('multiple', true)
                        createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_addImage_file )

                        // file name
                          let file_name = []
                        // file name
                
                        

                        createRightSideFooter_editPreview_addImage_file.onchange = (e)=>{ 

                          // clear file name
                            file_name = []
                          // clear file name
                
                                              
                
                
                
                          
                          if( createRightSideFooter_editPreview_addImage_file.files.length <= 10){            
                
                                                       
                            const heightArray = []
                
                            for (let i = 0; i < createRightSideFooter_editPreview_addImage_file.files.length; i++) {
                              // store file names
                                file_name.push( createRightSideFooter_editPreview_addImage_file.files[i].name )
                              // store file names
                
                              // get raw image dimensions
                                const rawImg = document.createElement('img')  // not appended to html
                
                                const reader = new FileReader();
                                reader.onload = function() {                  
                                    rawImg.src = reader.result;
                                    rawImg.onload = (e)=>{                        
                                        let retio = 2000/e.target.width
                                        let height = Math.round(e.target.height * retio)
                
                                        heightArray.push( height)
                                    }
                                    
                                };
                                reader.readAsDataURL(e.target.files[i]);              
                              // get raw image dimensions
                
                              // end of loop
                                if( i+1 == createRightSideFooter_editPreview_addImage_file.files.length){
                                  setTimeout(()=>{
                                    sendAjaxRequest()
                                  }, 2000)                  
                                }
                              // end of loop
                            }
                            
                            
                
                              function sendAjaxRequest(){           
                                const formData = new FormData(); // create a FormData object from the form data
                                for (let i = 0; i < createRightSideFooter_editPreview_addImage_file.files.length; i++) {
                                  formData.append('files[]', createRightSideFooter_editPreview_addImage_file.files[i]);
                                }
                                formData.append("width", 2000)
                                formData.append("height", JSON.stringify( heightArray ) )
                
                                $.ajax({
                                  url: '/resizeNewProfilePicM', // your server-side endpoint for handling file uploads
                                  type: 'POST',
                                  data: formData,
                                  processData: false,
                                  contentType: false,
                                  success: function(data) {
                                    // clear input file data
                                    createRightSideFooter_editPreview_addImage_file.value = ''
                                    // clear input file data
                
                                    
                
                                    const base64imagesFromArr = JSON.parse(data.base64imageArray)
                
                                    for (let i = 0; i < base64imagesFromArr.length; i++) {
                                      
                                      // create img tag
                                        const createImgTag = document.createElement('img')
                                        createImgTag.setAttribute('class', 'personalMessageInbox')
                                        createImgTag.setAttribute('src', "data:image/jpeg;base64," + base64imagesFromArr[i] )
                                        //document.querySelector('body').appendChild(createImgTag)
                                      // create img tag                                      
                
                                                        
                                      // creat context ( only for convert base64 to image url to upload into firestore )             
                                        createImgTag.onload = (ev) => {  
                                          const canvas = document.createElement("canvas")
                                          canvas.width = 2000
                                          canvas.height = heightArray[i]
                                        
                
                                          const context = canvas.getContext("2d")
                                          context.drawImage(createImgTag, 0, 0, canvas.width, canvas.height)
                                          canvas.toBlob((blob) => {
                                            
                                            addAnotherPicesMsgPortion_imgPice( `messagePortion_"${e.target.title}"`, "data:image/jpeg;base64," + base64imagesFromArr[i], blob )
                
                                          }, 'image/jpeg')
                                        }
                                      // creat context ( only for convert base64 to image url to upload into firestore )     
                                      
                                      

                
                                      // end of loop
                                      /*
                                        if( i+1 == base64imagesFromArr.length){
                                          setTimeout(()=>{
                                            console.log(compressed_image_url)
                                          }, 1000)
                                        }
                                        */
                                      // end of loop
                                      
                                    }
                                    
                                  },
                                  error: function(xhr, status, error) {
                                    console.error('Error uploading file:', error);
                                  }
                                });   
                              }
                
                          }
                        }                        
                    // add image

                    // add video
                    const createRightSideFooter_editPreview_addVideo = document.createElement('label')
                    createRightSideFooter_editPreview_addVideo.setAttribute('class', 'material-icons-outlined messengerRightSideFooter_editPreview_header_addVideoButton')
                    createRightSideFooter_editPreview_addVideo.setAttribute('for', 'addMessengerMultiVideos')
                    createRightSideFooter_editPreview_addVideo.innerText = 'add_photo_alternate'
                    createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_addVideo )

                      const createRightSideFooter_editPreview_addVideo_file = document.createElement('input')
                      createRightSideFooter_editPreview_addVideo_file.setAttribute('type', 'file')
                      createRightSideFooter_editPreview_addVideo_file.setAttribute('style', 'display:none')
                      createRightSideFooter_editPreview_addVideo_file.setAttribute('id', 'addMessengerMultiVideos')
                      createRightSideFooter_editPreview_addVideo_file.setAttribute('accept', 'video/*') // .jpg, .jpeg, .png, .gif
                      createRightSideFooter_editPreview_addVideo_file.setAttribute('multiple', true)
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_addVideo_file )

                                           
                      let video_Width = 0
                      let video_Duration = 0
                      createRightSideFooter_editPreview_addVideo_file.onchange = (e)=>{ 
                        // --------- check video width ------------- 
                          const videoFile = $('#addMessengerMultiVideos')[0].files[0]
                          const videoElement = document.createElement('video');
                          
                          // Create a URL for the selected video file
                          const videoURL = URL.createObjectURL(videoFile);
                          
                          // Set the video source to the URL
                          videoElement.src = videoURL;
                          
                          // Wait for metadata to load (including video width)
                          videoElement.addEventListener('loadedmetadata',async function() {
                              // Access the video width
                              video_Width = this.videoWidth;

                              // Access the video duration
                              video_Duration = this.duration;   
                              
                              await videoCompressProcess()                              
                          });
                        // --------- check video width ------------- 

                        function videoCompressProcess() {
                          // Log or use the video width as needed
                          console.log('--------------Video Width:', video_Width);
                          console.log('------------Video Duration:', video_Duration);
                          
                          if( video_Duration <= 600){

                            if(video_Width >=852){
                              // need processing

                              var formData = new FormData();
                              formData.append('video_field_ajax_appendFormData', $('#addMessengerMultiVideos')[0].files[0]);
                              formData.append('myId', myId)

                              $.ajax({
                                type: 'POST',
                                url: '/resizeVideo',  // The Express.js route for handling the video upload
                                data: formData,
                                processData: false,
                                contentType: false,
                                xhrFields: {
                                  responseType: 'blob' // Set the response type to 'blob'
                                },
                                success: function(data, textStatus, jqXHR) {
                                  // Get the file name from the Content-Disposition header
                                  const fileName = jqXHR.getResponseHeader('Content-Disposition').split('filename=')[1];
                          
                                  // Create a Blob from the binary data
                                  const videoBlob = new Blob([data], { type: 'video/mp4' });
                          
                                  // Create a data URL from the Blob
                                  const videoURL = URL.createObjectURL(videoBlob);
                          
                                  // Set the video source to the created data URL
                                  $('#testVideoElem').attr('src', videoURL);
                          
                                  // Output the file name
                                  console.log('File Name:', decodeURIComponent(fileName) );
                                },
                                error: function (error) {
                                  // $('#response').html('Error uploading video: ' + error.responseText);
                                  console.log( 'Error uploading video: ' + error.responseText )
                                }
                              });
                              
                            } else {
                              // no processing required

                              // Set the video source to the created data URL
                              $('#testVideoElem').attr('src', videoURL);
                            }


                            // Clean up: revoke the URL created for the video file
                            URL.revokeObjectURL(videoURL);

                          } else {
                            console.log('Messenger video duration must be under 10 minutes!')
                          }
                        }

                      }                        
                  // add video
                // hearder controls


                // main
                  const createRightSideFooter_editPreview_main = document.createElement('div')
                  createRightSideFooter_editPreview_main.setAttribute('class', 'messengerRightSideFooter_editPreview_main')
                  createRightSideFooter_editPreview.appendChild( createRightSideFooter_editPreview_main )

                  // set dyna height
                    function footerEditPreviewMainDynaHeight(){
                      const getFooterPreviewPanelHeight = createRightSideFooter_editPreview.offsetHeight
                      const deductFooterPreviewPanelHeight = getFooterPreviewPanelHeight - 40
                      createRightSideFooter_editPreview_main.style.height = deductFooterPreviewPanelHeight + 'px'
                    }
                  // set dyna height

                  // main sub section child 1
                    const createRightSideFooter_editPreview_mainSubSection = document.createElement('div')
                    createRightSideFooter_editPreview_mainSubSection.setAttribute('class', 'messengerRightSideFooter_editPreview_main_SubHolder')
                    createRightSideFooter_editPreview_main.appendChild( createRightSideFooter_editPreview_mainSubSection )
                  // main sub section child

                  // main sub section child 2
                    const createRightSideFooter_editPreview_mainSubSection_childSubSection2 = document.createElement('div')
                    createRightSideFooter_editPreview_mainSubSection_childSubSection2.setAttribute('class', 'messengerRightSideFooter_editPreview_main_SubHolder_childSubSection2')
                    createRightSideFooter_editPreview_mainSubSection.appendChild( createRightSideFooter_editPreview_mainSubSection_childSubSection2 )
                  // main sub section child 2

                  // main sub section child 3
                    const createRightSideFooter_editPreview_mainSubSection_childSubSection3 = document.createElement('div')
                    createRightSideFooter_editPreview_mainSubSection_childSubSection3.setAttribute('class', 'messengerRightSideFooter_editPreview_main_SubHolder_childSubSection3')
                    createRightSideFooter_editPreview_mainSubSection_childSubSection2.appendChild( createRightSideFooter_editPreview_mainSubSection_childSubSection3 )
                  // main sub section child 3


                  // video ------------------------------------------------ 
                    const videoElem = document.createElement('video')
                    videoElem.setAttribute('id', 'testVideoElem')
                    videoElem.setAttribute('controls', true)
                    videoElem.setAttribute('style', 'width: 200px;height: 200px;')
                    createRightSideFooter_editPreview_mainSubSection_childSubSection3.appendChild( videoElem )
                  // video ------------------------------------------------
                  
                  

                  let mainPicsInc = 0
                  // default pice of message portion
                    function defaultPiceOfMessagePortion(){
                      const createRightSideFooter_editPreview_mainPics = document.createElement('span')
                      createRightSideFooter_editPreview_mainPics.setAttribute('class', 'messengerRightSideFooter_editPreview_mainPics')
                      createRightSideFooter_editPreview_mainPics.setAttribute('title', mainPicsInc)
                      createRightSideFooter_editPreview_mainPics.setAttribute('id', `messagePortion_"${mainPicsInc}"`)
                      createRightSideFooter_editPreview_mainSubSection_childSubSection3.appendChild( createRightSideFooter_editPreview_mainPics )

                      // select pice
                        addArrayObjectTextarea( mainPicsInc, null, null ) // default execute for first message portion

                        createRightSideFooter_editPreview_mainPics.onclick = (event)=>{                                   
                          addArrayObjectTextarea( event.target.title, null, null )
                        }
                      // select pice

                      // add another pice of message portion
                        createRightSideFooter_editPreview_mainPics.ondblclick = (eve)=> { 
                          addAnotherPicesMsgPortion(eve.target.id )
                        }
                      // add another pice of message portion
                    }
                    defaultPiceOfMessagePortion() // default execute
                  // default pice of message portion


                  // add another pice
                    function addAnotherPicesMsgPortion( val ){ 
                      mainPicsInc++
                      
                      const createRightSideFooter_editPreview_mainPicsAnother = document.createElement('span')                      
                      createRightSideFooter_editPreview_mainPicsAnother.setAttribute('class', 'messengerRightSideFooter_editPreview_mainPics')
                      createRightSideFooter_editPreview_mainPicsAnother.setAttribute('title', mainPicsInc)
                      createRightSideFooter_editPreview_mainPicsAnother.setAttribute('id', `messagePortion_"${mainPicsInc}"` )
                      
                      // check if it has appended dummySpace elem
                      if( document.getElementById( 'dummySpaceAfter_' + document.getElementById( val ).title ) != null){
                        document.getElementById( 'dummySpaceAfter_' + document.getElementById( val ).title ).insertAdjacentElement("afterend", createRightSideFooter_editPreview_mainPicsAnother)
                      } else document.getElementById( val ).insertAdjacentElement("afterend", createRightSideFooter_editPreview_mainPicsAnother)

                      

                      // select pice
                        addArrayObjectTextarea( mainPicsInc, document.getElementById( val ).title, null ) // default execute on create

                        createRightSideFooter_editPreview_mainPicsAnother.onclick = (event)=>   {                                   
                          addArrayObjectTextarea( event.target.title, document.getElementById( val ).title, null )
                        }
                      // select pice

                      // add another again
                        createRightSideFooter_editPreview_mainPicsAnother.ondblclick = (eve)=> { 
                          addAnotherPicesMsgPortion(eve.target.id)
                        }
                      // add another again
                    }

                    // image pice
                      function addAnotherPicesMsgPortion_imgPice(val, src, BLOB){
                        mainPicsInc++
                      
                        const createRightSideFooter_editPreview_mainPicsAnother = document.createElement('img')                      
                        createRightSideFooter_editPreview_mainPicsAnother.setAttribute('class', 'messengerRightSideFooter_editPreview_mainPics messengerMultiImages')
                        createRightSideFooter_editPreview_mainPicsAnother.setAttribute('title', mainPicsInc)
                        createRightSideFooter_editPreview_mainPicsAnother.setAttribute('src', src)
                        createRightSideFooter_editPreview_mainPicsAnother.setAttribute('id', `messagePortion_"${mainPicsInc}"` )
                        
                        // check if it has appended dummySpace elem
                        if( document.getElementById( 'dummySpaceAfter_"' + document.getElementById( val ).title + '"' ) != null){ 
                          document.getElementById( 'dummySpaceAfter_"' + document.getElementById( val ).title + '"' ).insertAdjacentElement("afterend", createRightSideFooter_editPreview_mainPicsAnother)
                        } else { 
                          document.getElementById( val ).insertAdjacentElement("afterend", createRightSideFooter_editPreview_mainPicsAnother)
                        }

                        

                        // select pice
                          addArrayObjectTextarea( mainPicsInc, document.getElementById( val ).title, BLOB ) // default execute on create

                          createRightSideFooter_editPreview_mainPicsAnother.onclick = (event)=>   {                                   
                            addArrayObjectTextarea( event.target.title, document.getElementById( val ).title, BLOB )
                          }
                        // select pice

                      }
                    // image pice
                  // add another pice

                // main
              // edit



              
              
              

              // send message button
                const createRightSideFooter_sendMessage = document.createElement('span')
                createRightSideFooter_sendMessage.setAttribute('class', 'messengerRightSideFooter_sendMessage material-icons-outlined')
                createRightSideFooter_sendMessage.innerText = 'send'
                createRightSideFooter.appendChild( createRightSideFooter_sendMessage )
                      
                // upload sms to db
                  createRightSideFooter_sendMessage.onclick = async ()=>{
                    let hasMEDIA = false

                    const AJAXarray = []
                    const imageIndexArray = []
                    const imageBlobArray = []
                    const firestoreImageUrl = []
                    
                    for(let i = 0; i < messagesArray.length; i++){

                      if( messagesObject[ messagesArray[i] ].text != null ){
                        AJAXarray.push(
                          {
                            text: messagesObject[ messagesArray[i] ].text,
                            bold: messagesObject[ messagesArray[i] ].bold,
                            italic: messagesObject[ messagesArray[i] ].italic,
                            fontFamily: messagesObject[ messagesArray[i] ].fontFamily,
                            align: messagesObject[ messagesArray[i] ].align,
                            link: messagesObject[ messagesArray[i] ].link,
                            fontSize: messagesObject[ messagesArray[i] ].fontSize,
                          }
                        )
                      } else if( messagesObject[ messagesArray[i] ].image['blob'] != null ){
                        AJAXarray.push(
                          {
                            align: messagesObject[ messagesArray[i] ].align,
                          }
                        )

                        imageIndexArray.push(i)
                        imageBlobArray.push(messagesObject[ messagesArray[i] ].image['blob'])
                      }

                      // array end now try to send
                      if( i + 1 == messagesArray.length ) {
                        
                        if(imageBlobArray.length > 0){
                          hasMEDIA = true
                        }
                        sendToDb( )
                      }
                      // array end now try to send
                    }                    
                    
                    
                    function sendToDb( ) {
                      if(AJAXarray.length > 0){

                        $.ajax({
                          url: '/mongoJs/main/sendSMSMessengerRoom', // Replace with your server endpoint
                          type: 'PUT',
                          data: {
                            my_id: myId,
                            room_id : messengerRoomContents._id,
                            DATA_array_JSON : JSON.stringify(AJAXarray),
                            has_MEDIA: hasMEDIA,
                            reply_To_sms: JSON.stringify(smsForReply),
                          },
                          success: function(response) {
                            if(response != 'error' && response != null ){
                              console.warn("successfully send personal room sms!")
                          
                              // all done (clear everything)
                                clearMessageArrayObjectAndTextareaDraft()
                              // all done (clear everything)

                              // clear reply bar and object
                                smsForReply = null

                                document.querySelector('.replyToBar').style.display = 'none'
                              // clear reply bar and object

                              
                              // if has pic or not
                                if(imageBlobArray.length > 0){
                                  uploadImageToFirebaseAndMongoDB( response )
                                } else {
                                  // show send sms
                                    showUpdatedSMS()
                                  // show send sms
                                }
                              // if has pic or not                              
                          
                            } else{
                              console.warn("Error in sending personal room sms!" + response)              
                            }
                          },
                          error: function(error) {
                            if(error == 'error' && error != null ){
                              console.warn("Err in sending personal room sms!" + error)               
                            }
                          }
                        })
                      }
                    }


                    function uploadImageToFirebaseAndMongoDB( messengerRoomInfo ){
                      let i = 0
                      const lastSmsIndex = messengerRoomInfo.sms.length - 1

                      const metadata = {
                        contentType: 'image/jpeg'
                      }

                      async function loop(){

                          const storageReference = ref(storage, 'message/id' + messengerRoomInfo._id + '/sms' + lastSmsIndex + '/' + new Date() + file_name[i]  ); //assign the path of pic

                          const uploadTask = uploadBytesResumable(storageReference, imageBlobArray[i], metadata);
                
                          // Listen for state changes, errors, and completion of the upload.
                          uploadTask.on('state_changed',
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
                                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURLMini) => {
                                  console.warn('messenger image available: ', downloadURLMini);
                                    
                                  firestoreImageUrl.push( downloadURLMini )

                                  setTimeout(()=>{
                                    if( imageBlobArray.length > i + 1){   
                                      i++                       
                                      loop()
                                    } else {
                                      uploadImageUrlIntoMongodbMessageRoom( messengerRoomInfo._id, lastSmsIndex)
                                    }
                                  }, 1000)

                                });
                            }
                          )                                                
                      }
                      loop()
                    }



                    function uploadImageUrlIntoMongodbMessageRoom(roomId, smsIndex){ 
                      $.ajax({
                        url: '/mongoJs/main/sendFirestoreImageUrlMessenger', // Replace with your server endpoint
                        type: 'PUT',
                        data: {
                          messageRoom_Id: roomId,
                          sms_id: smsIndex,
                          messageDataIndex : JSON.stringify( imageIndexArray ),
                          imageUrl_Array: JSON.stringify( firestoreImageUrl )
                        },
                        success: function(response) {
                          if(response != 'error' && response != null ){
                            console.warn("successfully send image url in mongodb!")
                          
                            // show send sms
                              showUpdatedSMS()
                            // show send sms
                          
                          } else{
                            console.warn("Error in sending image url in mongodb!" + response)              
                          }
                        },
                        error: function(error) {
                          if(error == 'error' && error != null ){
                            console.warn("Err in sending image url in mongodb!" + error)               
                          }
                        }
                      })
                    } 

                    
                    
                    function showUpdatedSMS(){ 
                      $.ajax({
                        url: '/mongoJs/main/getMessages', // Replace with your server endpoint
                        type: 'POST',
                        data: {
                          my_id: myId,
                          room_id: messengerRoomContents._id
                        },
                        success: function(response) {
                          if(response == 'error' && response != null ){
                            console.warn("Error in getting sms!" + response) 
      
                          } else if( response == 'no sms' && response != null ){
      
                            console.warn("No sms yet!")
      
                          } else {    
                            console.warn("successfully get sms!")
      
                            showEveryMessages(response)                
                          }
                        },
                        error: function(error) {
                          if(error == 'error' && error != null ){
                            console.warn("Err in getting sms!" + error)               
                          }
                        }
                      })
                      
                    }


                    // all done (clear everything)
                      function clearMessageArrayObjectAndTextareaDraft() {
                        // hide edit panel
                        createRightSideFooter_editPreview.style.height = 0

                        createRightSideFooter_textarea.value = '' // clean textarea


                        messagesArray = null
                        messagesArray = []

                        messagesObject = null
                        messagesObject = {}

                        mainPicsInc = 0
                        createRightSideFooter_editPreview_mainSubSection_childSubSection3.innerHTML = '' // delete all message portion
                        defaultPiceOfMessagePortion()
                      

                        
                      }
                    // all done (clear everything)
                  }
                // upload sms to db
              // send message button

                           
            // right side footer              
          }
        // list content in right side view
      // show message list (default)


      
      // group
        // messenger left header button
        document.querySelector('.groupMessage').onclick = ()=>{
          showSerchGroupMessage()
          showGroupDashboard()
        }
        // messenger left header button


          // search group
            function showSerchGroupMessage(){
              
              // panel height, Right
              const leftSideHeight = document.querySelector('#messegeLeftSide').offsetHeight
              const deductHeight = leftSideHeight - 52
              document.querySelector('#searchToSendGroupMessage').style.height = deductHeight + 'px'


              document.querySelector('#searchToSendGroupMessage').style.left = 0
              // panel height, Right

              // search field width
              const leftSideWidth = document.querySelector('#messegeLeftSide').offsetWidth
              const deductedWidth = leftSideWidth - 60
              document.querySelector('#searchToSendGroupMessageForm input').style.width = deductedWidth + 'px'
              // search field width
            }

          // close/ hide
          document.getElementById('closeSearchToSendGroupMessage').onclick = hideSearchGroupMessagePanel

          function hideSearchGroupMessagePanel() {
            if(messengerPanel.offsetWidth <= 799){
              document.querySelector('#searchToSendGroupMessage').style.left = '-1100px'
            } else document.querySelector('#searchToSendGroupMessage').style.left = '-500px'
          }
          // close/ hide

          // search button
            // in messenger room        
            document.querySelector('#searchToSendGroupMessageForm button').onclick = async ()=>{
              // search in my message friends
              $.ajax({
                url: '/mongoJs/main/getAmongMessengerFriends', // Replace with your server endpoint
                type: 'POST',
                data: {
                  my_id: myId,
                  form_input : DOMPurify.sanitize( document.querySelector('#searchToSendGroupMessageForm input').value ) 
                },
                success: function(response) {
                  if(response == 'error' && response != null ){
                    console.warn("Error in getting among messenger groups!" + response)  
                  
                  } else if(response == 'not friend' && response != null){
                    console.warn("No messenger group. Checking successful!")
                  } else{
                    console.warn("successfully get among messenger group!")
                  
                    document.querySelector('#searchToSendGroupMessageForm-output').innerHTML = '' // reset old search data
                    //searchedGroupBar( response )
                  }
                },
                error: function(error) {
                  if(error == 'error' && error != null ){
                    console.warn("Err in getting among messenger groups!" + error)               
                  }
                }
              })
              // search in my message friends
              
            }
            // in messenger room

            // show search profile bar
              async function searchedGroupBar( searchdId ){
                for (let i = 0; i < searchdId.length; i++) {

                  const perProfileBar = document.createElement('div')
                  perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-searchToSendMessage' )
                  document.querySelector('#searchToSendMessageForm-output').appendChild( perProfileBar )

                  const perProfileBarHolder = document.createElement('div')
                  perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
                  perProfileBar.appendChild( perProfileBarHolder )

                  const perProfileBarImg = document.createElement('img')
                  perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
                  perProfileBarHolder.appendChild( perProfileBarImg )
                  perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

                  const perProfileBarContent = document.createElement('div')
                  perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
                  perProfileBar.appendChild( perProfileBarContent )

                  const perProfileBarContentName = document.createElement('div')
                  perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName profilesSingelBar-searchToSendMessage')
                  perProfileBarContent.appendChild( perProfileBarContentName )

                  const perProfileBarContentControl = document.createElement('div')
                  perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl profilesSingelBar-contentControl-searchToSendMessage')
                  perProfileBarContentControl.innerText = 'Click/ Tap to select.'
                  perProfileBarContent.appendChild( perProfileBarContentControl )

                  // css
                    function fixWidthOfNameAndContent(){
                      const getWidth = perProfileBar.offsetWidth
                      const deductWidth = getWidth - 65

                      perProfileBarContent.style.width = deductWidth + 'px'
                      perProfileBarContentControl.style.width = deductWidth + 'px'
                    }
                    fixWidthOfNameAndContent()
                  // css


                

                  const peerId = searchdId[i].key.id




                  // retrive data from db
                    // Send AJAX request to Node.js server              
                    $.ajax({
                      url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                      type: 'POST',
                      data: {
                        peer_id: peerId,
                      },
                      success: function(response) {
                        if(response != 'error' && response != null ){
                          console.warn("successfully get friends!")
                
                          showProfile(response)
                
                        } else{
                          console.warn("Error in getting friends!" + response)              
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in getting friends!" + error)               
                        }
                      }
                    })
                


                    function showProfile(singleDATA){  
                      // name
                      perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                  
                      // pic   
                        if ( singleDATA.profileInfo.profilePics.active != 'null') {           
                          perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                        }              
                      // pic
                
                      // controls

                      // controls
                    }
                  // retrive data from db


                  // select profile bar to send message
                    perProfileBar.onclick = selectProfileBarMessenger

                    async function selectProfileBarMessenger(){
                        

                        $.ajax({
                          url: '/mongoJs/main/updateMessengerActivity', // Replace with your server endpoint
                          type: 'PUT',
                          data: {
                            my_id: myId,
                            peer_id: peerId
                          },
                          success: function(response) {
                            if(response == 'error' && response != null ){
                              console.warn("Error in updating messenger activity!" + response)  
                            
                            } else{
                              console.warn("successfully updated messenger activity!")
                            
                              hideSearchPersonMessagePanel()
                            }
                          },
                          error: function(error) {
                            if(error == 'error' && error != null ){
                              console.warn("Err in updating messenger activity!" + error)               
                            }
                          }
                        })                      
                      
                    }
                  // select profile bar to send message
                }
              }
            // show search profile bar
          // search button
        // search group



        // group dashboard right side
          const groupDashboardRightSide = document.getElementById('groupDashboardRightSide')
          // group dashboard background
            groupDashboardRightSide.style.background = `url( 'https://firebasestorage.googleapis.com/v0/b/fir-rtc-53633.appspot.com/o/messengerBackground%2Fdark_1.jpg?alt=media&token=ea729e64-1eef-441f-8881-337b9afdd0f0' ) center no-repeat`;

            groupDashboardRightSide.style.backgroundSize =  '100% 100%'
          // group dashboard background

          // group dashboard sub container
            const groupDashboardSubcontainer = document.getElementById('group-Dashboard-subcontainer')
          // group dashboard sub container

          // show group dashboard
            function showGroupDashboard(){
              // hide other rigth tab
                document.querySelector('#messegeRightSide').style.left = '-' + document.querySelector('#messegeRightSide').offsetWidth + 'px'
                groupDashboardRightSide.style.right = 0
              // hide other rigth tab

              // set sub container dyna height
                const deductHeight = groupDashboardRightSide.offsetHeight - 90
                groupDashboardSubcontainer.style.height = deductHeight + 'px'
              // set sub container dyna height

              // create group
                const createGroup = document.getElementById('createGroup')
                createGroup.onclick = ()=>{
                  const groupNameField = document.createElement('input')
                  groupNameField.setAttribute('type', 'text')
                  groupNameField.setAttribute('class', 'group-name-field')
                  groupNameField.setAttribute('required', true)
                  groupNameField.setAttribute('placeholder', 'Put your desired name for group!')

                  groupDashboardSubcontainer.appendChild(groupNameField)

                  const makeGroupButton = document.createElement('button')
                  makeGroupButton.setAttribute('type', 'button')
                  makeGroupButton.setAttribute('class', 'make-group-button')
                  makeGroupButton.innerText = 'Create'

                  groupDashboardSubcontainer.appendChild(makeGroupButton)

                  makeGroupButton.onclick = ()=>{
                    $.ajax({
                      url: '/mongoJs/main/createGroupMessengerAndMeetingRoom', // Replace with your server endpoint
                      type: 'PUT',
                      data: {
                        my_id: myId,
                        group_name: DOMPurify.sanitize(groupNameField.value.trim())
                      },
                      success: function(response) {
                        if(response == 'error' && response != null ){
                          console.warn("Error in creating group messenger and meeting room!" + response)  
                        
                        } else{
                          console.warn("successfully created group messenger and meeting room!")
                        
                          
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in creating group messenger and meeting room!" + error)               
                        }
                      }
                    })
                  }
                }
              // create group
            }
          // show group dashboard
        // group dashboard right side
      // group
    // panel



    //join meeting
      document.querySelector( '.joinMeeting' ).onclick = ()=>{
        const rightSideBar = document.getElementById( 'messegeRightSide' )

        rightSideBar.innerHTML = ''

        const rightSideHeading = document.createElement('div')
        rightSideHeading.setAttribute( 'id', 'joinMeetingHeader')
        rightSideHeading.innerHTML = '<span>Join Meeting!</span>'
        rightSideBar.appendChild(rightSideHeading)

        const meetingNav = document.createElement('div')
        meetingNav.setAttribute( 'id', 'meetingNav')
        rightSideBar.appendChild(meetingNav)

          const meetingNavCenter = document.createElement('div')
          meetingNavCenter.setAttribute( 'id', 'meetingNavcenter')
          meetingNav.appendChild(meetingNavCenter)

          const joinAMeeting = document.createElement('button')
          joinAMeeting.setAttribute('id', 'joinAMeetingButton')
          joinAMeeting.innerText = 'Join A Meeting'
          meetingNavCenter.appendChild(joinAMeeting)

          const createAMeeting = document.createElement('button')
          createAMeeting.setAttribute('id', 'createAMeetingButton')
          createAMeeting.innerText = 'Create A Meeting'
          meetingNavCenter.appendChild(createAMeeting)

        const meetingSubContent = document.createElement('div')
        meetingSubContent.setAttribute( 'id', 'meetingSubContent')
        rightSideBar.appendChild(meetingSubContent)

          const joinMeetingForm = document.createElement( 'div')
          joinMeetingForm.setAttribute('id', 'joinMeetingForm')
          meetingSubContent.appendChild(joinMeetingForm)

          const meetingId = document.createElement('input')
          meetingId.setAttribute( 'type', 'text')
          meetingId.setAttribute( 'placeholder', 'Put meeting id...')
          joinMeetingForm.appendChild(meetingId)

          const meetingPass = document.createElement('input')
          meetingPass.setAttribute( 'type', 'password')
          meetingPass.setAttribute( 'placeholder', 'Put meeting password...')
          joinMeetingForm.appendChild(meetingPass)

          const joinBut = document.createElement('button')
          joinBut.innerText = 'Join Meeting'
          joinMeetingForm.appendChild(joinBut)

        //click create meeting
          document.getElementById('createAMeetingButton').onclick = async ()=>{
            let lastMeetingId = 1
            const getLastCreatedMeetingIdOnMoments = query( collection(db, 'Meetings'), orderBy("meetingId", "desc"), limit(1))
            const showLastCreatedMeetingIdOnMoments = await getDocs( getLastCreatedMeetingIdOnMoments );
            showLastCreatedMeetingIdOnMoments.forEach((docs) => {
              lastMeetingId = docs.data().id
            })
            const newMeetingId = await addDoc(collection(db, "Meetings"), {
              meetingId: lastMeetingId,
              creatorId: myId
            })
          }
        //click create meeting
      }
    //join meeting
  }
  // messenger button & panel






  



  // friends, requests and followers panel
  function friendsAndFollowersRequestPanel() {
    friendsAndRequestButton.onclick = ()=>{

      showFriendsFollowersAndRequestsPanel = true
      repositionFriendsRequestsFollowers()

    }
    // close
    document.querySelector('#closeFriendsFollowersRequestsPanel').onclick = ()=>{
      showFriendsFollowersAndRequestsPanel = false

      document.querySelector('#friendsFollowersRequestsPanel').style.top = '-2500px'
    }
    // close


    const friendsFollowerRequestsMainbody = document.querySelector('#friendsFollowersRequestsPanelMainbody')


    // deactive other button for 2 s
    function navButtonDelay(){
      document.querySelector('#seeFriendsButton').onclick = ''
      document.querySelector('#seeFriendsButton').style.color = 'inherit'
      document.querySelector('#seeSendRequestButton').onclick = ''
      document.querySelector('#seeSendRequestButton').style.color = 'inherit'
      document.querySelector('#seeReceiveRequestButton').onclick = ''
      document.querySelector('#seeReceiveRequestButton').style.color = 'inherit'
      document.querySelector('#seeFollowertButton').onclick = ''
      document.querySelector('#seeFollowertButton').style.color = 'inherit'
      document.querySelector('#seeFollowingtButton').onclick = ''
      document.querySelector('#seeFollowingtButton').style.color = 'inherit'
      document.querySelector('#seeFamilyMemberstButton').onclick = ''
      document.querySelector('#seeFamilyMemberstButton').style.color = 'inherit'
        // activate again
        setTimeout(()=>{
          document.querySelector('#seeFriendsButton').onclick = showFriends          
          document.querySelector('#seeFriendsButton').style.cursor = 'pointer'
          document.querySelector('#seeSendRequestButton').onclick = showSentRequests
          document.querySelector('#seeSendRequestButton').style.cursor = 'pointer'
          document.querySelector('#seeReceiveRequestButton').onclick = showReceivedRequests
          document.querySelector('#seeReceiveRequestButton').style.cursor = 'pointer'
          document.querySelector('#seeFollowertButton').onclick = showFollower
          document.querySelector('#seeFollowertButton').style.cursor = 'pointer'
          document.querySelector('#seeFollowingtButton').onclick = showFollowing
          document.querySelector('#seeFollowingtButton').style.cursor = 'pointer'
          document.querySelector('#seeFamilyMemberstButton').onclick = showFamilyMembers
          document.querySelector('#seeFamilyMemberstButton').style.cursor = 'pointer'
        }, 4000)
    }
    navButtonDelay()
    // deactive other button for 2 s

    // friend
    async function showFriends(){

      friendsFollowerRequestsMainbody.innerHTML = '' // rest old data

      navButtonDelay()

      document.querySelector('#seeFriendsButton').style.color = 'rgb(6, 220, 31)'
      document.querySelector('#seeFriendsButton').style.cursor = 'progress'


      // total friends and currently showing number on top of panel
        const paginationSection = document.createElement('div')
        paginationSection.setAttribute('class', 'profilesSingelBar-paginationSection' )
        paginationSection.setAttribute('id', `profilesSingelBar-paginationSection_freinds`)
        friendsFollowerRequestsMainbody.appendChild( paginationSection )

        const currentlyShowing = document.createElement('span')
        currentlyShowing.setAttribute('class', 'profilesSingelBar-currentlyShowing' )
        currentlyShowing.setAttribute('id', `profilesSingelBar-currentlyShowing_freinds`)
        currentlyShowing.innerHTML = 'Showing <span>0</span>'
        paginationSection.appendChild( currentlyShowing )

        const totalNumber = document.createElement('span')
        totalNumber.setAttribute('class', 'profilesSingelBar-totalNumber' )
        totalNumber.setAttribute('id', `profilesSingelBar-totalNumber_freinds`)
        totalNumber.innerHTML = ' out of <span>0</span>'
        paginationSection.appendChild( totalNumber )
      // total friends and currently showing number on top of panel



      // get friends from db
        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/main/getFriends', // Replace with your server endpoint
            type: 'POST',
            data: {
              my_id: myId,
            },
            success: function(response) {
              if(response != 'error' && response != null ){
                console.warn("successfully get friends!")
              
                friendsProfileBar(response)
              
              } else{
                console.warn("Error in getting friends!" + response)              
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Err in getting friends!" + error)               
              }
            }
          })
        })
      // get friends from db


      
      function friendsProfileBar(DATA) {  

        loopEnd = 0 // reset
        friend_i = 0 // reset



        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time

          if( DATA.friendsAndFollowers.friend.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = DATA.friendsAndFollowers.friend.length
            showPerProfileBarThroughLoop()
          }


          // pagination section
            if( DATA.friendsAndFollowers.friend[0] != ''){
              pagination(loopEnd, DATA.friendsAndFollowers.friend.length)
            } else {
              pagination(loopEnd - 1, DATA.friendsAndFollowers.friend.length - 1)
            }


            function pagination(start, end){
              document.querySelector('#profilesSingelBar-currentlyShowing_freinds span').innerText = start
              document.querySelector('#profilesSingelBar-totalNumber_freinds span').innerText = end
            }
          // pagination section
        }
        loopManager()

        
        
        
        function showPerProfileBarThroughLoop(){
          for (; friend_i < loopEnd; friend_i++) {
            if(DATA.friendsAndFollowers.friend[ friend_i ] != ''){
            
            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ DATA.friendsAndFollowers.friend[ friend_i ]}`)
            friendsFollowerRequestsMainbody.appendChild( perProfileBar )



            // mouse over on last 3 element
              if( friend_i + 2 == loopEnd || friend_i + 1 == loopEnd ){
                document.querySelector( '.profilesSingelBarNo-' + friend_i ).addEventListener("mouseover", hoverOver) 
          
                function hoverOver(){
            
                  this.removeEventListener("mouseover", hoverOver)
                  this.style.cursor = "wait"

                  setTimeout(()=>{
                    this.style.cursor = "default"
                    loopManager()  
                  }, 2000)
                     
                }
              }
            // mouse over on last 3 element
        


            const perProfileBarHolder = document.createElement('div')
            perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + DATA.friendsAndFollowers.friend[ friend_i ] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + DATA.friendsAndFollowers.friend[ friend_i ] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + DATA.friendsAndFollowers.friend[ friend_i ] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + DATA.friendsAndFollowers.friend[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + DATA.friendsAndFollowers.friend[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const unfriendButton = document.createElement('button')
            unfriendButton.setAttribute('class', 'profilesSingelBar-unfriendButton')
            unfriendButton.setAttribute('id', 'profilesSingelBar-unfriendButton-' + DATA.friendsAndFollowers.friend[ friend_i ] )
            unfriendButton.innerText = 'Unfriend'
            unfriendButton.onclick = unfriend
            perProfileBarContentControl.appendChild( unfriendButton )

            const msgButton = document.createElement('div')
            msgButton.setAttribute('class', 'profilesSingelBar-msgButton')
            msgButton.setAttribute('id', 'profilesSingelBar-msgButton-' + DATA.friendsAndFollowers.friend[ friend_i ] )
            msgButton.innerHTML = '<span class="material-icons-outlined">question_answer</span>'
            perProfileBarContentControl.appendChild( msgButton )
              
            
            const peerId = DATA.friendsAndFollowers.friend[ friend_i ]

            // retrive data from db
              // Send AJAX request to Node.js server              
              $.ajax({
                url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                type: 'POST',
                data: {
                  peer_id: DATA.friendsAndFollowers.friend[ friend_i ],
                },
                success: function(response) {
                  if(response != 'error' && response != null ){
                    console.warn("successfully get friends!")
              
                    showProfile(response)
              
                  } else{
                    console.warn("Error in getting friends!" + response)              
                  }
                },
                error: function(error) {
                  if(error == 'error' && error != null ){
                    console.warn("Err in getting friends!" + error)               
                  }
                }
              })
              


              function showProfile(singleDATA){                
                // name
                perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                
                // pic   
                  if ( singleDATA.profileInfo.profilePics.active != 'null') {           
                    perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                  }              
                // pic
              
                // controls

                // controls
              }
            // retrive data from db

              

              // unfriend
                function unfriend(){
                  unfriendButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
                  
                  $.ajax({
                    url: '/mongoJs/profile/unfriend', // Replace with your server endpoint
                    type: 'PUT',
                    data: {
                      peer_id: peerId, 
                      my_id: myId,
                    },
                    success: async function(response) {
                      if(response != 'error' && response != null ){
                        console.warn("successfully unfriend!")
          
                        perProfileBar.style.visibility = 'hidden'
                  
                      } else{
                        console.warn("Error in unfriending!" + response)
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Err in unfriending!" + error) 
                      }
                    }
                  })
                  
                }
              // unfriend
            }
          }
        }
        
      }
      

    }
    // friend

    // received requests
    async function showReceivedRequests(){

      friendsFollowerRequestsMainbody.innerHTML = '' // rest old data


      navButtonDelay()

      document.querySelector('#seeReceiveRequestButton').style.color = 'rgb(6, 220, 31)'
      document.querySelector('#seeReceiveRequestButton').style.cursor = 'progress'


      // total length and currently showing number
        const paginationSection = document.createElement('div')
        paginationSection.setAttribute('class', 'profilesSingelBar-paginationSection' )
        paginationSection.setAttribute('id', `profilesSingelBar-paginationSection_receiveRequest`)
        friendsFollowerRequestsMainbody.appendChild( paginationSection )

        const currentlyShowing = document.createElement('span')
        currentlyShowing.setAttribute('class', 'profilesSingelBar-currentlyShowing' )
        currentlyShowing.setAttribute('id', `profilesSingelBar-currentlyShowing_receiveRequest`)
        currentlyShowing.innerHTML = 'Showing <span>0</span>'
        paginationSection.appendChild( currentlyShowing )

        const totalNumber = document.createElement('span')
        totalNumber.setAttribute('class', 'profilesSingelBar-totalNumber' )
        totalNumber.setAttribute('id', `profilesSingelBar-totalNumber_receiveRequest`)
        totalNumber.innerHTML = ' out of <span>0</span>'
        paginationSection.appendChild( totalNumber )
      // total length and currently showing number




      // get receive requests from db
        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/main/getReceiveRequests', // Replace with your server endpoint
            type: 'POST',
            data: {
              my_id: myId,
            },
            success: function(response) {
              if(response != 'error' && response != null ){
                console.warn("successfully get receive request!")
              
                peoplesOfReceiveRequestProfileBar(response)
              
              } else{
                console.warn("Error in getting receive request!" + response)              
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Err in getting receive request!" + error)               
              }
            }
          })
        })
      // get receive requests from db



      function peoplesOfReceiveRequestProfileBar(DATA) {
        loopEnd = 0
        friend_i = 0


        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time   
          

          if( DATA.friendsAndFollowers.receive.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = DATA.friendsAndFollowers.receive.length
            showPerProfileBarThroughLoop()
          }

          // pagination section
            if( DATA.friendsAndFollowers.receive[0] != ''){
              pagination(loopEnd, DATA.friendsAndFollowers.receive.length)
            } else {
              pagination(loopEnd - 1, DATA.friendsAndFollowers.receive.length - 1)
            }


            function pagination(start, end){
              document.querySelector('#profilesSingelBar-currentlyShowing_receiveRequest span').innerText = start
              document.querySelector('#profilesSingelBar-totalNumber_receiveRequest span').innerText = end
            }
          // pagination section
        }
        loopManager()

        
        

        async function showPerProfileBarThroughLoop(){ 
          for (; friend_i < loopEnd; friend_i++) {
            if(DATA.friendsAndFollowers.receive[ friend_i ] != ''){

            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ DATA.friendsAndFollowers.receive[ friend_i ]}`)
            friendsFollowerRequestsMainbody.appendChild( perProfileBar )

            // mouse over on last 3 element
              if( friend_i + 2 == loopEnd || friend_i + 1 == loopEnd ){
                document.querySelector( '.profilesSingelBarNo-' + friend_i ).addEventListener("mouseover", hoverOver) 
          
                function hoverOver(){
            
                  this.removeEventListener("mouseover", hoverOver)
                  this.style.cursor = "wait"

                  setTimeout(()=>{
                    this.style.cursor = "default"
                    loopManager()  
                  }, 2000)
                     
                }
              }
            // mouse over on last 3 element
        


            const perProfileBarHolder = document.createElement('div')
            perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + DATA.friendsAndFollowers.receive[ friend_i ] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + DATA.friendsAndFollowers.receive[ friend_i ] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + DATA.friendsAndFollowers.receive[ friend_i ] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + DATA.friendsAndFollowers.receive[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + DATA.friendsAndFollowers.receive[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const acceptButton = document.createElement('button')
            acceptButton.setAttribute('class', 'profilesSingelBar-acceptButton')
            acceptButton.setAttribute('id', 'profilesSingelBar-acceptRequest-' + DATA.friendsAndFollowers.receive[ friend_i ] )
            acceptButton.innerText = 'Accept'
            perProfileBarContentControl.appendChild( acceptButton )

            const rejectRequestButton = document.createElement('button')
            rejectRequestButton.setAttribute('class', 'profilesSingelBar-rejectButton')
            rejectRequestButton.setAttribute('id', 'profilesSingelBar-rejectButton-' + DATA.friendsAndFollowers.receive[ friend_i ] )
            rejectRequestButton.innerText = 'Discard'
            perProfileBarContentControl.appendChild( rejectRequestButton )




            const peerId = DATA.friendsAndFollowers.receive[ friend_i ]

            // accept request
              document.getElementById( 'profilesSingelBar-acceptRequest-' + DATA.friendsAndFollowers.receive[ friend_i ] ).onclick = async ()=>{

                acceptButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
                acceptButton.onclick = ()=>{}
                rejectRequestButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
                rejectRequestButton.onclick = ()=>{}



                
                $.ajax({
                  url: '/mongoJs/profile/acceptFreindRequest', // Replace with your server endpoint
                  type: 'PUT',
                  data: {
                    my_id: myId,
                    peer_id: peerId
                  },
                  success: function(response) {
                    if(response != 'error' && response != null ){
                      console.warn("successfully accept request!")
                      
                      document.getElementById(`profilesSingelBar_${ peerId }`).style.visibility = 'hidden'
                      
                    } else{
                      console.warn("Error in acceptin friend request!" + response)
                    }
                  },
                  error: function(error) {
                    if(error == 'error' && error != null ){
                      console.warn("Err in acceptin friend request!" + error) 
                    }
                  }
                })
                
              }
            // accept request


            // discard request
              document.getElementById( 'profilesSingelBar-rejectButton-' + DATA.friendsAndFollowers.receive[ friend_i ] ).onclick = async ()=>{

                acceptButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
                acceptButton.onclick = ()=>{}
                rejectRequestButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
                rejectRequestButton.onclick = ()=>{}



                $.ajax({
                  url: '/mongoJs/profile/rejectFreindRequest', // Replace with your server endpoint
                  type: 'PUT',
                  data: {
                    peer_id: peerId, 
                    my_id: myId,
                  },
                  success: async function(response) {
                    if(response != 'error' && response != null ){
                      console.warn("successfully rejected friend request!")
        
                      document.getElementById(`profilesSingelBar_${ peerId }`).style.visibility = 'hidden'
                
                    } else{
                      console.warn("Error in rejected friend request!" + response)
                    }
                  },
                  error: function(error) {
                    if(error == 'error' && error != null ){
                      console.warn("Err in rejected friend request!" + error) 
                    }
                  }
                })
                
              }
            // discard request


            // retrive data from db
              // Send AJAX request to Node.js server              
              $.ajax({
                url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                type: 'POST',
                data: {
                  peer_id: peerId,
                },
                success: function(response) {
                  if(response != 'error' && response != null ){
                    console.warn("successfully get receive request single profile!")
              
                    showProfile(response)
              
                  } else{
                    console.warn("Error in getting receive request single profile!" + response)              
                  }
                },
                error: function(error) {
                  if(error == 'error' && error != null ){
                    console.warn("Err in getting receive request single profile!" + error)               
                  }
                }
              })



              function showProfile(singleDATA){                
                // name
                perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                
                // pic   
                  if ( singleDATA.profileInfo.profilePics.active != 'null') {           
                    perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                  }              
                // pic
              
                // controls

                // controls
              }
            // retrive data from db
            }
          }
        }
      }

    }
    // received requests

    // sent requests
    async function showSentRequests(){

      friendsFollowerRequestsMainbody.innerHTML = '' // rest old data

      navButtonDelay()

      document.querySelector('#seeSendRequestButton').style.color = 'rgb(6, 220, 31)'
      document.querySelector('#seeSendRequestButton').style.cursor = 'progress'



      // total length and currently showing number
        const paginationSection = document.createElement('div')
        paginationSection.setAttribute('class', 'profilesSingelBar-paginationSection' )
        paginationSection.setAttribute('id', `profilesSingelBar-paginationSection_sentRequest`)
        friendsFollowerRequestsMainbody.appendChild( paginationSection )

        const currentlyShowing = document.createElement('span')
        currentlyShowing.setAttribute('class', 'profilesSingelBar-currentlyShowing' )
        currentlyShowing.setAttribute('id', `profilesSingelBar-currentlyShowing_sentRequest`)
        currentlyShowing.innerHTML = 'Showing <span>0</span>'
        paginationSection.appendChild( currentlyShowing )

        const totalNumber = document.createElement('span')
        totalNumber.setAttribute('class', 'profilesSingelBar-totalNumber' )
        totalNumber.setAttribute('id', `profilesSingelBar-totalNumber_sentRequest`)
        totalNumber.innerHTML = ' out of <span>0</span>'
        paginationSection.appendChild( totalNumber )
      // total length and currently showing number



      // get send requests from db
        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/main/getSendRequests', // Replace with your server endpoint
            type: 'POST',
            data: {
              my_id: myId,
            },
            success: function(response) {
              if(response != 'error' && response != null ){
                console.warn("successfully get sent request!")
              
                peoplesOfSentRequestProfileBar(response)
              
              } else{
                console.warn("Error in getting sent request!" + response)              
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Err in getting sent request!" + error)               
              }
            }
          })
        })
      // get send requests from db



      function peoplesOfSentRequestProfileBar(DATA) {

        loopEnd = 0
        friend_i = 0


        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time

          if( DATA.friendsAndFollowers.send.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = DATA.friendsAndFollowers.send.length
            showPerProfileBarThroughLoop()
          }


          // pagination section
          if( DATA.friendsAndFollowers.send[0] != ''){
            pagination(loopEnd, DATA.friendsAndFollowers.send.length)
          } else {
            pagination(loopEnd - 1, DATA.friendsAndFollowers.send.length - 1)
          }


          function pagination(start, end){
            document.querySelector('#profilesSingelBar-currentlyShowing_sentRequest span').innerText = start
            document.querySelector('#profilesSingelBar-totalNumber_sentRequest span').innerText = end
          }
        // pagination section
        }
        loopManager()

        
        

        async function showPerProfileBarThroughLoop(){
          for (; friend_i < loopEnd; friend_i++) {
            if( DATA.friendsAndFollowers.send[ friend_i ] != ''){

            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ DATA.friendsAndFollowers.send[ friend_i ]}`)
            friendsFollowerRequestsMainbody.appendChild( perProfileBar )

            // mouse over on last 3 element
              if( friend_i + 2 == loopEnd || friend_i + 1 == loopEnd ){
                document.querySelector( '.profilesSingelBarNo-' + friend_i ).addEventListener("mouseover", hoverOver) 
          
                function hoverOver(){
            
                  this.removeEventListener("mouseover", hoverOver)
                  this.style.cursor = "wait"

                  setTimeout(()=>{
                    this.style.cursor = "default"
                    loopManager()  
                  }, 2000)
                     
                }
              }
            // mouse over on last 3 element
        


            const perProfileBarHolder = document.createElement('div')
            perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + DATA.friendsAndFollowers.send[ friend_i ] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + DATA.friendsAndFollowers.send[ friend_i ] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + DATA.friendsAndFollowers.send[ friend_i ] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + DATA.friendsAndFollowers.send[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + DATA.friendsAndFollowers.send[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const cancelButton = document.createElement('button')
            cancelButton.setAttribute('class', 'profilesSingelBar-unfriendButton')
            cancelButton.setAttribute('id', 'profilesSingelBar-cancelRequest-' + DATA.friendsAndFollowers.send[ friend_i ] )
            cancelButton.innerText = 'Cancel'
            perProfileBarContentControl.appendChild( cancelButton )

            const unfollowButton = document.createElement('button')
            unfollowButton.setAttribute('class', 'profilesSingelBar-unfollowButton')
            unfollowButton.setAttribute('id', 'profilesSingelBar-unfollowButton-' + DATA.friendsAndFollowers.send[ friend_i ] )
            unfollowButton.innerText = 'Unfollow'
            perProfileBarContentControl.appendChild( unfollowButton )





            const peerId = DATA.friendsAndFollowers.send[ friend_i ]

            // retrive data from db
              // Send AJAX request to Node.js server              
              $.ajax({
                url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                type: 'POST',
                data: {
                  peer_id: peerId,
                },
                success: function(response) {
                  if(response != 'error' && response != null ){
                    console.warn("successfully get receive request single profile!")
              
                    showProfile(response)
              
                  } else{
                    console.warn("Error in getting receive request single profile!" + response)              
                  }
                },
                error: function(error) {
                  if(error == 'error' && error != null ){
                    console.warn("Err in getting receive request single profile!" + error)               
                  }
                }
              })



              function showProfile(singleDATA){                
                // name
                perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                
                // pic   
                  if ( singleDATA.profileInfo.profilePics.active != 'null') {           
                    perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                  }              
                // pic
              
                
              }           
            // retrive data from db


              
              // check you following
                function checkYouAreFollowing() {
                  $.ajax({
                    url: '/mongoJs/profile/followStatus', // Replace with your server endpoint
                    type: 'POST',
                    data: {
                      peer_id: peerId, 
                      my_id: myId,
                    },
                    success: async function(response) {
                      if(response == 'following' && response != null ){
                        console.warn("following!")                
        
                        
                        setTimeout(()=>{
                          unfollowButton.innerText = 'Unfollow'
                          unfollowButton.onclick = unfollow
                          unfollowButton.style.display = 'inline-block'
                        }, 3000)
                        
                    
                      }  else if(response == 'not following' && response != null){
                        console.log('not following')
                        
                        setTimeout(()=>{
                          unfollowButton.innerText = 'Follow'
                          unfollowButton.onclick = follow
                          unfollowButton.style.display = 'inline-block'
                        }, 3000)

                      } else{
                        console.warn("Error in checking follow!" + response)
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Err in checking follow!" + error) 
                      }
                    }
                  })
                  
                }
                checkYouAreFollowing()
              // check you following


              
              // follow
                function follow() {
                
                  unfollowButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'


        
                  // Send AJAX request to Node.js server
                  $.ajax({
                    url: '/mongoJs/profile/follow', // Replace with your server endpoint
                    type: 'PUT',
                    data: {
                      peer_id: peerId, 
                      my_id: myId,
                    },
                    success: async function(response) {
                      if(response != 'error' && response != null ){
                        console.warn("successfully follow!")       

                        setTimeout(()=>{
                          checkYouAreFollowing()
                        }, 5000)

                      } else{
                        console.warn("Can't set follow!" + response)
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Can't set follow!" + error)
                      }
                    }
                  })                
                  
                }
              // follow

              // unfollow
                function unfollow() {

                  unfollowButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'


        
                  // Send AJAX request to Node.js server
                  $.ajax({
                    url: '/mongoJs/profile/unfollow', // Replace with your server endpoint
                    type: 'PUT',
                    data: {
                      peer_id: peerId, 
                      my_id: myId,
                    },
                    success: async function(response) {
                      if(response != 'error' && response != null ){
                        console.warn("successfully unfollow!")       

                        setTimeout(()=>{
                          checkYouAreFollowing()
                        }, 5000)

                      } else{
                        console.warn("Can't set unfollow!" + response)
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Can't set unfollow!" + error)
                      }
                    }
                  })
                }
              // unfollow
                
              // cancel request
              cancelButton.onclick = ()=>{

                unfollowButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
                cancelButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'



                // Send AJAX request to Node.js server
                $.ajax({
                  url: '/mongoJs/profile/cancelFreindRequest', // Replace with your server endpoint
                  type: 'PUT',
                  data: {
                    peer_id: peerId, 
                    my_id: myId,
                  },
                  success: async function(response) {
                    if(response != 'error' && response != null ){
                      console.warn("successfully cancel request!")       

                      document.getElementById(`profilesSingelBar_${ peerId }`).style.visibility = 'hidden'

                    } else{
                      console.warn("Can't cancel request!" + response)
                    }
                  },
                  error: function(error) {
                    if(error == 'error' && error != null ){
                      console.warn("Can't cancel request!" + error)
                    }
                  }
                })
                
                
              }
              // cancel request
              
            }
          }
        }
      }

    }
    // sent requests

    // follower
    async function showFollower(){

      friendsFollowerRequestsMainbody.innerHTML = '' // rest old data

      navButtonDelay()

      document.querySelector('#seeFollowertButton').style.color = 'rgb(6, 220, 31)'
      document.querySelector('#seeFollowertButton').style.cursor = 'progress'


      // total length and currently showing number
        const paginationSection = document.createElement('div')
        paginationSection.setAttribute('class', 'profilesSingelBar-paginationSection' )
        paginationSection.setAttribute('id', `profilesSingelBar-paginationSection_follower`)
        friendsFollowerRequestsMainbody.appendChild( paginationSection )

        const currentlyShowing = document.createElement('span')
        currentlyShowing.setAttribute('class', 'profilesSingelBar-currentlyShowing' )
        currentlyShowing.setAttribute('id', `profilesSingelBar-currentlyShowing_follower`)
        currentlyShowing.innerHTML = 'Showing <span>0</span>'
        paginationSection.appendChild( currentlyShowing )

        const totalNumber = document.createElement('span')
        totalNumber.setAttribute('class', 'profilesSingelBar-totalNumber' )
        totalNumber.setAttribute('id', `profilesSingelBar-totalNumber_follower`)
        totalNumber.innerHTML = ' out of <span>0</span>'
        paginationSection.appendChild( totalNumber )
      // total length and currently showing number




      // get follower from db
        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/main/getFollowers', // Replace with your server endpoint
            type: 'POST',
            data: {
              my_id: myId,
            },
            success: function(response) {
              if(response != 'error' && response != null ){
                console.warn("successfully get followers!")
              
                followersProfileBar(response)
              
              } else{
                console.warn("Error in getting followers!" + response)              
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Err in getting followers!" + error)               
              }
            }
          })
        })
      // get follower from db




      function followersProfileBar(DATA) {
        loopEnd = 0
        friend_i = 0


        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time

          if( DATA.friendsAndFollowers.follower.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = DATA.friendsAndFollowers.follower.length
            showPerProfileBarThroughLoop()
          }

          
          // pagination section
            if( DATA.friendsAndFollowers.follower[0] != ''){
              pagination(loopEnd, DATA.friendsAndFollowers.follower.length)
            } else {
              pagination(loopEnd - 1, DATA.friendsAndFollowers.follower.length - 1)
            }


            function pagination(start, end){
              document.querySelector('#profilesSingelBar-currentlyShowing_follower span').innerText = start
              document.querySelector('#profilesSingelBar-totalNumber_follower span').innerText = end
            }
          // pagination section
        }
        loopManager()

        
        

        async function showPerProfileBarThroughLoop(){
          for (; friend_i < loopEnd; friend_i++) {
            if( DATA.friendsAndFollowers.follower[friend_i] != ''){

            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ DATA.friendsAndFollowers.follower[friend_i] }`)
            friendsFollowerRequestsMainbody.appendChild( perProfileBar )

            // mouse over on last 3 element
              if( friend_i + 2 == loopEnd || friend_i + 1 == loopEnd ){
                document.querySelector( '.profilesSingelBarNo-' + friend_i ).addEventListener("mouseover", hoverOver) 
          
                function hoverOver(){
            
                  this.removeEventListener("mouseover", hoverOver)
                  this.style.cursor = "wait"

                  setTimeout(()=>{
                    this.style.cursor = "default"
                    loopManager()  
                  }, 2000)
                     
                }
              }
            // mouse over on last 3 element
        


            const perProfileBarHolder = document.createElement('div')
            perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + DATA.friendsAndFollowers.follower[friend_i] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + DATA.friendsAndFollowers.follower[friend_i] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + DATA.friendsAndFollowers.follower[friend_i] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + DATA.friendsAndFollowers.follower[friend_i] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + DATA.friendsAndFollowers.follower[friend_i] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const followbackButton = document.createElement('button')
            followbackButton.setAttribute('class', 'profilesSingelBar-followbackButton')
            followbackButton.setAttribute('id', 'profilesSingelBar-followbackButton-' + DATA.friendsAndFollowers.follower[friend_i] )
            followbackButton.innerText = 'You Not Following'
            perProfileBarContentControl.appendChild( followbackButton )

            const followerButton = document.createElement('button')
            followerButton.setAttribute('class', 'profilesSingelBar-followerButton')
            followerButton.setAttribute('id', 'profilesSingelBar-followerButton-' + DATA.friendsAndFollowers.follower[friend_i] )
            followerButton.innerText = 'Follower'
            perProfileBarContentControl.appendChild( followerButton )



            const peerId = DATA.friendsAndFollowers.follower[friend_i]


              // retrive data from db
                // Send AJAX request to Node.js server              
                $.ajax({
                  url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                  type: 'POST',
                  data: {
                    peer_id: peerId,
                  },
                  success: function(response) {
                    if(response != 'error' && response != null ){
                      console.warn("successfully get receive request single profile!")
              
                      showProfile(response)
              
                    } else{
                      console.warn("Error in getting receive request single profile!" + response)              
                    }
                  },
                  error: function(error) {
                    if(error == 'error' && error != null ){
                      console.warn("Err in getting receive request single profile!" + error)               
                    }
                  }
                })



                function showProfile(singleDATA){                
                  // name
                  perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                
                  // pic   
                    if ( singleDATA.profileInfo.profilePics.active != 'null') {           
                      perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                    }              
                  // pic
              
                
                }           
              // retrive data from db

            

                
              // check you following
                function checkYouFollowing(){
                  $.ajax({
                    url: '/mongoJs/main/getfollowingSpecificPeer', // Replace with your server endpoint
                    type: 'POST',
                    data: {
                      my_id: myId,
                      peer_id: peerId
                    },
                    success: function(response) {
                      if(response == 'following' && response != null ){
                        console.warn("successfully get followings!")
                  
                        followbackButton.innerText = 'You Too Following'
                        followbackButton.onclick = unfollow
                  
                      } else if(response == 'not following' && response != null){
                        console.warn("successfully get not followings!")

                        followbackButton.innerText = 'You Not Following'
                        followbackButton.onclick = follow
                      } else{
                        console.warn("Error in getting followings!" + response)              
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Err in getting followings!" + error)               
                      }
                    }
                  }) 
                }
                checkYouFollowing()                             
              // check you following

              // follow 
                function follow(){
                  followbackButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'

        
                  // Send AJAX request to Node.js server        
                  $.ajax({
                    url: '/mongoJs/profile/follow', // Replace with your server endpoint
                    type: 'PUT',
                    data: {
                      peer_id: peerId, 
                      my_id: myId,
                    },
                    success: async function(response) {
                      if(response != 'error' && response != null ){
                        console.warn("successfully follow!")       

                        setTimeout(()=>{
                          checkYouFollowing() 
                        },5000)
                      } else{
                        console.warn("Can't set follow!" + response)
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Can't set follow!" + error) 
                      }
                    }
                  })
        
                }
              // follow 

              // unfollow
                function unfollow(){
                  followbackButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'


        
                  // Send AJAX request to Node.js server        
                  $.ajax({
                    url: '/mongoJs/profile/unfollow', // Replace with your server endpoint
                    type: 'PUT',
                    data: {
                      peer_id: peerId, 
                      my_id: myId,
                    },
                    success: async function(response) {
                      if(response != 'error' && response != null ){
                        console.warn("successfully unfollow!")       

                        setTimeout(()=>{
                          checkYouFollowing() 
                        },5000)
                      } else{
                        console.warn("Can't set unfollow!" + response)
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Can't set unfollow!" + error) 
                      }
                    }
                  })
        
                }
              // unfollow              

            }
          }
        }
      }

    }
    // follower

    // following
    async function showFollowing(){

      friendsFollowerRequestsMainbody.innerHTML = '' // rest old data

      navButtonDelay()

      document.querySelector('#seeFollowingtButton').style.color = 'rgb(6, 220, 31)'
      document.querySelector('#seeFollowingtButton').style.cursor = 'progress'


      // total length and currently showing number
        const paginationSection = document.createElement('div')
        paginationSection.setAttribute('class', 'profilesSingelBar-paginationSection' )
        paginationSection.setAttribute('id', `profilesSingelBar-paginationSection_following`)
        friendsFollowerRequestsMainbody.appendChild( paginationSection )

        const currentlyShowing = document.createElement('span')
        currentlyShowing.setAttribute('class', 'profilesSingelBar-currentlyShowing' )
        currentlyShowing.setAttribute('id', `profilesSingelBar-currentlyShowing_following`)
        currentlyShowing.innerHTML = 'Showing <span>0</span>'
        paginationSection.appendChild( currentlyShowing )

        const totalNumber = document.createElement('span')
        totalNumber.setAttribute('class', 'profilesSingelBar-totalNumber' )
        totalNumber.setAttribute('id', `profilesSingelBar-totalNumber_following`)
        totalNumber.innerHTML = ' out of <span>0</span>'
        paginationSection.appendChild( totalNumber )
      // total length and currently showing number




      // get follower from db
        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/main/getFollowing', // Replace with your server endpoint
            type: 'POST',
            data: {
              my_id: myId,
            },
            success: function(response) {
              if(response != 'error' && response != null ){
                console.warn("successfully get following!")
              
                followingsProfileBar(response)
              
              } else{
                console.warn("Error in getting followings!" + response)              
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Err in getting followings!" + error)               
              }
            }
          })
        })
      // get follower from db



      function followingsProfileBar(DATA) {

        loopEnd = 0
        friend_i = 0

        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time

          if( DATA.friendsAndFollowers.following.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = DATA.friendsAndFollowers.following.length
            showPerProfileBarThroughLoop()
          }


          // pagination section
            if( DATA.friendsAndFollowers.following[0] != ''){
              pagination(loopEnd, DATA.friendsAndFollowers.following.length)
            } else {
              pagination(loopEnd - 1, DATA.friendsAndFollowers.following.length - 1)
            }


            function pagination(start, end){
              document.querySelector('#profilesSingelBar-currentlyShowing_following span').innerText = start
              document.querySelector('#profilesSingelBar-totalNumber_following span').innerText = end
            }
          // pagination section
        }
        loopManager()

        
        

        async function showPerProfileBarThroughLoop(){
          for (; friend_i < loopEnd; friend_i++) {
            if( DATA.friendsAndFollowers.following[ friend_i ] != ''){

            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ DATA.friendsAndFollowers.following[ friend_i ]}`)
            friendsFollowerRequestsMainbody.appendChild( perProfileBar )

            // mouse over on last 3 element
              if( friend_i + 2 == loopEnd || friend_i + 1 == loopEnd ){
                document.querySelector( '.profilesSingelBarNo-' + friend_i ).addEventListener("mouseover", hoverOver) 
          
                function hoverOver(){
            
                  this.removeEventListener("mouseover", hoverOver)
                  this.style.cursor = "wait"

                  setTimeout(()=>{
                    this.style.cursor = "default"
                    loopManager()  
                  }, 2000)
                     
                }
              }
            // mouse over on last 3 element
        


            const perProfileBarHolder = document.createElement('div')
            perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + DATA.friendsAndFollowers.following[ friend_i ] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + DATA.friendsAndFollowers.following[ friend_i ] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + DATA.friendsAndFollowers.following[ friend_i ] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + DATA.friendsAndFollowers.following[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + DATA.friendsAndFollowers.following[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const unfollowButton = document.createElement('button')
            unfollowButton.setAttribute('class', 'profilesSingelBar-unfollowButton')
            unfollowButton.setAttribute('id', 'profilesSingelBar-unfollowButton-' + DATA.friendsAndFollowers.following[ friend_i ] )
            unfollowButton.innerText = 'Unfollow'
            perProfileBarContentControl.appendChild( unfollowButton )
            unfollowButton.style.display = 'inline-block'

            const friendButton = document.createElement('button')
            friendButton.setAttribute('class', 'profilesSingelBar-friendButton')
            friendButton.setAttribute('id', 'profilesSingelBar-friendButton-' + DATA.friendsAndFollowers.following[ friend_i ] )
            friendButton.innerText = 'Not friend yet.'
            perProfileBarContentControl.appendChild( friendButton )



              const peerId = DATA.friendsAndFollowers.following[ friend_i ]

              // retrive data from db
                // Send AJAX request to Node.js server              
                $.ajax({
                  url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
                  type: 'POST',
                  data: {
                    peer_id: peerId,
                  },
                  success: function(response) {
                    if(response != 'error' && response != null ){
                      console.warn("successfully get receive request single profile!")
              
                      showProfile(response)
              
                    } else{
                      console.warn("Error in getting receive request single profile!" + response)              
                    }
                  },
                  error: function(error) {
                    if(error == 'error' && error != null ){
                      console.warn("Err in getting receive request single profile!" + error)               
                    }
                  }
                })



                function showProfile(singleDATA){                
                  // name
                  perProfileBarContentName.innerText = singleDATA.profileInfo.name.fullName
                
                  // pic   
                    if ( singleDATA.profileInfo.profilePics.active != 'null') {           
                      perProfileBarImg.src = singleDATA.profileInfo.profilePics.active  
                    }              
                  // pic              
                
                }           
              // retrive data from db



              // unfollow
                unfollowButton.onclick = async ()=>{
                
                  unfollowButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
                  friendButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'


        
                  // Send AJAX request to Node.js server        
                  $.ajax({
                    url: '/mongoJs/profile/unfollow', // Replace with your server endpoint
                    type: 'PUT',
                    data: {
                      peer_id: peerId, 
                      my_id: myId,
                    },
                    success: async function(response) {
                      if(response != 'error' && response != null ){
                        console.warn("successfully unfollow!")       

                        document.getElementById( `profilesSingelBar_${ peerId }` ).style.visibility = 'hidden'

                      } else{
                        console.warn("Can't set unfollow!" + response)
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Can't set unfollow!" + error) 
                      }
                    }
                  })
                  
                }
              // unfollow


              
              

              // check friend
                function checkFriend(){
                  // Send AJAX request to Node.js server              
                  $.ajax({
                    url: '/mongoJs/main/getFriend', // Replace with your server endpoint
                    type: 'POST',
                    data: {
                      my_id: myId,
                      peer_id: peerId
                    },
                    success: function(response) {
                      if(response == 'friend' && response != null ){
                        console.warn("successfully get friend!")
                        
                        friendButton.innerText = 'Friend'
                      } else if( response == 'not friend' && response != null  ){
                        console.warn("successfully get not friend!")
                        
                        friendButton.innerText = 'Not friend yet.'
                      } else{
                        console.warn("Error in getting friend!" + response)  
                      }
                    },
                    error: function(error) {
                      if(error == 'error' && error != null ){
                        console.warn("Err in getting friend!" + error)               
                      }
                    }
                  })
                  
                }
                checkFriend()
              // check friend
              
            }
          }
        }
      }

    }
    // following

    // family members
    async function showFamilyMembers(){

      friendsFollowerRequestsMainbody.innerHTML = '' // rest old data

      navButtonDelay()

      document.querySelector('#seeFamilyMemberstButton').style.color = 'rgb(6, 220, 31)'
      document.querySelector('#seeFamilyMemberstButton').style.cursor = 'progress'





      // sub nav
        const createSubNav = document.createElement('nav')
        createSubNav.setAttribute('class', 'familyMemberSubNav')
        friendsFollowerRequestsMainbody.appendChild( createSubNav )

        const subNavContainer = document.createElement('div')
        subNavContainer.setAttribute('class', ' familyMemberSubNav-container')
        createSubNav.appendChild( subNavContainer )

        const subNavNewFamilyMemberButton = document.createElement('div')
        subNavNewFamilyMemberButton.setAttribute('class', 'familyMemberSubNavButton familyMemberSubNavButton-newFamilyMemberButton')
        subNavNewFamilyMemberButton.setAttribute('id', ' familyMemberSubNav-newFamilyMemberButton')
        subNavNewFamilyMemberButton.innerText = 'Add New Close Person'
        subNavContainer.appendChild( subNavNewFamilyMemberButton )

        const subNavSentRequestButton = document.createElement('div')
        subNavSentRequestButton.setAttribute('class', 'familyMemberSubNavButton familyMemberSubNavButton-sentRequestButton')
        subNavSentRequestButton.setAttribute('id', 'familyMemberSubNavButton-sentRequestButton')
        subNavSentRequestButton.innerText = 'Sent Close Person Request'
        subNavContainer.appendChild( subNavSentRequestButton )

        const subNavReceiveRequestButton = document.createElement('div')
        subNavReceiveRequestButton.setAttribute('class', 'familyMemberSubNavButton familyMemberSubNavButton-receiveRequestButton')
        subNavReceiveRequestButton.setAttribute('id', 'familyMemberSubNavButton-receiveRequestButton')
        subNavReceiveRequestButton.innerText = 'Receive Close Person Request'
        subNavContainer.appendChild( subNavReceiveRequestButton )

        const subNavFamilyMembersButton = document.createElement('div')
        subNavFamilyMembersButton.setAttribute('class', 'familyMemberSubNavButton familyMemberSubNavButton-familyMembersButton')
        subNavFamilyMembersButton.setAttribute('id', 'familyMemberSubNavButton-familyMembersButton')
        subNavFamilyMembersButton.innerText = 'Your Close Persons'
        subNavContainer.appendChild( subNavFamilyMembersButton )
      // sub nav



      // sub container
        const createContainer = document.createElement('div')
        createContainer.setAttribute('class', 'closePersonsSubHolder')
        friendsFollowerRequestsMainbody.appendChild( createContainer )
      // sub container


      // deactive other button for 2 s
      function subNavButtonDelay(){
        subNavNewFamilyMemberButton.onclick = ''
        subNavNewFamilyMemberButton.style.color = 'inherit'
        subNavSentRequestButton.onclick = ''
        subNavSentRequestButton.style.color = 'inherit'
        subNavReceiveRequestButton.onclick = ''
        subNavReceiveRequestButton.style.color = 'inherit'
        subNavFamilyMembersButton.onclick = ''
        subNavFamilyMembersButton.style.color = 'inherit'
          // activate again
          setTimeout(()=>{
            subNavNewFamilyMemberButton.onclick = addNewClosePersons
            subNavNewFamilyMemberButton.style.cursor = 'pointer'
            subNavSentRequestButton.onclick = closePersonSentRequest
            subNavSentRequestButton.style.cursor = 'pointer'
            subNavReceiveRequestButton.onclick = closePersonReceiveRequest
            subNavReceiveRequestButton.style.cursor = 'pointer'
            subNavFamilyMembersButton.onclick = closePersonsList
            subNavFamilyMembersButton.style.cursor = 'pointer'
          }, 4000)
      }
      subNavButtonDelay()
      // deactive other button for 2 s




      // object friendly email - myid
        const escapeAtTheRate_myid = myId.replaceAll('@',"_")
        const escapedDot_myid = escapeAtTheRate_myid.replaceAll('.',"_")
      // object friendly email - myid


      // add new
      async function addNewClosePersons(){

        // sub nav button active
          subNavButtonDelay()

          subNavNewFamilyMemberButton.style.color = 'rgb(6, 220, 31)'
          subNavNewFamilyMemberButton.style.cursor = 'progress'
        // sub nav button active

        createContainer.innerHTML = '' // reset old data


      // add form and result        
        const addFamilyMemberTitle = document.createElement('h2')
        addFamilyMemberTitle.setAttribute('class', 'addFamilyMemberTitle')
        addFamilyMemberTitle.innerHTML = '<span>Add Your Close Persons.</span>'
        createContainer.appendChild( addFamilyMemberTitle )

        const formContainer = document.createElement('div')
        formContainer.setAttribute('class', 'addFamilyMemberFormContainer')
        createContainer.appendChild( formContainer )

        const formLevel = document.createElement('p')
        formLevel.setAttribute('class', 'addFamilyMemberFormLevel')
        formLevel.innerText = 'Write down the person\'s id among your friends only.'
        formContainer.appendChild( formLevel )

        const formInput = document.createElement('input')
        formInput.setAttribute('type', 'email')
        formInput.setAttribute('class', 'addFamilyMemberFormInput')
        formInput.setAttribute('id', 'addFamilyMemberFormInput')
        formInput.setAttribute('placeholder', 'type any friend\'s id who is alredy your friend.')
        formContainer.appendChild( formInput )

        // formInput width
          const spareWidth = formContainer.offsetWidth - 60
          formInput.style.width = spareWidth + 'px'
        // formInput width

        const formSubmit = document.createElement('button')
        formSubmit.setAttribute('class', 'addFamilyMemberFormSubmit')
        formSubmit.innerHTML = '<span class="material-icons-outlined">person_search</span>'
        formContainer.appendChild( formSubmit )

        const clearFloat = document.createElement('div')
        clearFloat.setAttribute('class', 'addFamilyMemberFormClearFloat')
        formContainer.appendChild( clearFloat )


        const outputContainer = document.createElement('div')
        outputContainer.setAttribute('class', 'addFamilyMemberFormOutput')
        createContainer.appendChild( outputContainer )
      // add form and result

      // form output - search in friends
        document.querySelector('.addFamilyMemberFormSubmit').onclick = async ()=>{
          // send to db
          $.ajax({
            url: '/mongoJs/main/getAmongFriends', // Replace with your server endpoint
            type: 'POST',
            data: {
              my_id: myId,
              form_input : DOMPurify.sanitize( formInput.value ) 
            },
            success: function(response) {
              if(response == 'error' && response != null ){
                console.warn("Error in getting among friends!" + response)  
              
              } else if(response == 'not friend' && response != null){
                console.warn("Not friend. Checking successful!")
              } else{
                console.warn("successfully get among friends!")
              
                showClosePersonSearchResult(response)        
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Err in getting among friends!" + error)               
              }
            }
          })
          // send to db

          

          

          function showClosePersonSearchResult(DATA) { 

            outputContainer.innerHTML = '' // reset old data

            for (let i = 0; i < DATA.length; i++) {            

            // show searched id
              const perProfileBar = document.createElement('div')
              perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBar-addFamilyMember' )
              perProfileBar.setAttribute('id', `addFamilyMemberProfileBar_${ DATA[i].key.id }`)
              outputContainer.appendChild( perProfileBar )

            
              const perProfileBarHolder = document.createElement('div')
              perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
              perProfileBarHolder.setAttribute('id', 'addFamilyMemberProfileBar-imageHolder-' + DATA[i].key.id )
              perProfileBar.appendChild( perProfileBarHolder )

              const perProfileBarImg = document.createElement('img')
              perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
              perProfileBarImg.setAttribute('id', 'addFamilyMemberProfileBar-img-' + DATA[i].key.id )
              perProfileBarHolder.appendChild( perProfileBarImg )
              perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

              const perProfileBarContent = document.createElement('div')
              perProfileBarContent.setAttribute('class', 'profilesSingelBar-content profilesSingelBar-addFamilyMemberContent')
              perProfileBarContent.setAttribute('id', 'addFamilyMemberProfileBar-content-' + DATA[i].key.id )
              perProfileBar.appendChild( perProfileBarContent )

              const perProfileBarContentName = document.createElement('div')
              perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName profileSingleBar-addFamilyMember-contentName')
              perProfileBarContentName.setAttribute('id', 'addFamilyMemberProfileBar-contentName-' + DATA[i].key.id )
              perProfileBarContent.appendChild( perProfileBarContentName )

              const perProfileBarContentControl = document.createElement('div')
              perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl profilesSingelBar-contentControl-addFamilyMember')
              perProfileBarContentControl.setAttribute('id', 'addFamilyMemberProfileBar-contentControl-' + DATA[i].key.id )
              perProfileBarContent.appendChild( perProfileBarContentControl )

              const addRelation = document.createElement('input')
              addRelation.setAttribute('class', 'profilesSingelBar-addRelationField')
              addRelation.setAttribute('id', 'profilesSingelBar-addRelationField-' + DATA[i].key.id )
              addRelation.setAttribute('placeholder', 'Write relation here.')
              perProfileBarContentControl.appendChild( addRelation )

                const relation_button_container = document.createElement('div')
                relation_button_container.setAttribute('class', 'closePersons-button-container')
                perProfileBarContentControl.appendChild( relation_button_container )

                  const addRelationButton = document.createElement('button')
                  addRelationButton.setAttribute('class', 'profilesSingelBar-addRelationButton profilesSingelBar-addRelationButton-closePersonSendRequest')
                  addRelationButton.setAttribute('id', 'profilesSingelBar-addRelationButton-' + DATA[i].key.id )
                  addRelationButton.innerText = 'Send request'
                  relation_button_container.appendChild( addRelationButton )

                  const rejectRelationButton = document.createElement('button')
                  rejectRelationButton.setAttribute('class', 'profilesSingelBar-addRelationButton profilesSingelBar-addRelationButton-closePersonRejectRequest')
                  rejectRelationButton.setAttribute('id', 'profilesSingelBar-deleteRelationButton-' + DATA[i].key.id )
                  rejectRelationButton.innerText = 'Cancel'
                  relation_button_container.appendChild( rejectRelationButton )

              // set relation field width
              function setFieldWidth(){
                const getFreeSpace = perProfileBarContentControl.offsetWidth - relation_button_container.offsetWidth
                const reduceFreeSpace = getFreeSpace - 15
                addRelation.style.width = reduceFreeSpace + 'px'
              }
              setFieldWidth()
              // set relation field width



                const peerId = DATA[i].key.id


                // retrive and put data in db
                  // name
                  perProfileBarContentName.innerText = DATA[i].profileInfo.name.fullName
                
                  // pic   
                    if ( DATA[i].profileInfo.profilePics.active != 'null') {           
                      perProfileBarImg.src = DATA[i].profileInfo.profilePics.active  
                    }              
                  // pic
                // retrive and put data in db


                



                // check status
                    function checkStatus() {
                      // Send AJAX request to Node.js server
                      $(document).ready(function(){
                        $.ajax({
                          url: '/mongoJs/main/requestStatus', // Replace with your server endpoint
                          type: 'POST',
                          data: {
                            peer_id: peerId, 
                            my_id: myId,
                          },
                          success: async function(response) {
                            if(response.status == 'sent request' && response != null ){
                              console.warn("sent request!")
                  
                              // reset
                                addRelationButton.innerText = 'Cancel'
                                addRelationButton.onclick = cancelRequest 

                                rejectRelationButton.style.display = 'none'

                                addRelation.value = response.data

                                setFieldWidth()
                              // reset
            
                            } else if(response.status == 'receive request' && response != null){
                              console.warn("receive request!")

                              // reset
                                addRelationButton.innerText = 'Accept'
                                addRelationButton.onclick = acceptClosePerson 

                                rejectRelationButton.style.display = 'inline-block'
                                rejectRelationButton.innerText = 'Cancel'
                                rejectRelationButton.onclick = rejectRequest
                                
                                addRelation.value = response.data

                                setFieldWidth()
                              // reset
                
                            } else if( response.status == 'familiar' && response != null){
                              console.warn("familiar!")

                              // reset
                                addRelationButton.innerText = 'Delete'
                                addRelationButton.onclick = deleteClosePerson 

                                rejectRelationButton.style.display = 'none'

                                addRelation.value = response.data

                                setFieldWidth()
                              // reset

                            } else if(response.status == 'not familiar' && response != null){
                              console.log('not familiar')


                              // reset
                                addRelationButton.innerText = 'Send request'
                                addRelationButton.onclick = sendRequest 

                                rejectRelationButton.style.display = 'none'

                                // addRelation.value = ''

                                setFieldWidth()
                              // reset

                            } else{
                              console.warn("Error in checking status!" + response)
                            }
                          },
                          error: function(error) {
                            if(error == 'error' && error != null ){
                              console.warn("Error in checking status!" + error) 
                            }
                          }
                        })
                      })
                    }
                    checkStatus()
                // check status



                // updates of close persons status
                  function updateClosePersonStatus(){
                    updatesOfClosePersonsStatus_main = setInterval(()=>{    

                      checkStatus()      

                    }, 8000)
                  }   
                  updateClosePersonStatus()   
                // updates of close persons status

              
               
                  
                // send close person relation request
                  function sendRequest() {

                    clearInterval(updatesOfClosePersonsStatus_main)
                    addRelationButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'



                    $.ajax({
                      url: '/mongoJs/main/closePersonSendRequest', // Replace with your server endpoint
                      type: 'PUT',
                      data: {
                        my_id: myId,
                        peer_id : peerId,
                        relation : DOMPurify.sanitize( addRelation.value )
                      },
                      success: function(response) {
                        if(response != 'error' && response != null ){
                          console.warn("successfully send close persons request!") 

                          updateClosePersonStatus()
                        
                        } else{
                          console.warn("Error in sending close persons request!" + response)
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in sending close persons request!" + error)               
                        }
                      }
                    })
                  }
                // send close person relation request


                // cancel request
                  function cancelRequest(){
                    clearInterval(updatesOfClosePersonsStatus_main)
                    addRelationButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'



                    $.ajax({
                      url: '/mongoJs/main/closePersonCancelRequest', // Replace with your server endpoint
                      type: 'PUT',
                      data: {
                        my_id: myId,
                        peer_id : peerId
                      },
                      success: function(response) {
                        if(response != 'error' && response != null ){
                          console.warn("successfully cancel close persons request!") 

                          updateClosePersonStatus()
                        
                        } else{
                          console.warn("Error in canceling close persons request!" + response)
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in canceling close persons request!" + error)               
                        }
                      }
                    })
                  }
                // cancel request


                // reject request
                  function rejectRequest(){
                    clearInterval(updatesOfClosePersonsStatus_main)
                    addRelationButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
                    rejectRelationButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'



                    $.ajax({
                      url: '/mongoJs/main/closePersonRejectRequest', // Replace with your server endpoint
                      type: 'PUT',
                      data: {
                        my_id: myId,
                        peer_id : peerId
                      },
                      success: function(response) {
                        if(response != 'error' && response != null ){
                          console.warn("successfully reject close persons request!") 

                          updateClosePersonStatus()
                        
                        } else{
                          console.warn("Error in rejecting close persons request!" + response)
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in rejecting close persons request!" + error)               
                        }
                      }
                    })
                  }
                // reject request



                // delete
                  function deleteClosePerson(){
                    clearInterval(updatesOfClosePersonsStatus_main)
                    addRelationButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'



                    $.ajax({
                      url: '/mongoJs/main/closePersonDeleteRequest', // Replace with your server endpoint
                      type: 'PUT',
                      data: {
                        my_id: myId,
                        peer_id : peerId
                      },
                      success: function(response) {
                        if(response != 'error' && response != null ){
                          console.warn("successfully delete close persons request!") 

                          updateClosePersonStatus()
                        
                        } else{
                          console.warn("Error in deleting close persons request!" + response)
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in deleting close persons request!" + error)               
                        }
                      }
                    })
                  }
                // delete

                // accept
                  function acceptClosePerson(){
                    clearInterval(updatesOfClosePersonsStatus_main)
                    addRelationButton.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
                    rejectRelationButton.style.display = 'none'



                    $.ajax({
                      url: '/mongoJs/main/closePersonAcceptRequest', // Replace with your server endpoint
                      type: 'PUT',
                      data: {
                        my_id: myId,
                        peer_id : peerId
                      },
                      success: function(response) {
                        if(response != 'error' && response != null ){
                          console.warn("successfully accept close persons request!") 

                          updateClosePersonStatus()
                        
                        } else{
                          console.warn("Error in accepting close persons request!" + response)
                        }
                      },
                      error: function(error) {
                        if(error == 'error' && error != null ){
                          console.warn("Err in accepting close persons request!" + error)               
                        }
                      }
                    })
                  }
                // accept
              

            // show searched id
            }
          }
        }
      // form output - search in friends
      }
      addNewClosePersons() // show on load default wizard
      // add new


      // sent request
      async function closePersonSentRequest(){

        // sub nav button active
          subNavButtonDelay()

          subNavSentRequestButton.style.color = 'rgb(6, 220, 31)'
          subNavSentRequestButton.style.cursor = 'progress'
        // sub nav button active

        createContainer.innerHTML = '' // reset old data


        // total length and currently showing number
          const paginationSection = document.createElement('div')
          paginationSection.setAttribute('class', 'profilesSingelBar-paginationSection' )
          paginationSection.setAttribute('id', `profilesSingelBar-paginationSection_closePersonsSentRequest`)
          createContainer.appendChild( paginationSection )
      
          const currentlyShowing = document.createElement('span')
          currentlyShowing.setAttribute('class', 'profilesSingelBar-currentlyShowing' )
          currentlyShowing.setAttribute('id', `profilesSingelBar-currentlyShowing_closePersonsSentRequest`)
          currentlyShowing.innerHTML = 'Showing <span>0</span>'
          paginationSection.appendChild( currentlyShowing )
      
          const totalNumber = document.createElement('span')
          totalNumber.setAttribute('class', 'profilesSingelBar-totalNumber' )
          totalNumber.setAttribute('id', `profilesSingelBar-totalNumber_closePersonsSentRequest`)
          totalNumber.innerHTML = ' out of <span>0</span>'
          paginationSection.appendChild( totalNumber )
        // total length and currently showing number

        
        
        const docSnap = await getDoc( doc(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'sendRequests', 'send') );

        if (docSnap.exists()) {

          let loopEnd = 0
          let friend_i = 1 // started from 1 because 0 = ''

          function loopManager(){
            loopEnd = loopEnd + 2 // 2 is the number how many friends will be shown at a time

            if( docSnap.data().sendList.length > loopEnd ){
              showPerProfileBarThroughLoop()
            } else {
              loopEnd = docSnap.data().sendList.length
              showPerProfileBarThroughLoop()
            }


            // pagination section
              if( docSnap.data().sendList.length > 1){ // bcz in list there [0] = ''
                document.querySelector('#profilesSingelBar-currentlyShowing_closePersonsSentRequest span').innerText = loopEnd
                document.querySelector('#profilesSingelBar-totalNumber_closePersonsSentRequest span').innerText = docSnap.data().sendList.length
              }
            // pagination section
          }
          loopManager()

        
        

          async function showPerProfileBarThroughLoop(){
            for (; friend_i < loopEnd; friend_i++) {

            
              // show profiles
                const perProfileBar = document.createElement('div')
                perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBar-closePerson' )
                perProfileBar.setAttribute('id', `addFamilyMemberProfileBar_${ docSnap.data().sendList[friend_i] }`)
                createContainer.appendChild( perProfileBar )

          
                const perProfileBarHolder = document.createElement('div')
                perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
                perProfileBarHolder.setAttribute('id', 'addFamilyMemberProfileBar-imageHolder-' + docSnap.data().sendList[friend_i] )
                perProfileBar.appendChild( perProfileBarHolder )

                const perProfileBarImg = document.createElement('img')
                perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
                perProfileBarImg.setAttribute('id', 'addFamilyMemberProfileBar-img-' + docSnap.data().sendList[friend_i] )
                perProfileBarHolder.appendChild( perProfileBarImg )
                perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

                const perProfileBarContent = document.createElement('div')
                perProfileBarContent.setAttribute('class', 'profilesSingelBar-content profilesSingelBar-closePersonContent')
                perProfileBarContent.setAttribute('id', 'addFamilyMemberProfileBar-content-' + docSnap.data().sendList[friend_i] )
                perProfileBar.appendChild( perProfileBarContent )

                const perProfileBarContentName = document.createElement('div')
                perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
                perProfileBarContentName.setAttribute('id', 'addFamilyMemberProfileBar-contentName-' + docSnap.data().sendList[friend_i] )
                perProfileBarContent.appendChild( perProfileBarContentName )

                const perProfileBarContentControl = document.createElement('div')
                perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl profilesSingelBar-contentControl-addFamilyMember')
                perProfileBarContentControl.setAttribute('id', 'addFamilyMemberProfileBar-contentControl-' + docSnap.data().sendList[friend_i] )
                perProfileBarContent.appendChild( perProfileBarContentControl )

                const addRelation = document.createElement('input')
                addRelation.setAttribute('class', 'profilesSingelBar-addRelationField')
                addRelation.setAttribute('id', 'profilesSingelBar-addRelationField-' + docSnap.data().sendList[friend_i] )
                addRelation.setAttribute('placeholder', 'Write relation here.')
                perProfileBarContentControl.appendChild( addRelation )

                const addRelationButton = document.createElement('button')
                addRelationButton.setAttribute('class', 'profilesSingelBar-addRelationButton')
                addRelationButton.setAttribute('id', 'profilesSingelBar-addRelationButton-' + docSnap.data().sendList[friend_i] )
                addRelationButton.innerText = 'Sent Pending ( Close )'
                perProfileBarContentControl.appendChild( addRelationButton )

                
                // set relation field width
                function setFieldWidth(){

                  // resize control container
                  const spareWideHolder = perProfileBar.offsetWidth - 65
                  perProfileBarContent.style.width = spareWideHolder + 'px'
                  // resize control container

                  const getFreeSpace = perProfileBarContentControl.offsetWidth - addRelationButton.offsetWidth
                  const reduceFreeSpace = getFreeSpace - 10
                  addRelation.style.width = reduceFreeSpace + 'px'
                }
                setFieldWidth()
                // set relation field width


                const peerId = docSnap.data().sendList[friend_i]



                // retrive and put data in db
                  const getProfileData = await getDoc( doc(db, "Moments", peerId, "profileInfo", "credentials") );
                  // name
                  perProfileBarContentName.innerText = getProfileData.data().name.fullName

                  // pic
                  const perProfilePicName = query(collection(db, "Moments", docSnap.data().sendList[friend_i], "profilePictures"), where('active', '==', true));

                  const showProfilePicName = await getDocs( perProfilePicName );
                  showProfilePicName.forEach((doc3) => {
             
                    const storesRef = ref(storage, doc3.data().title)
                    getDownloadURL(storesRef)
                    .then((url) => {
                      // Insert url into an <img> tag to "download"
                      perProfileBarImg.src = url
                    })              
                  })
                  // pic

            

                  

                  // object friendly email
                    const escapeAtTheRate = peerId.replaceAll('@',"_")
                    const escapedDot = escapeAtTheRate.replaceAll('.',"_")
                  // object friendly email

              

                  
                  // check send request
                    const checkChangeClosePersonRequest = query(collection(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'sendRequests'));
                    const unsubCheckChangeClosePersonRequest = onSnapshot( checkChangeClosePersonRequest, (querySnapshot) => {
                      querySnapshot.forEach(async (doc) => {

                                          
                        const checkClosePersonRequest = query(collection(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'sendRequests'), where("sendList", "array-contains", peerId ));

                        const getClosePersonRequest = await getDocs( checkClosePersonRequest );
                        getClosePersonRequest.forEach((docs) => {
                          addRelationButton.onclick = cancelRequest

                          addRelation.value = docs.data().sendRelation[escapedDot]
                        })

                      })
                    })
                  // check send request

                  // cancel request
                    async function cancelRequest(){

                      perProfileBar.style.visibility = 'hidden'
                  
                      await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'sendRequests', 'send'), {
                        sendList: arrayRemove ( peerId ),
                        sendRelation: {
                          [escapedDot]: deleteField()
                        }
                      },
                      { merge: true })

                      await setDoc(doc(db, "Moments", peerId, 'friendsAndFollowers', 'closePersons', 'receiveRequests', 'receive'), {
                        receiveList: arrayRemove ( myId ),
                        receiveRelation: {
                          [escapedDot]: deleteField()
                        }
                      },
                      { merge: true })
                    }
                  // cancel request              
              
                // retrive and put data in db

              // show searched id

              // mouse over on last 3 element
              if( friend_i + 2 == loopEnd || friend_i + 1 == loopEnd ){
                document.getElementById( 'addFamilyMemberProfileBar_' + docSnap.data().sendList[friend_i] ).addEventListener("mouseover", hoverOver) 
    
                function hoverOver(){
      
                  this.removeEventListener("mouseover", hoverOver)
                  this.style.cursor = "wait"

                  setTimeout(()=>{
                    this.style.cursor = "default"
                    loopManager()  
                  }, 2000)
               
                }
              }
              // mouse over on last 3 element
            }
          }

        }
      }
      // sent request

      // receive request
      async function closePersonReceiveRequest(){

        // sub nav button active
          subNavButtonDelay()

          subNavReceiveRequestButton.style.color = 'rgb(6, 220, 31)'
          subNavReceiveRequestButton.style.cursor = 'progress'
        // sub nav button active

        createContainer.innerHTML = '' // reset old data



        // total length and currently showing number
          const paginationSection = document.createElement('div')
          paginationSection.setAttribute('class', 'profilesSingelBar-paginationSection' )
          paginationSection.setAttribute('id', `profilesSingelBar-paginationSection_closePersonsReceiveRequest`)
          createContainer.appendChild( paginationSection )
    
          const currentlyShowing = document.createElement('span')
          currentlyShowing.setAttribute('class', 'profilesSingelBar-currentlyShowing' )
          currentlyShowing.setAttribute('id', `profilesSingelBar-currentlyShowing_closePersonsReceiveRequest`)
          currentlyShowing.innerHTML = 'Showing <span>0</span>'
          paginationSection.appendChild( currentlyShowing )
    
          const totalNumber = document.createElement('span')
          totalNumber.setAttribute('class', 'profilesSingelBar-totalNumber' )
          totalNumber.setAttribute('id', `profilesSingelBar-totalNumber_closePersonsReceiveRequest`)
          totalNumber.innerHTML = ' out of <span>0</span>'
          paginationSection.appendChild( totalNumber )
        // total length and currently showing number


        
        const docSnap = await getDoc( doc(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'receiveRequests', 'receive') );

        if (docSnap.exists()) { 

          let loopEnd = 0
          let friend_i = 0

          function loopManager(){
            loopEnd = loopEnd + 2 // 2 is the number how many friends will be shown at a time

            if( docSnap.data().receiveList.length > loopEnd ){
              showPerProfileBarThroughLoop()
            } else {
              loopEnd = docSnap.data().receiveList.length
              showPerProfileBarThroughLoop()
            }


            // pagination section
              document.querySelector('#profilesSingelBar-currentlyShowing_closePersonsReceiveRequest span').innerText = loopEnd
              document.querySelector('#profilesSingelBar-totalNumber_closePersonsReceiveRequest span').innerText = docSnap.data().closePersonsList.length
            // pagination section
          }
          loopManager()

        
        

          async function showPerProfileBarThroughLoop(){
            for (; friend_i < loopEnd; friend_i++) {

            
              // show profiles
                const perProfileBar = document.createElement('div')
                perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBar-closePerson' )
                perProfileBar.setAttribute('id', `addFamilyMemberProfileBar_${ docSnap.data().receiveList[friend_i] }`)
                createContainer.appendChild( perProfileBar )

          
                const perProfileBarHolder = document.createElement('div')
                perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
                perProfileBarHolder.setAttribute('id', 'addFamilyMemberProfileBar-imageHolder-' + docSnap.data().receiveList[friend_i] )
                perProfileBar.appendChild( perProfileBarHolder )

                const perProfileBarImg = document.createElement('img')
                perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
                perProfileBarImg.setAttribute('id', 'addFamilyMemberProfileBar-img-' + docSnap.data().receiveList[friend_i] )
                perProfileBarHolder.appendChild( perProfileBarImg )
                perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

                const perProfileBarContent = document.createElement('div')
                perProfileBarContent.setAttribute('class', 'profilesSingelBar-content profilesSingelBar-closePersonContent')
                perProfileBarContent.setAttribute('id', 'addFamilyMemberProfileBar-content-' + docSnap.data().receiveList[friend_i] )
                perProfileBar.appendChild( perProfileBarContent )

                const perProfileBarContentName = document.createElement('div')
                perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
                perProfileBarContentName.setAttribute('id', 'addFamilyMemberProfileBar-contentName-' + docSnap.data().receiveList[friend_i] )
                perProfileBarContent.appendChild( perProfileBarContentName )

                const perProfileBarContentControl = document.createElement('div')
                perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl profilesSingelBar-contentControl-addFamilyMember')
                perProfileBarContentControl.setAttribute('id', 'addFamilyMemberProfileBar-contentControl-' + docSnap.data().receiveList[friend_i] )
                perProfileBarContent.appendChild( perProfileBarContentControl )

                const addRelation = document.createElement('input')
                addRelation.setAttribute('class', 'profilesSingelBar-addRelationField')
                addRelation.setAttribute('id', 'profilesSingelBar-addRelationField-' + docSnap.data().receiveList[friend_i] )
                addRelation.setAttribute('placeholder', 'Write relation here.')
                perProfileBarContentControl.appendChild( addRelation )

                const addRelationButton = document.createElement('button')
                addRelationButton.setAttribute('class', 'profilesSingelBar-addRelationButton')
                addRelationButton.setAttribute('id', 'profilesSingelBar-addRelationButton-' + docSnap.data().receiveList[friend_i] )
                addRelationButton.innerText = 'Receive Pending ( Cancel )'
                perProfileBarContentControl.appendChild( addRelationButton )

                
                // set relation field width
                function setFieldWidth(){

                  // resize control container
                  const spareWideHolder = perProfileBar.offsetWidth - 65
                  perProfileBarContent.style.width = spareWideHolder + 'px'
                  // resize control container

                  const getFreeSpace = perProfileBarContentControl.offsetWidth - addRelationButton.offsetWidth
                  const reduceFreeSpace = getFreeSpace - 10
                  addRelation.style.width = reduceFreeSpace + 'px'
                }
                setFieldWidth()
                // set relation field width


                // retrive and put data in db
                  const getProfileData = await getDoc( doc(db, "Moments", docSnap.data().receiveList[friend_i], "profileInfo", "credentials") );
                  // name
                  perProfileBarContentName.innerText = getProfileData.data().name.fullName

                  // pic
                  const perProfilePicName = query(collection(db, "Moments", docSnap.data().receiveList[friend_i], "profilePictures"), where('active', '==', true));

                  const showProfilePicName = await getDocs( perProfilePicName );
                  showProfilePicName.forEach((doc3) => {
             
                    const storesRef = ref(storage, doc3.data().title)
                    getDownloadURL(storesRef)
                    .then((url) => {
                      // Insert url into an <img> tag to "download"
                      perProfileBarImg.src = url
                    })              
                  })
                  // pic

            

                  const peerId = docSnap.data().receiveList[friend_i]

                  // object friendly email
                    const escapeAtTheRate = peerId.replaceAll('@',"_")
                    const escapedDot = escapeAtTheRate.replaceAll('.',"_")
                  // object friendly email

              

              
                  // check send request
                    const checkChangeClosePersonRequest = query(collection(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'receiveRequests'));
                    const unsubCheckChangeClosePersonRequest = onSnapshot( checkChangeClosePersonRequest, (querySnapshot) => {
                      querySnapshot.forEach(async (doc) => {

                                          
                        const checkClosePersonRequest = query(collection(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'receiveRequests'), where("receiveList", "array-contains", peerId ));

                        const getClosePersonRequest = await getDocs( checkClosePersonRequest );
                        getClosePersonRequest.forEach((docs) => {
                          addRelationButton.onclick = receiveRequest

                          addRelation.value = docs.data().receiveRelation[escapedDot]
                        })

                      })
                    })
                  // check send request

                  // receive request
                    async function receiveRequest(){

                      perProfileBar.style.visibility = 'hidden'

                      // delete

                      await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'receiveRequests', 'receive'), {
                        receiveList: arrayRemove ( peerId ),
                        receiveRelation: {
                          [escapedDot]: deleteField()
                        }
                      },
                      { merge: true })

                      await setDoc(doc(db, "Moments", peerId, 'friendsAndFollowers', 'closePersons', 'sendRequests', 'send'), {
                        sendList: arrayRemove ( myId ),
                        sendRelation: {
                          [escapedDot]: deleteField()
                        }
                      },
                      { merge: true })

                      // delete

                      await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'familiar', 'allPersons'), {
                        closePersonsList: arrayUnion ( peerId ),
                        closePersonsRelation: {
                          [escapedDot]: DOMPurify.sanitize( addRelation.value )
                        }
                      },
                      {merge: true })
                      
                      await setDoc(doc(db, "Moments", peerId, 'friendsAndFollowers', 'closePersons', 'familiar', 'allPersons'), {
                        closePersonsList: arrayUnion ( myId ),
                        closePersonsRelation: {
                          [escapedDot_myid]: DOMPurify.sanitize( addRelation.value )
                        }
                      },
                      {merge: true }) 

                    }
                  // receive request           
              
                // retrive and put data in db

              // show searched id

              // mouse over on last 3 element
                if( friend_i + 2 == loopEnd || friend_i + 1 == loopEnd ){
                  document.getElementById( 'addFamilyMemberProfileBar_' + docSnap.data().receiveList[friend_i] ).addEventListener("mouseover", hoverOver) 
    
                  function hoverOver(){
      
                    this.removeEventListener("mouseover", hoverOver)
                    this.style.cursor = "wait"

                    setTimeout(()=>{
                      this.style.cursor = "default"
                      loopManager()  
                    }, 2000)
               
                  }
                }
              // mouse over on last 3 element
            }
          }

        }
      }
      // receive request

      // close persons list
      async function closePersonsList(){

        // sub nav button active
          subNavButtonDelay()

          subNavFamilyMembersButton.style.color = 'rgb(6, 220, 31)'
          subNavFamilyMembersButton.style.cursor = 'progress'
        // sub nav button active

        createContainer.innerHTML = '' // reset old data



        // total length and currently showing number
          const paginationSection = document.createElement('div')
          paginationSection.setAttribute('class', 'profilesSingelBar-paginationSection' )
          paginationSection.setAttribute('id', `profilesSingelBar-paginationSection_allClosePersons`)
          createContainer.appendChild( paginationSection )

          const currentlyShowing = document.createElement('span')
          currentlyShowing.setAttribute('class', 'profilesSingelBar-currentlyShowing' )
          currentlyShowing.setAttribute('id', `profilesSingelBar-currentlyShowing_allClosePersons`)
          currentlyShowing.innerHTML = 'Showing <span>0</span>'
          paginationSection.appendChild( currentlyShowing )

          const totalNumber = document.createElement('span')
          totalNumber.setAttribute('class', 'profilesSingelBar-totalNumber' )
          totalNumber.setAttribute('id', `profilesSingelBar-totalNumber_allClosePersons`)
          totalNumber.innerHTML = ' out of <span>0</span>'
          paginationSection.appendChild( totalNumber )
        // total length and currently showing number


        
        const docSnap = await getDoc( doc(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'familiar', 'allPersons') );

        if (docSnap.exists()) { 

          let loopEnd = 0
          let friend_i = 0

          function loopManager(){
            loopEnd = loopEnd + 2 // 2 is the number how many friends will be shown at a time

            if( docSnap.data().closePersonsList.length > loopEnd ){
              showPerProfileBarThroughLoop()
            } else {
              loopEnd = docSnap.data().closePersonsList.length
              showPerProfileBarThroughLoop()
            }


            // pagination section
              document.querySelector('#profilesSingelBar-currentlyShowing_allClosePersons span').innerText = loopEnd
              document.querySelector('#profilesSingelBar-totalNumber_allClosePersons span').innerText = docSnap.data().closePersonsList.length
            // pagination section
          }
          loopManager()

        
        

          async function showPerProfileBarThroughLoop(){
            for (; friend_i < loopEnd; friend_i++) {

            
              // show profiles
                const perProfileBar = document.createElement('div')
                perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBar-closePerson' )
                perProfileBar.setAttribute('id', `addFamilyMemberProfileBar_${ docSnap.data().closePersonsList[friend_i] }`)
                createContainer.appendChild( perProfileBar )

          
                const perProfileBarHolder = document.createElement('div')
                perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
                perProfileBarHolder.setAttribute('id', 'addFamilyMemberProfileBar-imageHolder-' + docSnap.data().closePersonsList[friend_i] )
                perProfileBar.appendChild( perProfileBarHolder )

                const perProfileBarImg = document.createElement('img')
                perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
                perProfileBarImg.setAttribute('id', 'addFamilyMemberProfileBar-img-' + docSnap.data().closePersonsList[friend_i] )
                perProfileBarHolder.appendChild( perProfileBarImg )
                perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

                const perProfileBarContent = document.createElement('div')
                perProfileBarContent.setAttribute('class', 'profilesSingelBar-content profilesSingelBar-closePersonContent')
                perProfileBarContent.setAttribute('id', 'addFamilyMemberProfileBar-content-' + docSnap.data().closePersonsList[friend_i] )
                perProfileBar.appendChild( perProfileBarContent )

                const perProfileBarContentName = document.createElement('div')
                perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
                perProfileBarContentName.setAttribute('id', 'addFamilyMemberProfileBar-contentName-' + docSnap.data().closePersonsList[friend_i] )
                perProfileBarContent.appendChild( perProfileBarContentName )

                const perProfileBarContentControl = document.createElement('div')
                perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl profilesSingelBar-contentControl-addFamilyMember')
                perProfileBarContentControl.setAttribute('id', 'addFamilyMemberProfileBar-contentControl-' + docSnap.data().closePersonsList[friend_i] )
                perProfileBarContent.appendChild( perProfileBarContentControl )

                const addRelation = document.createElement('span')
                addRelation.setAttribute('class', 'profilesSingelBar-addRelationField-span')
                addRelation.setAttribute('id', 'profilesSingelBar-addRelationField-' + docSnap.data().closePersonsList[friend_i] )
                perProfileBarContentControl.appendChild( addRelation )

                const addRelationButton = document.createElement('button')
                addRelationButton.setAttribute('class', 'profilesSingelBar-addRelationButton')
                addRelationButton.setAttribute('id', 'profilesSingelBar-addRelationButton-' + docSnap.data().closePersonsList[friend_i] )
                addRelationButton.innerText = 'Remove'
                perProfileBarContentControl.appendChild( addRelationButton )

                
                // set relation field width
                function setFieldWidth(){

                  // resize control container
                  const spareWideHolder = perProfileBar.offsetWidth - 65
                  perProfileBarContent.style.width = spareWideHolder + 'px'
                  // resize control container

                  const getFreeSpace = perProfileBarContentControl.offsetWidth - addRelationButton.offsetWidth
                  const reduceFreeSpace = getFreeSpace - 10
                  addRelation.style.width = reduceFreeSpace + 'px'
                }
                setFieldWidth()
                // set relation field width


                // retrive and put data in db
                  const getProfileData = await getDoc( doc(db, "Moments", docSnap.data().closePersonsList[friend_i], "profileInfo", "credentials") );
                  // name
                  perProfileBarContentName.innerText = getProfileData.data().name.fullName

                  // pic
                  const perProfilePicName = query(collection(db, "Moments", docSnap.data().closePersonsList[friend_i], "profilePictures"), where('active', '==', true));

                  const showProfilePicName = await getDocs( perProfilePicName );
                  showProfilePicName.forEach((doc3) => {
             
                    const storesRef = ref(storage, doc3.data().title)
                    getDownloadURL(storesRef)
                    .then((url) => {
                      // Insert url into an <img> tag to "download"
                      perProfileBarImg.src = url
                    })              
                  })
                  // pic

            

                  const peerId = docSnap.data().closePersonsList[friend_i]

                  // object friendly email
                    const escapeAtTheRate = peerId.replaceAll('@',"_")
                    const escapedDot = escapeAtTheRate.replaceAll('.',"_")
                  // object friendly email

              

              
                  // check send request
                    const checkChangeClosePersonRequest = query(collection(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'familiar'));
                    const unsubCheckChangeClosePersonRequest = onSnapshot( checkChangeClosePersonRequest, (querySnapshot) => {
                      querySnapshot.forEach(async (doc) => {

                                          
                        const checkClosePersonRequest = query(collection(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'familiar'), where("closePersonsList", "array-contains", peerId ));

                        const getClosePersonRequest = await getDocs( checkClosePersonRequest );
                        getClosePersonRequest.forEach((docs) => {
                          addRelationButton.onclick = removeClosePerson

                          addRelation.innerHTML =`<span>${docs.data().closePersonsRelation[escapedDot]} </span>`
                        })

                      })
                    })
                  // check send request

                  // remove close person
                    async function removeClosePerson(){

                      perProfileBar.style.visibility = 'hidden'

                      
                      await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'familiar', 'allPersons'), {
                        closePersonsList: arrayRemove ( peerId ),
                        closePersonsRelation: {
                          [escapedDot]: deleteField()
                        }
                      },
                      { merge: true })

                      await setDoc(doc(db, "Moments", peerId, 'friendsAndFollowers', 'closePersons', 'familiar', 'allPersons'), {
                        closePersonsList: arrayRemove ( myId ),
                        closePersonsRelation: {
                          [escapedDot_myid]: deleteField()
                        }
                      },
                      { merge: true })
                    }
                  // remove close person          
              
                // retrive and put data in db

              // show searched id

              // mouse over on last 3 element
                if( friend_i + 2 == loopEnd || friend_i + 1 == loopEnd ){
                  document.getElementById( 'addFamilyMemberProfileBar_' + docSnap.data().closePersonsList[friend_i] ).addEventListener("mouseover", hoverOver) 
    
                  function hoverOver(){
      
                    this.removeEventListener("mouseover", hoverOver)
                    this.style.cursor = "wait"

                    setTimeout(()=>{
                      this.style.cursor = "default"
                      loopManager()  
                    }, 2000)
               
                  }
                }
              // mouse over on last 3 element
            }
          }

        }
      }
      // close persons list





    }  
    // family members
  }
  // friends, requests and followers panel





  // active freind list buttion
    // on main.ejs
  // active freind list buttion



  // find people
    function findPeople(){
      const findPeoplePanel = document.getElementById( 'findPeoplePanel' )
      findPeopleButton.onclick = ()=>{
        findPeoplePanel.style.top = '55px'
        findPeoplePanel.style.opacity = 1

        isFindPeoplePanelDisplay = true
        resizeFindPeoplePanel() //height

        getPeopleFromDB()
      
      }
      // show personal and group sms in left side list


      // close panel
      document.getElementById( 'closeFindPeoplePanel' ).onclick = ()=>{
        findPeoplePanel.style.top = -100 + 'px'
        findPeoplePanel.style.height = 0
        findPeoplePanel.style.opacity = 0

        isFindPeoplePanelDisplay = false
      }
      // close panel




      

      const showingId = []
      let queryOn = []
      queryOn.push('public') // default search/suggest category
      
      
        if(profileFromMongoDB.birthPlace.postOffice != null){
          queryOn.push('birthPlace_postOffice')
        }
        if(profileFromMongoDB.birthPlace.subDistrict != null){
          queryOn.push('birthPlace_subDistrict')
        }
        if(profileFromMongoDB.birthPlace.village != null){
          queryOn.push('birthPlace_village')
        }

        if(profileFromMongoDB.livingPlace.postOffice != null){
          queryOn.push('livingPlace_postOffice')
        }
        if(profileFromMongoDB.livingPlace.subDistrict != null){
          queryOn.push('livingPlace_subDistrict')
        }
        if(profileFromMongoDB.livingPlace.village != null){
          queryOn.push('livingPlace_village')
        }

        if(profileFromMongoDB.profession != null){
          queryOn.push('profession')
        }

        if(profileFromMongoDB.education.elementary.institution != null){
          queryOn.push('education_elementary')
        }
        if(profileFromMongoDB.education.secondary.institution != null){
          queryOn.push('education_secondary')
        }
        if(profileFromMongoDB.education.higherSecondary.institution != null){
          queryOn.push('education_higherSecondary')
        }
        if(profileFromMongoDB.education.graduate.institution != null){
          queryOn.push('education_graduate')
        }
        if(profileFromMongoDB.education.postGraduate.institution != null){
          queryOn.push('education_postGraduate')
        }

        if(profileFromMongoDB.business.one.name != null){
          queryOn.push('business_one')
        }
        if(profileFromMongoDB.business.two.name != null){
          queryOn.push('business_two')
        }
        if(profileFromMongoDB.business.three.name != null){
          queryOn.push('business_three')
        }

        if(profileFromMongoDB.company.one.organization != null){
          queryOn.push('company_one')
        }
        if(profileFromMongoDB.company.two.organization != null){
          queryOn.push('company_two')
        }
        if(profileFromMongoDB.company.three.organization != null){
          queryOn.push('company_three')
        }

      console.log('query categories '+ queryOn)


      function getPeopleFromDB(){
        
        $.ajax({
          url: '/mongoJs/main/findPeople', // Replace with your server endpoint
          type: 'POST',
          data: {
            myId: myId,
            my_profileInfo: JSON.stringify( profileFromMongoDB ),
            showingId: JSON.stringify( showingId ),
            queryOn: JSON.stringify( queryOn )
          },
          success: function(response) {
            if(response == 'error' && response != null ){
              console.warn("Error in getting people in find people!" + response)  
            
            } else{
              console.warn("successfully get people in find people!")

              // update query category with excluded
                queryOn = JSON.parse( response.queryOn )
              // update query category with excluded

              const idToShow = JSON.parse( response.newIdToShow )
              // update id to show
                for (let i = 0; i < idToShow.length; i++) {
                  showingId.push( idToShow[i] )
                } 
              // update id to show

              console.warn('id to show ' + idToShow )
              console.warn('id to show length ' + idToShow.length )

              if( queryOn.length == 1 && idToShow.length == 0){

              }
            }
          },
          error: function(error) {
            if(error == 'error' && error != null ){
              console.warn("Err in getting people in find people!" + error)               
            }
          }
        })
      }
    }    
  // find people
// Header bar










// sub body left side navigator
  function subBodyLeftSideNavigator(){
    document.querySelector('#homeButton span').style.color = 'red'



    
    // Send AJAX request to Node.js server
    $.ajax({
        url: '/mongoJs/main/leftNav', // Replace with your server endpoint
        type: 'POST',
        data: {id: myId},
        success: async function(response) {
          if(response != 'error' && response != null){
              console.warn("left navigator loaded successfully!")


              for( let i = 0; i < response.length; i++){
                // update left hand side navigation panel
                  async function updateLeftHandSideNavigation(){
                    const idContainer = document.getElementById('profile-container')
  
         
                    const submit = document.createElement('button')
                    submit.setAttribute('id', 'button_' + response[i].key.id )
                    submit.innerText = `${response[i].profileInfo.name.firstName} ${response[i].profileInfo.name.lastName}`
                    idContainer.appendChild(submit)
  
  
                    document.getElementById( 'button_' + response[i].key.id ).onclick = ()=> { goToProfile( response[i].key.id, false) }
                    
                  }
                  updateLeftHandSideNavigation()
                // update left hand side navigation panel
              }              

          } else{
              console.warn("Can't load left navigator!" + response)
          }
        },
        error: function(error) {
          if(error == 'error' && error != null){
              console.warn("Can't load left navigator!" + error) 
          }
        }
    });   
    
  }
// sub body left side navigator
















//background picture
  async function backgroundPic(){  
    let picName



    // Send AJAX request to Node.js server
    $.ajax({
        url: '/mongoJs/main/backgroundPic', // Replace with your server endpoint
        type: 'POST',
        data: {id: myId},
        success: async function(response) {
          if(response != 'error' && response != null){
              const randIndex = Math.floor(Math.random() * 5)
              // console.warn('pic name '+ response['light-background'][randIndex])

              picName = response['light-background'][randIndex]
              retriveBackgroundImgFromFirestore()
          } else{
              console.warn('can\'t get bacground image. ' + response)
          }
        },
        error: function(error) {
          if(error == 'error' && error != null){
              console.warn('can\'t get bacground image. '+ error) 
          }
        }
    });


    
    
    async function retriveBackgroundImgFromFirestore(){
      const starsRef = ref( storage, 'bgPic/' + picName)
      getDownloadURL(starsRef)
      .then((url) => {
          // Insert url into an <img> tag to "download"
          document.getElementById('body').style.background = `url('${url}')`
          document.getElementById('body').style.backgroundAttachment = `fixed`
      })
      .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              console.log("File doesn't exist")
              break;
            case 'storage/unauthorized':
              console.log("User doesn't have permission to access the object")
              break;
            case 'storage/canceled':
              console.log("User canceled the upload")
              break;
  
            case 'storage/unknown':
              console.log("Unknown error occurred, inspect the server response")
              break;
          }
       })
    }
  }
//background picture