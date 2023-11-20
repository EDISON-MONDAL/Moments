import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs, getDoc, doc, query, where, 
    setDoc,
    onSnapshot,
    updateDoc,
    deleteField,
    deleteDoc,
    orderBy, limit, serverTimestamp,
    collectionGroup, addDoc, arrayRemove, arrayUnion
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


//init firebase services
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app);


let localStream = null;
let localAudioStream = null
let localShareScreenStream = null

let myId
const caleeId = localStorage.getItem("caleeId")
const MeetingURL = ''
let callType = 'private'

const peerIds = []
localStorage.setItem("peerIdsWebStorage", JSON.stringify(peerIds)) //set default to get read of blank value error
const onScreenPeerIds = []

const callButton = document.querySelector('#call')
const callCutButton = document.querySelector('#callCut')



//begining of code execution
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      myId = user.email;    

      openUserMedia()

      const getCallData = await getDoc(doc(db, "Moments", myId, "call", "management"))
      // get call type        
        if( getCallData.data().call.type == 'private'){
          callType = 'private'
        }
      // get call type

      // get meeting room url
        MeetingURL =  getCallData.data().meetingRoomURL
      // get meeting room url

      const delay = setTimeout(startFunctioning, 5000)
      /*
      soundBox()
      addMyNameParticipentsPanel()
      
      showMyProfilepic()
      displayMyName()
      nav_previous_next_func()
      */
    }
  })
//begining of code execution




/* 
* peer connection setup
* database controll
*/
  //call button state
    function callButtonState(){
      onSnapshot(doc(db, "Moments", myId, "call", "management"), (doc) => {
        if(doc.data().call.status == 'calling' || doc.data().call.status == 'talking'|| doc.data().call.status == 'ringing' ){
          callButton.style.display = 'none'
          callCutButton.style.display = 'inline-block'
        }
        else if( doc.data().call.status == '' ){
          callButton.style.display = 'inline-block'
          callCutButton.style.display = 'none'
        }
      })
    }
  //call button state


  


async function startFunctioning(){  

  callButtonState()

  callButton.onclick = checkPeerIsNotInCall
  

  // check calee isn't in another call
    async function checkPeerIsNotInCall(){ 
      // private call
      if( callType == 'private' ){
        const getEngedInCall = await getDoc(doc(db, "Moments", caleeId, "call", "management"))
        if(getEngedInCall.data().call.status != 'calling' 
        || getEngedInCall.data().call.status != 'talking' || getEngedInCall.data().call.status != 'ringing'){

          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'call': {
              'status': 'calling'
            }
          }, {merge:true})


          //alert peer im calling
            await setDoc(doc(db, "Moments", caleeId, "call", "management"), {
              'call': {
                'caller': myId,
                'status': 'ringing'
              }
            }, { merge: true })
          //alert peer im calling


    
          //In no response call will be dismised within 30 seconds
            const caleeRingingListener = onSnapshot(doc(db, "Moments", caleeId, "call", "management"), async ( snapshot ) => {
              if( snapshot ){

                let timer = null

                if (snapshot.data().call.status != 'talking' && snapshot.data().call.status == 'ringing' && snapshot.data().call.caller == myId) {

                  caleeRingingListener() //delete listener

                  document.querySelector('#alertMessage').style.display = 'block'
                  resize_perticipents_panal() // set x,y position correctly alertMessage box


                  const getCaleeName = await getDoc( doc(db, "Moments", caleeId, "profileInfo", "credentials") );
                  if ( getCaleeName.exists()) {
                    document.querySelector('#alerText').innerText = `You are calling to ${getCaleeName.data().name.fullName}`
                  }

        
              
                  let seconds = 30
                  timer = setInterval( async () => { 
                    --seconds

                    document.querySelector('#alerTimeRemaining').innerText = `Call remaining ${seconds} seconds ...`

                    if(seconds == 0){ 
                      clearInterval(timer)

                      await setDoc(doc(db, "Moments", myId, "call", "management"), {
                        'call': {
                          'status': ''
                        }
                      }, {merge:true})
      
                      await setDoc(doc(db, "Moments", caleeId, "call", "management"), {
                        'call': {
                          'status': '',
                        }
                      }, {merge:true})
            
                      document.querySelector('#alerTimeRemaining').innerText = `Call remaining ${seconds} second. 
                      Call again!`
                    }

                  }, 1000)
                }


                const caleeReceiverORRejectListener = onSnapshot(doc(db, "Moments", caleeId, "call", "management"), async snapshotUpdated => {
                  if (snapshotUpdated.data().call.status == 'talking' && snapshotUpdated.data().call.caller == myId ){

                    if(timer != null ){
                      clearInterval(timer)
                      timer = null
                    }              

                    caleeRingingListener() //delete parent listener
                    caleeReceiverORRejectListener() //delete this listener

                    document.querySelector('#alertMessage').style.display = 'none'

                    // start call
                      call( caleeId )
                    // start call
                  } 
                  else if ( snapshotUpdated.data().call.status == '' && snapshotUpdated.data().call.caller == myId ){
                    if(timer != null ){
                      clearInterval(timer)
                      timer = null
                    }              

                    caleeRingingListener() //delete parent listener
                    caleeReceiverORRejectListener() //delete this listener

                    document.querySelector('#alertMessage').style.display = 'block'
                    resize_perticipents_panal() // set x,y position correctly alertMessage box

                    const getCaleeName = await getDoc( doc(db, "Moments", caleeId, "profileInfo", "credentials") );
                    if ( getCaleeName.exists()) {
                      document.querySelector('#alerText').innerText = `${getCaleeName.data().name.fullName} ignored your call.`
                      document.querySelector('#alerTimeRemaining').innerText = ''
                    }
                  }
                })

              }
            })
          //In no response call will be dismised within 30 seconds
    

        } else {
          const getCaleeName = await getDoc( doc(db, "Moments", caleeId, "profileInfo", "credentials") );
          if ( getCaleeName.exists()) {
            alert(`${getCaleeName.data().name.fullName} is engaged in another call.`)
          }        
        }  
      }
      // private call
    }
  // check calee isn't in another call

  // hide alert box
    document.querySelector('#alertMessage #alertMessageClose').onclick = ()=>{
      document.querySelector('#alertMessage').style.display = 'none'
    }
  // hide alert box


  
  

  /*
  
  //store call id, store received id and also store group ids in local array
    //maintain perticipents panel
    onSnapshot(doc(db, "Moments", myId, "call", "management"), async (docs) => {
      //called
      for (let i = 0; i < docs.data().to.length; i++) {        
        if(peerIds.includes( docs.data().to[i] ) == false && docs.data().to[i] != ''){
          if( peerIds.push( docs.data().to[i]) ){
            call( docs.data().to[i] )

            localStorage.setItem("peerIdsWebStorage", JSON.stringify(peerIds))
            
            //add in perticipents panel
            const makDiv = document.createElement("div")
            makDiv.innerText = docs.data().call.to[i]
            makDiv.setAttribute('id', `panelBox_${docs.data().call.to[i]}`)
            document.querySelector('#perticipentsNameList').appendChild( makDiv )
            //add in perticipents panel
            
          }
        }
      }
      //called
    
      //received
      for (let i = 0; i < docs.data().from.length; i++) {        
        if(peerIds.includes( docs.data().from[i] ) == false && docs.data().from[i] != ''){
          if( peerIds.push( docs.data().from[i] ) ){
            console.warn('new id stored id call.from '+ docs.data().from[i])

            //check i have received the call
            if(docs.data().status == 'received'){
              receive( docs.data().from[i] )

              
              //add in perticipents panel
              const makDiv = document.createElement("div")
              makDiv.innerText = docs.data().call.from[i]
              makDiv.setAttribute('id', `panelBox_${docs.data().call.from[i]}`)
              document.querySelector('#perticipentsNameList').appendChild( makDiv )
              //add in perticipents panel
              
            }
            //check i have received the call

            localStorage.setItem("peerIdsWebStorage", JSON.stringify(peerIds))
          }        
        }        
      }
      //received


      //on group call collect ids from peer
      //               const delay = setTimeout(collectPeersIds, 3000)
      async function collectPeersIds(){
        clearTimeout(delay)
        const checkGroupCall = await getDoc( doc(db, "Moments", myId) );

        if (checkGroupCall.data().call.group == true) {

          const grabPeerPerticipents = await getDoc( doc(db, "Moments", checkGroupCall.data().call.from[1]) );

          for (let i = 0; i < grabPeerPerticipents.data().call.to.length; i++) {
            if( grabPeerPerticipents.data().call.to[i] != '' && grabPeerPerticipents.data().call.to[i] != myId){
        
              await setDoc(doc(db, 'Moments', myId), {
                'call': {
                  'to': arrayUnion( grabPeerPerticipents.data().call.to[i] ),
                  'group': false
                }
              }, {merge:true})

              await setDoc(doc(db, 'Moments', grabPeerPerticipents.data().call.to[i] ), {
                'call': {
                  'from': arrayUnion( myId ),
                  'group': false
                }
              }, {merge:true})
        
            console.log('uploaded in call.to '+ grabPeerPerticipents.data().call.to[i])
            }
          }


          for (let i = 0; i < grabPeerPerticipents.data().call.from.length; i++) {
            if( grabPeerPerticipents.data().call.from[i] != '' && grabPeerPerticipents.data().call.from[i] != myId){
        
              await setDoc(doc(db, 'Moments', myId), {
                'call': {
                  'to': arrayUnion( grabPeerPerticipents.data().call.from[i] ),
                  'group': false
                }
              }, {merge:true})

              await setDoc(doc(db, 'Moments', grabPeerPerticipents.data().call.from[i] ), {
                'call': {
                  'from': arrayUnion( myId ),
                  'group': false
                }
              }, {merge:true})
        
            console.log('uploaded in call.from '+ grabPeerPerticipents.data().call.from[i])
            }
          }
        }
      }
      //on group call collect ids from peer
    })
    //maintain perticipents panel
  //store call id, store received id and also store group ids in local array
    */


  const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };



  


