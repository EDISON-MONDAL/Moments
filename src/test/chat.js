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
const collRef = collection(db, "Moments")


let localStream = null;

async function startFunctioning(){

  

let myId
const peerIds = []


const caleeId = localStorage.getItem("caleeId")

const callCut = document.querySelector('#hangupBtn')


onAuthStateChanged(auth, async (user) => {
  if (user) {
    myId = user.email;

    onSnapshot(doc(db, 'Moments', myId), async (docs) => {
      //handaling peer id
      for (let i = 0; i < docs.data().call.to.length; i++) {        
        if(peerIds.includes( docs.data().call.to[i] ) == false && docs.data().call.to[i] != ''){
          if( peerIds.push( docs.data().call.to[i]) ){
            call( docs.data().call.to[i] )

            //localStorage.setItem("peerIdsWebStorage", JSON.stringify(peerIds))
            
          }
        }
      }
      

      for (let i = 0; i < docs.data().call.from.length; i++) {        
        if(peerIds.includes( docs.data().call.from[i] ) == false && docs.data().call.from[i] != ''){
          if( peerIds.push( docs.data().call.from[i] ) ){
            console.log('new id stored id call.from '+ docs.data().call.from[i])

            //check i have received the call
            if(docs.data().call.status == 'received'){
              setTimeout( ()=>{
                receive( docs.data().call.from[i] )
                
              }, 10000)
              console.log('receiver working')
            }
            //check i have received the call

            //localStorage.setItem("peerIdsWebStorage", JSON.stringify(peerIds))
          }
          
        }        
      }


    //on group call collect ids from peer
    setTimeout(collectPeersIds, 3000)
    async function collectPeersIds(){
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
          
         console.log('uploading in call.to '+ grabPeerPerticipents.data().call.to[i])
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
          
          console.log('uploading in call.from '+ grabPeerPerticipents.data().call.from[i])
        }
      }
    }
    }
    //on group call collect ids from peer


    })

    
    //on group call collect ids from peer
    /*
    const unsubGroupPeer = onSnapshot(doc(db, "Moments", myId), async (docs) => {
      
      if (docs.data().call.group == true) {

        const grabPeerPerticipents = await getDoc( doc(db, "Moments", docs.data().call.from[1]) );
  
        for (let i = 0; i < grabPeerPerticipents.data().call.to.length; i++) {
          if( grabPeerPerticipents.data().call.to[i] != '' && grabPeerPerticipents.data().call.to[i] != myId){
            
            await setDoc(doc(db, 'Moments', myId), {
              'call': {
                'to': arrayUnion( grabPeerPerticipents.data().call.to[i] ),
                'group': true
              }
            }, {merge:true})
  
            await setDoc(doc(db, 'Moments', grabPeerPerticipents.data().call.to[i] ), {
              'call': {
                'from': arrayUnion( myId ),
                'group': true
              }
            }, {merge:true})
            
           console.log('uploading in call.to '+ grabPeerPerticipents.data().call.to[i])
          }
        }
  
        for (let i = 0; i < grabPeerPerticipents.data().call.from.length; i++) {
          if( grabPeerPerticipents.data().call.from[i] != '' && grabPeerPerticipents.data().call.from[i] != myId){
            
            await setDoc(doc(db, 'Moments', myId), {
              'call': {
                'to': arrayUnion( grabPeerPerticipents.data().call.from[i] ),
                'group': true
              }
            }, {merge:true})
  
            await setDoc(doc(db, 'Moments', grabPeerPerticipents.data().call.from[i] ), {
              'call': {
                'from': arrayUnion( myId ),
                'group': true
              }
            }, {merge:true})
            
            console.log('uploading in call.from '+ grabPeerPerticipents.data().call.from[i])
          }
        }
        
        unsubGroupPeer()
      }
    })
    */
    //on group call collect ids from peer

    init();
  }
})



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






async function init() {
  
  
  //document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  document.querySelector('#createBtn').addEventListener('click', checkPeerIsNotInCall);
}



