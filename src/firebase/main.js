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
const storage = getStorage(app)
const collRef = collection(db, "Moments")










let myId
onAuthStateChanged(auth, (user) => {
  if (user) {
    if(user.emailVerified == true){

      user.providerData.forEach(async (profile) => {
        myId = profile.uid
        
        showMyProfileName()
        callAlertFunction()
        // setInterval(resetAudioVideoData, 1000)
        subBodyLeftSideNavigator()
        backgroundPic()
        showUnseenSMSindicatorHeader() 
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
  //home button
    //document.getElementById('homeButton').onclick = loadHome
  //home button

  // profile button & description
  //show my name and picture in control bar
  async function showMyProfileName(){
    //pic
    const profilePic = document.querySelector('#profilePic')
    const profilePicDescription = document.querySelector('#profilePicDescription')

    const getProfilePicChange = query(collection(db, "Moments", myId, "profilePictures"));
    let picName = null
    
    onSnapshot( getProfilePicChange, (querySnapshot) => {
      picName = null

      querySnapshot.forEach( async (docs) => {
        if(changedInProfilePicInProfileDescription == true){
          changedInProfilePicInProfileDescription = false

          const getProfilePicName = query(collection(db, "Moments", myId, "profilePictures"), where('active', '==', true));

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

    onSnapshot(doc(db, "Moments", myId, 'profileInfo', 'credentials'), async (doc) => {
      document.getElementById('profileName').innerText = doc.data().name.firstName +" "+ doc.data().name.lastName;
    })

    // when click on profile image on top bar
    document.getElementById('myProfileLink').onclick = ()=>{
      document.getElementById('profileDescription').style.top = '60px'
    }
    document.getElementById('closeProfileDescription').onclick = ()=>{
      document.getElementById('profileDescription').style.top = '-700px'
    }
    // when click on profile image on top bar
  }

  document.getElementById('profilePicDescription').onclick = goToProfile
  document.getElementById('profileName').onclick = goToProfile

  function goToProfile(){
    document.querySelector('#homeButton span').style.color = 'inherit'
    stopAllSnapshot() // main.ejs

    $("#subBodyRightSide-maincontent").load("allProfile", {uId : myId}, function(responseTxt, statusTxt, xhr){
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

        /* where('send.id', '!=', myId), where(`seenBy.${escapedDotEmail}`, '==', false), limit(1) */        
        const unsubCheckUnseenSMSIndicator = onSnapshot( query(collectionGroup(db, 'sms'), where(`seenBy.${escapedDotEmail}`, '==', false) ), async (querySnapshot) => {    

          for (let i = 0; i < querySnapshot.docs.length; i++) {
            console.warn(querySnapshot.docs[i].id)
          }

        })
      // check unseen sms
      }
    // unseen message indication on header control bar and message sound  


    // panel
    const messengerPanel = document.getElementById( 'messengerPanel' )
    document.getElementById( 'messengerButton' ).onclick = ()=>{
      messengerPanel.style.top = '55px'
      messengerPanel.style.opacity = 1

      isMessengerDisplay = true
      resezizeMessenger() //height

      showMessageList()
      
    }



    document.getElementById( 'closeMessenger' ).onclick = ()=>{
      messengerPanel.style.top = -100 + 'px'
      messengerPanel.style.height = 0
      messengerPanel.style.opacity = 0

      isMessengerDisplay = false
    }




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
          let messengerRoomRef 
          document.querySelector('#searchToSendMessageForm button').onclick = async ()=>{
            /*
            const checkFriend = query(collection(db, "Moments", myId, 'friendsAndFollowers'), where("friendList", "array-contains", document.querySelector('#searchToSendMessageForm input').value));

              const getFriend = await getDocs( checkFriend );
              getFriend.forEach((docs) => {

                document.querySelector('#searchToSendMessageForm-output').innerHTML = '' // reset old search data
                searchedProfileBar( document.querySelector('#searchToSendMessageForm input').value )
              })*/

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
          }
          // in messenger room

          // show search profile bar
            async function searchedProfileBar( searchdId ){
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
                  const deductWidth = getWidth - 60

                  perProfileBarContent.style.width = deductWidth + 'px'
                  perProfileBarContentControl.style.width = deductWidth + 'px'
                }
                fixWidthOfNameAndContent()
              // css

              // retrive data from db
                const getProfileData = await getDoc( doc(db, "Moments", searchdId, "profileInfo", "credentials") );
                // name
                perProfileBarContentName.innerText = getProfileData.data().name.fullName

                // pic
                const perProfilePicName = query(collection(db, "Moments", searchdId, "profilePictures"), where('active', '==', true));

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
              // retrive data from db


              // select profile bar to send message
                perProfileBar.onclick = selectProfileBarMessenger

                async function selectProfileBarMessenger(){
                  
                      await setDoc(doc(db, "Messenger", messengerRoomRef ), {
                        lastActivity: serverTimestamp()
                      },
                      {merge: true })

                      hideSearchPersonMessagePanel()
                    
                }
              // select profile bar to send message
            }
          // show search profile bar
        // search button
      // search person




      // show message list (default)

        const showMessageList_SubHolder = document.querySelector('#showMessageList_subHolder')        
        
        // check for update and reset
        let isShowMessageListOn = false // this is for snapshot delay
        async function showMessageList(){
          const checkMessegePersonsUpdate = query( collection(db, 'Messenger'), where('membersList', 'array-contains', myId) )

          const unsubCheckMessegePersonsUpdate = onSnapshot(checkMessegePersonsUpdate, (querySnapshot) => {
            querySnapshot.forEach(async (docs1) => {

              /* 
                onsnapshot check [isShowMessageListOn] is false then set it to true. Meanwhile also start the timeout func, which will be executed after 2 seconds. 
                Here the expecting fact is within those 2 seconds the onsnapshot func will finish it's all operation then the update DB data will be shown, which will not occur any flickering in showing result. By this it will look totally natural view..
              */
              
              if( isShowMessageListOn == false ) {
                isShowMessageListOn = true

                setTimeout( ()=>{
                  showMessageList_SubHolder.innerHTML = '' // reset old data
                  showMessageList_SubHolder.style.padding = 0 // reset old style

                  isShowMessageListOn = false
                  goToMessageList()
                }, 2000)

              }
              
            })
          })
        }
        // check for update and reset

        // result list
        async function goToMessageList(){

          showMessageList_SubHolder.style.padding = '5px' // set padding to message list subholder


          // inbox loop
            const getMessegePersons = query( collection(db, 'Messenger'), where('membersList', 'array-contains', myId), orderBy("lastActivity", "desc"), limit(100))

            const querySnapshot = await getDocs( getMessegePersons );
            querySnapshot.forEach(async (docs) => {

                // show profile bar
                  const perProfileBar = document.createElement('div')
                  perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody messengerProfilesSingelBarBody messengerProfilesSingelBarNo-' + docs.id )
                  perProfileBar.setAttribute('id', `messengerProfilesSingelBar_${ docs.id }`)
                  showMessageList_SubHolder.appendChild( perProfileBar )
                  perProfileBar.onclick = ()=>{ listContentInRightSideView( docs.id ) } // right side view on onclik
  
                        
                  const perProfileBarHolder = document.createElement('div')
                  perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
                  perProfileBarHolder.setAttribute('id', 'messengerProfilesSingelBar-imageHolder-' + docs.id )
                  perProfileBar.appendChild( perProfileBarHolder )
  
                  const perProfileBarImg = document.createElement('img')
                  perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
                  perProfileBarImg.setAttribute('id', 'messengerProfilesSingelBar-img-' + docs.id )
                  perProfileBarHolder.appendChild( perProfileBarImg )
                  perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
  
                  const perProfileBarContent = document.createElement('div')
                  perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
                  perProfileBarContent.setAttribute('id', 'messengerProfilesSingelBar-content-' + docs.id )
                  perProfileBar.appendChild( perProfileBarContent )

                  // style js
                    // set content bar width
                    const getPerProfileBarContentWidth = document.querySelector('.messengerProfilesSingelBarBody').offsetWidth
                    const deductPerProfileBarContentWidth = getPerProfileBarContentWidth - 65

                    perProfileBarContent.style.width = deductPerProfileBarContentWidth + 'px'                    
                  // style js
  
                  const perProfileBarContentName = document.createElement('div')
                  perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName messengerProfilesSingelBar-contentName')
                  perProfileBarContentName.setAttribute('id', 'messengerProfilesSingelBar-contentName-' + docs.id )
                  perProfileBarContent.appendChild( perProfileBarContentName )
  
                  const perProfileBarContentControl = document.createElement('div')
                  perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
                  perProfileBarContentControl.setAttribute('id', 'messengerProfilesSingelBar-contentControl-' + docs.id )
                  perProfileBarContent.appendChild( perProfileBarContentControl )

                    const perProfileBarContentControl_subSection = document.createElement('div')
                    perProfileBarContentControl_subSection.setAttribute('class', 'profilesSingelBar-contentControl-subSection')
                    perProfileBarContentControl_subSection.setAttribute('id', 'messengerProfilesSingelBar-contentControl-subSection-' + docs.id )
                    perProfileBarContentControl.appendChild( perProfileBarContentControl_subSection )

                      const perProfileBarContentControl_subSection_2 = document.createElement('div')
                      perProfileBarContentControl_subSection_2.setAttribute('class', 'profilesSingelBar-contentControl-subSection-2')
                      perProfileBarContentControl_subSection_2.setAttribute('id', 'messengerProfilesSingelBar-contentControl-subSection-2-' + docs.id )
                      perProfileBarContentControl_subSection.appendChild( perProfileBarContentControl_subSection_2 )

                        const perProfileBarContentControl_senderName = document.createElement('div')
                        perProfileBarContentControl_senderName.setAttribute('class', 'profilesSingelBar-contentControl_senderName')
                        perProfileBarContentControl_senderName.setAttribute('id', 'messengerProfilesSingelBar-contentControl-senderName-' + docs.id )
                        perProfileBarContentControl_subSection_2.appendChild( perProfileBarContentControl_senderName )

                        const perProfileBarContentControl_unseenMsg = document.createElement('div')
                        perProfileBarContentControl_unseenMsg.setAttribute('class', 'profilesSingelBar-contentControl_unseenMsg')
                        perProfileBarContentControl_unseenMsg.setAttribute('id', 'messengerProfilesSingelBar-contentControl-unseenMsg-' + docs.id )
                        perProfileBarContentControl_subSection_2.appendChild( perProfileBarContentControl_unseenMsg )

                    const perProfileBarContentControl_messageTime = document.createElement('div')
                    perProfileBarContentControl_messageTime.setAttribute('class', 'profilesSingelBar-contentControl-messageTime')
                    perProfileBarContentControl_messageTime.setAttribute('id', 'messengerProfilesSingelBar-contentControl-messageTime-' + docs.id )
                    perProfileBarContentControl.appendChild( perProfileBarContentControl_messageTime )

                  
                  // check messenger room group or not
                    const getMessengerRoomData = await getDoc( doc(db, "Messenger", docs.id))
                    if( getMessengerRoomData.data().group == false ){ 
                      for (let i = 0; i < getMessengerRoomData.data().membersList.length; i++) { 
                        if( getMessengerRoomData.data().membersList.length == 2 && getMessengerRoomData.data().membersList[i] != myId) { 
                          // retrive data from db
                            const getProfileData = await getDoc( doc(db, "Moments", getMessengerRoomData.data().membersList[i], "profileInfo", "credentials") );
                            // name
                            perProfileBarContentName.innerText = getProfileData.data().name.fullName
  
                            // pic
                            const perProfilePicName = query(collection(db, "Moments", getMessengerRoomData.data().membersList[i], "profilePictures"), where('active', '==', true));
  
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
                          // retrive data from db
                        }
                      }
                    }
                  // check messenger room group or not

                  // check unseen sms
                    // remove special charecters form email
                      const escapeAtTheRate = myId.replaceAll('@',"_")
                      const escapedDotEmail = escapeAtTheRate.replaceAll('.',"_")
                    // remove special charecters from email

                    /* where('send.id', '!=', myId), where(`seenBy.${escapedDotEmail}`, '==', false), limit(1) */
                    const unsubCheckUnseenSMS = onSnapshot( query( collection(db, 'Messenger', docs.id, 'sms'), orderBy('send.time', 'desc')  ), async (querySnapshot) => {    

                      for (let i = 0; i < querySnapshot.docs.length; i++) {
                        if( querySnapshot.docs[i].data().send.id != myId && querySnapshot.docs[i].data().seenBy[escapedDotEmail] == false) {

                            perProfileBarContentControl.style.display = 'block'

                            // sender name
                              const senderName = await getDoc( doc(db, "Moments", querySnapshot.docs[i].data().send.id, "profileInfo", "credentials") )
                              perProfileBarContentControl_senderName.innerText = senderName.data().name.firstName + ':'
                            // sender name
                          

                            // message
                              let text = ''                            
                              for (let j in querySnapshot.docs[i].data().messengerData ) {
                                text += querySnapshot.docs[i].data().messengerData[j].text + " "
                              }

                              // trim string in 10 words
                                let trimedText = text.substr(0,20)
                              // trim string in 10 words

                              perProfileBarContentControl_unseenMsg.innerText = trimedText + '...'
                            // message

                            // message time
                              const sendAtTimestamp = querySnapshot.docs[i].data().send.time.toDate()
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
    
                              perProfileBarContentControl_messageTime.innerText = '🕝 ' + hours + ':' + sendAtTimestamp.getMinutes() + ' ' + amPm + '. ' + sendAtTimestamp.getDate() + '-' + sendAtTimestamp.getMonth() + '-' + sendAtTimestamp.getFullYear()  
                              
                              perProfileBarContentControl_messageTime.style.padding = '1px 3px'
                            // message time

                          i = querySnapshot.docs.length // stop the loop

                        } else{
                          perProfileBarContentControl.style.display = 'none'
                        }
                      }

                    })
                  // check unseen sms
                // show profile bar
              
            })
          // inbox loop
        }
        // result list


        // list content in right side view
        const messageRightSide = document.querySelector('#messegeRightSide')
        const messengerRightSideSubSection = document.querySelector('#messegeRightSideSubSection')

          // hide right side on small device default
            document.getElementById('closeMessengerRightSide').onclick = ()=>{
              messageRightSide.style.right = '-810px'

              document.getElementById('closeMessenger').style.right = 0 // show messenger close button again
            }
          // hide right side on small device default

          
          async function listContentInRightSideView( messengerRef ){

            // make unseen sms seen
              async function makeUnseenSMSseen(){
                // remove special charecters form email
                  const escapeAtTheRate = myId.replaceAll('@',"_")
                  const escapedDotEmail = escapeAtTheRate.replaceAll('.',"_")
                // remove special charecters from email
                  
                const querySnapshot = await getDocs(query( collection(db, 'Messenger', messengerRef, 'sms'), where('send.id', '!=', myId), where(`seenBy.${escapedDotEmail}`, '==', false)));
                querySnapshot.forEach(async (doc1) => {
                  await setDoc(doc(db, 'Messenger', messengerRef, 'sms', doc1.id), {
                    seenBy:{
                      [escapedDotEmail]: true
                    }
                  },
                  { merge: true })

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

            messengerRightSideSubSection.innerHTML = '' // reset old data


            // messenger right side background
            const storesRef = ref( storage, 'messengerBackground/dark_1.jpg')
            getDownloadURL(storesRef)
            .then((url) => {
              // Insert url into an <img> tag to "download"
              messageRightSide.style.background = `url(${url}) center no-repeat`;
              messageRightSide.style.backgroundSize =  '100% 100%'
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
            // messenger right side background


            // right side header section              
              const createRightSideHeader = document.createElement('div')
              createRightSideHeader.setAttribute('class', 'messengerRightSideHeaderBar')
              messengerRightSideSubSection.appendChild( createRightSideHeader )

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
              

              

              // check messenger room group or not
                const getMessengerRoomData = await getDoc( doc(db, "Messenger", messengerRef ))
                if( getMessengerRoomData.data().group == false ){ 
                  for (let i = 0; i < getMessengerRoomData.data().membersList.length; i++) { 
                    if( getMessengerRoomData.data().membersList.length == 2 && getMessengerRoomData.data().membersList[i] != myId) { 
                      // retrive data from db
                        const getProfileData = await getDoc( doc(db, "Moments", getMessengerRoomData.data().membersList[i], "profileInfo", "credentials") );
                        // name
                        createRightSideHeader_name.innerText = getProfileData.data().name.fullName

                        // pic
                        const perProfilePicName = query(collection(db, "Moments", getMessengerRoomData.data().membersList[i], "profilePictures"), where('active', '==', true));

                        const showProfilePicName = await getDocs( perProfilePicName );
                        showProfilePicName.forEach((doc3) => {
           
                          const storesRef = ref(storage, doc3.data().title)
                          getDownloadURL(storesRef)
                          .then((url) => {
                            // Insert url into an <img> tag to "download"
                            createRightSideHeader_img.src = url
                          })              
                        })
                        // pic                          
                      // retrive data from db
                    }
                  }
                }
              // check messenger room group or not
            // right side header section



            // messages view middle part
              const createRightSideMessageViewMiddlePart = document.createElement('div')
              createRightSideMessageViewMiddlePart.setAttribute('class', 'messengerRightSideMessageViewMiddlePart')
              messengerRightSideSubSection.appendChild( createRightSideMessageViewMiddlePart )

              const createRightSideMessageViewMiddlePart_subSection = document.createElement('div')
              createRightSideMessageViewMiddlePart_subSection.setAttribute('class', 'messengerRightSideMessageViewMiddlePart_subSection')
              createRightSideMessageViewMiddlePart.appendChild( createRightSideMessageViewMiddlePart_subSection )



              // message update
                const getMessages = query( collection(db, "Messenger", messengerRef, 'sms' ) )
                let changeInMessageView = false
                const unsubMessageView = onSnapshot( getMessages, (doc1) => {
                  if( changeInMessageView == false ){
                    changeInMessageView = true

                    setTimeout(()=>{
                      changeInMessageView = false
                      showEveryMessages()
                    }, 2000)
                  }
                })
              // message update

              // loop
                async function showEveryMessages(){
                  createRightSideMessageViewMiddlePart_subSection.innerHTML = '' // clear middle part sub section

                  const getMessages = query(collection(db, "Messenger", messengerRef, "sms" ), orderBy("send.time", "asc"));

                  const querySnapshot = await getDocs( getMessages );
                  querySnapshot.forEach( async ( doc1 ) => {
                    
                    // my message
                    if( doc1.data().send.id == myId ){
                      const createRightSideMessageView_myMessage = document.createElement('div')
                      createRightSideMessageView_myMessage.setAttribute('class', 'messengerRightSideMessageView_myMessage')
                      createRightSideMessageViewMiddlePart_subSection.appendChild( createRightSideMessageView_myMessage )

                      // previous next message portion
                        function previousNextPortion( index, messageId ){                          
                          // previous
                            const dummySpaceBefore = document.createElement('div')
                            dummySpaceBefore.setAttribute('class', 'dummySpaceBeforeMessageMainPartPices')
                            dummySpaceBefore.setAttribute('title', index )               
                            

                            /* onle reason why I used condition is for check if exist pervisios message portion. If so then what it's align */
                            const deductIndex = index - 1
                            if( doc1.data().messengerData[ deductIndex ] != undefined ){
                              if(doc1.data().messengerData[ deductIndex ].align == 'default'){
                                
                                document.getElementById( 'messageMainPartPices_msgId_'+ messageId + '_incement_' + index ).insertAdjacentElement("beforebegin", dummySpaceBefore)
                              }
                            } else  document.getElementById( 'messageMainPartPices_msgId_'+ messageId + '_incement_' + index ).insertAdjacentElement("beforebegin", dummySpaceBefore) 
                          // previous

                          // next
                            const dummySpaceAfter = document.createElement('div')
                            dummySpaceAfter.setAttribute('class', 'dummySpaceAfterMessageMainPartPices') 
                            dummySpaceAfter.setAttribute('title', index )                   

                            /* onle reason why I used condition is for check if exist next message portion. If so then what it's align */
                            const addIndex = index + 1                                                        
                            
                            if( doc1.data().messengerData[ addIndex ] != undefined ){ 
                              if(doc1.data().messengerData[ addIndex ].align == 'default'){
                              
                                document.getElementById( 'messageMainPartPices_msgId_'+ messageId + '_incement_' + index ).insertAdjacentElement("afterend", dummySpaceAfter)
                              }
                            } else  document.getElementById( 'messageMainPartPices_msgId_'+ messageId + '_incement_' + index ).insertAdjacentElement("afterend", dummySpaceAfter) 
                          // next

                        }
                      // previous next message portion

                      // retive messages pices from object
                      let messengerObjectIndex = 0
                      for (let x in doc1.data().messengerData) {                        
                        
                        const createMessagePortion = document.createElement('span')
                        createMessagePortion.setAttribute('class', 'messageMainPartPices')
                        createMessagePortion.setAttribute('id', 'messageMainPartPices_msgId_'+ doc1.id + '_incement_' + x)
                        createMessagePortion.innerText = doc1.data().messengerData[x].text

                          const createNBSP = document.createElement('span')
                          createNBSP.innerHTML = '&nbsp;'
                          createMessagePortion.appendChild(createNBSP)
                        
                        createRightSideMessageView_myMessage.appendChild( createMessagePortion )

                        
                        // bold
                          if( doc1.data().messengerData[x].bold == true){
                            createMessagePortion.style.fontWeight = 'bold'
                          }
                        // bold

                        // italic
                          if( doc1.data().messengerData[x].italic == true){
                            createMessagePortion.style.fontStyle = 'italic'
                          }
                        // italic

                        // fontFamily
                          if( doc1.data().messengerData[x].fontFamily != 'default' ){
                            createMessagePortion.style.fontFamily = doc1.data().messengerData[x].fontFamily
                          }
                        // fontFamily

                        // align
                          // left
                            if( doc1.data().messengerData[x].align == 'left' ){
                              createMessagePortion.style.float = 'left'

                              previousNextPortion( messengerObjectIndex, doc1.id )
                            }
                          // left

                          // center
                            if( doc1.data().messengerData[x].align == 'center' ){
                                                           
                              const containerWidthPixel = createRightSideMessageView_myMessage.offsetWidth

                              const perPercentOfPixel = 100/containerWidthPixel

                              const percentageOfThisPortion = createMessagePortion.offsetWidth * perPercentOfPixel

                              const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion

                              const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2

                              createMessagePortion.style.display = 'table'
                              createMessagePortion.style.position = 'absolute'  
                              createMessagePortion.style.left = deductedOuterWideHalfPercent + '%'


                              previousNextPortion( messengerObjectIndex, doc1.id )
                            }                          
                          // center

                          // right
                            if( doc1.data().messengerData[x].align == 'right' ){
                              createMessagePortion.style.float = 'right'

                              previousNextPortion( messengerObjectIndex, doc1.id )
                            }
                          // right
                        // align
                        

                        messengerObjectIndex++
                      }                      
                      // retive messages pices from object

                      // sender profile pic
                        const senderProfilePicContainer = document.createElement('div')
                        senderProfilePicContainer.setAttribute('class', 'senderProfilePicContainer')
                        senderProfilePicContainer.setAttribute('id', 'senderProfilePicContainer_' + doc1.data().send.id )

                        createRightSideMessageView_myMessage.appendChild( senderProfilePicContainer )

                          const createImgElement = document.createElement('img')
                          createImgElement.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
                          senderProfilePicContainer.appendChild( createImgElement )                          

                          // pic
                            const perProfilePicName = query(collection(db, "Moments", doc1.data().send.id, "profilePictures"), where('active', '==', true));
  
                            const showProfilePicName = await getDocs( perProfilePicName );
                            showProfilePicName.forEach((doc3) => {
                 
                              const storesRef = ref(storage, doc3.data().title)
                              getDownloadURL(storesRef)
                              .then((url) => {
                                // Insert url into an <img> tag to "download"
                                createImgElement.src = url
                              })              
                            })
                          // pic  
                      // sender profile pic

                      // sending time
                        const createSendAtHolder = document.createElement('div')
                        createSendAtHolder.setAttribute('class', 'messageSendAt')

                        createRightSideMessageView_myMessage.appendChild( createSendAtHolder )

                        const sendAtTimestamp = doc1.data().send.time.toDate()
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

                          const containerWidthPixel = createRightSideMessageView_myMessage.offsetWidth

                          const perPercentOfPixel = 100/containerWidthPixel

                          const percentageOfThisPortion = createSendAtHolder.offsetWidth * perPercentOfPixel

                          const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion

                          const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2

                          createSendAtHolder.style.left = deductedOuterWideHalfPercent + '%'
                      // sending time
                    }// my message
                    // peer message
                    else {
                      const createLeftSideMessageView = document.createElement('div')
                      createLeftSideMessageView.setAttribute('class', 'messengerLefttSideMessageView')
                      createRightSideMessageViewMiddlePart_subSection.appendChild( createLeftSideMessageView )

                      // previous next message portion
                        function previousNextPortion( index, messageId ){                          
                          // previous
                            const dummySpaceBefore = document.createElement('div')
                            dummySpaceBefore.setAttribute('class', 'dummySpaceBeforeMessageMainPartPices')
                            dummySpaceBefore.setAttribute('title', index )               
                            

                            /* onle reason why I used condition is for check if exist pervisios message portion. If so then what it's align */
                            const deductIndex = index - 1
                            if( doc1.data().messengerData[ deductIndex ] != undefined ){
                              if(doc1.data().messengerData[ deductIndex ].align == 'default'){
                                
                                document.getElementById( 'messageMainPartPices_msgId_'+ messageId + '_incement_' + index ).insertAdjacentElement("beforebegin", dummySpaceBefore)
                              }
                            } else  document.getElementById( 'messageMainPartPices_msgId_'+ messageId + '_incement_' + index ).insertAdjacentElement("beforebegin", dummySpaceBefore) 
                          // previous

                          // next
                            const dummySpaceAfter = document.createElement('div')
                            dummySpaceAfter.setAttribute('class', 'dummySpaceAfterMessageMainPartPices') 
                            dummySpaceAfter.setAttribute('title', index )                   

                            /* onle reason why I used condition is for check if exist next message portion. If so then what it's align */
                            const addIndex = index + 1                                                        
                            
                            if( doc1.data().messengerData[ addIndex ] != undefined ){ 
                              if(doc1.data().messengerData[ addIndex ].align == 'default'){
                              
                                document.getElementById( 'messageMainPartPices_msgId_'+ messageId + '_incement_' + index ).insertAdjacentElement("afterend", dummySpaceAfter)
                              }
                            } else  document.getElementById( 'messageMainPartPices_msgId_'+ messageId + '_incement_' + index ).insertAdjacentElement("afterend", dummySpaceAfter) 
                          // next

                        }
                      // previous next message portion

                      // retive messages pices from object
                      let messengerObjectIndex = 0
                      for (let x in doc1.data().messengerData) {                        
                        
                        const createMessagePortion = document.createElement('span')
                        createMessagePortion.setAttribute('class', 'messageMainPartPices')
                        createMessagePortion.setAttribute('id', 'messageMainPartPices_msgId_'+ doc1.id + '_incement_' + x)
                        createMessagePortion.innerText = doc1.data().messengerData[x].text

                          const createNBSP = document.createElement('span')
                          createNBSP.innerHTML = '&nbsp;'
                          createMessagePortion.appendChild(createNBSP)
                        
                          createLeftSideMessageView.appendChild( createMessagePortion )

                        
                        // bold
                          if( doc1.data().messengerData[x].bold == true){
                            createMessagePortion.style.fontWeight = 'bold'
                          }
                        // bold

                        // italic
                          if( doc1.data().messengerData[x].italic == true){
                            createMessagePortion.style.fontStyle = 'italic'
                          }
                        // italic

                        // fontFamily
                          if( doc1.data().messengerData[x].fontFamily != 'default' ){
                            createMessagePortion.style.fontFamily = doc1.data().messengerData[x].fontFamily
                          }
                        // fontFamily

                        // align
                          // left
                            if( doc1.data().messengerData[x].align == 'left' ){
                              createMessagePortion.style.float = 'left'

                              previousNextPortion( messengerObjectIndex, doc1.id )
                            }
                          // left

                          // center
                            if( doc1.data().messengerData[x].align == 'center' ){
                                                           
                              const containerWidthPixel = createLeftSideMessageView.offsetWidth

                              const perPercentOfPixel = 100/containerWidthPixel

                              const percentageOfThisPortion = createMessagePortion.offsetWidth * perPercentOfPixel

                              const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion

                              const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2

                              createMessagePortion.style.display = 'table'
                              createMessagePortion.style.position = 'absolute'  
                              createMessagePortion.style.left = deductedOuterWideHalfPercent + '%'


                              previousNextPortion( messengerObjectIndex, doc1.id )
                            }                          
                          // center

                          // right
                            if( doc1.data().messengerData[x].align == 'right' ){
                              createMessagePortion.style.float = 'right'

                              previousNextPortion( messengerObjectIndex, doc1.id )
                            }
                          // right
                        // align
                        

                        messengerObjectIndex++
                      }                      
                      // retive messages pices from object

                      // sender profile pic
                        const senderProfilePicContainer = document.createElement('div')
                        senderProfilePicContainer.setAttribute('class', 'senderProfilePicContainer senderProfilePicContainer_leftSide')
                        senderProfilePicContainer.setAttribute('id', 'senderProfilePicContainer_' + doc1.data().send.id )

                        createLeftSideMessageView.appendChild( senderProfilePicContainer )

                          const createImgElement = document.createElement('img')
                          createImgElement.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
                          senderProfilePicContainer.appendChild( createImgElement )                          
                          
                          // pic
                            const perProfilePicName = query(collection(db, "Moments", doc1.data().send.id, "profilePictures"), where('active', '==', true));
  
                            const showProfilePicName = await getDocs( perProfilePicName );
                            showProfilePicName.forEach((doc3) => {
                 
                              const storesRef = ref(storage, doc3.data().title)
                              getDownloadURL(storesRef)
                              .then((url) => {
                                // Insert url into an <img> tag to "download"
                                createImgElement.src = url
                              })              
                            })
                          // pic  
                      // sender profile pic

                      // sending time
                        const createSendAtHolder = document.createElement('div')
                        createSendAtHolder.setAttribute('class', 'messageSendAt')

                        createLeftSideMessageView.appendChild( createSendAtHolder )

                        const sendAtTimestamp = doc1.data().send.time.toDate()
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
                    }
                    // peer message
                  })
                }
              // loop
            // messages view middle part



            // right side footer
              const createRightSideFooter = document.createElement('div')
              createRightSideFooter.setAttribute('class', 'messengerRightSideFooter')
              messengerRightSideSubSection.appendChild( createRightSideFooter )


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
                  }
                  createRightSideFooter_textarea.onblur = ()=>{
                    createRightSideFooter_textarea.style.height = '30px'
                    createRightSideFooter_textarea.style.padding = '5px 10px'

                    // edit button
                    createRightSideFooter_editPreviewButton.style.bottom = '25px'

                    // edit panel
                    createRightSideFooter_editPreview.style.bottom = '30px'
                  }
                  // on click change height
                // style
              // textarea


              // add and show array and object and pass data in textarea
                let messagesArray = []
                let messagesObject = {}
                let viewingDevice = 'phone'

                function addArrayObjectTextarea( val, previousPiceVal ){
                  // console.warn(' selected messagePortion_' + messagesArray[`${val}`])

                  if( messagesArray.includes( `"${val}"` ) == false && val != null) { 
                    if( previousPiceVal == null ){
                      messagesArray.push( `"${val}"` )
                    } else {
                      const perviousPiceIndex = messagesArray.indexOf( `"${previousPiceVal}"` ) + 1
                      messagesArray.splice( perviousPiceIndex, 0, `"${val}"`) // insert before previous pice pushing it higher index
                    }
                    

                    messagesObject[ `"${val}"` ] = {}
                    messagesObject[ `"${val}"` ].text = ''
                    messagesObject[ `"${val}"` ].bold = false
                    messagesObject[ `"${val}"` ].italic = false
                    messagesObject[ `"${val}"` ].fontFamily = 'default'
                    messagesObject[ `"${val}"` ].align = 'default'

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
                                    dummySpaceBeforeThisElem.setAttribute('style', "display: block; clear: both;")

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
                                    if( document.getElementById( "dummySpaceBefore_" + messagesArray[ addIndex ] ) ) { // if exist before this
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
                              selectTheMessagePortion.style.position = 'relative'
                              selectTheMessagePortion.style.left = 0
                              selectTheMessagePortion.style.float = 'left'

                              previousNextMessagePortion()
                              
                            }
                          // left

                          // center
                            else if( messagesObject[ messagesArray[i] ].align == 'center' ){  
                              
                              const containerWidthPixel = createRightSideFooter_editPreview_mainSubSection_childSubSection3.offsetWidth

                              const perPercentOfPixel = 100/containerWidthPixel

                              const percentageOfThisPortion = selectTheMessagePortion.offsetWidth * perPercentOfPixel

                              const deductThisPortionWidePercentFrom100percent = 100 - percentageOfThisPortion

                              const deductedOuterWideHalfPercent = deductThisPortionWidePercentFrom100percent / 2

                              selectTheMessagePortion.style.display = 'table'
                              selectTheMessagePortion.style.position = 'absolute'  
                              selectTheMessagePortion.style.left = deductedOuterWideHalfPercent + '%'



                              previousNextMessagePortion()
                              
                              
                            }
                          // center

                          // right
                            else if( messagesObject[ messagesArray[i] ].align == 'right' ){
                              

                              // selectTheMessagePortion.style.display = 'block'                              
                              // selectTheMessagePortion.style.float = 'right'

                              selectTheMessagePortion.style.display = 'inline'  
                              selectTheMessagePortion.style.position = 'relative'
                              selectTheMessagePortion.style.left = 0
                              selectTheMessagePortion.style.float = 'right'

                              previousNextMessagePortion()
                              
                            }
                          // right

                          // default
                            else {
                              
                              selectTheMessagePortion.style.display = 'inline'
                              selectTheMessagePortion.style.position = 'relative'
                              selectTheMessagePortion.style.left = 0
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
                        
                      }
                        // style per message portion
                      // array & object loop

                  } // edit preview section (retrive data from array and object)
                  // works after selection by users

                  console.warn('see array arrangement '+ messagesArray)
                  
                  if(val != null){

                    // textarea
                      // fill
                        if( messagesObject[ `"${val}"` ].text != '' ) {
                          createRightSideFooter_textarea.value = messagesObject[ `"${val}"` ].text
                        } else createRightSideFooter_textarea.value = ''
                      // fill

                      // preview on onkeypress
                        createRightSideFooter_textarea.onkeyup = ()=>{
                          document.getElementById( `messagePortion_"${val}"` ).innerText = createRightSideFooter_textarea.value
                      
                          messagesObject[ `"${val}"` ].text = createRightSideFooter_textarea.value.trim()
                        }
                      // preview on onkeypress
                    // textarea
                    

                    // focused on active message portion
                      const selectAllPerMessageBar = document.querySelectorAll('.messengerRightSideFooter_editPreview_mainPics')

                      for (let i = 0; i < selectAllPerMessageBar.length; i++) {
                        selectAllPerMessageBar[i].style.borderColor = "rgb(198, 198, 198)";
                      }

                      document.getElementById( `messagePortion_"${val}"` ).style.borderColor = 'red'
                    // focused on active message portion


                  
                    // edit header style buttons action

                      // add another message portion button
                        createRightSideFooter_editPreview_header_addAnotherMessagePortion.onclick = ()=>{
                          addAnotherPicesMsgPortion( `messagePortion_"${val}"` )
                        }
                      
                      // add another message portion button   


                      // bold
                        if( messagesObject[ `"${val}"` ].bold == true ) {
                          createRightSideFooter_editPreview_header_bold.style.backgroundColor = 'yellow'
                        } else createRightSideFooter_editPreview_header_bold.style.backgroundColor = 'white'


                        createRightSideFooter_editPreview_header_bold.onclick = ()=>{
                          if( messagesObject[ `"${val}"` ].bold == true ) {
                            messagesObject[ `"${val}"` ].bold = false

                            addArrayObjectTextarea( val, null ) // update message portion
                          } else {
                            messagesObject[ `"${val}"` ].bold = true

                            addArrayObjectTextarea( val, null ) // update message portion
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

                            addArrayObjectTextarea( val, null ) // update message portion
                          } else {
                            messagesObject[ `"${val}"` ].italic = true

                            addArrayObjectTextarea( val, null ) // update message portion
                          }
                        }
                      // italic

                      // fontFamily
                        if( messagesObject[ `"${val}"` ].fontFamily != 'default' ) {
                          createRightSideFooter_editPreview_header_font.style.backgroundColor = 'yellow'
                        } else createRightSideFooter_editPreview_header_font.style.backgroundColor = 'white'
                    
                        createRightSideFooter_editPreview_header_font.onchange = ()=>{                   
                          messagesObject[ `"${val}"` ].fontFamily = createRightSideFooter_editPreview_header_font.value

                          addArrayObjectTextarea( val, null ) // update message portion
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

                            addArrayObjectTextarea( val, null ) // update message portion                            
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

                            addArrayObjectTextarea( val, null ) // update message portion
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

                            addArrayObjectTextarea( val, null ) // update message portion
                          }
                        // right
                      // align
                    // edit header style buttons action
                  }
                }
              // add and show array and object and pass data in textarea

              
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

                  // device
                    // phone
                      const createRightSideFooter_editPreview_header_android = document.createElement('img')
                      createRightSideFooter_editPreview_header_android.setAttribute('class', ' messengerRightSideFooter_editPreview_header_deviceType androidMessage')
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_android )

                      const starsRefSmartPhone = ref( storage, 'messengerBackground/edit panel device/smart phone.png')
                      getDownloadURL(starsRefSmartPhone)
                      .then((url) => {
                        // Insert url into an <img> tag to "download"
                        createRightSideFooter_editPreview_header_android.src = url
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

                      // onclick
                        createRightSideFooter_editPreview_header_android.onclick = ()=>{
                          if(viewingDevice != 'phone' ){
                            createRightSideFooter_editPreview_header_android.style.backgroundColor = 'yellow' // set active device header button active
                            createRightSideFooter_editPreview_header_tab.style.backgroundColor = 'white'
                            createRightSideFooter_editPreview_header_pc.style.backgroundColor = 'white'

                            viewingDevice = 'phone'
                            addArrayObjectTextarea( null, null ) // update message portion
                          }
                        }
                      // onclick
                    // phone

                    // tab
                      const createRightSideFooter_editPreview_header_tab = document.createElement('img')
                      createRightSideFooter_editPreview_header_tab.setAttribute('class', ' messengerRightSideFooter_editPreview_header_deviceType tabMessage')
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_tab )

                      const starsRefTab = ref( storage, 'messengerBackground/edit panel device/tablet pc.png')
                      getDownloadURL(starsRefTab)
                      .then((url) => {
                        // Insert url into an <img> tag to "download"
                        createRightSideFooter_editPreview_header_tab.src = url
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

                      // onclick
                        createRightSideFooter_editPreview_header_tab.onclick = ()=>{
                          if(viewingDevice != 'tab' ){
                            createRightSideFooter_editPreview_header_android.style.backgroundColor = 'white' 
                            createRightSideFooter_editPreview_header_tab.style.backgroundColor = 'yellow' // set active device header button active
                            createRightSideFooter_editPreview_header_pc.style.backgroundColor = 'white'

                            viewingDevice = 'tab'
                            addArrayObjectTextarea( null, null ) // update message portion
                          }
                        }
                      // onclick
                    // tab

                    // pc
                      const createRightSideFooter_editPreview_header_pc = document.createElement('img')
                      createRightSideFooter_editPreview_header_pc.setAttribute('class', ' messengerRightSideFooter_editPreview_header_deviceType pcMessage')
                      createRightSideFooter_editPreview_header_SubSection.appendChild( createRightSideFooter_editPreview_header_pc )

                      const starsRefPc = ref( storage, 'messengerBackground/edit panel device/pngwing.com.png')
                      getDownloadURL(starsRefPc)
                      .then((url) => {
                        // Insert url into an <img> tag to "download"
                        createRightSideFooter_editPreview_header_pc.src = url
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

                      // onclick
                        createRightSideFooter_editPreview_header_pc.onclick = ()=>{
                          if(viewingDevice != 'pc' ){
                            createRightSideFooter_editPreview_header_android.style.backgroundColor = 'white' 
                            createRightSideFooter_editPreview_header_tab.style.backgroundColor = 'white'
                            createRightSideFooter_editPreview_header_pc.style.backgroundColor = 'yellow' // set active device header button active

                            viewingDevice = 'pc'
                            addArrayObjectTextarea( null, null ) // update message portion
                          }
                        }
                      // onclick
                    // pc

                    // check device size to activate device buttons
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
                    // check device size to activate device buttons

                    // check viewing device                    
                      function getViewingDevice(){
                      if( viewingDevice == 'phone' ){

                        createRightSideFooter_editPreview_header_android.style.backgroundColor = 'yellow' // set active device header button active

                        createRightSideFooter_editPreview_mainSubSection.style.minWidth = '350px'
                        createRightSideFooter_editPreview_mainSubSection.style.width = '350px'
                        createRightSideFooter_editPreview_mainSubSection.style.maxWidth = '350px'

                        const starsRefSmartPhone = ref( storage, 'messengerBackground/edit panel device/smart phone sqare.png')
                        getDownloadURL(starsRefSmartPhone)
                        .then((url) => {
                          // Insert url into an <img> tag to "download"
                          createRightSideFooter_editPreview_mainSubSection.style.background = ` url('${url}')`
                          createRightSideFooter_editPreview_mainSubSection.style.backgroundSize = '100% 100%'                          
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

                        const starsRefTab = ref( storage, 'messengerBackground/edit panel device/tablet pc.png')
                        getDownloadURL(starsRefTab)
                        .then((url) => {
                          // Insert url into an <img> tag to "download"
                          createRightSideFooter_editPreview_mainSubSection.style.background = ` url('${url}')`
                          createRightSideFooter_editPreview_mainSubSection.style.backgroundSize = '100% 100%'
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

                        const starsRefPc = ref( storage, 'messengerBackground/edit panel device/pngwing.com.png')
                        getDownloadURL(starsRefPc)
                        .then((url) => {
                          // Insert url into an <img> tag to "download"
                          createRightSideFooter_editPreview_mainSubSection.style.background = ` url('${url}') top center`
                          createRightSideFooter_editPreview_mainSubSection.style.backgroundSize = '135% 106%'
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

                        createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.width = '84%'
                        createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.top = '7.5%'
                        createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.left = '8%'
                        createRightSideFooter_editPreview_mainSubSection_childSubSection2.style.height = '81.8%'

                        createRightSideFooter_editPreview_mainSubSection_childSubSection3.style.width = '85%'
                      }
                      }                      
                    // check viewing device
                  // device
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
                  
                  

                  let mainPicsInc = 0
                  // default pice of message portion
                    function defaultPiceOfMessagePortion(){
                      const createRightSideFooter_editPreview_mainPics = document.createElement('span')
                      createRightSideFooter_editPreview_mainPics.setAttribute('class', 'messengerRightSideFooter_editPreview_mainPics')
                      createRightSideFooter_editPreview_mainPics.setAttribute('title', mainPicsInc)
                      createRightSideFooter_editPreview_mainPics.setAttribute('id', `messagePortion_"${mainPicsInc}"`)
                      createRightSideFooter_editPreview_mainSubSection_childSubSection3.appendChild( createRightSideFooter_editPreview_mainPics )

                      // select pice
                        addArrayObjectTextarea( mainPicsInc, null ) // default execute for first message portion

                        createRightSideFooter_editPreview_mainPics.onclick = (event)=>{                                   
                          addArrayObjectTextarea( event.target.title, null )
                        }
                      // select pice

                      // add another pice of message portion
                        createRightSideFooter_editPreview_mainPics.ondblclick = (eve)=> { 
                          addAnotherPicesMsgPortion(eve.target.id)
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
                      
                      // check if it has appended bummySpace elem
                      if( document.getElementById( 'dummySpaceAfter_' + document.getElementById( val ).title ) != null){
                        document.getElementById( 'dummySpaceAfter_' + document.getElementById( val ).title ).insertAdjacentElement("afterend", createRightSideFooter_editPreview_mainPicsAnother)
                      } else document.getElementById( val ).insertAdjacentElement("afterend", createRightSideFooter_editPreview_mainPicsAnother)

                      

                      // select pice
                        addArrayObjectTextarea( mainPicsInc, document.getElementById( val ).title ) // default execute on create

                        createRightSideFooter_editPreview_mainPicsAnother.onclick = (event)=>   {                                   
                          addArrayObjectTextarea( event.target.title, document.getElementById( val ).title )
                        }
                      // select pice

                      // add another again
                        createRightSideFooter_editPreview_mainPicsAnother.ondblclick = (eve)=> { 
                          addAnotherPicesMsgPortion(eve.target.id)
                        }
                      // add another again
                    }
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
                    let smsDocId
                    if( messagesObject[ messagesArray[0] ].text != '' ){

                      const seenBy = {}
                      const getMembersList = await getDoc( doc(db, "Messenger", messengerRef) )
                      for (let i = 0; i < getMembersList.data().membersList.length; i++) {
                        if( getMembersList.data().membersList[i] != myId){
                          // remove special charecters form email
                            const escapeAtTheRate = getMembersList.data().membersList[i].replaceAll('@',"_")
                            const escapedDotEmail = escapeAtTheRate.replaceAll('.',"_")
                          // remove special charecters from email

                          seenBy[escapedDotEmail] =  false                              
                        }
                      }





                      for(let i = 0; i < messagesArray.length; i++){
                      
                        console.warn('object.text ' + messagesObject[ messagesArray[i] ].text)
                        console.warn('object.bold ' + messagesObject[ messagesArray[i] ].bold)
                        console.warn('array '+ messagesArray[i])
                      
                          if(i == 0){
                            
                              // last activity
                                await setDoc(doc(db, "Messenger", messengerRef ), {
                                  lastActivity: serverTimestamp()
                                },
                                {merge: true })
                              // last activity


                              // put in db
                                smsDocId = await addDoc(collection(db, "Messenger", messengerRef, "sms" ), 
                                {
                                  messengerData:{
                                    [i]: {
                                      text: messagesObject[ messagesArray[i] ].text,
                                      bold: messagesObject[ messagesArray[i] ].bold,
                                      italic: messagesObject[ messagesArray[i] ].italic,
                                      fontFamily: messagesObject[ messagesArray[i] ].fontFamily,
                                      align: messagesObject[ messagesArray[i] ].align
                                    }
                                  },
                                  send: {
                                    id: myId,
                                    time: serverTimestamp()
                                  },
                                  seenBy
                                },
                                {merge: true })
                              // put in bd                             

                          } else if( i > 0 ) {
                            if( messagesObject[ messagesArray[i] ].text != '' ){
                              
                                await setDoc(doc(db, "Messenger", messengerRef, "sms", smsDocId.id ), 
                                {
                                  messengerData:{
                                    [i]: {
                                      text: messagesObject[ messagesArray[i] ].text,
                                      bold: messagesObject[ messagesArray[i] ].bold,
                                      italic: messagesObject[ messagesArray[i] ].italic,
                                      fontFamily: messagesObject[ messagesArray[i] ].fontFamily,
                                      align: messagesObject[ messagesArray[i] ].align
                                    }
                                  }
                                },
                                {merge: true })
                              
                            }

                          }
                      

                          // all done (clear everything)
                            if( i + 1 == messagesArray.length ) {
                              clearMessageArrayObjectAndTextareaDraft()
                            }
                          // all done (clear everything)
                      }
                    } else clearMessageArrayObjectAndTextareaDraft()

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
  // messenger button & panel





  // friends, requests and followers panel
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


      // total length and currently showing number
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
      // total length and currently showing number



      const docSnap = await getDoc( doc(db, "Moments", myId, 'friendsAndFollowers', 'friend') );

      if (docSnap.exists()) {

        let loopEnd = 0
        let friend_i = 0

        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time

          if( docSnap.data().friendList.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = docSnap.data().friendList.length
            showPerProfileBarThroughLoop()
          }


          // pagination section
            document.querySelector('#profilesSingelBar-currentlyShowing_freinds span').innerText = loopEnd
            document.querySelector('#profilesSingelBar-totalNumber_freinds span').innerText = docSnap.data().friendList.length
          // pagination section
        }
        loopManager()

        
        

        async function showPerProfileBarThroughLoop(){
          for (; friend_i < loopEnd; friend_i++) {

            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ docSnap.data().friendList[ friend_i ]}`)
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
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + docSnap.data().friendList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + docSnap.data().friendList[ friend_i ] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + docSnap.data().friendList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + docSnap.data().friendList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + docSnap.data().friendList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const unfriendButton = document.createElement('button')
            unfriendButton.setAttribute('class', 'profilesSingelBar-unfriendButton')
            unfriendButton.setAttribute('id', 'profilesSingelBar-unfriendButton-' + docSnap.data().friendList[ friend_i ] )
            unfriendButton.innerText = 'Unfriend'
            perProfileBarContentControl.appendChild( unfriendButton )

            const msgButton = document.createElement('div')
            msgButton.setAttribute('class', 'profilesSingelBar-msgButton')
            msgButton.setAttribute('id', 'profilesSingelBar-msgButton-' + docSnap.data().friendList[ friend_i ] )
            msgButton.innerHTML = '<span class="material-icons-outlined">question_answer</span>'
            perProfileBarContentControl.appendChild( msgButton )

            // retrive data from db
              const getProfileData = await getDoc( doc(db, "Moments", docSnap.data().friendList[ friend_i ], "profileInfo", "credentials") );
              // name
              perProfileBarContentName.innerText = getProfileData.data().name.fullName

              // pic
              const perProfilePicName = query(collection(db, "Moments", docSnap.data().friendList[ friend_i ], "profilePictures"), where('active', '==', true));

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

              // controls

              // controls
            
            // retrive data from db
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



      const docSnap = await getDoc( doc(db, "Moments", myId, 'friendsAndFollowers', 'receive') );

      if (docSnap.exists()) {

        let loopEnd = 0
        let friend_i = 0

        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time

          if( docSnap.data().receiveList.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = docSnap.data().receiveList.length
            showPerProfileBarThroughLoop()
          }

          // pagination section
            document.querySelector('#profilesSingelBar-currentlyShowing_receiveRequest span').innerText = loopEnd
            document.querySelector('#profilesSingelBar-totalNumber_receiveRequest span').innerText = docSnap.data().receiveList.length
          // pagination section
        }
        loopManager()

        
        

        async function showPerProfileBarThroughLoop(){
          for (; friend_i < loopEnd; friend_i++) {

            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ docSnap.data().receiveList[ friend_i ]}`)
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
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + docSnap.data().receiveList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + docSnap.data().receiveList[ friend_i ] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + docSnap.data().receiveList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + docSnap.data().receiveList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + docSnap.data().receiveList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const acceptButton = document.createElement('button')
            acceptButton.setAttribute('class', 'profilesSingelBar-acceptButton')
            acceptButton.setAttribute('id', 'profilesSingelBar-acceptRequest-' + docSnap.data().receiveList[ friend_i ] )
            acceptButton.innerText = 'Accept'
            perProfileBarContentControl.appendChild( acceptButton )

            const rejectRequestButton = document.createElement('button')
            rejectRequestButton.setAttribute('class', 'profilesSingelBar-rejectButton')
            rejectRequestButton.setAttribute('id', 'profilesSingelBar-rejectButton-' + docSnap.data().receiveList[ friend_i ] )
            rejectRequestButton.innerText = 'Discard'
            perProfileBarContentControl.appendChild( rejectRequestButton )

            // retrive data from db
              const getProfileData = await getDoc( doc(db, "Moments", docSnap.data().receiveList[ friend_i ], "profileInfo", "credentials") );
              // name
              perProfileBarContentName.innerText = getProfileData.data().name.fullName

              // pic
              const perProfilePicName = query(collection(db, "Moments", docSnap.data().receiveList[ friend_i ], "profilePictures"), where('active', '==', true));

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

              

              const peerId = docSnap.data().receiveList[ friend_i ]

              // accept request
              document.getElementById( 'profilesSingelBar-acceptRequest-' + docSnap.data().receiveList[ friend_i ] ).onclick = async ()=>{
                
                await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'receive'), {
                  receiveList: arrayRemove( uiD )
                },
                {merge: true })
          
                await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'send'), {
                  sendList: arrayRemove ( myId )
                },
                {merge: true })
          
          
                
                await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'friend'), {
                  friendList: arrayUnion ( uiD )
                },
                {merge: true })
        
                await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'friend'), {
                  friendList: arrayUnion ( myId )
                },
                {merge: true })
        
        
                await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), {
                  followingList: arrayUnion ( uiD )
                },
                {merge: true })
        
                await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'follower'), {
                  followerList: arrayUnion ( myId )
                },
                {merge: true })
                
                document.getElementById(`profilesSingelBar_${ peerId }`).style.visibility = 'hidden'
              }
              // accept request

              // discard request
              document.getElementById( 'profilesSingelBar-rejectButton-' + docSnap.data().receiveList[ friend_i ] ).onclick = async ()=>{

                const cancelRequestRef = doc(db, "Moments", myId, 'friendsAndFollowers', 'receive');              
                setDoc(cancelRequestRef, 
                {
                  receiveList: arrayRemove( peerId )
                },
                {merge:true})
                .then(() => {
                  console.log("Document successfully updated!");
                })
  
  
                const withdrawRequestRef = doc(db, "Moments", peerId, 'friendsAndFollowers', 'send');              
                setDoc(withdrawRequestRef, 
                {
                  sendList: arrayRemove( myId )
                },
                {merge:true})
                .then(() => {
                  console.log("Document successfully updated!");
                })

                document.getElementById(`profilesSingelBar_${ peerId }`).style.visibility = 'hidden'

              }
              // discard request
            
            // retrive data from db
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



      const docSnap = await getDoc( doc(db, "Moments", myId, 'friendsAndFollowers', 'send') );

      if (docSnap.exists()) {

        let loopEnd = 0
        let friend_i = 0

        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time

          if( docSnap.data().sendList.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = docSnap.data().sendList.length
            showPerProfileBarThroughLoop()
          }


          // pagination section
            document.querySelector('#profilesSingelBar-currentlyShowing_sentRequest span').innerText = loopEnd
            document.querySelector('#profilesSingelBar-totalNumber_sentRequest span').innerText = docSnap.data().sendList.length
          // pagination section
        }
        loopManager()

        
        

        async function showPerProfileBarThroughLoop(){
          for (; friend_i < loopEnd; friend_i++) {

            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ docSnap.data().sendList[ friend_i ]}`)
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
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + docSnap.data().sendList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + docSnap.data().sendList[ friend_i ] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + docSnap.data().sendList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + docSnap.data().sendList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + docSnap.data().sendList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const cancelButton = document.createElement('button')
            cancelButton.setAttribute('class', 'profilesSingelBar-unfriendButton')
            cancelButton.setAttribute('id', 'profilesSingelBar-cancelRequest-' + docSnap.data().sendList[ friend_i ] )
            cancelButton.innerText = 'Cancel'
            perProfileBarContentControl.appendChild( cancelButton )

            const unfollowButton = document.createElement('button')
            unfollowButton.setAttribute('class', 'profilesSingelBar-unfollowButton')
            unfollowButton.setAttribute('id', 'profilesSingelBar-unfollowButton-' + docSnap.data().sendList[ friend_i ] )
            unfollowButton.innerText = 'Unfollow'
            perProfileBarContentControl.appendChild( unfollowButton )

            // retrive data from db
              const getProfileData = await getDoc( doc(db, "Moments", docSnap.data().sendList[ friend_i ], "profileInfo", "credentials") );
              // name
              perProfileBarContentName.innerText = getProfileData.data().name.fullName

              // pic
              const perProfilePicName = query(collection(db, "Moments", docSnap.data().sendList[ friend_i ], "profilePictures"), where('active', '==', true));

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

              // check you following
              const checkFollowing = query(collection(db, "Moments", myId, 'friendsAndFollowers'), where("followingList", "array-contains", docSnap.data().sendList[ friend_i ]));

              const getFollowing = await getDocs( checkFollowing );
              getFollowing.forEach((docs) => {
                unfollowButton.style.display = 'inline-block'
              })
              // check you following

              const peerId = docSnap.data().sendList[ friend_i ]

              // unfollow
              document.getElementById('profilesSingelBar-unfollowButton-' + docSnap.data().sendList[ friend_i ]).onclick = async ()=>{
                
                await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), {
                  followingList: arrayRemove ( peerId )
                },
                { merge: true })

                await setDoc(doc(db, "Moments", peerId, 'friendsAndFollowers', 'follower'), {
                  followerList: arrayRemove ( myId )
                },
                { merge: true })
                
                unfollowButton.style.display = 'none'
              }
              // unfollow

              // cancel request
              document.getElementById('profilesSingelBar-cancelRequest-' + docSnap.data().sendList[ friend_i ]).onclick = async ()=>{
                const cancelRequestRef = doc(db, "Moments", myId, 'friendsAndFollowers', 'send');              
                setDoc(cancelRequestRef, 
                {
                  sendList: arrayRemove( peerId )
                },
                {merge:true})
                .then(() => {
                  console.log("Document successfully updated!");
                })
        
        
                const withdrawRequestRef = doc(db, "Moments", peerId, 'friendsAndFollowers', 'receive');              
                setDoc(withdrawRequestRef, 
                {
                  receiveList: arrayRemove( myId )
                },
                {merge:true})
                .then(() => {
                  console.log("Document successfully updated!");
                })
                
                
                await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'follower'), {
                  followerList: arrayRemove( peerId )
                },
                {merge: true })

                document.getElementById(`profilesSingelBar_${ peerId }`).style.visibility = 'hidden'
              }
              // cancel request
            
            // retrive data from db
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



      const docSnap = await getDoc( doc(db, "Moments", myId, 'friendsAndFollowers', 'follower') );

      if (docSnap.exists()) {

        let loopEnd = 0
        let friend_i = 0

        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time

          if( docSnap.data().followerList.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = docSnap.data().followerList.length
            showPerProfileBarThroughLoop()
          }

          // pagination section
            document.querySelector('#profilesSingelBar-currentlyShowing_follower span').innerText = loopEnd
            document.querySelector('#profilesSingelBar-totalNumber_follower span').innerText = docSnap.data().followerList.length
          // pagination section
        }
        loopManager()

        
        

        async function showPerProfileBarThroughLoop(){
          for (; friend_i < loopEnd; friend_i++) {

            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ docSnap.data().followerList[ friend_i ]}`)
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
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + docSnap.data().followerList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + docSnap.data().followerList[ friend_i ] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + docSnap.data().followerList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + docSnap.data().followerList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + docSnap.data().followerList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const followbackButton = document.createElement('button')
            followbackButton.setAttribute('class', 'profilesSingelBar-followbackButton')
            followbackButton.setAttribute('id', 'profilesSingelBar-followbackButton-' + docSnap.data().followerList[ friend_i ] )
            followbackButton.innerText = 'Follow Back'
            perProfileBarContentControl.appendChild( followbackButton )

            const followerButton = document.createElement('button')
            followerButton.setAttribute('class', 'profilesSingelBar-followerButton')
            followerButton.setAttribute('id', 'profilesSingelBar-followerButton-' + docSnap.data().followerList[ friend_i ] )
            followerButton.innerText = 'Following you'
            perProfileBarContentControl.appendChild( followerButton )

            // retrive data from db
              const getProfileData = await getDoc( doc(db, "Moments", docSnap.data().followerList[ friend_i ], "profileInfo", "credentials") );
              // name
              perProfileBarContentName.innerText = getProfileData.data().name.fullName

              // pic
              const perProfilePicName = query(collection(db, "Moments", docSnap.data().followerList[ friend_i ], "profilePictures"), where('active', '==', true));

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

              

              const peerId = docSnap.data().followerList[ friend_i ]

              // check following
              const checkFollowing = query(collection(db, "Moments", myId, 'friendsAndFollowers'), where("followingList", "array-contains", peerId ));
              /*
              const getFollowing = await getDocs( checkFollowing );
              getFollowing.forEach((docs) => {
                followbackButton.innerText = 'You Following'
              })
              */
              const unsubscribe = onSnapshot( checkFollowing, (querySnapshot) => {
                querySnapshot.forEach((docs) => {
                  followbackButton.innerText = 'You Following'
                })
              })
              // check following

              // follow back
              followbackButton.onclick = async ()=>{
                
                await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), {
                  followingList: arrayUnion ( peerId )
                },
                { merge: true })

                await setDoc(doc(db, "Moments", peerId, 'friendsAndFollowers', 'follower'), {
                  followerList: arrayUnion ( myId )
                },
                { merge: true })
              }
              // follow back
            
            // retrive data from db
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



      const docSnap = await getDoc( doc(db, "Moments", myId, 'friendsAndFollowers', 'following') );

      if (docSnap.exists()) {

        let loopEnd = 0
        let friend_i = 0

        function loopManager(){
          loopEnd = loopEnd + 10 // 2 is the number how many friends will be shown at a time

          if( docSnap.data().followingList.length > loopEnd ){
            showPerProfileBarThroughLoop()
          } else {
            loopEnd = docSnap.data().followingList.length
            showPerProfileBarThroughLoop()
          }


          // pagination section
            document.querySelector('#profilesSingelBar-currentlyShowing_following span').innerText = loopEnd
            document.querySelector('#profilesSingelBar-totalNumber_following span').innerText = docSnap.data().followingList.length
          // pagination section
        }
        loopManager()

        
        

        async function showPerProfileBarThroughLoop(){
          for (; friend_i < loopEnd; friend_i++) {

            const perProfileBar = document.createElement('div')
            perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBarNo-' + friend_i )
            perProfileBar.setAttribute('id', `profilesSingelBar_${ docSnap.data().followingList[ friend_i ]}`)
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
            perProfileBarHolder.setAttribute('id', 'profilesSingelBar-imageHolder-' + docSnap.data().followingList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarHolder )

            const perProfileBarImg = document.createElement('img')
            perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
            perProfileBarImg.setAttribute('id', 'profilesSingelBar-img-' + docSnap.data().followingList[ friend_i ] )
            perProfileBarHolder.appendChild( perProfileBarImg )
            perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

            const perProfileBarContent = document.createElement('div')
            perProfileBarContent.setAttribute('class', 'profilesSingelBar-content')
            perProfileBarContent.setAttribute('id', 'profilesSingelBar-content-' + docSnap.data().followingList[ friend_i ] )
            perProfileBar.appendChild( perProfileBarContent )

            const perProfileBarContentName = document.createElement('div')
            perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
            perProfileBarContentName.setAttribute('id', 'profilesSingelBar-contentName-' + docSnap.data().followingList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentName )

            const perProfileBarContentControl = document.createElement('div')
            perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl')
            perProfileBarContentControl.setAttribute('id', 'profilesSingelBar-contentControl-' + docSnap.data().followingList[ friend_i ] )
            perProfileBarContent.appendChild( perProfileBarContentControl )

            const unfollowButton = document.createElement('button')
            unfollowButton.setAttribute('class', 'profilesSingelBar-unfollowButton')
            unfollowButton.setAttribute('id', 'profilesSingelBar-unfollowButton-' + docSnap.data().followingList[ friend_i ] )
            unfollowButton.innerText = 'Unfollow'
            perProfileBarContentControl.appendChild( unfollowButton )
            unfollowButton.style.display = 'inline-block'

            const friendButton = document.createElement('button')
            friendButton.setAttribute('class', 'profilesSingelBar-friendButton')
            friendButton.setAttribute('id', 'profilesSingelBar-friendButton-' + docSnap.data().followingList[ friend_i ] )
            friendButton.innerText = 'Not friend yet.'
            perProfileBarContentControl.appendChild( friendButton )

            // retrive data from db
              const getProfileData = await getDoc( doc(db, "Moments", docSnap.data().followingList[ friend_i ], "profileInfo", "credentials") );
              // name
              perProfileBarContentName.innerText = getProfileData.data().name.fullName

              // pic
              const perProfilePicName = query(collection(db, "Moments", docSnap.data().followingList[ friend_i ], "profilePictures"), where('active', '==', true));

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

              

              const peerId = docSnap.data().followingList[ friend_i ]

              // unfollow
              unfollowButton.onclick = async ()=>{
                
                await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), {
                  followingList: arrayRemove ( peerId )
                },
                { merge: true })

                await setDoc(doc(db, "Moments", peerId, 'friendsAndFollowers', 'follower'), {
                  followerList: arrayRemove ( myId )
                },
                { merge: true })

                document.getElementById( `profilesSingelBar_${ peerId }` ).style.visibility = 'hidden'
              }
              // unfollow

              // check friend
              const checkFriend = query(collection(db, "Moments", myId, 'friendsAndFollowers'), where("friendList", "array-contains", peerId ));

              const getFriend = await getDocs( checkFriend );
              getFriend.forEach((docs) => {
                friendButton.innerText = 'Friend'
              })
              // check friend
            
            // retrive data from db
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
          const checkFriend = query(collection(db, "Moments", myId, 'friendsAndFollowers'), where("friendList", "array-contains", DOMPurify.sanitize( formInput.value ) ));

          const getFriend = await getDocs( checkFriend );
          getFriend.forEach(async (docs) => {

            outputContainer.innerHTML = '' // reset old data

            // show searched id
              const perProfileBar = document.createElement('div')
              perProfileBar.setAttribute('class', 'profilesSingelBar-friendsFollowerRequestsMainbody profilesSingelBar-addFamilyMember' )
              perProfileBar.setAttribute('id', `addFamilyMemberProfileBar_${ DOMPurify.sanitize( formInput.value ) }`)
              outputContainer.appendChild( perProfileBar )

            
              const perProfileBarHolder = document.createElement('div')
              perProfileBarHolder.setAttribute('class', 'profilesSingelBar-imageHolder')
              perProfileBarHolder.setAttribute('id', 'addFamilyMemberProfileBar-imageHolder-' + DOMPurify.sanitize( formInput.value ) )
              perProfileBar.appendChild( perProfileBarHolder )

              const perProfileBarImg = document.createElement('img')
              perProfileBarImg.setAttribute('class', 'profilesSingelBar-img')
              perProfileBarImg.setAttribute('id', 'addFamilyMemberProfileBar-img-' + DOMPurify.sanitize( formInput.value ) )
              perProfileBarHolder.appendChild( perProfileBarImg )
              perProfileBarImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'

              const perProfileBarContent = document.createElement('div')
              perProfileBarContent.setAttribute('class', 'profilesSingelBar-content profilesSingelBar-addFamilyMemberContent')
              perProfileBarContent.setAttribute('id', 'addFamilyMemberProfileBar-content-' + DOMPurify.sanitize( formInput.value ) )
              perProfileBar.appendChild( perProfileBarContent )

              const perProfileBarContentName = document.createElement('div')
              perProfileBarContentName.setAttribute('class', 'profilesSingelBar-contentName')
              perProfileBarContentName.setAttribute('id', 'addFamilyMemberProfileBar-contentName-' + DOMPurify.sanitize( formInput.value ) )
              perProfileBarContent.appendChild( perProfileBarContentName )

              const perProfileBarContentControl = document.createElement('div')
              perProfileBarContentControl.setAttribute('class', 'profilesSingelBar-contentControl profilesSingelBar-contentControl-addFamilyMember')
              perProfileBarContentControl.setAttribute('id', 'addFamilyMemberProfileBar-contentControl-' + DOMPurify.sanitize( formInput.value ) )
              perProfileBarContent.appendChild( perProfileBarContentControl )

              const addRelation = document.createElement('input')
              addRelation.setAttribute('class', 'profilesSingelBar-addRelationField')
              addRelation.setAttribute('id', 'profilesSingelBar-addRelationField-' + DOMPurify.sanitize( formInput.value ) )
              addRelation.setAttribute('placeholder', 'Write relation here.')
              perProfileBarContentControl.appendChild( addRelation )

              const addRelationButton = document.createElement('button')
              addRelationButton.setAttribute('class', 'profilesSingelBar-addRelationButton')
              addRelationButton.setAttribute('id', 'profilesSingelBar-addRelationButton-' + DOMPurify.sanitize( formInput.value ) )
              addRelationButton.innerText = 'Request'
              perProfileBarContentControl.appendChild( addRelationButton )

              // set relation field width
              function setFieldWidth(){
                const getFreeSpace = perProfileBarContentControl.offsetWidth - addRelationButton.offsetWidth
                const reduceFreeSpace = getFreeSpace - 10
                addRelation.style.width = reduceFreeSpace + 'px'
              }
              setFieldWidth()
              // set relation field width


              // retrive and put data in db
                const getProfileData = await getDoc( doc(db, "Moments", DOMPurify.sanitize( formInput.value ), "profileInfo", "credentials") );
                // name
                perProfileBarContentName.innerText = getProfileData.data().name.fullName

                // pic
                const perProfilePicName = query(collection(db, "Moments", DOMPurify.sanitize( formInput.value ), "profilePictures"), where('active', '==', true));

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

              

                const peerId = DOMPurify.sanitize( formInput.value )

                // object friendly email
                  const escapeAtTheRate = peerId.replaceAll('@',"_")
                  const escapedDot = escapeAtTheRate.replaceAll('.',"_")
                // object friendly email

                                



                // check send request
                  const checkChangeClosePersonRequest = query(collection(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'sendRequests'));
                  const unsubCheckChangeClosePersonRequest = onSnapshot( checkChangeClosePersonRequest, (querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {

                      // reset
                        addRelationButton.innerText = 'Request'
                        addRelationButton.onclick = sendRequest 

                        addRelation.value = ''

                        setFieldWidth()
                      // reset
                      
                      const checkClosePersonRequest = query(collection(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'sendRequests'), where("sendList", "array-contains", peerId ));

                      const getClosePersonRequest = await getDocs( checkClosePersonRequest );
                      getClosePersonRequest.forEach(async (docs) => {
                        addRelationButton.innerText = 'Pending ( Cancel )'
                        addRelationButton.onclick = cancelRequest

                        addRelation.value = docs.data().sendRelation[escapedDot]

                        setFieldWidth()
                      })

                    })
                  })
                // check send request

                // cancel request
                  async function cancelRequest(){
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
                        [escapedDot_myid]: deleteField()
                      }
                    },
                    { merge: true })
                  }
                // cancel request

                // my id
                  const getMyProfileData = await getDoc( doc(db, "Moments", myId, "profileInfo", "credentials") );
                // my id

                // put relation                  
                  async function sendRequest() {
                    await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'closePersons', 'sendRequests', 'send'), {
                      sendList: arrayUnion ( peerId ),
                      sendRelation: {
                        [escapedDot]: getProfileData.data().name.fullName + ' is ' + DOMPurify.sanitize( addRelation.value ) + ' of ' + getMyProfileData.data().name.fullName
                      }
                    },
                    {merge: true })
                    
                    await setDoc(doc(db, "Moments", peerId, 'friendsAndFollowers', 'closePersons', 'receiveRequests', 'receive'), {
                      receiveList: arrayUnion ( myId ),
                      receiveRelation: {
                        [escapedDot_myid]: DOMPurify.sanitize( addRelation.value ) // not needed full data because its getting field value
                      }
                    },
                    {merge: true }) 
                  }
                // put relation
              // retrive and put data in db

            // show searched id
          })
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
  // friends, requests and followers panel


  // active freind list buttion
    // on main.ejs
  // active freind list buttion
// Header bar






// sub body left side navigator
function subBodyLeftSideNavigator(){
  document.querySelector('#homeButton span').style.color = 'red'

    $("#subBodyLeftSide-navigator").load("leftNav", function(responseTxt, statusTxt, xhr){
      if(statusTxt == "success")
        console.warn("left navigator loaded successfully!");
      if(statusTxt == "error")
        alert("Can't load left navigator! Error: " + xhr.status + ": " + xhr.statusText);
    })
}
// sub body left side navigator








// call alert
function callAlertFunction() {

  const callAlert =  document.getElementById('callAlert')
  const callerName = document.getElementById('callerName')

    //alert
    let callTimer = null
    onSnapshot(doc(db, 'Moments', myId, 'call', 'management'), async (docs) => {
      if(docs.data().call.status == 'ringing'){
        
        /*
        if (  docs.data().call.group == true){
          callAlertText.innerText = docs.data().from[1] + ' is inviting you in a temporary group call'
        }
        */

        const getCallerProfilePicAndName = await getDoc( doc(db, "Moments", docs.data().call.caller, "profileInfo", "credentials") );
        if ( getCallerProfilePicAndName.exists()) {
          callerName.innerText = `You are calling to ${getCallerProfilePicAndName.data().name.fullName}`
        }
  
        callAlert.style.display = 'block'
        callTimer = setTimeout(()=>{ 
          callReject( docs.data().call.caller )
        }, 30000)
  
        document.getElementById('callReject').onclick = ()=>{ cancelCall(docs.data().call.caller) }
        document.getElementById('callReceive').onclick = callPicked
  
      } else {
        callAlert.style.display = 'none'
      }
    })
  
    async function callPicked(){
      await setDoc(doc(db, 'Moments', myId, 'call', 'management'), {
        'call':{
          status: 'talking',
          receiver: true
        } 
      }, {merge:true})
        
      
      callAlert.style.display = 'none'

      if(callTimer != null){
        clearTimeout(callTimer)
        callTimer = null
      }
  
      window.open( location.origin + "/chat5", '_blank', "left=5,top=5,width=1000,height=600")    
    }


    async function callReject( callerId ) { 
      await setDoc(doc(db, 'Moments', myId, 'call', 'management'), {
        'call': {
          status : ''
        }        
      }, {merge:true})

      await setDoc(doc(db, 'Moments', callerId, 'call', 'management'), {
        'call': {
          status : ''
        }        
      }, {merge:true})
    } 
  
    function cancelCall( passCallerId ) { 
      callReject( passCallerId )

      if(callTimer != null){
        clearTimeout(callTimer)
        callTimer = null
      }
    }
    //alert    
    
  }
//end of call alert



//reset video or audio call old data on force stop of webpage
async function resetAudioVideoData(){
    console.log('reset old call')
    if(localStorage.getItem("closedVideoOrAudioCall") == 'yes'){
      localStorage.setItem("closedVideoOrAudioCall", "no")
          
      const getPeerIds = JSON.parse( localStorage.getItem("peerIdsWebStorage") )
      
      for(let i = 0; i < getPeerIds.length; i++){
        console.log('getpeerids '+ getPeerIds[i])
        await setDoc(doc(db, 'Moments', myId, 'call', 'management'), {
          video: false,
          audio: false,
          to: arrayRemove( getPeerIds[i] ),
          from: arrayRemove( getPeerIds[i] ),
          status: '',
          group: false,
          increased: {
            video: 0,
            audio: 0,
            shareScreen: 0
          },
          shareScreen: false,
        }, {merge:true})
        
        //clear sendStream
        //video
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', getPeerIds[i], 'sendStream', 'video'), {
          'offer': '',
          'completeStart': {
            'video': false
          }
        }, {merge:true})
    
        const getICEsendStream = query(collection(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'sendStream', 'video', 'ICE'));
    
        const queryICEsendStream = await getDocs(getICEsendStream);
        queryICEsendStream.forEach(async (docs) => {
          await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'sendStream', 'video', 'ICE', docs.id))
        })
        //video
        //audio
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', getPeerIds[i], 'sendStream', 'audio'), {
          'offer': '',
          'completeStart': {
            'audio': false
          }
        }, {merge:true})
    
        const getICEsendStreamAudio = query(collection(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'sendStream', 'audio', 'ICE'));
    
        const queryICEsendStreamAudio = await getDocs( getICEsendStreamAudio );
        queryICEsendStreamAudio.forEach(async (docs) => {
          await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'sendStream', 'audio', 'ICE', docs.id))
        })
        //audio
        //share screen
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', getPeerIds[i], 'sendStream', 'shareScreen'), {
          'offer': '',
          'completeStart': {
            'shareScreen': false
          }
        }, {merge:true})
    
        const getICEsendStreamShareScreen = query(collection(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'sendStream', 'shareScreen', 'ICE'));
    
        const queryICEsendStreamShareScreen = await getDocs( getICEsendStreamShareScreen );
        queryICEsendStreamShareScreen.forEach(async (docs) => {
          await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'sendStream', 'shareScreen', 'ICE', docs.id))
        })
        //share screen
        //clear sendStream
  
  
  
        //clear receiveStream
        //video
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', getPeerIds[i], 'receiveStream', 'video'), {
          'answer': ''
        }, {merge:true})
    
        const getICEreceiveStream = query(collection(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'receiveStream', 'video', 'ICE'));
    
        const queryICEreceiveStream = await getDocs(getICEreceiveStream);
        queryICEreceiveStream.forEach(async (docs) => {
          await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'receiveStream', 'video', 'ICE', docs.id))
        })
        //video
        //audio
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', getPeerIds[i], 'receiveStream', 'audio'), {
          'answer': ''
        }, {merge:true})
    
        const getICEreceiveStreamAudio = query(collection(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'receiveStream', 'audio', 'ICE'));
    
        const queryICEreceiveStreamAudio = await getDocs( getICEreceiveStreamAudio );
        queryICEreceiveStreamAudio.forEach(async (docs) => {
          await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'receiveStream', 'audio', 'ICE', docs.id))
        })
        //audio
        //share screen
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', getPeerIds[i], 'receiveStream', 'shareScreen'), {
          'answer': ''
        }, {merge:true})
    
        const getICEreceiveStreamShareScreen = query(collection(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'receiveStream', 'shareScreen', 'ICE'));
    
        const queryICEreceiveStreamShareScreen = await getDocs( getICEreceiveStreamShareScreen );
        queryICEreceiveStreamShareScreen.forEach(async (docs) => {
          await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', getPeerIds[i], 'receiveStream', 'shareScreen', 'ICE', docs.id))
        })
        //share screen
        //clear receiveStream
      }
    }
  }
  //reset video or audio call old data on force stop of webpage






//background picture
async function backgroundPic(){  
  let picName
  const getBg = await getDoc(doc(db, "MomentsStorage", 'data'));
  if (getBg.exists()) {
    picName = getBg.data().backgroundPic.light[4]
  }

  console.log(picName)  

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
//background picture