//call to start
async function call(calee){
  
  //send stream
  let peerConnectionSendStream = null
  let peerConnectionSendStreamAudio = null
  let peerConnectionSendStreamShareScreen = null

  let unsubscribeRemoteDescription = null
  let unsubscribeRemoteDescriptionAudio = null
  let unsubscribeRemoteDescriptionShareScreen = null

  let unsubscribeRemoteICEListener = null
  let unsubscribeRemoteICEListenerAudio = null
  let unsubscribeRemoteICEListenerShareScreen = null

  let unsubLocalIncrementListener = null
  let unsubLocalIncrementListenerAudio = null
  let unsubOnOrOffLocalListenerShareScreen = null

  let lookLocalStrIncrementVideo = 0
  let lookLocalStrIncrementVideoInside = 0

  let lookLocalStrIncrementAudio = 0
  let lookLocalStrIncrementAudioInside = 0

  let lookLocalStrIncrementShareScreen = 0

  const getIncrement = await getDoc( doc(db, "Moments", myId, "call", "management") );
  if (getIncrement.exists()) {
    lookLocalStrIncrementVideo = getIncrement.data().device.increased.video
    lookLocalStrIncrementAudio = getIncrement.data().device.increased.audio
    lookLocalStrIncrementShareScreen = getIncrement.data().device.increased.shareScreen
  }  
  
  const localVideoStremChangingListener = onSnapshot(doc(db, "Moments", myId, "call", "management"), async (docs) => {
    if(lookLocalStrIncrementVideo < docs.data().device.increased.video ){
      console.warn("Local Video call increased to: "+ calee +" ", docs.data().device.increased.video );            
      
      
        const delay = setTimeout( async ()=>{
          //check video is on or not and share screen off
          const checkPeerVideoIsOnOrNot = await getDoc( doc(db, "Moments", myId, "call", "management") );
          if ( checkPeerVideoIsOnOrNot.data().device.media.video == true && checkPeerVideoIsOnOrNot.data().device.media.shareScreen == false ){
            sendVideoStream(calee)
            console.warn('re-video calling')
          }
          //check video is on or not and share screen off

          clearTimeout(delay)
        }, 4000)        
      

        lookLocalStrIncrementVideo++
    }
  })
  
  const localAudioStremChangingListener = onSnapshot(doc(db, "Moments", myId, "call", "management"), async (docs) => {
    if(lookLocalStrIncrementAudio < docs.data().device.increased.audio ){
      console.warn("Local audio call increased to: "+ calee +" ", docs.data().device.increased.audio );            
      
      
        const delay = setTimeout( async ()=>{
          //make audio call
          sendAudioStream( calee )
          console.warn('re audio calling')
          //make audio call

          clearTimeout(delay)
        }, 2000)        
      

        lookLocalStrIncrementAudio++
    }
  })
  
  
  const localShareScreenStatusChangeListener = onSnapshot(doc(db, "Moments", myId, "call", "management"), async (docs) => {
    if(lookLocalStrIncrementShareScreen < docs.data().device.increased.shareScreen ){

      console.warn("shared screen calling to: "+ calee +" ", docs.data().device.increased.shareScreen );            
      
      
        const delay = setTimeout( async ()=>{
          //check share screen is on or not
          const checkPeerShareScreenIsOnOrNot = await getDoc( doc(db, "Moments", myId) );
          if ( checkPeerShareScreenIsOnOrNot.data().device.shareScreen == true){
            sendShareScreenStream(calee)
            console.warn('re share screen calling')
          }
          //check share screen is on or not

          clearTimeout(delay)
        }, 4000)        
      

        lookLocalStrIncrementShareScreen++
    }
  })
  

  
  async function sendVideoStream( peerId ) {
    console.log('Create PeerConnection for video: ', configuration);
    peerConnectionSendStream = new RTCPeerConnection(configuration);

  
    peerConnectionSendStream.addEventListener('icegatheringstatechange', iceGatheringstate);
    async function iceGatheringstate(){
      console.log(`ICE gathering state changed: ${peerConnectionSendStream.iceGatheringState} for ${peerId}`);

      if( peerConnectionSendStream.iceGatheringState == 'complete') {
        await setDoc(doc(db, 'Meetings', MeetingURL, 'members', myId, peerId, 'offer', 'video', 'data'), {
          'completeStart': {
            'video': true
          }
        }, {merge:true})
      }
    }
      
  
    peerConnectionSendStream.addEventListener('connectionstatechange', connectionStates);
      async function connectionStates(){
        console.log(`Connection state change: ${peerConnectionSendStream.connectionState}`);
        /*
        if( peerConnectionSendStream.connectionState == 'failed' || peerConnectionSendStream.connectionState == 'closed'){

          deletePeerPermanently( calee, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
            peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
        }
        */
      }
  
    peerConnectionSendStream.addEventListener('signalingstatechange', signalingstate);
      
  
    peerConnectionSendStream.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      


    localStream.getTracks().forEach(track => {
      peerConnectionSendStream.addTrack(track, localStream);
      console.log('local track added to peer connection')
    });  


    // Code for collecting ICE candidates below
    let ICE_Number = 0
    peerConnectionSendStream.addEventListener('icecandidate', iceCandiateListeners);
      async function iceCandiateListeners(event){
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        ICE_Number++
        await setDoc(doc(db, 'Meetings', MeetingURL, 'members', myId, peerId, 'offer', 'video', 'data', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
      }
    // Code for collecting ICE candidates above


    // Code for creating a room below
    const offer = await peerConnectionSendStream.createOffer();
    await peerConnectionSendStream.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(doc(db, 'Meetings', MeetingURL, 'members', myId, peerId, 'offer', 'video', 'data'), roomWithOffer)

    console.warn(`video called to: ${peerId}`);
    //document.querySelector('#currentRoom').innerText = `your id is: ${myId} and your peer is: ${peerId}`
    // Code for creating a room above

    /*
    
    // Listening for remote session description below
    unsubscribeRemoteDescription = onSnapshot(doc(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'video'), async snapshot => {
      const data = snapshot.data();
      if (!peerConnectionSendStream.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnectionSendStream.setRemoteDescription(rtcSessionDescription);
      }
    });
    // Listening for remote session description above
  
    // Listen for remote ICE candidates below
    unsubscribeRemoteICEListener = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'video', 'ICE')), async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnectionSendStream.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listen for remote ICE candidates above 


    const getLocalStrIncrement2 = await getDoc( doc(db, "Moments", myId) );

    if (getLocalStrIncrement2.exists()) {
      lookLocalStrIncrementVideoInside = getLocalStrIncrement2.data().call.increased.video
    }
    
    unsubLocalIncrementListener = onSnapshot(doc(db, "Moments", myId), async (docs) => {
      if(lookLocalStrIncrementVideoInside < docs.data().call.increased.video ){
        lookLocalStrIncrementVideoInside++

        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'video'), {
          'completeStart': {
            'video': false
          }
        }, {merge:true})

        stopSendPeerConnection( peerId, docs.data().call.increased.video, peerConnectionSendStream, unsubscribeRemoteDescription, unsubscribeRemoteICEListener, unsubLocalIncrementListener )      
      
      }
    })

    */
    
  }
  async function sendAudioStream(peerId) {
    console.log('Create PeerConnection for audio: ', configuration);
    peerConnectionSendStreamAudio = new RTCPeerConnection(configuration);

  
    peerConnectionSendStreamAudio.addEventListener('icegatheringstatechange', iceGatheringstate);
    async function iceGatheringstate(){
      console.log(`ICE gathering state changed: ${peerConnectionSendStreamAudio.iceGatheringState}`);

      if( peerConnectionSendStreamAudio.iceGatheringState == 'complete') {
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'audio'), {
          'completeStart': {
            'audio': true
          }
        }, {merge:true})
      }
    }
    
      
  
    peerConnectionSendStreamAudio.addEventListener('connectionstatechange', connectionStates);
      async function connectionStates(){
        console.log(`Connection state change: ${peerConnectionSendStreamAudio.connectionState}`);
    
        if( peerConnectionSendStreamAudio.connectionState == 'failed' || peerConnectionSendStreamAudio.connectionState == 'closed'){
          
          deletePeerPermanently( calee, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
            peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
        }
      }
  
      peerConnectionSendStreamAudio.addEventListener('signalingstatechange', signalingstate);
      
  
      peerConnectionSendStreamAudio.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      


      localAudioStream.getTracks().forEach(track => {
        peerConnectionSendStreamAudio.addTrack(track, localAudioStream);
        console.log('local track added to audio peer connection')
      });  


    // Code for collecting ICE candidates below
    let ICE_Number = 0
    peerConnectionSendStreamAudio.addEventListener('icecandidate', iceCandiateListeners);
      async function iceCandiateListeners(event){
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        ICE_Number++
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'audio', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
      }
    // Code for collecting ICE candidates above


    // Code for creating a room below
    const offer = await peerConnectionSendStreamAudio.createOffer();
    await peerConnectionSendStreamAudio.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'audio'), roomWithOffer)

    console.warn(`audio called to: ${peerId}`);
    //document.querySelector('#currentRoom').innerText = `your id is: ${myId} and your peer is: ${peerId}`
    // Code for creating a room above


    
    // Listening for remote session description below
    unsubscribeRemoteDescriptionAudio = onSnapshot(doc(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'audio'), async snapshot => {
      const data = snapshot.data();
      if (!peerConnectionSendStreamAudio.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnectionSendStreamAudio.setRemoteDescription(rtcSessionDescription);
      }
    });
    // Listening for remote session description above
  
    // Listen for remote ICE candidates below
    unsubscribeRemoteICEListenerAudio = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'audio', 'ICE')), async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnectionSendStreamAudio.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listen for remote ICE candidates above 


    const getLocalStrIncrement2 = await getDoc( doc(db, "Moments", myId) );

    if (getLocalStrIncrement2.exists()) {
      lookLocalStrIncrementAudioInside = getLocalStrIncrement2.data().call.increased.audio
    }
    
    unsubLocalIncrementListenerAudio = onSnapshot(doc(db, "Moments", myId), async (docs) => {
      if(lookLocalStrIncrementAudioInside < docs.data().call.increased.audio ){
        lookLocalStrIncrementAudioInside++

        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'audio'), {
          'completeStart': {
            'audio': false
          }
        }, {merge:true})

        stopSendPeerConnection( peerId, docs.data().call.audio, peerConnectionSendStreamAudio, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteICEListenerAudio, unsubLocalIncrementListenerAudio )      
      
      }
    })
    
  }
  async function sendShareScreenStream(peerId) {

    console.log('Create PeerConnection for share screen: ', configuration);
    peerConnectionSendStreamShareScreen = new RTCPeerConnection(configuration);

  
    peerConnectionSendStreamShareScreen.addEventListener('icegatheringstatechange', iceGatheringstate);
    async function iceGatheringstate(){
      console.log(`ICE gathering state changed: ${peerConnectionSendStreamShareScreen.iceGatheringState}`);

      if( peerConnectionSendStreamShareScreen.iceGatheringState == 'complete') {
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen'), {
          'completeStart': {
            'shareScreen': true
          }
        }, {merge:true})
      }
    }
      
  
    peerConnectionSendStreamShareScreen.addEventListener('connectionstatechange', connectionStates);
      async function connectionStates(){
        console.log(`Connection state change: ${peerConnectionSendStreamShareScreen.connectionState}`);
    
        if( peerConnectionSendStreamShareScreen.connectionState == 'failed' || peerConnectionSendStreamShareScreen.connectionState == 'closed'){
          
          deletePeerPermanently( calee, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
            peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
        }
      }
  
    peerConnectionSendStreamShareScreen.addEventListener('signalingstatechange', signalingstate);
      
  
    peerConnectionSendStreamShareScreen.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      


    localShareScreenStream.getTracks().forEach(track => {
      peerConnectionSendStreamShareScreen.addTrack(track, localShareScreenStream);
      console.log('local track added to peer connection')
    });  


    // Code for collecting ICE candidates below
    let ICE_Number = 0
    peerConnectionSendStreamShareScreen.addEventListener('icecandidate', iceCandiateListeners);
      async function iceCandiateListeners(event){
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        ICE_Number++
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
      }
    // Code for collecting ICE candidates above


    // Code for creating a room below
    const offer = await peerConnectionSendStreamShareScreen.createOffer();
    await peerConnectionSendStreamShareScreen.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen'), roomWithOffer)

    console.log(`share screen called to: ${peerId}`);
    //document.querySelector('#currentRoom').innerText = `your id is: ${myId} and your peer is: ${peerId}`
    // Code for creating a room above


    
    // Listening for remote session description below
    unsubscribeRemoteDescriptionShareScreen = onSnapshot(doc(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'shareScreen'), async snapshot => {
      const data = snapshot.data();
      if (!peerConnectionSendStreamShareScreen.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnectionSendStreamShareScreen.setRemoteDescription(rtcSessionDescription);
      }
    });
    // Listening for remote session description above
  
    // Listen for remote ICE candidates below
    unsubscribeRemoteICEListenerShareScreen = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'shareScreen', 'ICE')), async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnectionSendStreamShareScreen.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listen for remote ICE candidates above 


    
    
    unsubOnOrOffLocalListenerShareScreen = onSnapshot(doc(db, "Moments", myId), async (docs) => {
      if( docs.data().call.shareScreen == false ){

        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen'), {
          'completeStart': {
            'shareScreen': false
          }
        }, {merge:true})
        

        stopSendPeerConnection( peerId, docs.data().call.increased.shareScreen, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescriptionShareScreen, unsubscribeRemoteICEListenerShareScreen, unsubOnOrOffLocalListenerShareScreen )      
      
      }
    })
    
  }

  const delayCall = setTimeout( async ()=>{

    
  //check video is on or not and share screen off
  const checkVideoIsOnOrNot = await getDoc( doc(db, "Moments", myId, "call", "management") );
  if ( checkVideoIsOnOrNot.data().device.media.video == true && checkVideoIsOnOrNot.data().device.media.shareScreen == false ){
    sendVideoStream(calee)
    console.warn('make video call')
  }
  //check video is on or not and share screen off

  /*
  
  //start audio pc
    sendAudioStream(calee)
  //start audio pc
  
  
  //check share screen is on or not
  const checkPeerShareScreenIsOnOrNot = await getDoc( doc(db, "Moments", myId) );
  if ( checkPeerShareScreenIsOnOrNot.data().call.shareScreen == true){
    sendShareScreenStream(calee)
    console.warn('make share screen call')
  }
  //check share screen is on or not

  */
  
  clearTimeout(delayCall)
  }, 5000)
  
  //send stream


  /*
  
  //receive stream
  //remote video & audio tag
  remoteVideoFrame( calee )
  //remote video & audio tag 

  let checkVideoAndSpanCreated = setInterval(()=>{
    const remoteVideoTag = document.getElementById( 'remoteVideo_' + calee )
    const peerName = document.getElementById( 'holder_name_' + calee)

    if ( remoteVideoTag && peerName ){
      peerPicAndName( calee )
      peerPicNameControllarsInPerticipentsPanel( calee )
      clearInterval( checkVideoAndSpanCreated )
    }

    
  }, 1000)

  
  let activePeerIncrement = 0
  let interval_execution = setInterval( ()=>{
    //resize video frame on update
    const remoteVideoFrame = document.getElementById( 'videos_holder_remoteVideo_' + calee )
    if( remoteVideoFrame ){
      remoteVideoFrame.style.width = `${ videoFrameWidths }px`
      remoteVideoFrame.style.height = `${ videoFrameHeights }px`
    }
    //resize video frame on update

    //check calee is in active array
    if( onScreenPeerIds.includes( calee ) == true && activePeerIncrement < 1 ){
      activePeerIncrement++
    }
    //check calee is in active array

  }, 1000);

  
  let peerConnectionReceiveStream = null
  let peerConnectionReceiveStreamAudio = null
  let peerConnectionReceiveStreamShareScreen = null
  let remoteStream = null
  let remoteAudioStream = null
  let remoteStreamShareScreen = null

  
  

  let unsubRemoteIncrementListenerVideo = null
  let unsubRemoteIncrementListenerAudio = null
  let unsubRemoteIncrementListenerShareScreen = null

  let unsubscribeRemoteICEListenerReceiveStream = null
  let unsubscribeRemoteICEListenerReceiveStreamAudio = null
  let unsubscribeRemoteICEListenerReceiveStreamShareScreen = null


  
  let lookRemoteStrIncrementVideo = 0
  let lookRemoteStrIncrementVideoInside = 0




  let lookRemoteStrIncrementAudio = 0
  let lookRemoteStrIncrementAudioInside = 0
  

  

  let lookRemoteStrIncrementShareScreen = 0

  let lookupRemoteStreamChangingVideo = null
  let lookupRemoteStreamChangingAudio = null
  let lookupRemoteStreamChangingShareScreen = null


  const checkCallReceive = onSnapshot(doc(db, 'Moments', myId), async (docsCheck) => {
    //check peer received my call first
    if(docsCheck.data().call.status == 'received'){
        
        checkCallReceive() //stoped the listener

        const getRemoteStrIncrement = await getDoc( doc(db, "Moments", calee) );

    if (getRemoteStrIncrement.exists()) {
      lookRemoteStrIncrementVideo = getRemoteStrIncrement.data().call.increased.video
      lookRemoteStrIncrementAudio = getRemoteStrIncrement.data().call.increased.audio
      lookRemoteStrIncrementShareScreen = getRemoteStrIncrement.data().call.increased.shareScreen
    }

    
    lookupRemoteStreamChangingVideo = onSnapshot(doc(db, "Moments", calee), async (docs) => {
      if(lookRemoteStrIncrementVideo < docs.data().call.increased.video ){

        console.warn("received video call from : " + calee, docs.data().call.increased.video );

        
          //check video is on or not and share screen is off
          const chackCallerVideoStartedCompletly = onSnapshot(doc(db, "Moments", calee, 'audioVideoChat', myId, 'sendStream', 'video' ), async (docs) => {
            if ( docs.data().completeStart.video == true){
        
              const docSnap = await getDoc( doc(db, "Moments", calee) )
              if ( docSnap.data().call.video == true && docSnap.data().call.shareScreen == false ){
                receiveStream( calee )
                chackCallerVideoStartedCompletly()

                console.warn(' re received video call')
              }
            }
          })
          //check video is on or not and share screen is off

         
        lookRemoteStrIncrementVideo++      
      }
    })
    
    lookupRemoteStreamChangingAudio = onSnapshot(doc(db, "Moments", calee), async (docs) => {
      if(lookRemoteStrIncrementAudio < docs.data().call.increased.audio ){

        console.warn("received audio call from : " + calee, docs.data().call.increased.audio );

        //receive audio call
        const chackCallerAudioStartedCompletly = onSnapshot(doc(db, "Moments", calee, 'audioVideoChat', myId, 'sendStream', 'audio' ), async (docs) => {
          if ( docs.data().completeStart.audio == true){
        
            receiveStreamAudio( calee )
            chackCallerAudioStartedCompletly()

            console.warn(' re received audio call')
          }
        })
        //receive audio call

        lookRemoteStrIncrementAudio++      
      }
    })
    
    
    lookupRemoteStreamChangingShareScreen = onSnapshot(doc(db, "Moments", calee), async (docs) => {
      if(lookRemoteStrIncrementShareScreen < docs.data().call.increased.shareScreen ){

        console.warn("received share screen from : " + calee, docs.data().call.increased.shareScreen );

        //check share screen is on
        const chackCallerShareScreenStartedCompletly = onSnapshot(doc(db, "Moments", calee, 'audioVideoChat', myId, 'sendStream', 'shareScreen' ), async (docs) => {
          if ( docs.data().completeStart.shareScreen == true){
        
            receiveStreamShareScreen( calee )
            chackCallerShareScreenStartedCompletly()

            console.warn(' re received share screen call')
          }
        })
        //check share screen is on

        lookRemoteStrIncrementShareScreen++      
      }
    })
    


    async function receiveStream( peerId ){

      console.warn(`you received video call from: ${peerId}`);
      //document.querySelector('#currentRoom').innerText = `Your room: ${myId} peer room: ${peerId}`

      console.log('Create PeerConnection with configuration: ', configuration);
    
      remoteStream = new MediaStream();

      peerConnectionReceiveStream = new RTCPeerConnection(configuration);

      peerConnectionReceiveStream.addEventListener('icegatheringstatechange', icegatheringstate);
      peerConnectionReceiveStream.addEventListener('connectionstatechange', connectionstate );
      async function connectionstate(){
        console.log(`Connection state change: ${peerConnectionReceiveStream.connectionState}`);
        
        if ( peerConnectionReceiveStream.connectionState == 'failed' || peerConnectionReceiveStream.connectionState == 'closed' ) {
          
          deletePeerPermanently( calee, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
            peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
        }
      }
      peerConnectionReceiveStream.addEventListener('signalingstatechange', signalingstate);
      peerConnectionReceiveStream.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      

      

  
      // Code for collecting ICE candidates below
      let ICE_Number = 0
      peerConnectionReceiveStream.addEventListener('icecandidate', candidateListener);
        async function candidateListener(event){
          if (!event.candidate) {

            console.log('Got final candidate!');

            return;
          }

          console.log('Got candidate: ', event.candidate);

          ICE_Number++
          await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'video', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
        }
      // Code for collecting ICE candidates above
  

      //tuck in remote stream
      peerConnectionReceiveStream.addEventListener('track', tarckListener);
        function tarckListener(event){

          console.log('Got remote track:', event.streams[0]);

          event.streams[0].getTracks().forEach(track => {

            console.log('Add a track to the remoteStream:', track);

            remoteStream.addTrack(track);
          });
        }
      //tuck in remote stream

      // Code for creating SDP answer below
      const getPeerInfo = await getDoc(doc(db, 'Moments', peerId, 'audioVideoChat', myId, 'sendStream', 'video'))
      const offer = getPeerInfo.data().offer

      console.log('Got offer:', offer);

      await peerConnectionReceiveStream.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionReceiveStream.createAnswer();
      console.log('Created answer:', answer);
      await peerConnectionReceiveStream.setLocalDescription(answer);

      const roomWithAnswer = {
        'answer': {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'video'), roomWithAnswer)
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      unsubscribeRemoteICEListenerReceiveStream = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'sendStream', 'video', 'ICE')), snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();

            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);

            await peerConnectionReceiveStream.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      // Listening for remote ICE candidates above


    
      document.getElementById(`remoteVideo_${peerId}`).srcObject = remoteStream;



      const getRemoteStrIncrement2 = await getDoc( doc(db, "Moments", peerId) );

      if (getRemoteStrIncrement2.exists()) {
        lookRemoteStrIncrementVideoInside = getRemoteStrIncrement2.data().call.increased.video
      }

      unsubRemoteIncrementListenerVideo = onSnapshot(doc(db, "Moments", peerId), async (docs) => {
        if(lookRemoteStrIncrementVideoInside < docs.data().call.increased.video ){

          console.warn("stopped received peer connection : " + peerId, docs.data().call.increased.video);
  
    
          if (peerConnectionReceiveStream) {
            peerConnectionReceiveStream.close()
    
            unsubscribeRemoteICEListenerReceiveStream()

            unsubRemoteIncrementListenerVideo()
               
            
            peerConnectionReceiveStream = null
            
            
            await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'video'), {
              'offer': '',
              'answer': ''
            }, {merge:true})
          
            const getICE = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'video', 'ICE'));
          
            const queryICE = await getDocs(getICE);
            queryICE.forEach(async (docs) => {
              await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'video', 'ICE', docs.id))
            })
           
          
          }

          lookRemoteStrIncrementVideoInside++
        }
      })
    

    }
    async function receiveStreamAudio( peerId ){
      console.warn(`you received a audio call from: ${peerId}`);
      //document.querySelector('#currentRoom').innerText = `Your room: ${myId} peer room: ${peerId}`

      console.log('Create PeerConnection for audio: ', configuration);
    
      remoteAudioStream = new MediaStream();

      peerConnectionReceiveStreamAudio = new RTCPeerConnection(configuration);

      peerConnectionReceiveStreamAudio.addEventListener('icegatheringstatechange', icegatheringstate);
      peerConnectionReceiveStreamAudio.addEventListener('connectionstatechange', connectionstate );
      async function connectionstate(){
        console.log(`Connection state change: ${peerConnectionReceiveStreamAudio.connectionState}`);
        
        if ( peerConnectionReceiveStreamAudio.connectionState == 'failed' || peerConnectionReceiveStreamAudio.connectionState == 'closed' ) {
          
          deletePeerPermanently( calee, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
            peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
        }
        
      }
      peerConnectionReceiveStreamAudio.addEventListener('signalingstatechange', signalingstate);
      peerConnectionReceiveStreamAudio.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      

      

  
      // Code for collecting ICE candidates below
      let ICE_Number = 0
      peerConnectionReceiveStreamAudio.addEventListener('icecandidate', candidateListener);
        async function candidateListener(event){
          if (!event.candidate) {

            console.log('Got final candidate!');

            return;
          }

          console.log('Got candidate: ', event.candidate);

          ICE_Number++
          await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'audio', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
        }
      // Code for collecting ICE candidates above
  

      //tuck in remote stream
      peerConnectionReceiveStreamAudio.addEventListener('track', tarckListener);
        function tarckListener(event){

          console.log('Got remote track:', event.streams[0]);

          event.streams[0].getTracks().forEach(track => {

            console.log('Add a track to the remoteStream:', track);

            remoteAudioStream.addTrack(track);
          });
        }
      //tuck in remote stream

      // Code for creating SDP answer below
      const getPeerInfo = await getDoc(doc(db, 'Moments', peerId, 'audioVideoChat', myId, 'sendStream', 'audio'))
      const offer = getPeerInfo.data().offer

      console.log('Got offer:', offer);

      await peerConnectionReceiveStreamAudio.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionReceiveStreamAudio.createAnswer();
      console.log('Created answer:', answer);
      await peerConnectionReceiveStreamAudio.setLocalDescription(answer);

      const roomWithAnswer = {
        'answer': {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'audio'), roomWithAnswer)
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      unsubscribeRemoteICEListenerReceiveStreamAudio = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'sendStream', 'audio', 'ICE')), snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();

            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);

            await peerConnectionReceiveStreamAudio.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      // Listening for remote ICE candidates above


    
      document.getElementById(`remoteAudio_${peerId}`).srcObject = remoteAudioStream;



      const getRemoteStrIncrement2 = await getDoc( doc(db, "Moments", peerId) );

      if (getRemoteStrIncrement2.exists()) {
        lookRemoteStrIncrementAudioInside = getRemoteStrIncrement2.data().call.increased.audio
      }

      unsubRemoteIncrementListenerAudio = onSnapshot(doc(db, "Moments", peerId), async (docs) => {
        if(lookRemoteStrIncrementAudioInside < docs.data().call.increased.audio ){

          console.warn("stopped Audio received peer connection : " + peerId, docs.data().call.increased.audio);
  
    
          if (peerConnectionReceiveStreamAudio) {
            peerConnectionReceiveStreamAudio.close()
    
            unsubscribeRemoteICEListenerReceiveStreamAudio()

            unsubRemoteIncrementListenerAudio()
               
            
            peerConnectionReceiveStreamAudio = null
            
            
            await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'audio'), {
              'offer': '',
              'answer': ''
            }, {merge:true})
          
            const getICE = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'audio', 'ICE'));
          
            const queryICE = await getDocs(getICE);
            queryICE.forEach(async (docs) => {
              await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'audio', 'ICE', docs.id))
            })
           
          
          }

          lookRemoteStrIncrementAudioInside++
        }
      })
    

    }
    async function receiveStreamShareScreen( peerId ){

      console.warn(`you received a share screen call from: ${peerId}`);
      //document.querySelector('#currentRoom').innerText = `Your room: ${myId} peer room: ${peerId}`

      console.log('Create PeerConnection with configuration: ', configuration);
    
      remoteStreamShareScreen = new MediaStream();

      peerConnectionReceiveStreamShareScreen = new RTCPeerConnection(configuration);

      peerConnectionReceiveStreamShareScreen.addEventListener('icegatheringstatechange', icegatheringstate);
      peerConnectionReceiveStreamShareScreen.addEventListener('connectionstatechange', connectionstate );
      async function connectionstate(){
        console.log(`Connection state change: ${peerConnectionReceiveStreamShareScreen.connectionState}`);
        
        if ( peerConnectionReceiveStreamShareScreen.connectionState == 'failed' || peerConnectionReceiveStreamShareScreen.connectionState == 'closed' ) {
          
          deletePeerPermanently( calee, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
            peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
        }        
      }
      peerConnectionReceiveStreamShareScreen.addEventListener('signalingstatechange', signalingstate);
      peerConnectionReceiveStreamShareScreen.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      

      

  
      // Code for collecting ICE candidates below
      let ICE_Number = 0
      peerConnectionReceiveStreamShareScreen.addEventListener('icecandidate', candidateListener);
        async function candidateListener(event){
          if (!event.candidate) {

            console.log('Got final candidate!');

            return;
          }

          console.log('Got candidate: ', event.candidate);

          ICE_Number++
          await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
        }
      // Code for collecting ICE candidates above
  

      //tuck in remote stream
      peerConnectionReceiveStreamShareScreen.addEventListener('track', tarckListener);
        function tarckListener(event){

          console.log('Got remote track:', event.streams[0]);

          event.streams[0].getTracks().forEach(track => {

            console.log('Add a track to the remoteStreamShareScreen:', track);

            remoteStreamShareScreen.addTrack(track);
          });
        }
      //tuck in remote stream

      // Code for creating SDP answer below
      const getPeerInfo = await getDoc(doc(db, 'Moments', peerId, 'audioVideoChat', myId, 'sendStream', 'shareScreen'))
      const offer = getPeerInfo.data().offer

      console.log('Got offer:', offer);

      await peerConnectionReceiveStreamShareScreen.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionReceiveStreamShareScreen.createAnswer();
      console.log('Created answer:', answer);
      await peerConnectionReceiveStreamShareScreen.setLocalDescription(answer);

      const roomWithAnswer = {
        'answer': {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen'), roomWithAnswer)
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      unsubscribeRemoteICEListenerReceiveStreamShareScreen = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'sendStream', 'shareScreen', 'ICE')), snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();

            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);

            await peerConnectionReceiveStreamShareScreen.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      // Listening for remote ICE candidates above


    
      document.getElementById(`remoteVideo_${peerId}`).srcObject = remoteStreamShareScreen;



      

      unsubRemoteIncrementListenerShareScreen = onSnapshot(doc(db, "Moments", peerId), async (docs) => {
        if( docs.data().call.shareScreen == false){

          console.warn("stopped received peer connection : " + peerId);
  
    
          if (peerConnectionReceiveStreamShareScreen) {
            peerConnectionReceiveStreamShareScreen.close()
    
            unsubscribeRemoteICEListenerReceiveStreamShareScreen()

            unsubRemoteIncrementListenerShareScreen()
               
            
            peerConnectionReceiveStreamShareScreen = null
            
            
            await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen'), {
              'offer': '',
              'answer': ''
            }, {merge:true})
          
            const getICE = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen', 'ICE'));
          
            const queryICE = await getDocs(getICE);
            queryICE.forEach(async (docs) => {
              await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen', 'ICE', docs.id))
            })
           
          
          }

          
        }
      })
    

    }

    
    //check video is on or not and share screen is off
    const chackCallerVideoStartedCompletly = onSnapshot(doc(db, "Moments", calee, 'audioVideoChat', myId, 'sendStream', 'video' ), async (docs) => {
      if ( docs.data().completeStart.video == true){
        
        const docSnap = await getDoc( doc(db, "Moments", calee) )
        if ( docSnap.data().call.video == true && docSnap.data().call.shareScreen == false ){
          receiveStream( calee )
          chackCallerVideoStartedCompletly()

          console.warn('received video call '+ calee)
        }
      }
    })
    //check video is on or not and share screen is off
    
    //receive audio call
    const chackCallerAudioStartedCompletly = onSnapshot(doc(db, "Moments", calee, 'audioVideoChat', myId, 'sendStream', 'audio' ), async (docs) => {
      if ( docs.data().completeStart.audio == true){
        
        receiveStreamAudio( calee )
        chackCallerAudioStartedCompletly()

        console.warn('received audio call '+ calee)
      }
    })
    //receive audio call
    
    
    //check share screen is on
    const chackCallerShareScreenStartedCompletly = onSnapshot(doc(db, "Moments", calee, 'audioVideoChat', myId, 'sendStream', 'shareScreen' ), async (docs) => {
      if ( docs.data().completeStart.shareScreen == true){
        
        receiveStreamShareScreen( calee )
        chackCallerShareScreenStartedCompletly()

        console.warn('received share screen call'+ calee)
      }
    })
    //check share screen is on
    
    
    //mute unmute remote audio video tag
    const muteUnmuteRemoteElement = onSnapshot(doc(db, "Moments", calee), async (docs) => {
      const remoteVideoFrame = document.getElementById( 'videos_holder_remoteVideo_' + calee )
      if( remoteVideoFrame ){

        const remoteVideoTag = document.getElementById( 'remoteVideo_' + calee )
        const remoteAudioTag = document.getElementById( 'remoteAudio_' + calee )
        if( docs.data().call.video == true && docs.data().call.shareScreen == false && docs.data().call.audio == true ) {
          remoteVideoTag.muted = false
          remoteAudioTag.muted = true

        } else if( docs.data().call.video == false && docs.data().call.shareScreen == true && docs.data().call.audio == true ){
          remoteVideoTag.muted = false
          remoteAudioTag.muted = false

        } else if( docs.data().call.video == false && docs.data().call.shareScreen == true && docs.data().call.audio == false || docs.data().call.video == true && docs.data().call.shareScreen == true && docs.data().call.audio == false ){
          remoteVideoTag.muted = false
          remoteAudioTag.muted = true

        } else if( docs.data().call.video == false && docs.data().call.shareScreen == false && docs.data().call.audio == true ){
          remoteVideoTag.muted = true
          remoteAudioTag.muted = false

        } else if( docs.data().call.video == false && docs.data().call.shareScreen == false && docs.data().call.audio == false ||
        docs.data().call.video == true && docs.data().call.shareScreen == false && docs.data().call.audio == false ){
          remoteVideoTag.muted = true
          remoteAudioTag.muted = true
        } else if( docs.data().call.video == true && docs.data().call.shareScreen == true && docs.data().call.  audio == true ){
          remoteVideoTag.muted = false
          remoteAudioTag.muted = false

        }

      } else {
        muteUnmuteRemoteElement()
      }
    })
    //mute unmute remote audio video tag


    
        
    }
    //check peer received my call first
  })
  //receive stream



  //call cut
  callCutButton.onclick = ()=>{
    deletePeerPermanently( calee, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
      peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
  }
  
*/
  
}
//end of call to



  // are you receiver?
    const unsubReceiver = onSnapshot(doc(db, "Moments", myId, "call", "management"), (doc1) => {
      if( doc1.data().call.receiver == true ) {
        receive( caller )
      }
    })
  // are you receiver?