async function checkPeerIsNotInCall(){  
  const getEngedInCall = await getDoc(doc(db, 'Moments', caleeId))
  if(getEngedInCall.data().call.status != 'calling' 
  || getEngedInCall.data().call.status != 'received'){

    document.querySelector('#createBtn').disabled = true;
    document.querySelector('#joinBtn').disabled = true;

    await setDoc(doc(db, 'Moments', myId), {
      'call': {
        'to': arrayUnion( caleeId ),
        'status': 'calling'
      }
    }, {merge:true})

    //alert peer im calling
    await setDoc(doc(db, 'Moments', caleeId), {
      'call': {
        'from': arrayUnion( myId ),
        'status': 'rigning'
      }
    }, { merge: true })
    //alert peer im calling

    //In no response call will be dismised within 30 seconds
    onSnapshot(doc(db, "Moments", caleeId), async snapshot => {
      if (snapshot.data().call.status != 'received' && snapshot.data().call.status == 'rigning') {

        document.querySelector('#alertMessage').style.display = 'block'

        document.querySelector('#alerText').innerText = `You are calling to ${snapshot.data().profileInfo.firstName} 
        ${snapshot.data().profileInfo.lastName}`
        
        let seconds = 30
        let timer = setInterval( async () => {
          --seconds

          document.querySelector('#alerTimeRemaining').innerText = `Call remaining ${seconds} seconds`

          if(seconds == 0){
            clearInterval(timer)

            await setDoc(doc(db, 'Moments', myId), {
              'call': {
                'type': '',
                'to': arrayRemove( caleeId ),
                'from': '',
                'status': ''
              }
            }, {merge:true})
        
            await setDoc(doc(db, 'Moments', caleeId), {
              'call': {
                'type': '',
                'to': '',
                'from': arrayRemove( myId ),
                'status': ''
              }
            }, {merge:true})
        
          }

        }, 1000)
        
        onSnapshot(doc(db, "Moments", caleeId), async snapshotUpdated => {
          if (snapshotUpdated.data().call.status == 'received'){
            clearInterval(timer)

            document.querySelector('#alertMessage').style.display = 'none'
          }
        })

      }
    })
    //In no response call will be dismised within 30 seconds
  } else {
    alert(`${getEngedInCall.data().profileInfo.firstName} 
    ${getEngedInCall.data().profileInfo.lastName} is engaged in another call.`)
  }  
}