async function receive( caller ) {
  
  //receive stream

    //remote video & audio tag
    remoteVideoFrame( caller )
    //remote video & audio tag 


    let checkVideoAndSpanCreated = setInterval(()=>{
      const remoteVideoTag = document.getElementById( 'remoteVideo_' + caller )
      const peerName = document.getElementById( 'holder_name_' + caller)
  
      if ( remoteVideoTag && peerName ){
        peerPicAndName( caller )
        peerPicNameControllarsInPerticipentsPanel( caller ) //add in panel list
        clearInterval( checkVideoAndSpanCreated )      
      }
  
      
    }, 1000)



    let activePeerIncrement = 0
    let interval_execution = setInterval( ()=>{
      //resize video frame on update
      const remoteVideoFrame = document.getElementById( 'videos_holder_remoteVideo_' + caller )
      if( remoteVideoFrame ){
        remoteVideoFrame.style.width = `${ videoFrameWidths }px`
        remoteVideoFrame.style.height = `${ videoFrameHeights }px`
      }
      //resize video frame on update

      //check caller is in active array
      if( onScreenPeerIds.includes( caller ) == true && activePeerIncrement < 1 ){
        activePeerIncrement++
      }
      //check caller is in active array

    }, 1000);

    
    let peerConnectionReceiveStream = null
    let peerConnectionReceiveStreamAudio = null
    let peerConnectionReceiveStreamShareScreen = null

    let remoteStream = null
    let remoteAudioStream = null
    let remoteStreamShareScreen = null

    
    

    let unsubRemoteIncrementListenerVideo = null
    let unsubRemoteIncrementListenerAudio = null
    let unsubRemoteIncrementListenerShareScreen = null

    let unsubscribeRemoteICEListenerReceiveStream = null
    let unsubscribeRemoteICEListenerReceiveStreamAudio = null
    let unsubscribeRemoteICEListenerReceiveStreamShareScreen = null


    
    let lookRemoteStrIncrementVideo = 0
    let lookRemoteStrIncrementVideoInside = 0




    let lookRemoteStrIncrementAudio = 0
    let lookRemoteStrIncrementAudioInside = 0
    

    

    let lookRemoteStrIncrementShareScreen = 0


    const getRemoteStrIncrement = await getDoc( doc(db, "Moments", caller) );

    if (getRemoteStrIncrement.exists()) {
      lookRemoteStrIncrementVideo = getRemoteStrIncrement.data().call.increased.video
      lookRemoteStrIncrementAudio = getRemoteStrIncrement.data().call.increased.audio
      lookRemoteStrIncrementShareScreen = getRemoteStrIncrement.data().call.increased.shareScreen
    }

    
    const lookupRemoteStreamChangingVideo = onSnapshot(doc(db, "Moments", caller), async (docs) => {
      if(lookRemoteStrIncrementVideo < docs.data().call.increased.video ){

        console.warn("received video call from : " + caller, docs.data().call.increased.video );

        //check video is on or not and share screen is off
        const chackCallerVideoStartedCompletly = onSnapshot(doc(db, "Moments", caller, 'audioVideoChat', myId, 'sendStream', 'video' ), async (docs) => {
          if ( docs.data().completeStart.video == true){
          
            const docSnap = await getDoc( doc(db, "Moments", caller) )
            if ( docSnap.data().call.video == true && docSnap.data().call.shareScreen == false ){
              receiveStream( caller )
              chackCallerVideoStartedCompletly()
  
              console.warn('re received video call')
            }
          }
        })
        //check video is on or not and share screen is off

        lookRemoteStrIncrementVideo++      
      }
    })
    
    const lookupRemoteStreamChangingAudio = onSnapshot(doc(db, "Moments", caller), async (docs) => {
      if(lookRemoteStrIncrementAudio < docs.data().call.increased.audio ){

        console.warn("received audio call from : " + caller, docs.data().call.increased.audio );

        //receive audio call
        const chackCallerAudioStartedCompletly = onSnapshot(doc(db, "Moments", caller, 'audioVideoChat', myId, 'sendStream', 'audio' ), async (docs) => {
          if ( docs.data().completeStart.audio == true){
          
            receiveStreamAudio( caller )
            chackCallerAudioStartedCompletly()

            console.warn('re received audio call')
          }
        })
        //receive audio call

        lookRemoteStrIncrementAudio++      
      }
    })
    
    
    const lookupRemoteStreamChangingShareScreen = onSnapshot(doc(db, "Moments", caller), async (docs) => {
      if(lookRemoteStrIncrementShareScreen < docs.data().call.increased.shareScreen ){

        console.warn("received share screen call from : " + caller, docs.data().call.increased.shareScreen );

        //check share screen is on
        const chackCallerShareScreenStartedCompletly = onSnapshot(doc(db, "Moments", caller, 'audioVideoChat', myId, 'sendStream', 'shareScreen' ), async (docs) => {
          if ( docs.data().completeStart.shareScreen == true){
          
            receiveStreamShareScreen( caller )
            chackCallerShareScreenStartedCompletly()

            console.warn('re received share screen call')
          }
        })
        //check share screen is on

        lookRemoteStrIncrementShareScreen++      
      }
    })
    


    async function receiveStream( caller ){

      console.warn(`you received a video call from: ${caller}`);
      //document.querySelector('#currentRoom').innerText = `Your room: ${myId} peer room: ${caller}`

      console.log('Create PeerConnection with configuration: ', configuration);
    
      remoteStream = new MediaStream();

      peerConnectionReceiveStream = new RTCPeerConnection(configuration);

      peerConnectionReceiveStream.addEventListener('icegatheringstatechange', icegatheringstate);
      peerConnectionReceiveStream.addEventListener('connectionstatechange', connectionstate );
      async function connectionstate(){
        console.log(`Connection state change: ${peerConnectionReceiveStream.connectionState}`);
        
        if ( peerConnectionReceiveStream.connectionState == 'failed' || peerConnectionReceiveStream.connectionState == 'closed' ) {
          //deletePeerPermanently( peerConnectionSendStream, peerConnectionReceiveStream, caller, unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteDescription, lookupSendStreamChanging, lookupRemoteStreamChanging, interval_execution, unsubRemoteIncrementListener, unsubLocalIncrementListener)
        }
        
      }
      peerConnectionReceiveStream.addEventListener('signalingstatechange', signalingstate);
      peerConnectionReceiveStream.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      

      

  
      // Code for collecting ICE candidates below
      let ICE_Number = 0
      peerConnectionReceiveStream.addEventListener('icecandidate', candidateListener);
        async function candidateListener(event){
          if (!event.candidate) {

            console.log('Got final candidate!');

            return;
          }

          console.log('Got candidate: ', event.candidate);

          ICE_Number++
          await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', caller, 'receiveStream', 'video', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
        }
      // Code for collecting ICE candidates above
  

      //tuck in remote stream
      peerConnectionReceiveStream.addEventListener('track', tarckListener);
        function tarckListener(event){

          console.log('Got remote track:', event.streams[0]);

          event.streams[0].getTracks().forEach(track => {

            console.log('Add a track to the remoteStream:', track);

            remoteStream.addTrack(track);
          });
        }
      //tuck in remote stream

      // Code for creating SDP answer below
      const getPeerInfo = await getDoc(doc(db, 'Moments', caller, 'audioVideoChat', myId, 'sendStream', 'video'))
      const offer = getPeerInfo.data().offer

      console.log('Got offer:', offer);

      await peerConnectionReceiveStream.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionReceiveStream.createAnswer();
      console.log('Created answer:', answer);
      await peerConnectionReceiveStream.setLocalDescription(answer);

      const roomWithAnswer = {
        'answer': {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', caller, 'receiveStream', 'video'), roomWithAnswer)
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      unsubscribeRemoteICEListenerReceiveStream = onSnapshot(query(collection(db, "Moments", caller, 'audioVideoChat', myId, 'sendStream', 'video', 'ICE')), snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();

            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);

            await peerConnectionReceiveStream.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      // Listening for remote ICE candidates above


    
      document.getElementById(`remoteVideo_${caller}`).srcObject = remoteStream;



      const getRemoteStrIncrement2 = await getDoc( doc(db, "Moments", caller) );

      if (getRemoteStrIncrement2.exists()) {
        lookRemoteStrIncrementVideoInside = getRemoteStrIncrement2.data().call.increased.video
      }

      unsubRemoteIncrementListenerVideo = onSnapshot(doc(db, "Moments", caller), async (docs) => {
        if(lookRemoteStrIncrementVideoInside < docs.data().call.increased.video ){

          console.warn("stopped received peer connection : " + caller, docs.data().call.increased.video);
  
    
          if (peerConnectionReceiveStream) {
            peerConnectionReceiveStream.close()
    
            unsubscribeRemoteICEListenerReceiveStream()

            unsubRemoteIncrementListenerVideo()
               
            
            peerConnectionReceiveStream = null
            
            
            await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', caller, 'receiveStream', 'video'), {
              'offer': '',
              'answer': ''
            }, {merge:true})
          
            const getICE = query(collection(db, "Moments", myId, 'audioVideoChat', caller, 'receiveStream', 'video', 'ICE'));
          
            const queryICE = await getDocs(getICE);
            queryICE.forEach(async (docs) => {
              await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', caller, 'receiveStream', 'video', 'ICE', docs.id))
            })
           
          
          }

          lookRemoteStrIncrementVideoInside++
        }
      })
    

    }
    async function receiveStreamAudio( caller ){
      console.warn(`you received a audio call from: ${caller}`);

      //document.querySelector('#currentRoom').innerText = `Your room: ${myId} peer room: ${caller}`

      console.log('Create PeerConnection for audio: ', configuration);
    
      remoteAudioStream = new MediaStream();

      peerConnectionReceiveStreamAudio = new RTCPeerConnection(configuration);

      peerConnectionReceiveStreamAudio.addEventListener('icegatheringstatechange', icegatheringstate);
      peerConnectionReceiveStreamAudio.addEventListener('connectionstatechange', connectionstate );
      async function connectionstate(){
        console.log(`Connection state change: ${peerConnectionReceiveStreamAudio.connectionState}`);
        
        if ( peerConnectionReceiveStreamAudio.connectionState == 'failed' || peerConnectionReceiveStreamAudio.connectionState == 'closed' ) {
          //deletePeerPermanently( peerConnectionSendStream, peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, caller, unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteDescription, lookupSendStreamChanging, lookupRemoteStreamChanging, interval_execution, unsubRemoteIncrementListener, unsubRemoteIncrementListenerAudio, unsubLocalIncrementListener)
        }
      }
      peerConnectionReceiveStreamAudio.addEventListener('signalingstatechange', signalingstate);
      peerConnectionReceiveStreamAudio.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      

      

  
      // Code for collecting ICE candidates below
      let ICE_Number = 0
      peerConnectionReceiveStreamAudio.addEventListener('icecandidate', candidateListener);
        async function candidateListener(event){
          if (!event.candidate) {

            console.log('Got final candidate!');

            return;
          }

          console.log('Got candidate: ', event.candidate);

          ICE_Number++
          await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', caller, 'receiveStream', 'audio', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
        }
      // Code for collecting ICE candidates above
  

      //tuck in remote stream
      peerConnectionReceiveStreamAudio.addEventListener('track', tarckListener);
        function tarckListener(event){

          console.log('Got remote track:', event.streams[0]);

          event.streams[0].getTracks().forEach(track => {

            console.log('Add a track to the remoteStream:', track);

            remoteAudioStream.addTrack(track);
          });
        }
      //tuck in remote stream

      // Code for creating SDP answer below
      const getPeerInfo = await getDoc(doc(db, 'Moments', caller, 'audioVideoChat', myId, 'sendStream', 'audio'))
      const offer = getPeerInfo.data().offer

      console.log('Got offer:', offer);

      await peerConnectionReceiveStreamAudio.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionReceiveStreamAudio.createAnswer();
      console.log('Created answer:', answer);
      await peerConnectionReceiveStreamAudio.setLocalDescription(answer);

      const roomWithAnswer = {
        'answer': {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', caller, 'receiveStream', 'audio'), roomWithAnswer)
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      unsubscribeRemoteICEListenerReceiveStreamAudio = onSnapshot(query(collection(db, "Moments", caller, 'audioVideoChat', myId, 'sendStream', 'audio', 'ICE')), snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();

            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);

            await peerConnectionReceiveStreamAudio.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      // Listening for remote ICE candidates above


    
      document.getElementById(`remoteAudio_${caller}`).srcObject = remoteAudioStream;



      const getRemoteStrIncrement2 = await getDoc( doc(db, "Moments", caller) );

      if (getRemoteStrIncrement2.exists()) {
        lookRemoteStrIncrementAudioInside = getRemoteStrIncrement2.data().call.increased.audio
      }

      unsubRemoteIncrementListenerAudio = onSnapshot(doc(db, "Moments", caller), async (docs) => {
        if(lookRemoteStrIncrementAudioInside < docs.data().call.increased.audio ){

          console.warn("stopped Audio received peer connection : " + caller, docs.data().call.increased.audio);
  
    
          if (peerConnectionReceiveStreamAudio) {
            peerConnectionReceiveStreamAudio.close()
    
            unsubscribeRemoteICEListenerReceiveStreamAudio()

            unsubRemoteIncrementListenerAudio()
               
            
            peerConnectionReceiveStreamAudio = null
            
            
            await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', caller, 'receiveStream', 'audio'), {
              'offer': '',
              'answer': ''
            }, {merge:true})
          
            const getICE = query(collection(db, "Moments", myId, 'audioVideoChat', caller, 'receiveStream', 'audio', 'ICE'));
          
            const queryICE = await getDocs(getICE);
            queryICE.forEach(async (docs) => {
              await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', caller, 'receiveStream', 'audio', 'ICE', docs.id))
            })
           
          
          }

          lookRemoteStrIncrementAudioInside++
        }
      })
    

    }
    async function receiveStreamShareScreen( peerId ){

      console.warn(`you received a share screen call from: ${peerId}`);
      //document.querySelector('#currentRoom').innerText = `Your room: ${myId} peer room: ${peerId}`

      console.log('Create PeerConnection with configuration: ', configuration);
    
      remoteStreamShareScreen = new MediaStream();

      peerConnectionReceiveStreamShareScreen = new RTCPeerConnection(configuration);

      peerConnectionReceiveStreamShareScreen.addEventListener('icegatheringstatechange', icegatheringstate);
      peerConnectionReceiveStreamShareScreen.addEventListener('connectionstatechange', connectionstate );
      async function connectionstate(){
        console.log(`Connection state change: ${peerConnectionReceiveStreamShareScreen.connectionState}`);
        
        if ( peerConnectionReceiveStreamShareScreen.connectionState == 'failed' || peerConnectionReceiveStreamShareScreen.connectionState == 'closed' ) {
          //deletePeerPermanently( peerConnectionSendStream, peerConnectionReceiveStream, peerId, unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteDescription, lookupSendStreamChanging, lookupRemoteStreamChanging, interval_execution, unsubRemoteIncrementListener, unsubLocalIncrementListener)
        }
      }
      peerConnectionReceiveStreamShareScreen.addEventListener('signalingstatechange', signalingstate);
      peerConnectionReceiveStreamShareScreen.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      

      

  
      // Code for collecting ICE candidates below
      let ICE_Number = 0
      peerConnectionReceiveStreamShareScreen.addEventListener('icecandidate', candidateListener);
        async function candidateListener(event){
          if (!event.candidate) {

            console.log('Got final candidate!');

            return;
          }

          console.log('Got candidate: ', event.candidate);

          ICE_Number++
          await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
        }
      // Code for collecting ICE candidates above
  

      //tuck in remote stream
      peerConnectionReceiveStreamShareScreen.addEventListener('track', tarckListener);
        function tarckListener(event){

          console.log('Got remote track:', event.streams[0]);

          event.streams[0].getTracks().forEach(track => {

            console.log('Add a track to the remoteStreamShareScreen:', track);

            remoteStreamShareScreen.addTrack(track);
          });
        }
      //tuck in remote stream

      // Code for creating SDP answer below
      const getPeerInfo = await getDoc(doc(db, 'Moments', peerId, 'audioVideoChat', myId, 'sendStream', 'shareScreen'))
      const offer = getPeerInfo.data().offer

      console.log('Got offer:', offer);

      await peerConnectionReceiveStreamShareScreen.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionReceiveStreamShareScreen.createAnswer();
      console.log('Created answer:', answer);
      await peerConnectionReceiveStreamShareScreen.setLocalDescription(answer);

      const roomWithAnswer = {
        'answer': {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen'), roomWithAnswer)
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      unsubscribeRemoteICEListenerReceiveStreamShareScreen = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'sendStream', 'shareScreen', 'ICE')), snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();

            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);

            await peerConnectionReceiveStreamShareScreen.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      // Listening for remote ICE candidates above


    
      document.getElementById(`remoteVideo_${peerId}`).srcObject = remoteStreamShareScreen;



      

      unsubRemoteIncrementListenerShareScreen = onSnapshot(doc(db, "Moments", peerId), async (docs) => {
        if( docs.data().call.shareScreen == false){

          console.warn("stopped received peer connection : " + peerId);
  
    
          if (peerConnectionReceiveStreamShareScreen) {
            peerConnectionReceiveStreamShareScreen.close()
    
            unsubscribeRemoteICEListenerReceiveStreamShareScreen()

            unsubRemoteIncrementListenerShareScreen()
               
            
            peerConnectionReceiveStreamShareScreen = null
            
            
            await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen'), {
              'offer': '',
              'answer': ''
            }, {merge:true})
          
            const getICE = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen', 'ICE'));
          
            const queryICE = await getDocs(getICE);
            queryICE.forEach(async (docs) => {
              await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen', 'ICE', docs.id))
            })
           
          
          }

          
        }
      })
    

    }

    
      
      //check video is on or not and share screen is off
      const chackCallerVideoStartedCompletly = onSnapshot(doc(db, "Moments", caller, 'audioVideoChat', myId, 'sendStream', 'video' ), async (docs) => {
        if ( docs.data().completeStart.video == true){
          
          const docSnap = await getDoc( doc(db, "Moments", caller) )
          if ( docSnap.data().call.video == true && docSnap.data().call.shareScreen == false ){
            receiveStream( caller )
            chackCallerVideoStartedCompletly()
  
            console.warn('received video call '+ caller)
          }
        }
      })
      //check video is on or not and share screen is off
    
      //receive audio call
      const chackCallerAudioStartedCompletly = onSnapshot(doc(db, "Moments", caller, 'audioVideoChat', myId, 'sendStream', 'audio' ), async (docs) => {
        if ( docs.data().completeStart.audio == true){
          
          receiveStreamAudio( caller )
          chackCallerAudioStartedCompletly()

          console.warn('received audio call '+ caller)
        }
      })
      //receive audio call
      
    
      //check share screen is on
      const chackCallerShareScreenStartedCompletly = onSnapshot(doc(db, "Moments", caller, 'audioVideoChat', myId, 'sendStream', 'shareScreen' ), async (docs) => {
        if ( docs.data().completeStart.shareScreen == true){
          
          receiveStreamShareScreen( caller )
          chackCallerShareScreenStartedCompletly()

          console.warn('received share screen call '+ caller)
        }
      })
      //check share screen is on
    
                 
      


    //mute unmute remote audio video tag
    const muteUnmuteRemoteElement = onSnapshot(doc(db, "Moments", caller), async (docs) => {
      const remoteVideoFrame = document.getElementById( 'videos_holder_remoteVideo_' + caller )
      if( remoteVideoFrame ){


      const remoteVideoTag = document.getElementById( 'remoteVideo_' + caller )
      const remoteAudioTag = document.getElementById( 'remoteAudio_' + caller )
      if( docs.data().call.video == true && docs.data().call.shareScreen == false && docs.data().call.audio == true ) {
        remoteVideoTag.muted = false
        remoteAudioTag.muted = true

      } else if( docs.data().call.video == false && docs.data().call.shareScreen == true && docs.data().call.audio == true ){
        remoteVideoTag.muted = false
        remoteAudioTag.muted = false

      } else if( docs.data().call.video == false && docs.data().call.shareScreen == true && docs.data().call.audio == false || docs.data().call.video == true && docs.data().call.shareScreen == true && docs.data().call.audio == false ){
        remoteVideoTag.muted = false
        remoteAudioTag.muted = true

      } else if( docs.data().call.video == false && docs.data().call.shareScreen == false && docs.data().call.audio == true ){
        remoteVideoTag.muted = true
        remoteAudioTag.muted = false

      } else if( docs.data().call.video == false && docs.data().call.shareScreen == false && docs.data().call.audio == false ||
      docs.data().call.video == true && docs.data().call.shareScreen == false && docs.data().call.audio == false ){
        remoteVideoTag.muted = true
        remoteAudioTag.muted = true
      } else if( docs.data().call.video == true && docs.data().call.shareScreen == true && docs.data().call.audio == true ){
        remoteVideoTag.muted = false
        remoteAudioTag.muted = false

      }

      } else {
        muteUnmuteRemoteElement()
      }
    })
    //mute unmute remote audio video tag


    

  //receive stream
    
  



  //send stream
  let peerConnectionSendStream = null
  let peerConnectionSendStreamAudio = null
  let peerConnectionSendStreamShareScreen = null

  let unsubscribeRemoteDescription = null
  let unsubscribeRemoteDescriptionAudio = null
  let unsubscribeRemoteDescriptionShareScreen = null

  let unsubscribeRemoteICEListener = null
  let unsubscribeRemoteICEListenerAudio = null
  let unsubscribeRemoteICEListenerShareScreen = null

  let unsubLocalIncrementListener = null
  let unsubLocalIncrementListenerAudio = null
  let unsubOnOrOffLocalListenerShareScreen = null

  let lookLocalStrIncrementVideo = 0
  let lookLocalStrIncrementVideoInside = 0

  let lookLocalStrIncrementAudio = 0
  let lookLocalStrIncrementAudioInside = 0

  let lookLocalStrIncrementShareScreen = 0

  const getIncrement = await getDoc( doc(db, "Moments", myId, "call", "management") );
  if (getIncrement.exists()) {
    lookLocalStrIncrementVideo = getIncrement.data().increased.video
    lookLocalStrIncrementAudio = getIncrement.data().increased.audio
    lookLocalStrIncrementShareScreen = getIncrement.data().increased.shareScreen
  }  
  
  const localVideoStremChangingListener = onSnapshot(doc(db, "Moments", myId, "call", "management"), async (docs) => {
    if(lookLocalStrIncrementVideo < docs.data().increased.video ){
      console.warn("video called back from: "+ caller +" ", docs.data().increased.video );            
      
      
        const delay = setTimeout( async ()=>{
          //check video is on or not and share screen off
          const checkPeerVideoIsOnOrNot = await getDoc( doc(db, "Moments", myId, "call", "management") );
          if ( checkPeerVideoIsOnOrNot.data().call.video == true && checkPeerVideoIsOnOrNot.data().call.shareScreen == false ){
            sendVideoStream(caller)
            console.warn('make re-video call')
          }
          //check video is on or not and share screen off

          clearTimeout(delay)
        }, 4000)        
      

        lookLocalStrIncrementVideo++
    }
  })

  const localAudioStremChangingListener = onSnapshot(doc(db, "Moments", myId), async (docs) => {
    if(lookLocalStrIncrementAudio < docs.data().call.increased.audio ){
      console.warn("audio called back from: "+ caller +" ", docs.data().call.increased.audio );            
      
      
        const delay = setTimeout( async ()=>{
          //make audio call
          sendAudioStream( caller )
          console.warn('re audio call')
          //make audio call

          clearTimeout(delay)
        }, 2000)        
      

        lookLocalStrIncrementAudio++
    }
  })
  

  const localShareScreenStatusChangeListener = onSnapshot(doc(db, "Moments", myId), async (docs) => {
    if(lookLocalStrIncrementShareScreen < docs.data().call.increased.shareScreen ){

      console.warn("shared screen call from: "+ caller +" ", docs.data().call.increased.shareScreen );            
      
      
        const delay = setTimeout( async ()=>{
          //check share screen is on or not
          const checkPeerShareScreenIsOnOrNot = await getDoc( doc(db, "Moments", myId) );
          if ( checkPeerShareScreenIsOnOrNot.data().call.shareScreen == true){
            sendShareScreenStream(caller)
            console.warn('re make share screen call')
          }
          //check share screen is on or not

          clearTimeout(delay)
        }, 4000)        
      

        lookLocalStrIncrementShareScreen++
    }
  })


  
  async function sendVideoStream( peerId ) {
    console.log('Create PeerConnection for video: ', configuration);
    peerConnectionSendStream = new RTCPeerConnection(configuration);

  
    peerConnectionSendStream.addEventListener('icegatheringstatechange', iceGatheringstate);
    async function iceGatheringstate(){
      console.log(`ICE gathering state changed: ${peerConnectionSendStream.iceGatheringState}`);

      if( peerConnectionSendStream.iceGatheringState == 'complete') {
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'video'), {
          'completeStart': {
            'video': true
          }
        }, {merge:true})
      }
    }
      
  
    peerConnectionSendStream.addEventListener('connectionstatechange', connectionStates);
      async function connectionStates(){
        console.log(`Connection state change: ${peerConnectionSendStream.connectionState}`);
    
        if( peerConnectionSendStream.connectionState == 'failed' || peerConnectionSendStream.connectionState == 'closed'){
          
          deletePeerPermanently( caller, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
            peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
        }
      }
  
    peerConnectionSendStream.addEventListener('signalingstatechange', signalingstate);
      
  
    peerConnectionSendStream.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      


    localStream.getTracks().forEach(track => {
      peerConnectionSendStream.addTrack(track, localStream);
      console.log('local track added to peer connection')
    });  


    // Code for collecting ICE candidates below
    let ICE_Number = 0
    peerConnectionSendStream.addEventListener('icecandidate', iceCandiateListeners);
      async function iceCandiateListeners(event){
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        ICE_Number++
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'video', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
      }
    // Code for collecting ICE candidates above


    // Code for creating a room below
    const offer = await peerConnectionSendStream.createOffer();
    await peerConnectionSendStream.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'video'), roomWithOffer)

    console.warn(`back video called to: ${peerId}`);
    //document.querySelector('#currentRoom').innerText = `your id is: ${myId} and your peer is: ${peerId}`
    // Code for creating a room above


    
    // Listening for remote session description below
    unsubscribeRemoteDescription = onSnapshot(doc(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'video'), async snapshot => {
      const data = snapshot.data();
      if (!peerConnectionSendStream.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnectionSendStream.setRemoteDescription(rtcSessionDescription);
      }
    });
    // Listening for remote session description above
  
    // Listen for remote ICE candidates below
    unsubscribeRemoteICEListener = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'video', 'ICE')), async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnectionSendStream.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listen for remote ICE candidates above 


    const getLocalStrIncrement2 = await getDoc( doc(db, "Moments", myId) );

    if (getLocalStrIncrement2.exists()) {
      lookLocalStrIncrementVideoInside = getLocalStrIncrement2.data().call.increased.video
    }
    
    unsubLocalIncrementListener = onSnapshot(doc(db, "Moments", myId), async (docs) => {
      if(lookLocalStrIncrementVideoInside < docs.data().call.increased.video ){
        lookLocalStrIncrementVideoInside++

        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'video'), {
          'completeStart': {
            'video': false
          }
        }, {merge:true})

        stopSendPeerConnection( peerId, docs.data().call.increased.video, peerConnectionSendStream, unsubscribeRemoteDescription, unsubscribeRemoteICEListener, unsubLocalIncrementListener )      
      
      }
    })
    
  }
  async function sendAudioStream(peerId) {
    console.log('Create PeerConnection for audio: ', configuration);
    peerConnectionSendStreamAudio = new RTCPeerConnection(configuration);

  
    peerConnectionSendStreamAudio.addEventListener('icegatheringstatechange', iceGatheringstate);
    async function iceGatheringstate(){
      console.log(`ICE gathering state changed: ${peerConnectionSendStreamAudio.iceGatheringState}`);

      if( peerConnectionSendStreamAudio.iceGatheringState == 'complete') {
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'audio'), {
          'completeStart': {
            'audio': true
          }
        }, {merge:true})
      }
    }
      
  
    peerConnectionSendStreamAudio.addEventListener('connectionstatechange', connectionStates);
      async function connectionStates(){
        console.log(`Connection state change: ${peerConnectionSendStreamAudio.connectionState}`);
    
        if( peerConnectionSendStreamAudio.connectionState == 'failed' || peerConnectionSendStreamAudio.connectionState == 'closed'){
          
          deletePeerPermanently( caller, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
            peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
        }
      }
  
      peerConnectionSendStreamAudio.addEventListener('signalingstatechange', signalingstate);
      
  
      peerConnectionSendStreamAudio.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      


      localAudioStream.getTracks().forEach(track => {
        peerConnectionSendStreamAudio.addTrack(track, localAudioStream);
        console.log('local track added to audio peer connection')
      });  


    // Code for collecting ICE candidates below
    let ICE_Number = 0
    peerConnectionSendStreamAudio.addEventListener('icecandidate', iceCandiateListeners);
      async function iceCandiateListeners(event){
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        ICE_Number++
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'audio', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
      }
    // Code for collecting ICE candidates above


    // Code for creating a room below
    const offer = await peerConnectionSendStreamAudio.createOffer();
    await peerConnectionSendStreamAudio.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'audio'), roomWithOffer)

    console.warn(`back audio called to: ${peerId}`);
    //document.querySelector('#currentRoom').innerText = `your id is: ${myId} and your peer is: ${peerId}`
    // Code for creating a room above


    
    // Listening for remote session description below
    unsubscribeRemoteDescriptionAudio = onSnapshot(doc(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'audio'), async snapshot => {
      const data = snapshot.data();
      if (!peerConnectionSendStreamAudio.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnectionSendStreamAudio.setRemoteDescription(rtcSessionDescription);
      }
    });
    // Listening for remote session description above
  
    // Listen for remote ICE candidates below
    unsubscribeRemoteICEListenerAudio = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'audio', 'ICE')), async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnectionSendStreamAudio.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listen for remote ICE candidates above 


    const getLocalStrIncrement2 = await getDoc( doc(db, "Moments", myId) );

    if (getLocalStrIncrement2.exists()) {
      lookLocalStrIncrementAudioInside = getLocalStrIncrement2.data().call.increased.audio
    }
    
    unsubLocalIncrementListenerAudio = onSnapshot(doc(db, "Moments", myId), async (docs) => {
      if(lookLocalStrIncrementAudioInside < docs.data().call.increased.audio ){
        lookLocalStrIncrementAudioInside++

        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'audio'), {
          'completeStart': {
            'audio': false
          }
        }, {merge:true})

        stopSendPeerConnection( peerId, docs.data().call.audio, peerConnectionSendStreamAudio, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteICEListenerAudio, unsubLocalIncrementListenerAudio )      
      
      }
    })
    
  }
  async function sendShareScreenStream(peerId) {

    console.log('Create PeerConnection for share screen: ', configuration);
    peerConnectionSendStreamShareScreen = new RTCPeerConnection(configuration);

  
    peerConnectionSendStreamShareScreen.addEventListener('icegatheringstatechange', iceGatheringstate);
    async function iceGatheringstate(){
      console.log(`ICE gathering state changed: ${peerConnectionSendStreamShareScreen.iceGatheringState}`);

      if( peerConnectionSendStreamShareScreen.iceGatheringState == 'complete') {
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen'), {
          'completeStart': {
            'shareScreen': true
          }
        }, {merge:true})
      }
    }
    
      
  
    peerConnectionSendStreamShareScreen.addEventListener('connectionstatechange', connectionStates);
      async function connectionStates(){
        console.log(`Connection state change: ${peerConnectionSendStreamShareScreen.connectionState}`);
    
        if( peerConnectionSendStreamShareScreen.connectionState == 'failed' || peerConnectionSendStreamShareScreen.connectionState == 'closed'){
          
          deletePeerPermanently( caller, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
            peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
        }
      }
  
    peerConnectionSendStreamShareScreen.addEventListener('signalingstatechange', signalingstate);
      
  
    peerConnectionSendStreamShareScreen.addEventListener('iceconnectionstatechange ', iceconnectionstate);
      


    localShareScreenStream.getTracks().forEach(track => {
      peerConnectionSendStreamShareScreen.addTrack(track, localShareScreenStream);
      console.log('local track added to peer connection')
    });  


    // Code for collecting ICE candidates below
    let ICE_Number = 0
    peerConnectionSendStreamShareScreen.addEventListener('icecandidate', iceCandiateListeners);
      async function iceCandiateListeners(event){
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        ICE_Number++
        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen', 'ICE', `${ICE_Number}`), event.candidate.toJSON())
      }
    // Code for collecting ICE candidates above


    // Code for creating a room below
    const offer = await peerConnectionSendStreamShareScreen.createOffer();
    await peerConnectionSendStreamShareScreen.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen'), roomWithOffer)

    console.warn(`shared screen called to: ${peerId}`);
    //document.querySelector('#currentRoom').innerText = `your id is: ${myId} and your peer is: ${peerId}`
    // Code for creating a room above


    
    // Listening for remote session description below
    unsubscribeRemoteDescriptionShareScreen = onSnapshot(doc(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'shareScreen'), async snapshot => {
      const data = snapshot.data();
      if (!peerConnectionSendStreamShareScreen.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnectionSendStreamShareScreen.setRemoteDescription(rtcSessionDescription);
      }
    });
    // Listening for remote session description above
  
    // Listen for remote ICE candidates below
    unsubscribeRemoteICEListenerShareScreen = onSnapshot(query(collection(db, "Moments", peerId, 'audioVideoChat', myId, 'receiveStream', 'shareScreen', 'ICE')), async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnectionSendStreamShareScreen.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listen for remote ICE candidates above 


    
    
    unsubOnOrOffLocalListenerShareScreen = onSnapshot(doc(db, "Moments", myId), async (docs) => {
      if( docs.data().call.shareScreen == false ){

        await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen'), {
          'completeStart': {
            'shareScreen': false
          }
        }, {merge:true})
        

        stopSendPeerConnection( peerId, docs.data().call.increased.shareScreen, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescriptionShareScreen, unsubscribeRemoteICEListenerShareScreen, unsubOnOrOffLocalListenerShareScreen )      
      
      }
    })
    
  }

  const delayCallBack = setTimeout( async ()=>{
    
  //check video is on or not and share screen off
  const checkPeerVideoIsOnOrNot = await getDoc( doc(db, "Moments", myId) );
  if ( checkPeerVideoIsOnOrNot.data().call.video == true && checkPeerVideoIsOnOrNot.data().call.shareScreen == false ){
    sendVideoStream(caller)
    console.warn('make video call')
  }
  //check video is on or not and share screen off
  
  //start audio pc
    sendAudioStream(caller)
  //start audio pc
  
  
  //check share screen is on or not
  const checkPeerShareScreenIsOnOrNot = await getDoc( doc(db, "Moments", myId) );
  if ( checkPeerShareScreenIsOnOrNot.data().call.shareScreen == true){
    sendShareScreenStream(caller)
    console.warn('make share screen call')
  }
  //check share screen is on or not
  

  clearTimeout(delayCallBack)
      
    }, 30000)
  
  //send stream

  

  
  //call cut
  callCutButton.onclick = ()=>{
    deletePeerPermanently( caller, peerConnectionSendStream, peerConnectionSendStreamAudio, peerConnectionSendStreamShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionAudio, unsubscribeRemoteDescriptionShareScreen,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
      peerConnectionReceiveStream, peerConnectionReceiveStreamAudio, peerConnectionReceiveStreamShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen)    
  }
  
  
  
  
}





//------ peerconnection events ---------
function icegatheringstate(){
  console.log(`ICE gathering state changed: ${this.iceGatheringState}`);
}

function signalingstate(){
  console.log(`Signaling state change: ${this.signalingState}`);
}

function iceconnectionstate(){
  console.log(`ICE connection state change: ${this.iceConnectionState}`);
}
//------ peerconnection events ---------


//----- stop peerconnection ---------
async function stopSendPeerConnection( peerId, increment, peerConnectionSendStream, unsubscribeRemoteDescription, unsubscribeRemoteICEListener, unsubLocalIncrementListener ){

  console.log("stopped send peer connection to :"+ peerId +" increment "+ increment);
  
        if (peerConnectionSendStream) {
          peerConnectionSendStream.close()
          
          unsubscribeRemoteDescription()
          unsubscribeRemoteICEListener()
          unsubLocalIncrementListener()

          peerConnectionSendStream = null          
        }      
      
}
//----- stop peerconnection ---------
//----- permanently delete peer ------
async function deletePeerPermanently( peerId, pcSendVid, pcSendAudi, pcSendShareScreen, unsubscribeRemoteDescription, unsubscribeRemoteDescriptionShareScreen, unsubscribeRemoteDescriptionAudio,  unsubscribeRemoteICEListener, unsubscribeRemoteICEListenerAudio, unsubscribeRemoteICEListenerShareScreen,  unsubLocalIncrementListener, unsubLocalIncrementListenerAudio, unsubOnOrOffLocalListenerShareScreen,  localVideoStremChangingListener, localAudioStremChangingListener, localShareScreenStatusChangeListener,   
  pcReceiveVid, pcReceiveAudi, pcReceiveShareScreen, interval_execution, unsubRemoteIncrementListenerVideo, unsubRemoteIncrementListenerAudio, unsubRemoteIncrementListenerShareScreen, unsubscribeRemoteICEListenerReceiveStream, unsubscribeRemoteICEListenerReceiveStreamAudio, unsubscribeRemoteICEListenerReceiveStreamShareScreen, lookupRemoteStreamChangingVideo, lookupRemoteStreamChangingAudio, lookupRemoteStreamChangingShareScreen ){
  
  console.warn('deleting peerconnection')
  //send
  //video
  if (pcSendVid) {
    pcSendVid.close()
    
    pcSendVid = null

    console.warn('Send video peer connection has stopped!')
  }
  //video
  //audio
  if (pcSendAudi) {
    pcSendAudi.close()
    
    pcSendAudi = null

    console.warn('Send audio peer connection has stopped!')
  }
  //audio
  //share screen
  if (pcSendShareScreen) {
    pcSendShareScreen.close()
    
    pcSendShareScreen = null

    console.warn('Send share screen peer connection has stopped!')
  }
  //share screen
  //send

  //receive
  //video
  if (pcReceiveVid) {
    pcReceiveVid.close()
    
    pcReceiveVid = null

    console.warn('Receive video peer connection has stopped!')
  }
  //video
  //audio
  if (pcReceiveAudi) {
    pcReceiveAudi.close()
    
    pcReceiveAudi = null

    console.warn('Receive audio peer connection has stopped!')
  }
  //audio
  //share screen
  if (pcReceiveShareScreen) {
    pcReceiveShareScreen.close()
    
    pcReceiveShareScreen = null

    console.warn('Receive share screen peer connection has stopped!')
  }
  //share screen
  //receive

  

  await setDoc(doc(db, 'Moments', myId), {
    'call': {
      'to': arrayRemove( peerId ),
      'from': arrayRemove( peerId )
    }
  }, {merge:true})

  

  //send
  //video
  await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'video'), {
    'offer': '',
    'completeStart': {
      'video': false
    }
  }, {merge:true})

  const getSendICE = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'sendStream', 'video', 'ICE'));

  const querySendICE = await getDocs( getSendICE );
  querySendICE.forEach(async (docs) => {
    await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'sendStream', 'video', 'ICE', docs.id))
  })
  //video
  //audio
  await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'audio'), {
    'offer': '',
    'completeStart': {
      'audio': false
    }
  }, {merge:true})

  const getSendICEAudio = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'sendStream', 'audio', 'ICE'));

  const querySendICEAudio = await getDocs( getSendICEAudio );
  querySendICEAudio.forEach(async (docs) => {
    await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'sendStream', 'audio', 'ICE', docs.id))
  })
  //audio
  //share scren
  await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen'), {
    'offer': '',
    'completeStart': {
      'shareScreen': false
    }
  }, {merge:true})

  const getSendICEshareScreen = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen', 'ICE'));

  const querySendICEshareScreen = await getDocs( getSendICEshareScreen );
  querySendICEshareScreen.forEach(async (docs) => {
    await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'sendStream', 'shareScreen', 'ICE', docs.id))
  })
  //share scren
  //send




  //Receive
  //video
  await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'video'), {
    'answer': ''
  }, {merge:true})

  const getReceiveICE = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'video', 'ICE'));

  const queryReceiveICE = await getDocs( getReceiveICE );
  queryReceiveICE.forEach(async (docs) => {
    await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'video', 'ICE', docs.id))
  })
  //video
  //audio
  await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'audio'), {
    'answer': ''
  }, {merge:true})

  const getReceiveICEAudio = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'audio', 'ICE'));

  const queryReceiveICEAudio = await getDocs( getReceiveICEAudio );
  queryReceiveICEAudio.forEach(async (docs) => {
    await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'audio', 'ICE', docs.id))
  })
  //audio
  //share scren
  await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen'), {
    'answer': ''
  }, {merge:true})

  const getReceiveICEshareScreen = query(collection(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen', 'ICE'));

  const queryReceiveICEshareScreen = await getDocs( getReceiveICEshareScreen );
  queryReceiveICEshareScreen.forEach(async (docs) => {
    await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerId, 'receiveStream', 'shareScreen', 'ICE', docs.id))
  })
  //share scren
  //Receive
  


  peerIds.splice(peerIds.indexOf( peerId ), 1)
  console.warn('peerids after deleting: '+ peerIds)

  
  if( peerIds.length == 0 ){
    await setDoc(doc(db, 'Moments', myId), {
      'call': {
        'status': ''
      }
    }, {merge:true})
  }


  const pannelActiveName = document.getElementById('panelBox_' + peerId )
  if(pannelActiveName){
    document.querySelector('#perticipentsNameList').removeChild( pannelActiveName ) //remove from panel name list
  }

  //Delete video frame
    document.getElementById( 'video_frames_warnings' ).removeChild( document.getElementById( 'videos_holder_remoteVideo_' + peerId ) )
  //Delete video frame

  if(unsubscribeRemoteDescription != null){
    unsubscribeRemoteDescription()
  }
  if(unsubscribeRemoteDescriptionShareScreen != null){
    unsubscribeRemoteDescriptionShareScreen()
  }  
  if( unsubscribeRemoteDescriptionAudio != null){
    unsubscribeRemoteDescriptionAudio()
  }
  
  if( unsubscribeRemoteICEListener != null){
    unsubscribeRemoteICEListener()
  }
  if( unsubscribeRemoteICEListenerAudio != null){
    unsubscribeRemoteICEListenerAudio()
  }
  if( unsubscribeRemoteICEListenerShareScreen != null){
    unsubscribeRemoteICEListenerShareScreen()
  }
  
  if( unsubLocalIncrementListener != null){
    unsubLocalIncrementListener()
  }
  if( unsubLocalIncrementListenerAudio != null){
    unsubLocalIncrementListenerAudio()
  }
  if( unsubOnOrOffLocalListenerShareScreen != null){
    unsubOnOrOffLocalListenerShareScreen()
  }
  
  if( localVideoStremChangingListener != null){
    localVideoStremChangingListener()
  }
  if( localAudioStremChangingListener != null){
    localAudioStremChangingListener()
  }
  if( localShareScreenStatusChangeListener != null){
    localShareScreenStatusChangeListener()
  }



  if( unsubRemoteIncrementListenerVideo != null){
    unsubRemoteIncrementListenerVideo()
  }
  if( unsubRemoteIncrementListenerAudio != null){
    unsubRemoteIncrementListenerAudio()
  }
  if( unsubRemoteIncrementListenerShareScreen != null){
    unsubRemoteIncrementListenerShareScreen()
  }
  
  if( unsubscribeRemoteICEListenerReceiveStream != null){
    unsubscribeRemoteICEListenerReceiveStream()
  }
  if( unsubscribeRemoteICEListenerReceiveStreamAudio != null){
    unsubscribeRemoteICEListenerReceiveStreamAudio()
  }
  if( unsubscribeRemoteICEListenerReceiveStreamShareScreen != null){
    unsubscribeRemoteICEListenerReceiveStreamShareScreen()
  }
  
  if( lookupRemoteStreamChangingVideo != null){
    lookupRemoteStreamChangingVideo()
  }
  if( lookupRemoteStreamChangingAudio != null){
    lookupRemoteStreamChangingAudio()
  }
  if( lookupRemoteStreamChangingShareScreen != null){
    lookupRemoteStreamChangingShareScreen()
  }

  clearInterval( interval_execution )
}
//----- permanently delete peer ------