//peer connection and call start
async function call(calee){
  localStorage.setItem("peerIdsWebStorage", JSON.stringify( peerIds ))

  let peerConnection = null;
  console.log('Create PeerConnection with configuration: ', configuration);
  peerConnection = new RTCPeerConnection(configuration);

  
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
          `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });
  
  peerConnection.addEventListener('connectionstatechange', async () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);

    if( peerConnection.connectionState == 'failed' || peerConnection.connectionState == 'closed'){
      await setDoc(doc(db, 'Moments', myId), {
        'call': {
          'to': arrayRemove( calee ),
          'from': arrayRemove( calee )
        }
      }, {merge:true})
  
      await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', calee), {
        'offer': '',
        'answer': ''
      }, {merge:true})
  
      const getICE = query(collection(db, "Moments", myId, 'audioVideoChat', calee, 'ICE'));
  
      const queryICE = await getDocs(getICE);
      queryICE.forEach(async (docs) => {
        await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', calee, 'ICE', docs.id))
      })

      stopPeerConnectionAndDeleteRemoteVideo()

      peerIds.splice(peerIds.indexOf(calee), 1)

      console.log('peerids after deleting from call '+ peerIds)

      unsubscribeRemoteICEListener()
      unsubscribeRemoteDescription()
    }
  });
  
  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });
  
  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
          `ICE connection state change: ${peerConnection.iceConnectionState}`);
  });

    
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
    console.log('local track added to peer connection')
  });

  // Code for collecting ICE candidates below
  let ICE_Number = 0

  peerConnection.addEventListener('icecandidate', async event => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    console.log('Got candidate: ', event.candidate);
    ICE_Number++
    await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', calee, 'ICE', `${ICE_Number}`), event.candidate.toJSON())
  });
  // Code for collecting ICE candidates above

  // Code for creating a room below
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log('Created offer:', offer);

  const roomWithOffer = {
    'offer': {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', calee), roomWithOffer)
  console.log(`your id is: ${myId} and your peer is: ${calee}`);
  document.querySelector(
      '#currentRoom').innerText = `your id is: ${myId} and your peer is: ${calee}`
  // Code for creating a room above
  
  let remoteStream = new MediaStream();
  peerConnection.addEventListener('track', event => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach(track => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  const unsubscribeRemoteDescription = onSnapshot(doc(db, "Moments", calee, 'audioVideoChat', myId), async snapshot => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      console.log('Got remote description: ', data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });
  // Listening for remote session description above

  // Listen for remote ICE candidates below
  const unsubscribeRemoteICEListener = onSnapshot(query(collection(db, "Moments", calee, 'audioVideoChat', myId, 'ICE')), async snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  // Listen for remote ICE candidates above




  //peer video tag
  const remoteVideo = document.createElement('video')
  remoteVideo.setAttribute('id', 'remoteVideo_' + calee)
  remoteVideo.setAttribute('autoplay', '')
  remoteVideo.setAttribute('playsinline', '')
  document.getElementById('videos').appendChild( remoteVideo )
  document.getElementById(`remoteVideo_${calee}`).srcObject = remoteStream;
  //peer video tag


  //call cut
  callCut.addEventListener('click', stopPeerConnectionAndDeleteRemoteVideo)
  
  async function stopPeerConnectionAndDeleteRemoteVideo(){
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }  

    document.getElementById('videos').removeChild(remoteVideo)
  }


}
//end of peer connection and call start




async function receive( caller ) {
  localStorage.setItem("peerIdsWebStorage", JSON.stringify( peerIds ))

  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;

  console.log(`Your room: ${myId} peer room: ${caller}`);
  document.querySelector(
            '#currentRoom').innerText = `Your room: ${myId} peer room: ${caller}`

  console.log('Create PeerConnection with configuration: ', configuration);

  let peerConnection = null;

  peerConnection = new RTCPeerConnection(configuration);

  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });

  peerConnection.addEventListener('connectionstatechange', async () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);

    if( peerConnection.connectionState == 'failed' || peerConnection.connectionState == 'closed'){
      await setDoc(doc(db, 'Moments', myId), {
        'call': {
          'to': arrayRemove( caller ),
          'from': arrayRemove( caller )
        }
      }, {merge:true})
  
      await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', caller), {
        'offer': '',
        'answer': ''
      }, {merge:true})
  
      const getICE = query(collection(db, "Moments", myId, 'audioVideoChat', caller, 'ICE'));
  
      const queryICE = await getDocs(getICE);
      queryICE.forEach(async (docs) => {
        await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', caller, 'ICE', docs.id))
      })

      stopPeerConnectionAndDeleteRemoteVideo()

      peerIds.splice(peerIds.indexOf(caller), 1)

      console.log('peerids after deleting from receive '+ peerIds)

      unsubscribeRemoteICEListener()
    }
  });
  

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`);
  });


  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  
  // Code for collecting ICE candidates below
  let ICE_Number = 0
  peerConnection.addEventListener('icecandidate', async event => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    console.log('Got candidate: ', event.candidate);
    ICE_Number++
    await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', caller, 'ICE', `${ICE_Number}`), event.candidate.toJSON())
  });
  // Code for collecting ICE candidates above
  let remoteStream = new MediaStream();
  peerConnection.addEventListener('track', event => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach(track => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track);
    });
  });

    // Code for creating SDP answer below
    const getPeerInfo = await getDoc(doc(db, 'Moments', caller, 'audioVideoChat', myId))
    const offer = getPeerInfo.data().offer
    console.log('Got offer:', offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    console.log('Created answer:', answer);
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      'answer': {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', caller), roomWithAnswer)
    // Code for creating SDP answer above

    // Listening for remote ICE candidates below
    const unsubscribeRemoteICEListener = onSnapshot(query(collection(db, "Moments", caller, 'audioVideoChat', myId, 'ICE')), snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listening for remote ICE candidates above


    

    //peer video tag
    const remoteVideo = document.createElement('video')
    remoteVideo.setAttribute('id', 'remoteVideo_' + caller)
    remoteVideo.setAttribute('autoplay', '')
    remoteVideo.setAttribute('playsinline', '')
    document.getElementById('videos').appendChild( remoteVideo )
    document.getElementById(`remoteVideo_${caller}`).srcObject = remoteStream;
    //peer video tag


    //call cut
  callCut.addEventListener('click', stopPeerConnectionAndDeleteRemoteVideo)
  
  async function stopPeerConnectionAndDeleteRemoteVideo(){
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }  

    document.getElementById('videos').removeChild(remoteVideo)
  }
  
  
}



//cut call
callCut.addEventListener('click', async (e)=>{
  /*
  const tracks = document.querySelector('#localVideo').srcObject.getTracks();
  tracks.forEach(track => {
    track.stop();
  });
  

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }
  

  document.querySelector('#localVideo').srcObject = null;
  document.querySelector('#remoteVideo').srcObject = null;  
  */
  document.querySelector('#joinBtn').disabled = true;
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#hangupBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = '';

  for(let i = 0; i < peerIds.length; i++){
    await setDoc(doc(db, 'Moments', myId), {
      'call': {
        'to': arrayRemove( peerIds[i] ),
        'from': arrayRemove( peerIds[i] ),
        'status': '',
        'group': false
      }
    }, {merge:true})

    await setDoc(doc(db, 'Moments', myId, 'audioVideoChat', peerIds[i]), {
      'offer': '',
      'answer': ''
    }, {merge:true})

    const getICE = query(collection(db, "Moments", myId, 'audioVideoChat', peerIds[i], 'ICE'));

    const queryICE = await getDocs(getICE);
    queryICE.forEach(async (docs) => {
      await deleteDoc(doc(db, "Moments", myId, 'audioVideoChat', peerIds[i], 'ICE', docs.id))
    })
  }
})



}
startFunctioning()