//--- Remote video tage creating through js --------
function remoteVideoFrame( remotePeerId ){
  const videosHolderAndProfile = document.createElement('div')
    videosHolderAndProfile.setAttribute('class', 'videos_holder_and_profile')
    videosHolderAndProfile.setAttribute('id', 'videos_holder_remoteVideo_' + remotePeerId)
  document.getElementById( 'video_frames_warnings' ).appendChild( videosHolderAndProfile )
    videosHolderAndProfile.style.width = `${ videoFrameWidths }px`
    videosHolderAndProfile.style.height = `${ videoFrameHeights }px`

  const remoteVideo = document.createElement('video')
    remoteVideo.setAttribute('id', 'remoteVideo_' + remotePeerId)
    remoteVideo.setAttribute('class', 'remoteVideo')
    remoteVideo.setAttribute('autoplay', '')
    remoteVideo.setAttribute('playsinline', '')
  document.getElementById( 'videos_holder_remoteVideo_' + remotePeerId ).appendChild( remoteVideo )
  document.getElementById( 'remoteVideo_' + remotePeerId ).muted = true

  const remoteAudio = document.createElement('audio')
    remoteAudio.setAttribute('id', 'remoteAudio_' + remotePeerId)
    remoteAudio.setAttribute('controls', '' )
    remoteAudio.setAttribute('autoplay', '' )
    remoteAudio.setAttribute('class', 'remoteAudio' )
  document.getElementById( 'videos_holder_remoteVideo_' + remotePeerId ).appendChild( remoteAudio )
  document.getElementById( 'remoteAudio_' + remotePeerId ).muted = true

  const remoteSpan = document.createElement('span')
    remoteSpan.setAttribute('id', 'holder_name_' + remotePeerId)
    remoteSpan.setAttribute('class', 'holder_name' )
  document.getElementById( 'videos_holder_remoteVideo_' + remotePeerId ).appendChild( remoteSpan )

  const remoteSpanBg = document.createElement('span')
    remoteSpanBg.setAttribute('id', 'holder_name_Big_' + remotePeerId)
    remoteSpanBg.setAttribute('class', 'holder_nameBig' )
  document.getElementById( 'videos_holder_remoteVideo_' + remotePeerId ).appendChild( remoteSpanBg )
}
//--- Remote video tage creating through js --------

//----- Remote peer pic and name on frame on video and share screen on and off --------
async function peerPicAndName( remotePeerId ){
  let remoteVideoHolder = null
  const remoteVideoTag = document.getElementById( 'remoteVideo_' + remotePeerId )

  //show name
  const getName = await getDoc( doc(db, "Moments", remotePeerId) );
  if (getName.exists()) {
    document.getElementById( 'holder_name_' + remotePeerId ).innerText = getName.data().profileInfo.firstName + ' ' + getName.data().profileInfo.lastName
    document.getElementById( 'holder_name_Big_' + remotePeerId ).innerText = getName.data().profileInfo.firstName + ' ' + getName.data().profileInfo.lastName
  }
  //show name

  
  //profile pic handlers 
    const getProfilePicName = query(collection(db, "Moments", remotePeerId, "profilePictures"), orderBy("time", "desc"), limit(1));
    let picName
    const showProfilePicName = await getDocs(getProfilePicName);
    showProfilePicName.forEach((doc) => {
      picName = doc.data().title
    })

    if( picName!= null && picName!= undefined && picName!= '' ){
      //pic
      const storesRef = ref(storage, 'profilePictures/' + remotePeerId + '/' + picName)
      getDownloadURL(storesRef)
      .then((URL) => {
        // Insert url into an <img> tag to "download"
    
        //listener for video off and on
        const unsubVideoChange = onSnapshot(doc(db, "Moments", remotePeerId), (docs) => {
          remoteVideoHolder = document.getElementById('videos_holder_remoteVideo_' + remotePeerId)
          if( remoteVideoHolder ){

            if( docs.data().call.video == true || docs.data().call.shareScreen == true ){

              remoteVideoTag.style.display = 'block'

              remoteVideoHolder.style.backgroundImage = "none"
              remoteVideoHolder.style.width = videoFrameWidths
              remoteVideoHolder.style.height = videoFrameHeights
              console.warn('showing')
  
            }else if( docs.data().call.video == false && docs.data().call.shareScreen == false ){

              remoteVideoTag.style.display = 'none'
            
              remoteVideoHolder.style.backgroundImage = "url(" + URL + ")"
              remoteVideoHolder.style.backgroundSize = 'cover'
              remoteVideoHolder.style.backgroundPosition = 'center'
              remoteVideoHolder.style.backgroundRepeat = 'no-repeat'
              remoteVideoHolder.style.width = videoFrameWidths
              remoteVideoHolder.style.height = videoFrameHeights
              console.warn('hiding')
  
            }

          } else {
            unsubVideoChange()
            console.warn('listener deleted')
          }        
        })
        //listener for video off and on
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

      //show name
        document.getElementById( 'holder_name_' + remotePeerId ).style.display = 'inline-block'
        document.getElementById( 'holder_name_Big_' + remotePeerId ).style.display = 'none'
      //show name
    } else {
      console.warn( remotePeerId + ' profile pic missing' )

      //listener for video off and on
      const unsubVideoChange = onSnapshot(doc(db, "Moments", remotePeerId), (docs) => {
        remoteVideoHolder = document.getElementById('videos_holder_remoteVideo_' + remotePeerId)
        if( remoteVideoHolder ){

          if( docs.data().call.video == true || docs.data().call.shareScreen == true ){

            remoteVideoTag.style.display = 'block'

            document.getElementById( 'holder_name_' + remotePeerId ).style.display = 'inline-block'
            document.getElementById( 'holder_name_Big_' + remotePeerId ).style.display = 'none'

          }else if( docs.data().call.video == false && docs.data().call.shareScreen == false ){

            remoteVideoTag.style.display = 'none'

            document.getElementById( 'holder_name_' + remotePeerId ).style.display = 'none'
            document.getElementById( 'holder_name_Big_' + remotePeerId ).style.display = 'inline-block'

          }

        } else {
          unsubVideoChange()
          console.warn('listener deleted')
        }        
      })
      //listener for video off and on
    }

    //profile pic handlers

}
//----- Remote peer pic and name on frame on video and share screen on and off --------

//----- Remote peer pic, name and controllars add in participents panel -----
async function peerPicNameControllarsInPerticipentsPanel( remotePeerId ){
  const makDiv = document.createElement("div")
  makDiv.setAttribute('id', `panelBox_${remotePeerId}`)
  makDiv.setAttribute('class', `panelBox`)
  document.querySelector('#perticipentsNameList').appendChild( makDiv )

  const imgHolderDiv = document.createElement("div")
  imgHolderDiv.setAttribute('class', `imgHolderDiv`)
  imgHolderDiv.setAttribute('id', `imgHolderDiv_${ remotePeerId }`)
  document.getElementById(`panelBox_${ remotePeerId }`).appendChild( imgHolderDiv )

  const altText = document.createElement("span")
  altText.setAttribute('class', `altTextParticipentsPanel`)
  altText.setAttribute('id', `altText_${ remotePeerId }`)
  document.getElementById( `imgHolderDiv_${ remotePeerId }` ).appendChild( altText )

  const imgHolder = document.createElement("img")
  imgHolder.setAttribute('id', `imgHolder_${ remotePeerId }`)
  imgHolder.setAttribute('class', `imgHolder`)
  document.getElementById( `imgHolderDiv_${ remotePeerId }` ).appendChild( imgHolder )

  const myName = document.createElement("span")
  myName.setAttribute('id', `name_${ remotePeerId }`)
  myName.setAttribute('class', `panelName`)
  document.getElementById(`panelBox_${ remotePeerId }`).appendChild( myName )

  //my name        
    const getMyName = await getDoc( doc(db, "Moments", remotePeerId) )
    myName.innerText = getMyName.data().profileInfo.fullName
      

    const firstLetter_firstname = getMyName.data().profileInfo.firstName.charAt(0)
    const firstLetter_lastname = getMyName.data().profileInfo.lastName.charAt(0)
    altText.innerText = firstLetter_firstname + firstLetter_lastname
  //my name


  //peer profile pic handlers 
  async function getPeerProfilepic(){
    const getProfilePicName = query(collection(db, "Moments", remotePeerId, "profilePictures"), orderBy("time", "desc"), limit(1));
    let picName
    const showProfilePicName = await getDocs(getProfilePicName);
    showProfilePicName.forEach((doc) => {
      picName = doc.data().title
    })

    if(picName!= null && picName!= undefined && picName!= ''){
      const storesRef = ref(storage, 'profilePictures/' + remotePeerId + '/' + picName)
      getDownloadURL(storesRef)
      .then((URL) => {
        // Insert url into an <img> tag to "download"
        document.getElementById(`imgHolder_${ remotePeerId }`).setAttribute('src',  URL )
        document.getElementById(`imgHolder_${ remotePeerId }`).style.display = 'inline-block'
        document.getElementById(`altText_${ remotePeerId }`).style.display = 'none'
          
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
    } else {
      console.warn(`panal profile pic of ${ remotePeerId } empty`)

      document.getElementById(`imgHolder_${ remotePeerId }`).style.display = 'none'
      document.getElementById(`altText_${ remotePeerId }`).style.display = 'inline-block'
    }
  }

  if( document.getElementById(`imgHolder_${ remotePeerId }`) ){
    getPeerProfilepic()
  }
  //peer profile pic handlers

      

  //mic
    const myMic = document.createElement("span")
    myMic.setAttribute('id', `mic_${ remotePeerId }`)
    myMic.setAttribute('class', `material-icons-outlined panel_mic`)
    myMic.innerText = 'mic'
    document.getElementById(`panelBox_${ remotePeerId }`).appendChild( myMic )

    const myMicOff = document.createElement("span")
    myMicOff.setAttribute('id', `micOff_${ remotePeerId }`)
    myMicOff.setAttribute('class', `material-icons-outlined panel_mic_off`)
    myMicOff.innerText = 'mic_off'
    document.getElementById(`panelBox_${ remotePeerId }`).appendChild( myMicOff )


    const peerMicButton = document.getElementById( `mic_${ remotePeerId }` )
    const peerMicButtonOff = document.getElementById( `micOff_${ remotePeerId }` )
    const unsubMicButtonChange = onSnapshot(doc(db, "Moments", remotePeerId), (docs) => {
      if( peerMicButton || peerMicButtonOff ){
        if( docs.data().call.audio == false ){
          peerMicButton.style.display = 'none'
          peerMicButtonOff.style.display = 'inline-block'
        } else if( docs.data().call.audio == true ) {
          peerMicButton.style.display = 'inline-block'
          peerMicButtonOff.style.display = 'none'
        }
      } else {
        unsubMicButtonChange()
      }
    })
      
    document.getElementById( `mic_${ remotePeerId }` ).onclick = async ()=>{
      await setDoc(doc(db, "Moments", remotePeerId), {
        'call': {
          'audio': false    
        }
      },
      { merge: true })
      
      console.warn(`working click panel_mic ${ remotePeerId } on`)
    }
      
    document.getElementById( `micOff_${ remotePeerId }` ).onclick = async ()=>{
      await setDoc(doc(db, "Moments", remotePeerId), {
        'call': {
          'audio': true    
        }
      },
      { merge: true })    
      console.warn(`working click panel_mic ${ remotePeerId } off`)
    }
  //mic

  //cam
    const myCam = document.createElement("span")
    myCam.setAttribute('id', `cam_${ remotePeerId }`)
    myCam.setAttribute('class', `material-icons-outlined panel_videocam`)
    myCam.innerText = 'videocam'
    document.getElementById(`panelBox_${ remotePeerId }`).appendChild( myCam )

    const myCamOff = document.createElement("span")
    myCamOff.setAttribute('id', `camOff_${ remotePeerId }`)
    myCamOff.setAttribute('class', `material-icons-outlined panel_videocam_off`)
    myCamOff.innerText = 'videocam_off'
    document.getElementById(`panelBox_${ remotePeerId }`).appendChild( myCamOff )

    const peerCamButton = document.getElementById( `cam_${ remotePeerId }` )
    const peerCamButtonOff = document.getElementById( `camOff_${ remotePeerId }` )
    const unsubVideoChange = onSnapshot(doc(db, "Moments", remotePeerId), (docs) => {
      if( peerCamButton || peerCamButtonOff ){
        if( docs.data().call.video == true ){
          peerCamButton.style.display = 'inline-block'
          peerCamButtonOff.style.display = 'none'
            
          //document.querySelector('.screen_share').style.display = 'inline-block'
          //document.querySelector('.screen_share_active').style.display = 'none'
      
        } else if ( docs.data().call.video == false ) {
          peerCamButton.style.display = 'none'
          peerCamButtonOff.style.display = 'inline-block'
      
          //document.querySelector('.screen_share').style.display = 'inline-block'
          //document.querySelector('.screen_share_active').style.display = 'none'
      
        }
      } else{
        unsubVideoChange()
      }
    })
  //cam

}
//----- Remote peer pic, name and controllars add in participents panel -----


  


}
/* 
* peer connection setup
* database controll
*/









/* 
* camera
* miceophone
* share screen
*/
async function openUserMedia(e) {

  const localVideoElement = document.querySelector('#localVideo')
  const localAudioElement = document.querySelector('#localAudio')

  const audioInputSelect = document.querySelector('select#audioSource');
  const audioOutputSelect = document.querySelector('select#audioOutput');
  const videoSelect = document.querySelector('select#videoSource');
  const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

  audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);


  
  /* find out media devices available */
    function gotDevices(deviceInfos) {

      // Handles being called several times to update labels. Preserve values.
      const values = selectors.map(select => select.value);
      selectors.forEach(select => {
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
      });

      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
          option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
          audioInputSelect.appendChild(option);
        } else if (deviceInfo.kind === 'audiooutput') {
          option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
          audioOutputSelect.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
          videoSelect.appendChild(option);
        } else {
          console.log('Some other kind of source/device: ', deviceInfo);
        }
      }

      selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
          select.value = values[selectorIndex];
        }
      });
    }

    function handleError(error) {
      console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }

    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
  /* find out media devices available */


  //chage media devices
  audioInputSelect.onchange = async ()=>{
    startAudio()
    startVideo()
    
    const audioIncrement = await getDoc(doc(db, 'Moments', myId, 'call', 'management'));
    const getStrNum = audioIncrement.data().device.increased.audio
    await setDoc(doc(db, 'Moments', myId, 'call', 'management'), {
      'device': {
        'increased': {
          'audio': getStrNum + 1
        },
        'complete': {
          'audio': false
        }
      }
    }, {merge:true})

    const videoIncrement = await getDoc(doc(db, 'Moments', myId, 'call', 'management'));
    const getStrNumVideo = videoIncrement.data().device.increased.video
    await setDoc(doc(db, 'Moments', myId, 'call', 'management'), {
      'device': {
        'increased': {
          'video': getStrNumVideo + 1
        },
        'complete': {
          'video': false
        }
      }
    }, {merge:true})

  };

  videoSelect.onchange = async ()=>{
    const videoIncrement = await getDoc(doc(db, 'Moments', myId, 'call', 'management'));

    const getStrNum = videoIncrement.data().device.increased.video

    await setDoc(doc(db, 'Moments', myId, 'call', 'management'), {
      'device': {
        'increased': {
          'video': getStrNum + 1
        },
        'complete': {
          'video': false
        }
      }
    }, {merge:true})

    startVideo()    
  };

  audioOutputSelect.onchange = ()=>{
    const audioDestination = audioOutputSelect.value;
    attachSinkId(videoElement, audioDestination);
  }

    // change sound speaker device
      function attachSinkId(element, sinkId) {
        if (typeof element.sinkId !== 'undefined') {
          element.setSinkId(sinkId)
          .then(() => {
            console.log(`Success, audio output device attached: ${sinkId}`);
          })
          .catch(error => {
            let errorMessage = error;
            if (error.name === 'SecurityError') {
              errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
            }
            console.error(errorMessage);
            // Jump back to first output device in the list as it's the default.
            audioOutputSelect.selectedIndex = 0;
          });
        } else {
          console.warn('Browser does not support output device selection.');
        }
      }
    // change sound speaker device
  //chage media devices

  



  //--------- video ----------
  async function videoCam(){

    function gotVideoStream(stream) {
      localStream = stream

      localVideoElement.srcObject = localStream
    
      console.log('Video Stream:', localVideoElement.srcObject)

      // Refresh button list in case labels have become available
      return navigator.mediaDevices.enumerateDevices()
    }

    function handleVideoError(error) {
      console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }

    //video stream
      async function startVideo() {
    
        const audioSource = audioInputSelect.value;
        const videoSource = videoSelect.value;

        let constraints = {
          audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
          video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        }

        navigator.mediaDevices.getUserMedia(constraints).then( gotVideoStream ).then(gotDevices).catch(handleVideoError);
    
      }

      const checkMyVideoIsOnOrNot = await getDoc(doc(db, "Moments", myId, "call", "management"));
      if( checkMyVideoIsOnOrNot.data().device.media.video == true){
        startVideo()
      }//first call witout increment
      


      let videoIncrement = checkMyVideoIsOnOrNot.data().device.increased.video

      onSnapshot(doc(db, "Moments", myId, "call", "management"), (doc) => {
        if( doc.data().device.media.video == true && videoIncrement < doc.data().device.increased.video){
          videoIncrement++
          startVideo()
        }
      })
    //video stream

    

    //camera on off button
      async function camereOnOffButton(){
        const unsubVideoChange = onSnapshot(doc(db, "Moments", myId, "call", "management"), (docs) => {
          if( docs.data().call.video == true ){
            document.querySelector( '.videocam' ).style.display = 'inline-block'
            document.querySelector( '.videocam_off' ).style.display = 'none'
      
            document.querySelector('.screen_share').style.display = 'inline-block'
            document.querySelector('.screen_share_active').style.display = 'none'

          } else if ( docs.data().call.video == false ) {
            document.querySelector( '.videocam' ).style.display = 'none'
            document.querySelector( '.videocam_off' ).style.display = 'inline-block'

            document.querySelector('.screen_share').style.display = 'inline-block'
            document.querySelector('.screen_share_active').style.display = 'none'

          }
        })

        document.querySelector('.videocam').onclick = async ()=>{
          const videoIncrement = await getDoc(doc(db, "Moments", myId, "call", "management"));
          const getStrNum = videoIncrement.data().device.increased.video
    
          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'device': {
              'media': {
                'video': false,
              },
              'increased': {
                'video': getStrNum + 1        
              },        
              'complete': {
                'video': false
              }
            }
          },
          { merge: true })
    
        
          console.warn('working click video on to off')    
    
          //stop cam
            const tracks = localStream.getTracks();
            tracks.forEach(track => {
              track.stop();
            })
          //stop cam
        }
    
        document.querySelector('.videocam_off').onclick = async ()=>{
          const videoIncrement = await getDoc(doc(db, "Moments", myId, "call", "management"));
          const getStrNum = videoIncrement.data().device.increased.video
    
          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'device': {
              'media': {
                'video': true,
                'shareScreen': false,
              },
              'increased': {
                'video': getStrNum + 1
              } 
            }
          },
          { merge: true })
    
        
          console.warn('working click video off to on')
        }

        document.querySelector( '.arrow_drop_up_cam' ).onclick = ()=>{
          document.querySelector( '.video_source' ).style.display = 'inline-block'
        
          document.querySelector( '.arrow_drop_up_cam' ).style.display = 'none'
          document.querySelector( '.arrow_drop_down_cam' ).style.display = 'inline-block'
        }

        document.querySelector( '.arrow_drop_down_cam' ).onclick = ()=>{
          document.querySelector( '.video_source' ).style.display = 'none'
        
          document.querySelector( '.arrow_drop_up_cam' ).style.display = 'inline-block'
          document.querySelector( '.arrow_drop_down_cam' ).style.display = 'none'
        }
      }
      camereOnOffButton()
    //camera on off button
  }
  videoCam()
  //--------- video ----------




  //audio stream
  async function audioMicophone() {
    function gotAudioStream(stream) {
      localAudioElement.srcObject = stream;

      localAudioStream = stream

      console.log('Audio Stream:', localAudioElement.srcObject)

      // Refresh button list in case labels have become available
      return navigator.mediaDevices.enumerateDevices()
    }

    function handleAudioError(error) {
      console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }

    function startAudio() {
      const audioSource = audioInputSelect.value;

      let constraints = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
        video: false
      }

      navigator.mediaDevices.getUserMedia(constraints).then( gotAudioStream ).then(gotDevices).catch( handleAudioError );
    
    }
    startAudio() // default start
    

    //microphone button
      async function microphone(){
        onSnapshot(doc(db, "Moments", myId, "call", "management"), (docs) => {
          if( docs.data().device.media.audio == false ){
            document.querySelector('.mic').style.display = 'none'
            document.querySelector('.mic_off').style.display = 'inline-block'
          } else if( docs.data().device.media.audio == true ) {
            document.querySelector('.mic').style.display = 'inline-block'
            document.querySelector('.mic_off').style.display = 'none'
          }
        })

        document.querySelector('.mic').onclick = async ()=>{
          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'device': {
              'media': {
                'audio': false
              }    
            }
          },
          { merge: true })

          console.warn('working click mic on')
        }

        document.querySelector('.mic_off').onclick = async ()=>{
          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'device': {
              'media': {
                'audio': true
              }    
            }
          },
          { merge: true })    
          
          console.warn('working click mic off')
        }

        document.querySelector( '.arrow_drop_up_mic' ).onclick = ()=> {
          document.querySelector( '.audio_source' ).style.display = 'inline-block'
  
          document.querySelector( '.arrow_drop_up_mic' ).style.display = 'none'
          document.querySelector( '.arrow_drop_down_mic' ).style.display = 'inline-block'
        }
  
        document.querySelector( '.arrow_drop_down_mic' ).onclick = ()=> {
          document.querySelector( '.audio_source' ).style.display = 'none'
  
          document.querySelector( '.arrow_drop_down_mic' ).style.display = 'none'
          document.querySelector( '.arrow_drop_up_mic' ).style.display = 'inline-block'
        }
      }
      microphone()
    //microphone button
  }
  audioMicophone()
  //audio stream




  // push stream of camre or screen into local video element
  function tuckInWebCamInLocalVideo(){
    localVideoElement.srcObject = localStream;
  }
  // push stream of camre or screen into local video element

  
  //screen Sharing
  async function screenSharingController() {

    if (adapter.browserDetails.browser === 'chrome' && adapter.browserDetails.version >= 107) {
      // See https://developer.chrome.com/docs/web-platform/screen-sharing-controls/
      //document.getElementById('options').style.display = 'block';
    } else if (adapter.browserDetails.browser === 'firefox') {
      // Polyfill in Firefox.
      // See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
      adapter.browserShim.shimGetDisplayMedia(window, 'screen');
    }

    async function handleShareScreenSuccess(stream) {
      localShareScreenStream = stream

      localVideoElement.srcObject = localShareScreenStream

      console.log('Share Screen Stream:', localVideoElement.srcObject )



      const shareScreenIncrement = await getDoc(doc(db, 'Moments', myId, 'call', 'management'));
      const getStrNumShareScreen = shareScreenIncrement.data().device.increased.shareScreen
      const getStrNumVideo = shareScreenIncrement.data().device.increased.video
      await setDoc(doc(db, "Moments", myId, "call", "management"), {
        'device': {
          'media': {
            'shareScreen': true,
          },        
          'increased': {
            'shareScreen': getStrNumShareScreen + 1,
            'video': getStrNumVideo + 1
          }
        }
      },
      { merge: true })



      // detect that the user has stopped screen sharing
        stream.getVideoTracks()[0].addEventListener('ended', async () => {
          console.warn('The user has ended sharing the screen');

          stream.getVideoTracks()[0].removeEventListener('ended' , async ()=>{}) // clear listenet

          const videoIncrement = await getDoc(doc(db, 'Moments', myId, 'call', 'management'));
          const getStrNum = videoIncrement.data().device.increased.video

          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'device': {
              'media': {
                'shareScreen': false,
              },          
              'increased': {
                'video': getStrNum + 1
              }   
            }
          },
          { merge: true })
    
    
          tuckInWebCamInLocalVideo()

        });
      // detect that the user has stopped screen sharing
    }
  
    function handleShareScreenError(error) {
      console.warn(`Share Screen error: ${error.name}`)
      if (typeof error !== 'undefined') {
        console.error(error);
      }
    }

    function startShareScreen() {
      const options = {audio: true, video: true};
    
      navigator.mediaDevices.getDisplayMedia(options).then( handleShareScreenSuccess, handleShareScreenError );
    }
  

    document.querySelector('.screen_share').onclick = async () => {    
      startShareScreen()
    }

    document.querySelector('.screen_share_active').onclick = async ()=>{

      const videoIncrement = await getDoc(doc(db, 'Moments', myId, 'call', 'management'));
      const getStrNum = videoIncrement.data().call.increased.video

      await setDoc(doc(db, "Moments", myId, "call", "management"), {
        'device': {
          'media': {
            'shareScreen': false,
          },        
          'increased': {
            'video': getStrNum + 1
          },
          'complete': {
            'shareScreen': false
          }
        }
      },
      { merge: true })

      tuckInWebCamInLocalVideo()
    }

    // show & hide share screen button
    const unSubToogleShareScreen = onSnapshot(doc(db, "Moments", myId, "call", "management"), (docs) => {
      if( docs.data().device.media.shareScreen == true){
        document.querySelector('.screen_share').style.display = 'none'
        document.querySelector('.screen_share_active').style.display = 'inline-block'
      } else {
        document.querySelector('.screen_share').style.display = 'inline-block'
        document.querySelector('.screen_share_active').style.display = 'none'
      }
    })
    // show & hide share screen button
  }
  screenSharingController()
  //screen Sharing


  




  //Hide unhide local video tag on camera and share screen on or off
  onSnapshot(doc(db, "Moments", myId, "call", "management"), (docs) => {
    const localVideoElem = document.getElementById( 'localVideo' )

    if( docs.data().device.media.video == false && docs.data().device.media.shareScreen == true ||
    docs.data().device.media.video == true && docs.data().device.media.shareScreen == false ){
      localVideoElem.style.display = 'inline-block'
    } else if ( docs.data().device.media.video == false && docs.data().device.media.shareScreen == false ){
      localVideoElem.style.display = 'none'
    }
  })
  //Hide unhide local video tag on camera and share screen on or off

}