openUserMedia()
async function openUserMedia(e) {
  /*
  const stream = await navigator.mediaDevices.getUserMedia(
      {video: true, audio: true});
  document.querySelector('#localVideo').srcObject = stream;
  localStream = stream;
  
  console.log('Stream:', document.querySelector('#localVideo').srcObject);
  */


  
  document.querySelector('#joinBtn').disabled = false;
  document.querySelector('#createBtn').disabled = false;
  document.querySelector('#hangupBtn').disabled = false;


  const videoElement = document.querySelector('#localVideo')
  const audioInputSelect = document.querySelector('select#audioSource');
  const audioOutputSelect = document.querySelector('select#audioOutput');
  const videoSelect = document.querySelector('select#videoSource');
  const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

  audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

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

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

  // Attach audio output device to video element using device/sink ID.
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

  function changeAudioDestination() {
    const audioDestination = audioOutputSelect.value;
    attachSinkId(videoElement, audioDestination);
  }

  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;

    localStream = stream

    console.log('Stream:', videoElement.srcObject)

    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }

  function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }

  function start() {
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    const audioSource = audioInputSelect.value;
    const videoSource = videoSelect.value;
    const constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);

    
  }

  audioInputSelect.onchange = start;
  audioOutputSelect.onchange = changeAudioDestination;

  videoSelect.onchange = start;

  start();
}









//search profile for add peer
const searchedId = document.querySelector('#searchProfile')

searchedId.addEventListener('submit', (e) => {
 	e.preventDefault()
  
  $("#addPeerSection").load("/searchIdInMySql", {myid: myId, searchValue: searchedId.searchProfile.value})
})
//search profile for add peer