/* 
* camera
* miceophone
* share screen
*/









//soundBox/ Hearphone/ earphone
function soundBox(){
  document.querySelector('.volume_up').onclick = async ()=>{
    document.querySelector('.volume_up').style.display = 'none'
    document.querySelector('.volume_off').style.display = 'inline-block'

    await setDoc(doc(db, "Moments", myId, "call", "management"), {
      'call': {
        'muteRemotePeer': true    
      }
    },
    { merge: true })
  }

  document.querySelector('.volume_off').onclick = async ()=>{
    document.querySelector('.volume_up').style.display = 'inline-block'
    document.querySelector('.volume_off').style.display = 'none'

    await setDoc(doc(db, "Moments", myId, "call", "management"), {
      'call': {
        'muteRemotePeer': false    
      }
    },
    { merge: true })
  }

  //speaker mute listener
  onSnapshot(doc(db, "Moments", myId, "call", "management"), (docs) => {
    if( docs.data().call.muteRemotePeer == false ){
      const remotePeerMuting = document.querySelector('.remoteVideo')

      if(remotePeerMuting){
        remotePeerMuting.muted = false
      }      
    } else if( docs.data().call.muteRemotePeer == true ) {
      const remotePeerMuting = document.querySelector('.remoteVideo')
      
      if(remotePeerMuting){
        remotePeerMuting.muted = true
      }   
    }
  })
  //speaker mute listener
}
document.querySelector( '.arrow_drop_up_speaker' ).onclick = ()=>{
  document.querySelector( '.audio_output' ).style.display = 'inline-block'

  document.querySelector( '.arrow_drop_up_speaker' ).style.display = 'none'
  document.querySelector( '.arrow_drop_down_speaker' ).style.display = 'inline-block'
}
document.querySelector( '.arrow_drop_down_speaker' ).onclick = ()=>{
  document.querySelector( '.audio_output' ).style.display = 'none'

  document.querySelector( '.arrow_drop_up_speaker' ).style.display = 'inline-block'
  document.querySelector( '.arrow_drop_down_speaker' ).style.display = 'none'
}
//soundBox/ Hearphone/ earphone


//add member button
  document.querySelector('.person_add').onclick = ()=>{ 
    document.querySelector('.add_member_panal').classList.toggle("add_member_panal_show") 

      const vh = window.innerHeight - 51
      const mt = window.innerHeight - 41
      document.querySelector('.add_member_panal').style.height = vh + 'px'
      document.querySelector('.add_member_panal').style.marginTop = '-' + mt + 'px'
  }
//add member button


//screen recorder
let mediaRecorder;
let recordedBlobs;
let screenRecorderStreem

const codecPreferences = document.querySelector('#codecPreferences');
const recordedVideo = document.querySelector('video#recorded');

const recordStreamControlBox = document.querySelector('#recordStreamControlar')

document.getElementById('saveRecord').onclick = () => {
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'Screen Record.webm';
  a.setAttribute('style','display: hidden;')
  recordStreamControlBox.appendChild(a);
  a.click();
  setTimeout(() => {
    recordStreamControlBox.removeChild(a);
    window.URL.revokeObjectURL(url);

    hideRecordPanel()
  }, 100);
};

function playPreviewRecord() {
  const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value.split(';', 1)[0];
  const superBuffer = new Blob(recordedBlobs, {type: mimeType});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.play();
};


function handleDataAvailable(event) {
  console.warn('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}


function startRecording( theStream ) {
  recordedBlobs = [];
  const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value;
  const options = {mimeType};

  try {
    mediaRecorder = new MediaRecorder( theStream, options);
  } catch (e) {
    console.warn('Exception while creating MediaRecorder:', e);
    //errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.warn('Created MediaRecorder', mediaRecorder, 'with options', options);
  
  mediaRecorder.onstop = (event) => {
    console.warn('Recorder stopped: ', event);
    console.warn('Recorded Blobs: ', recordedBlobs);

    playPreviewRecord()
    

    screenRecorderButton.style.display = 'inline-block'
    screenRecorderButtonOn.style.display = 'none'

    recordStreamControlBox.style.display = 'inline-block'

    resize_perticipents_panal() //place center in ejs this func 
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.warn('MediaRecorder started', mediaRecorder);
}



function getSupportedMimeTypes() {
  const possibleTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/mp4;codecs=h264,aac',
  ];
  return possibleTypes.filter(mimeType => {
    return MediaRecorder.isTypeSupported(mimeType);
  });
}



async function handleScreenRecorderSuccess(stream) {  
  screenRecorderStreem = stream
  console.warn('Screen Recorder Stream:', stream )

  getSupportedMimeTypes().forEach(mimeType => {
    const option = document.createElement('option');
    option.value = mimeType;
    option.innerText = option.value;
    codecPreferences.appendChild(option);
  });


  if( stream ){
    startRecording( stream )
  }


  // detect that the user has stopped screen recording
  screenRecorderStreem.getVideoTracks()[0].addEventListener('ended', async () => {
    console.warn('Screen Recorder Stopped');

    screenRecorderStreem.getVideoTracks()[0].removeEventListener('ended' , async ()=>{})

  });
}

function handleScreenRecorderError(error) {
  console.warn(`Screen Recorder error: ${error.name}`)
  if (typeof error !== 'undefined') {
    console.error(error);
  }

  screenRecorderButton.style.display = 'inline-block'
  screenRecorderButtonOn.style.display = 'none'
}

function startScreenRecording() {
  const options = {
    audio: {
      echoCancellation: {ideal: true},
      noiseSuppression: {ideal: true}
    }, 
    video: true
  };  
  navigator.mediaDevices.getDisplayMedia(options).then( handleScreenRecorderSuccess, handleScreenRecorderError );
}


const screenRecorderButton = document.querySelector( '.video_file' )
const screenRecorderButtonOn = document.querySelector( '.video_file_on' )
screenRecorderButton.onclick = ()=>{
  screenRecorderButton.style.display = 'none'
  screenRecorderButtonOn.style.display = 'inline-block'

  startScreenRecording()
}
screenRecorderButtonOn.onclick = ()=>{
  screenRecorderButton.style.display = 'inline-block'
  screenRecorderButtonOn.style.display = 'none'

  //stop recording
  const tracks = screenRecorderStreem.getTracks();
  tracks.forEach(track => {
    track.stop();
  })
  //stop recording
}

document.querySelector('#cancelRecord').onclick = hideRecordPanel
function hideRecordPanel() {
  recordStreamControlBox.style.display = 'none'
  recordedVideo.pause()
}
//screen recorder




//search profile for add peer
const searchedId = document.querySelector('#searchProfile')

searchedId.addEventListener('submit', async (e) => {
 	e.preventDefault()
  
  //mysql on server.js
  //$("#addPeerSection").load("/searchIdInMySql", {myid: myId, searchValue: searchedId.searchProfile.value})

  //clear previous serach  
  document.querySelector("#searchedIdContainer").innerHTML = ''
  //clear previous search

  const seachThePersonInMoments = query(collection(db, "Moments"), where("profileInfo.fullName", "==", searchedId.searchProfile.value));

  const getThePerson = await getDocs( seachThePersonInMoments );
  getThePerson.forEach( async (docs) => {

    //emptied search box
      document.querySelector('#profileSearchField').value = ''
    //emptied search box

    const createSearchedPeerBox = document.createElement('div')
    createSearchedPeerBox.setAttribute('id', `searchedPeerBox_${ docs.id }`)
    createSearchedPeerBox.setAttribute('class', `searchedPeerBox`)
    document.querySelector("#searchedIdContainer").appendChild( createSearchedPeerBox )

    const createSearchedPeerImg = document.createElement('img')
    createSearchedPeerImg.setAttribute('id', `searchedPeerBoxImg_${ docs.id }`)
    createSearchedPeerImg.setAttribute('class', `searchedPeerBoxImg`)
    createSearchedPeerImg.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
    createSearchedPeerBox.appendChild( createSearchedPeerImg )

    const createSearchedPeerName = document.createElement('span')
    createSearchedPeerName.setAttribute('class', `searchedPeerName`)
    createSearchedPeerName.innerText = docs.data().profileInfo.fullName
    createSearchedPeerBox.appendChild( createSearchedPeerName )

    const searchedPeerStatus = document.createElement('span')
    searchedPeerStatus.setAttribute('class', `searchedPeerMessages`)
    createSearchedPeerBox.appendChild( searchedPeerStatus )


    if( peerIds.includes( docs.id ) == true || docs.id == myId ) {
      
      searchedPeerStatus.innerText = 'Already in this meeting!'

    } else {
      const addButton = document.createElement("button")
      addButton.setAttribute('id', `addPeerButton_${ docs.id }`)
      addButton.setAttribute('class', `addPeerButton`)
      addButton.innerText = 'Add'
      createSearchedPeerBox.appendChild( addButton )

      const cutButton = document.createElement("button")
      cutButton.setAttribute('id', `cutButton_${ docs.id }`)
      cutButton.setAttribute('class', `cutButton`)
      cutButton.innerText = 'Cut'
      createSearchedPeerBox.appendChild( cutButton )
      cutButton.style.display = 'none'
      


      document.getElementById( `addPeerButton_${ docs.id }` ).onclick = async ()=>{

        document.getElementById( `addPeerButton_${ docs.id }` ).style.display = 'none'

        const checkPeerIsInAnotherCallOrNot = await getDoc( doc(db, "Moments", docs.id) )
        if( checkPeerIsInAnotherCallOrNot.data().call.status != 'calling' && checkPeerIsInAnotherCallOrNot.data().call.status != 'ringing' ){

          await setDoc(doc(db, 'Moments', myId ), {
            'call': {
              'to': arrayUnion( docs.id ),
              'group': false
            }
          }, {merge:true})
  
          await setDoc(doc(db, 'Moments', docs.id ), {
            'call': {
              'from': arrayUnion( myId ),
              'status': 'rigning',
              'group': true
            }
          }, {merge:true})

        } else {
          searchedPeerStatus.innerText = 'In another call!'
        }
        
        let callTimer30Seconds = null
        async function cutAddPeerCall(){
          await setDoc(doc(db, 'Moments', myId ), {
            'call': {
              'to': arrayRemove( docs.id ),
            }
          }, {merge:true})
  
          await setDoc(doc(db, 'Moments', docs.id ), {
            'call': {
              'from': arrayRemove( myId ),
              'status': '',
              'group': false
            }
          }, {merge:true})

          peerIds.splice(peerIds.indexOf( docs.id ), 1)
          console.warn('peerids after deleting: '+ peerIds)

          const pannelActiveName = document.getElementById('panelBox_' + docs.id )
          if(pannelActiveName){
            document.querySelector('#perticipentsNameList').removeChild( pannelActiveName ) //remove from panel name list
          }
        }

        document.getElementById( `cutButton_${ docs.id }` ).onclick = cutAddPeerCall //cut button in add peer
        
        const unsubAddMemberListener = onSnapshot(doc(db, "Moments", docs.id), (docs) => {
          if( document.getElementById( `searchedPeerBox_${ docs.id }` ) ){
            
            if( docs.data().call.status == 'rigning' ){
              searchedPeerStatus.innerText = 'Calling!'
              callTimer30Seconds = setTimeout( cutAddPeerCall, 30000)
              cutButton.style.display = 'inline-block'

            } else if ( docs.data().call.status == 'received' ){

              searchedPeerStatus.innerText = 'Added in this meeting!'
              clearTimeout( callTimer30Seconds )
              cutButton.style.display = 'none'

            } else if( docs.data().call.status == '' ){
              clearTimeout( callTimer30Seconds ) //when peer cut my call
              cutAddPeerCall()
              unsubAddMemberListener()
              searchedPeerStatus.innerText = ''
              cutButton.style.display = 'none'
              document.getElementById( `addPeerButton_${ docs.id }` ).style.display = 'inline-block'
            }
          } else {
            unsubAddMemberListener()
          }
        })
      }
    }

    //profile pic handlers 
    const getProfilePicName = query(collection(db, "Moments", docs.id, "profilePictures"), orderBy("time", "desc"), limit(1));
    let picName
    const showProfilePicName = await getDocs(getProfilePicName);
    showProfilePicName.forEach((doc) => {
      picName = doc.data().title
    })

    if( picName!= null && picName!= undefined && picName!= '' ){
      //pic
      const storesRef = ref(storage, 'profilePictures/' + docs.id + '/' + picName)
      getDownloadURL(storesRef)
      .then((URL) => {
        // Insert url into an <img> tag to "download"
        createSearchedPeerImg.setAttribute('src', URL)        
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
    
  })
})
//search profile for add peer




//participents button

  //participents total number
  setInterval(()=>{
  document.querySelector('.perticipents_number').innerText = peerIds.length + 1
  }, 1000)
  //participents total number

  //add my name in perticipents panel
    async function addMyNameParticipentsPanel(){
      const makDiv = document.createElement("div")
      //makDiv.innerText = myId
      makDiv.setAttribute('id', `panelBox_${myId}`)
      makDiv.setAttribute('class', `panelBox`)
      document.querySelector('#perticipentsNameList').appendChild( makDiv )

      const imgHolderDiv = document.createElement("div")
      imgHolderDiv.setAttribute('class', `imgHolderDiv`)
      imgHolderDiv.setAttribute('id', `myImgHolderDiv`)
      document.getElementById(`panelBox_${myId}`).appendChild( imgHolderDiv )

      const altText = document.createElement("span")
      altText.setAttribute('class', `altTextParticipentsPanel`)
      altText.setAttribute('id', `altTextMy`)
      document.getElementById(`myImgHolderDiv`).appendChild( altText )

      const imgHolder = document.createElement("img")
      imgHolder.setAttribute('id', `imgHolder_${myId}`)
      imgHolder.setAttribute('class', `imgHolder`)
      document.getElementById(`myImgHolderDiv`).appendChild( imgHolder )

      const myName = document.createElement("span")
      myName.setAttribute('id', `myName`)
      myName.setAttribute('class', `panelName`)
      document.getElementById(`panelBox_${myId}`).appendChild( myName )

      //my name        
        const getMyName = await getDoc( doc(db, "Moments", myId, "profileInfo", "credentials") )
        myName.innerText = getMyName.data().name.fullName + ' ( Me )'
      

        const firstLetter_firstname = getMyName.data().name.firstName.charAt(0)
        const firstLetter_lastname = getMyName.data().name.lastName.charAt(0)
        altText.innerText = firstLetter_firstname + firstLetter_lastname
      //my name


      //My profile pic handlers 
      async function getMyProfilepic(){
        const getProfilePicName = query(collection(db, "Moments", myId, "profilePictures"), orderBy("time", "desc"), limit(1));
        let picName
        const showProfilePicName = await getDocs(getProfilePicName);
        showProfilePicName.forEach((doc) => {
          picName = doc.data().title
        })

        if(picName!= null && picName!= undefined && picName!= ''){
          const storesRef = ref(storage, 'profilePictures/' + myId + '/' + picName)
          getDownloadURL(storesRef)
          .then((URL) => {
            // Insert url into an <img> tag to "download"
            document.getElementById(`imgHolder_${myId}`).setAttribute('src',  URL )
            document.getElementById(`imgHolder_${myId}`).style.display = 'inline-block'
            document.getElementById(`altTextMy`).style.display = 'none'
          /*
          //listener for video off and on
          const unsubVideoChange = onSnapshot(doc(db, "Moments", myId), (docs) => {
            if( docs.data().call.video == true ||  docs.data().call.shareScreen == true){

              document.querySelector('#videos_holder_localVideo').style.backgroundImage = 'none'

            }else if( docs.data().call.video == false &&  docs.data().call.shareScreen == false){

              document.querySelector('#videos_holder_localVideo').style.backgroundImage = "url(" + URL + ")"
              document.querySelector('#videos_holder_localVideo').style.backgroundSize = 'cover'
              document.querySelector('#videos_holder_localVideo').style.backgroundPosition = 'center'
              document.querySelector('#videos_holder_localVideo').style.backgroundRepeat = 'no-repeat'

            }
          })
          //listener for video off and on
          */
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
        } else {
          console.warn('panal my profile pic empty')

          document.getElementById(`imgHolder_${myId}`).style.display = 'none'
          document.getElementById(`altTextMy`).style.display = 'inline-block'
        }
      }

      if( document.getElementById(`imgHolder_${myId}`) ){
        getMyProfilepic()
      }
      //My profile pic handlers

      

      //mic
        const myMic = document.createElement("span")
        myMic.setAttribute('id', `myMic`)
        myMic.setAttribute('class', `material-icons-outlined panel_mic`)
        myMic.innerText = 'mic'
        document.getElementById(`panelBox_${myId}`).appendChild( myMic )

        const myMicOff = document.createElement("span")
        myMicOff.setAttribute('id', `myMicOff`)
        myMicOff.setAttribute('class', `material-icons-outlined panel_mic_off`)
        myMicOff.innerText = 'mic_off'
        document.getElementById(`panelBox_${myId}`).appendChild( myMicOff )

        onSnapshot(doc(db, "Moments", myId, "call", "management"), (docs) => {
          if( docs.data().call.audio == false ){
            document.querySelector('.panel_mic').style.display = 'none'
            document.querySelector('.panel_mic_off').style.display = 'inline-block'
          } else if( docs.data().call.audio == true ) {
            document.querySelector('.panel_mic').style.display = 'inline-block'
            document.querySelector('.panel_mic_off').style.display = 'none'
          }
        })
      
        document.querySelector('.panel_mic').onclick = async ()=>{
          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'call': {
              'audio': false    
            }
          },
          { merge: true })
      
          console.warn('working click panel_mic on')
        }
      
        document.querySelector('.panel_mic_off').onclick = async ()=>{
          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'call': {
              'audio': true    
            }
          },
          { merge: true })    
          console.warn('working click panel_mic off')
        }
      //mic

      //cam
        const myCam = document.createElement("span")
        myCam.setAttribute('id', `myCam`)
        myCam.setAttribute('class', `material-icons-outlined panel_videocam`)
        myCam.innerText = 'videocam'
        document.getElementById(`panelBox_${myId}`).appendChild( myCam )

        const myCamOff = document.createElement("span")
        myCamOff.setAttribute('id', `myCamOff`)
        myCamOff.setAttribute('class', `material-icons-outlined panel_videocam_off`)
        myCamOff.innerText = 'videocam_off'
        document.getElementById(`panelBox_${myId}`).appendChild( myCamOff )

        const unsubVideoChange = onSnapshot(doc(db, "Moments", myId, "call", "management"), (docs) => {
          if( docs.data().call.video == true ){
            document.querySelector( '.panel_videocam' ).style.display = 'inline-block'
            document.querySelector( '.panel_videocam_off' ).style.display = 'none'
            
            document.querySelector('.screen_share').style.display = 'inline-block'
            document.querySelector('.screen_share_active').style.display = 'none'
      
          } else if ( docs.data().call.video == false ) {
            document.querySelector( '.panel_videocam' ).style.display = 'none'
            document.querySelector( '.panel_videocam_off' ).style.display = 'inline-block'
      
            document.querySelector('.screen_share').style.display = 'inline-block'
            document.querySelector('.screen_share_active').style.display = 'none'
      
          }
        })


        document.querySelector('.panel_videocam').onclick = async ()=>{
          const videoIncrement = await getDoc(doc(db, "Moments", myId, "call", "management"));
          const getStrNum = videoIncrement.data().call.increased.video
      
          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'call': {
              'video': false,
              'increased': {
                'video': getStrNum + 1
              }
            }
          },
          { merge: true })
      
          
          console.warn('working click panel video on to off')    
      
          //stop cam
          const tracks = localStream.getTracks();
          tracks.forEach(track => {
            track.stop();
          })
          //stop cam
        }
      
        document.querySelector('.panel_videocam_off').onclick = async ()=>{
          const videoIncrement = await getDoc(doc(db, 'Moments', myId));
          const getStrNum = videoIncrement.data().call.increased.video
      
          await setDoc(doc(db, "Moments", myId, "call", "management"), {
            'call': {
              'video': true,
              'shareScreen': false,
              'increased': {
                'video': getStrNum + 1
              } 
            }
          },
          { merge: true })
      
          console.warn('working click Panel video off to on')
        }
      //cam

    }
  //add my name in perticipents panel

  //show participents panal
    document.querySelector('.arrow_drop_up_participents').onclick = ()=>{ 
      document.querySelector('.perticipents_panal').style.display = 'inline-block'

      document.querySelector('.arrow_drop_up_participents').style.display = 'none'
      document.querySelector( '.arrow_drop_down_participents').style.display = 'inline-block'
    }
    document.querySelector('.arrow_drop_down_participents').onclick = ()=>{ 
      document.querySelector('.perticipents_panal').style.display = 'none'

      document.querySelector('.arrow_drop_up_participents').style.display = 'inline-block'
      document.querySelector( '.arrow_drop_down_participents').style.display = 'none'
    }
  //show participents panal

  //Add member button
    document.querySelector( '.person_add' ).onclick = ()=>{
      document.querySelector( '.addMember' ).style.display = 'inline-block'

      document.querySelector( '.person_add' ).style.display = 'none'
      document.querySelector( '.person_close' ).style.display = 'inline-block'

      resize_perticipents_panal() //for get member panel width
    }
    document.querySelector( '.person_close' ).onclick = closeMemberPanel
    document.querySelector( '.mamber_cancel' ).onclick = ()=>{
      closeMemberPanel() 
      clearSearchedIdContainer()
    }
    function closeMemberPanel() {
      document.querySelector( '.addMember' ).style.display = 'none'

      document.querySelector( '.person_add' ).style.display = 'inline-block'
      document.querySelector( '.person_close' ).style.display = 'none'
    }

    //clear previous serach
    function clearSearchedIdContainer(){
      document.querySelector('#profileSearchField').value = ''
      document.querySelector("#searchedIdContainer").innerHTML = ''
    }
    //clear previous search
    
  //Add member button
//participents button


//My profile pic handlers 
async function showMyProfilepic(){
  const getProfilePicName = query(collection(db, "Moments", myId, "profilePictures"), orderBy("time", "desc"), limit(1));
  let picName
  const showProfilePicName = await getDocs(getProfilePicName);
  showProfilePicName.forEach((docs) => {   
    picName = docs.data().title
  })


  if( picName!= null && picName!= undefined && picName!= ''){
    //pic
      const storesRef = ref(storage, 'profilePictures/' + myId + '/' + picName)
      getDownloadURL(storesRef)
      .then((URL) => {
        // Insert url into an <img> tag to "download"
    
        //listener for video off and on
        const unsubVideoChange = onSnapshot(doc(db, "Moments", myId), (docs) => {
          if( docs.data().call.video == true ||  docs.data().call.shareScreen == true){

            document.querySelector('#videos_holder_localVideo').style.backgroundImage = 'none'

          }else if( docs.data().call.video == false &&  docs.data().call.shareScreen == false){

            document.querySelector('#videos_holder_localVideo').style.backgroundImage = "url(" + URL + ")"
            document.querySelector('#videos_holder_localVideo').style.backgroundSize = 'cover'
            document.querySelector('#videos_holder_localVideo').style.backgroundPosition = 'center'
            document.querySelector('#videos_holder_localVideo').style.backgroundRepeat = 'no-repeat'

          }
        })
        //listener for video off and on
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
              console.warn('Pic dosnt found')
          break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.warn('Pic access forbiden')
          break;
          case 'storage/canceled':
            // User canceled the upload
            console.warn('Pic uploading cancled')
          break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
              console.warn('Unexpected err in Pic uploading')
          break;
        }
      })
    //pic

    //name
      document.querySelector('#holder_myname').style.display = 'inline-block'
      document.querySelector('#holder_mynameBig').style.display = 'none'
    //name

    
  } else {
    console.warn('my profile pic empty')

    //listener for video off and on
    const unsubVideoChange = onSnapshot(doc(db, "Moments", myId), (docs) => {
      if( docs.data().call.video == true ||  docs.data().call.shareScreen == true){

        document.querySelector('#holder_myname').style.display = 'inline-block'
        document.querySelector('#holder_mynameBig').style.display = 'none'

      }else if( docs.data().call.video == false &&  docs.data().call.shareScreen == false){

        document.querySelector('#holder_myname').style.display = 'none'
        document.querySelector('#holder_mynameBig').style.display = 'inline-block'

      }
    })
    //listener for video off and on
  }
  
}
//My profile pic handlers

//show my name
async function displayMyName(){
  const getMyName = await getDoc( doc(db, "Moments", myId, "profileInfo", "credentials") );

  document.querySelector('#holder_myname').innerText = getMyName.data().name.firstName + ' ' + getMyName.data().name.lastName  
  document.querySelector('#holder_mynameBig').innerText = getMyName.data().name.firstName + ' ' + getMyName.data().name.lastName
}
//show my name


//--- nav previous and next ----
function nav_previous_next_func(){

  //check the length of peerids array > 1
  setInterval(()=>{
    if( peerIds.length >= 1){
      document.getElementById( 'next_previous_nav' ).style.display = 'block'
    }

    if( getContainerWidth >= 300 && getContainerWidth < 1250 ){
      addInActivePeerArray( 1 )
    }
  }, 1000)
  //check the length of peerids array > 1

  //add in active peer array
  function addInActivePeerArray( num ){
    
    if( peerIds[ num ] != undefined && onScreenPeerIds.includes( peerIds[ num ] ) == false ){
      onScreenPeerIds.push( peerIds[ num ] )
      console.warn('peerids num: '+ peerIds[ num ])
      console.warn('onscreenArray: '+onScreenPeerIds)  
    }
  
  }
  //add in active peer array

  document.getElementById( 'previous_button' ).click = ()=>{
  
  }
  document.getElementById( 'next_button' ).click = ()=>{
  
  }
}
//--- nav previous and next ----

//measurement for videos_holder_and_profile
/*
let getContainerWidth
let getContainerHeight
let videoFrameWidths
let videoFrameHeights
function measre_video_holders_and_profile(){
  getContainerWidth = document.querySelector('#video_frames_warnings').offsetWidth
  getContainerHeight = document.querySelector('#video_frames_warnings').offsetHeight

  if( getContainerWidth >= 100){
    videoFrameWidths = getContainerWidth/4
    document.querySelector('#videos_holder_localVideo').style.width = videoFrameWidths + 'px'
  }
    
  if( getContainerHeight >= 100){
    videoFrameHeights = getContainerHeight/5
    document.querySelector('#videos_holder_localVideo').style.height = videoFrameHeights + 'px'
  }
}
measre_video_holders_and_profile()
*/



  setInterval(()=>{

    const grabMyFrame = document.getElementById( 'videos_holder_localVideo' )

    if( peerIds.length == 0 ) {

      grabMyFrame.style.width = '100%'
      grabMyFrame.style.height = '100%'
      grabMyFrame.style.right = '0'
      grabMyFrame.style.bottom = '0'

    } else if( peerIds.length == 1){
      const grabSinglePeer = document.getElementById( 'videos_holder_remoteVideo_' + peerIds[0])  
      if( grabSinglePeer ) {
        grabSinglePeer.style.width = '100%'
        grabSinglePeer.style.height = '100%'
        grabSinglePeer.style.zIndex = '1'

        grabMyFrame.style.width = '150px'
        grabMyFrame.style.height = '120px'
        grabMyFrame.style.zIndex = '2'
        grabMyFrame.style.position = 'absolute'
        grabMyFrame.style.right = '10px'
        grabMyFrame.style.bottom = '10px'
      }
    } else if( peerIds.length > 1){ 

      videoFrameWidths = getContainerWidth/2
      document.querySelector('#videos_holder_localVideo').style.width = videoFrameWidths + 'px'

      videoFrameHeights = getContainerHeight/2
      document.querySelector('#videos_holder_localVideo').style.height = videoFrameHeights + 'px'
    }

  }, 1000)
  

//measurement for videos_holder_and_profile


