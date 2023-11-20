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

const collRef = collectionGroup(db, "profileInfo")

//end database section





//start client side coding
let myId
let messengerRoomURL

onAuthStateChanged(auth, async (user) => {
  if (user) {
    myId = user.email;
    
    initialize()

    // get messenger room reference  
      unSubGetMessengerRoom = onSnapshot( query(collection(db, "Messenger"), where(`membersList`, "array-contains", myId) ), (querySnapshot) => {
        querySnapshot.forEach( async (doc1) => {
          const getMessengerRoom_peerId = await getDocs( query(collection(db, "Messenger"), where(`membersList`, "array-contains", uiD) ) );
          getMessengerRoom_peerId.forEach(async (doc2) => {
            if( doc1.id == doc2.id ){

              messengerRoomURL = doc2.id
              messaging()
            }
          })
        })
      })
    // get messenger room reference
   
    // postManagement()
  }
})



const freindButton =  document.getElementById('freindButton') 
const cancelButton =  document.getElementById('cancelButton') 
const followButton = document.getElementById('followButton')

const messageButton = document.getElementById('messaging')

const audioCallButton = document.getElementById('audioCallButton')
const videoCallButton =  document.getElementById('videoCallButton')


const allProfileArea = document.getElementById('allProfileArea')
const profileEditButton = document.querySelector('.profileEditButton')


async function initialize() {
  unsubProfileChange = onSnapshot(doc(db, "Moments", uiD, 'profileInfo', 'credentials'), async (docu) => {
  
    console.log(docu.data(), docu.id)
    let isThatYou = ''
    if( uiD == myId ){
      isThatYou = '<you>'

      allProfileArea.onmouseover = ()=>{
        profileEditButton.style.width = 'auto'
        profileEditButton.style.height = 'auto'
        profileEditButton.style.fontSize = '30px'
        profileEditButton.style.padding = '5px'
      }
      allProfileArea.onmouseout = ()=>{
        profileEditButton.style.width = 0
        profileEditButton.style.height = 0
        profileEditButton.style.fontSize = 0
        profileEditButton.style.padding = 0
      }
      profileEditButton.onclick = ()=>{
        stopAllSnapshot() // main.ejs
        $("#subBodyRightSide-maincontent").load("updateProfile", {uid : myId}, function(responseTxt, statusTxt, xhr){
          if(statusTxt == "success")
            console.warn("Profile updating page loaded successfully!");
          if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        })
      }
    }

    //show my picture
      const profilePicContainerOnProfilePage = document.querySelector('#profilePicContainerOnProfilePage')
      const profilePicOnProfilePage = document.getElementById('profilePicOnProfilePage')

      const getProfilePicName = query(collection(db, "Moments", uiD, "profilePictures"), where('active', '==', true));
      let picName = null
      const showProfilePicName = await getDocs(getProfilePicName);
      showProfilePicName.forEach((doc) => {
        picName = doc.data().title
      })

      if( picName == null){
        profilePicContainerOnProfilePage.style.height = '200px'
        profilePicOnProfilePage.style.objectFit = 'contain'
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
          } else if ( document.getElementById('subBodyRightSide-maincontent').offsetWidth <= 480){
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
    //show my picture
      
    
  
    // name
    let nickName = ''
    if(docu.data().name.nickName != undefined && docu.data().name.nickName.trim() !== '' ){ 
      nickName = '( '+ DOMPurify.sanitize( docu.data().name.nickName.trim() ) + ' )' // add bracket in nickname
    }
    if( document.getElementById('name') ){
      document.getElementById('name').innerText = DOMPurify.sanitize( docu.data().name.firstName ) +' '+ DOMPurify.sanitize( docu.data().name.middleName ) +' '+ DOMPurify.sanitize( docu.data().name.lastName ) +' '+ nickName +' '+ isThatYou
    }
    // name

    // id
    if( document.getElementById('id') ){
      document.getElementById('id').innerText = docu.data().key.id
    }
    // id

    // short autobiograph
    if( document.getElementById('shortAutobiograph') && docu.data().autobiograph != '' ){
      document.querySelector('.shortAutobiograph-holder-profile').style.display = 'inline-block'
      document.getElementById('shortAutobiograph').innerText = docu.data().autobiograph
    }
    // short autobiograph

    // living place
    if( document.getElementById('livingPlace') && docu.data().livingPlace.village != '' && docu.data().livingPlace.postOffice != '' && docu.data().livingPlace.subDistrict != '' && docu.data().livingPlace.district != '' && docu.data().livingPlace.country != '' ){

      document.querySelector('.livingPlace-holder-profile').style.display = 'inline-block'

      let village
      if (docu.data().livingPlace.village != ''){
        village = 'Village/ City: ' + docu.data().livingPlace.village + '; '
      } else {
        village = ''
      }
      let postOffice
      if (docu.data().livingPlace.postOffice != ''){
        postOffice = 'Post Office: ' + docu.data().livingPlace.postOffice + '; '
      } else {
        postOffice = ''
      }
      let subDistrict
      if (docu.data().livingPlace.subDistrict != ''){
        subDistrict = 'Sub District: ' + docu.data().livingPlace.subDistrict + '; '
      } else {
        subDistrict = ''
      }
      let district
      if (docu.data().livingPlace.district != ''){
        district = 'District/ State: ' + docu.data().livingPlace.district + '; '
      } else {
        district = ''
      }
      let country
      if (docu.data().livingPlace.country != ''){
        country = 'Country: ' + docu.data().livingPlace.country + '; '
      } else {
        country = ''
      }

      document.getElementById('livingPlace').innerHTML = village + '<br>' + postOffice + '<br>' + subDistrict + '<br>' + district + '<br>' + country
    }
    // living place

    // birth place
    if( document.getElementById('birthPlace') && docu.data().birthPlace.village != '' && docu.data().birthPlace.postOffice != '' && docu.data().birthPlace.subDistrict != '' && docu.data().birthPlace.district != '' && docu.data().birthPlace.country != '' ){

      document.querySelector('.birthPlace-holder-profile').style.display = 'inline-block'

      let village
      if (docu.data().birthPlace.village != ''){
        village = 'Village/ City: ' + docu.data().birthPlace.village + '; '
      } else {
        village = ''
      }
      let postOffice
      if (docu.data().birthPlace.postOffice != ''){
        postOffice = 'Post Office: ' + docu.data().birthPlace.postOffice + '; '
      } else {
        postOffice = ''
      }
      let subDistrict
      if (docu.data().birthPlace.subDistrict != ''){
        subDistrict = 'Sub District: ' + docu.data().birthPlace.subDistrict + '; '
      } else {
        subDistrict = ''
      }
      let district
      if (docu.data().birthPlace.district != ''){
        district = 'District/ State: ' + docu.data().birthPlace.district + '; '
      } else {
        district = ''
      }
      let country
      if (docu.data().birthPlace.country != ''){
        country = 'Country: ' + docu.data().birthPlace.country + '; '
      } else {
        country = ''
      }
      
      document.getElementById('birthPlace').innerHTML = village + '<br>' + postOffice + '<br>' + subDistrict + '<br>' + district + '<br>' + country
    }
    // birth place

    // birth date
    if( document.getElementById('birthDate') && docu.data().birthDate != '' ){
      document.querySelector('.birthDate-holder-profile').style.display = 'inline-block'

      document.getElementById('birthDate').innerText = docu.data().birthDate
    }
    // birth date

    // phone
    if( document.getElementById('phoneNumber') && docu.data().phoneNumber.personal != '' || docu.data().phoneNumber.personal2 != '' || docu.data().phoneNumber.home != '' || docu.data().phoneNumber.office != ''  ){

      document.querySelector('.phoneNumber-holder-profile').style.display = 'inline-block'

      let personal1
      if (docu.data().phoneNumber.personal != ''){
        personal1 = 'Pesonal : ' + docu.data().phoneNumber.personal + ' ; <br>'
      } else {
        personal1 = ''
      }
      let personal2
      if (docu.data().phoneNumber.personal2 != ''){
        personal2 = 'Pesonal second : ' + docu.data().phoneNumber.personal2 + ' ; <br>'
      } else {
        personal2 = ''
      }
      let home
      if (docu.data().phoneNumber.home != ''){
        home = 'Home : ' + docu.data().phoneNumber.home + ' ; <br>'
      } else {
        home = ''
      }
      let office
      if (docu.data().phoneNumber.office != ''){
        office = 'Office : ' + docu.data().phoneNumber.office + ' ;'
      } else {
        office = ''
      }
      
      document.getElementById('phoneNumber').innerHTML = personal1 + personal2 + home + office
    }
    // phone

    // email
    if( document.getElementById('email') && docu.data().email.personal != '' && docu.data().email.business != '' ){

      document.querySelector('.email-holder-profile').style.display = 'inline-block'

      let personal
      if (docu.data().email.personal != ''){
        personal = 'Pesonal : ' + docu.data().email.personal + ' ; <br>'
      } else {
        personal = ''
      }
      let business
      if (docu.data().email.business != ''){
        business = 'Business : ' + docu.data().email.business + ' ;'
      } else {
        business = ''
      }
      
      document.getElementById('email').innerHTML = personal + business
    }
    // email

    // website
      // one
      if( document.getElementById('website-one') && docu.data().website.oneTitle != '' ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-one').style.display = 'block'
        document.querySelector('#title-one span').innerHTML = docu.data().website.oneTitle

        document.querySelector('#website-one').style.display = 'block'
        document.getElementById('website-one').innerHTML = docu.data().website.one
      }
      // one
      // two
      if( document.getElementById('website-two') && docu.data().website.twoTitle != '' ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-two').style.display = 'block'
        document.querySelector('#title-two span').innerHTML = docu.data().website.twoTitle

        document.querySelector('#website-two').style.display = 'block'
        document.getElementById('website-two').innerHTML = docu.data().website.two
      }
      // two
      // three
      if( document.getElementById('website-three') && docu.data().website.threeTitle != '' ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-three').style.display = 'block'
        document.querySelector('#title-three span').innerHTML = docu.data().website.threeTitle

        document.querySelector('#website-three').style.display = 'block'
        document.getElementById('website-three').innerHTML = docu.data().website.three
      }
      // three
      // four
      if( document.getElementById('website-four') && docu.data().website.fourTitle != '' ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-four').style.display = 'block'
        document.querySelector('#title-four span').innerHTML = docu.data().website.fourTitle

        document.querySelector('#website-four').style.display = 'block'
        document.getElementById('website-four').innerHTML = docu.data().website.four
      }
      // four
      // five
      if( document.getElementById('website-five') && docu.data().website.fiveTitle != '' ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-five').style.display = 'block'
        document.querySelector('#title-five span').innerHTML = docu.data().website.fiveTitle

        document.querySelector('#website-five').style.display = 'block'
        document.getElementById('website-five').innerHTML = docu.data().website.five
      }
      // five
    // website

    // profession
    if( document.getElementById('profession') && docu.data().profession != '' ){
      document.querySelector('.profession-holder-profile').style.display = 'inline-block'

      document.getElementById('profession').innerText = docu.data().profession
    }
    // profession

    // education
      // post graduate
      if( document.getElementById('institution-one') && docu.data().education.postGraduate.institution != '' ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#postGraduate-title').style.display = 'block'

        document.getElementById('postGraduate-institution').style.display = 'block'
        document.getElementById('institution-one').style.display = 'block'
        document.getElementById('institution-one').innerText = docu.data().education.postGraduate.institution

        document.getElementById('postGraduate-duration').style.display = 'block'
        document.getElementById('postGraduate-from').style.display = 'block'
        document.getElementById('postgraduate-duration-from').style.display = 'block'
        document.getElementById('postgraduate-duration-from').innerText = docu.data().education.postGraduate.from

        document.getElementById('postGraduate-to').style.display = 'block'
        document.getElementById('postgraduate-duration-to').style.display = 'block'
        document.getElementById('postgraduate-duration-to').innerText = docu.data().education.postGraduate.to

        document.getElementById('postGraduate-location').style.display = 'block'
        document.getElementById('institution-location-one').style.display = 'block'
        document.getElementById('institution-location-one').innerText = docu.data().education.postGraduate.location
      }
      // post graduate
      // graduate
      if( document.getElementById('institution-two') && docu.data().education.graduate.institution != '' ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#graduate-title').style.display = 'block'

        document.getElementById('graduate-institution').style.display = 'block'
        document.getElementById('institution-two').style.display = 'block'
        document.getElementById('institution-two').innerText = docu.data().education.graduate.institution

        document.getElementById('graduate-duration').style.display = 'block'
        document.getElementById('graduate-from').style.display = 'block'
        document.getElementById('graduate-duration-from').style.display = 'block'
        document.getElementById('graduate-duration-from').innerText = docu.data().education.graduate.from

        document.getElementById('graduate-to').style.display = 'block'
        document.getElementById('graduate-duration-to').style.display = 'block'
        document.getElementById('graduate-duration-to').innerText = docu.data().education.graduate.to

        document.getElementById('graduate-location').style.display = 'block'
        document.getElementById('institution-location-two').style.display = 'block'
        document.getElementById('institution-location-two').innerText = docu.data().education.graduate.location
      }
      // graduate
      // higher secondary
      if( document.getElementById('institution-three') && docu.data().education.higherSecondary.institution != '' ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#higherSecondary-title').style.display = 'block'

        document.getElementById('higherSecondary-institution').style.display = 'block'
        document.getElementById('institution-three').style.display = 'block'
        document.getElementById('institution-three').innerText = docu.data().education.higherSecondary.institution

        document.getElementById('higherSecondary-duration').style.display = 'block'
        document.getElementById('higherSecondary-from').style.display = 'block'
        document.getElementById('higherSecondary-duration-from').style.display = 'block'
        document.getElementById('higherSecondary-duration-from').innerText = docu.data().education.higherSecondary.from

        document.getElementById('higherSecondary-to').style.display = 'block'
        document.getElementById('higherSecondary-duration-to').style.display = 'block'
        document.getElementById('higherSecondary-duration-to').innerText = docu.data().education.higherSecondary.to

        document.getElementById('higherSecondary-location').style.display = 'block'
        document.getElementById('institution-location-three').style.display = 'block'
        document.getElementById('institution-location-three').innerText = docu.data().education.higherSecondary.location
      }
      // higher secondary
      // secondary
      if( document.getElementById('institution-four') && docu.data().education.secondary.institution != '' ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#secondary-title').style.display = 'block'

        document.getElementById('secondary-institution').style.display = 'block'
        document.getElementById('institution-four').style.display = 'block'
        document.getElementById('institution-four').innerText = docu.data().education.secondary.institution

        document.getElementById('secondary-duration').style.display = 'block'
        document.getElementById('secondary-from').style.display = 'block'
        document.getElementById('secondary-duration-from').style.display = 'block'
        document.getElementById('secondary-duration-from').innerText = docu.data().education.secondary.from

        document.getElementById('secondary-to').style.display = 'block'
        document.getElementById('secondary-duration-to').style.display = 'block'
        document.getElementById('secondary-duration-to').innerText = docu.data().education.secondary.to

        document.getElementById('secondary-location').style.display = 'block'
        document.getElementById('institution-location-four').style.display = 'block'
        document.getElementById('institution-location-four').innerText = docu.data().education.secondary.location
      }
      // secondary
      // elementary
      if( document.getElementById('institution-five') && docu.data().education.elementary.institution != '' ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#elementary-title').style.display = 'block'

        document.getElementById('elementary-institution').style.display = 'block'
        document.getElementById('institution-five').style.display = 'block'
        document.getElementById('institution-five').innerText = docu.data().education.elementary.institution


        document.getElementById('elementary-duration').style.display = 'block'
        document.getElementById('elementary-from').style.display = 'block'
        document.getElementById('elementary-duration-from').style.display = 'block'
        document.getElementById('elementary-duration-from').innerText = docu.data().education.elementary.from

        document.getElementById('elementary-to').style.display = 'block'
        document.getElementById('elementary-duration-to').style.display = 'block'
        document.getElementById('elementary-duration-to').innerText = docu.data().education.elementary.to

        document.getElementById('elementary-location').style.display = 'block'
        document.getElementById('institution-location-five').style.display = 'block'
        document.getElementById('institution-location-five').innerText = docu.data().education.elementary.location
      }
      // elementary
    // education

    // company
      // one
      if( document.getElementById('organization-one') && docu.data().company.one.organization != '' ){
        document.querySelector('.company-holder-profile').style.display = 'inline-block'
        document.querySelector('#company-title-one').style.display = 'block'

        document.getElementById('company-name-one').style.display = 'block'
        document.getElementById('organization-one').style.display = 'block'
        document.getElementById('organization-one').innerText = docu.data().company.one.organization

        document.getElementById('company-duration-one').style.display = 'block'        
        document.getElementById('company-from-one').style.display = 'block'
        document.getElementById('organization-one-from').style.display = 'block'
        document.getElementById('organization-one-from').innerText = docu.data().company.one.from

        document.getElementById('company-to-one').style.display = 'block'
        document.getElementById('organization-one-to').style.display = 'block'
        document.getElementById('organization-one-to').innerText = docu.data().company.one.to

        document.getElementById('company-location-one').style.display = 'block'
        document.getElementById('organization-one-location').style.display = 'block'
        document.getElementById('organization-one-location').innerText = docu.data().company.one.location
      }
      // one
      // two
      if( document.getElementById('organization-two') && docu.data().company.two.organization != '' ){
        document.querySelector('.company-holder-profile').style.display = 'inline-block'
        document.querySelector('#company-title-two').style.display = 'block'

        document.getElementById('company-name-two').style.display = 'block'
        document.getElementById('organization-two').style.display = 'block'
        document.getElementById('organization-two').innerText = docu.data().company.two.organization

        document.getElementById('company-duration-two').style.display = 'block'        
        document.getElementById('company-from-two').style.display = 'block'
        document.getElementById('organization-two-from').style.display = 'block'
        document.getElementById('organization-two-from').innerText = docu.data().company.two.from

        document.getElementById('company-to-two').style.display = 'block'
        document.getElementById('organization-two-to').style.display = 'block'
        document.getElementById('organization-two-to').innerText = docu.data().company.two.to

        document.getElementById('company-location-two').style.display = 'block'
        document.getElementById('organization-two-location').style.display = 'block'
        document.getElementById('organization-two-location').innerText = docu.data().company.two.location
      }
      // two
      // three
      if( document.getElementById('organization-three') && docu.data().company.three.organization != '' ){
        document.querySelector('.company-holder-profile').style.display = 'inline-block'
        document.querySelector('#company-title-three').style.display = 'block'

        document.getElementById('company-name-three').style.display = 'block'
        document.getElementById('organization-three').style.display = 'block'
        document.getElementById('organization-three').innerText = docu.data().company.three.organization

        document.getElementById('company-duration-three').style.display = 'block'        
        document.getElementById('company-from-three').style.display = 'block'
        document.getElementById('organization-three-from').style.display = 'block'
        document.getElementById('organization-three-from').innerText = docu.data().company.three.from

        document.getElementById('company-to-three').style.display = 'block'
        document.getElementById('organization-three-to').style.display = 'block'
        document.getElementById('organization-three-to').innerText = docu.data().company.three.to

        document.getElementById('company-location-three').style.display = 'block'
        document.getElementById('organization-three-location').style.display = 'block'
        document.getElementById('organization-three-location').innerText = docu.data().company.three.location
      }
      // three
    // company

    // business
      // one
      if( document.getElementById('business-one') && docu.data().business.one.name != '' ){
        document.querySelector('.business-holder-profile').style.display = 'inline-block'
        document.querySelector('#business-title-one').style.display = 'block'

        document.getElementById('business-name-one').style.display = 'block'
        document.getElementById('business-one').style.display = 'block'
        document.getElementById('business-one').innerText = docu.data().business.one.name

        document.getElementById('business-duration-one').style.display = 'block'        
        document.getElementById('business-from-one').style.display = 'block'
        document.getElementById('business-profile-one-from').style.display = 'block'
        document.getElementById('business-profile-one-from').innerText = docu.data().business.one.from

        document.getElementById('business-to-one').style.display = 'block'
        document.getElementById('business-profile-one-to').style.display = 'block'
        document.getElementById('business-profile-one-to').innerText = docu.data().business.one.to

        document.getElementById('business-location-one').style.display = 'block'
        document.getElementById('business-one-location').style.display = 'block'
        document.getElementById('business-one-location').innerText = docu.data().business.one.location
      }
      // one
      // two
      if( document.getElementById('business-two') && docu.data().business.two.name != '' ){
        document.querySelector('.business-holder-profile').style.display = 'inline-block'
        document.querySelector('#business-title-two').style.display = 'block'

        document.getElementById('business-name-two').style.display = 'block'
        document.getElementById('business-two').style.display = 'block'
        document.getElementById('business-two').innerText = docu.data().business.two.name

        document.getElementById('business-duration-two').style.display = 'block'        
        document.getElementById('business-from-two').style.display = 'block'
        document.getElementById('business-profile-two-from').style.display = 'block'
        document.getElementById('business-profile-two-from').innerText = docu.data().business.two.from

        document.getElementById('business-to-two').style.display = 'block'
        document.getElementById('business-profile-two-to').style.display = 'block'
        document.getElementById('business-profile-two-to').innerText = docu.data().business.two.to

        document.getElementById('business-location-two').style.display = 'block'
        document.getElementById('business-two-location').style.display = 'block'
        document.getElementById('business-two-location').innerText = docu.data().business.two.location
      }
      // two
      // three
      if( document.getElementById('business-three') && docu.data().business.three.name != '' ){
        document.querySelector('.business-holder-profile').style.display = 'inline-block'
        document.querySelector('#business-title-three').style.display = 'block'

        document.getElementById('business-name-three').style.display = 'block'
        document.getElementById('business-three').style.display = 'block'
        document.getElementById('business-three').innerText = docu.data().business.three.name

        document.getElementById('business-duration-three').style.display = 'block'        
        document.getElementById('business-from-three').style.display = 'block'
        document.getElementById('business-profile-three-from').style.display = 'block'
        document.getElementById('business-profile-three-from').innerText = docu.data().business.three.from

        document.getElementById('business-to-three').style.display = 'block'
        document.getElementById('business-profile-three-to').style.display = 'block'
        document.getElementById('business-profile-three-to').innerText = docu.data().business.three.to

        document.getElementById('business-location-three').style.display = 'block'
        document.getElementById('business-three-location').style.display = 'block'
        document.getElementById('business-three-location').innerText = docu.data().business.three.location
      }
      // three
    // business

    // passion
    if( document.getElementById('passion') && docu.data().passion != '' ){
      document.querySelector('.passion-holder-profile').style.display = 'inline-block'
      document.getElementById('passion').innerText = docu.data().passion
    }
    // passion

    // religion
    if( document.getElementById('religion') && docu.data().religion != '' ){
      document.querySelector('.religion-holder-profile').style.display = 'inline-block'
      document.getElementById('religion').innerText = docu.data().religion
    }
    // religion

    // politics
    if( document.getElementById('politics') && docu.data().politics != '' ){
      document.querySelector('.politics-holder-profile').style.display = 'inline-block'
      document.getElementById('politics').innerText = docu.data().politics
    }
    // politics



    // lookup for change in subdody width and adjust css  in pc only
      if( window.innerWidth >= 1000){

        function correctSingleProfileContentHolder()  {
          // name
            if(document.getElementById('name')){
              const getNameMaincontentHeight = document.getElementById('name').offsetHeight
              document.querySelector('.neme-holder-profile').style.height = getNameMaincontentHeight + 5 + 'px'

              // title span
              const getTitleHeight = document.querySelector('.name-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.name-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
            }
          // name

          // id
            if(document.getElementById('id')){
              const idMainContentHeight = document.getElementById('id').offsetHeight
              document.querySelector('.id-holder-profile').style.height = idMainContentHeight + 5 + 'px'

              // title span
              const getTitleHeight = document.querySelector('.id-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.id-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
            }
          // id

          // short autobiograph
            if(document.getElementById('shortAutobiograph')){
              const idMainContentHeight = document.getElementById('shortAutobiograph').offsetHeight
              document.querySelector('.shortAutobiograph-holder-profile').style.height = idMainContentHeight + 5 + 'px'

              // title span
                const getTitleHeight = document.querySelector('.shortAutobiograph-title').offsetHeight
                const getTitleHeightHalf = getTitleHeight / 2

                document.querySelector('.shortAutobiograph-title span').style.marginTop = getTitleHeightHalf - 30 + 'px'

              // title span
            }
          // short autobiograph

          // living place
          if(document.getElementById('livingPlace')){
            const idMainContentHeight = document.getElementById('livingPlace').offsetHeight
            document.querySelector('.livingPlace-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.livingPlace-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.livingPlace-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // living place

          // birth place
          if(document.getElementById('birthPlace')){
            const idMainContentHeight = document.getElementById('birthPlace').offsetHeight
            document.querySelector('.birthPlace-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.birthPlace-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.birthPlace-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // birth place

          // birth date
          if(document.getElementById('birthDate')){
            const idMainContentHeight = document.getElementById('birthDate').offsetHeight
            document.querySelector('.birthDate-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.birthDate-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.birthDate-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // birth date

          // phone number
          if(document.getElementById('phoneNumber')){
            const idMainContentHeight = document.getElementById('phoneNumber').offsetHeight
            document.querySelector('.phoneNumber-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.phoneNumber-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.phoneNumber-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // phone number

          // email
          if(document.getElementById('email')){
            const idMainContentHeight = document.getElementById('email').offsetHeight
            document.querySelector('.email-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.email-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.email-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // email

          // website
          if(document.getElementById('website-one') || document.getElementById('website-two') || document.getElementById('website-three') || document.getElementById('website-four') || document.getElementById('website-five')){

            const idMainContentHeight = document.querySelector('.all-website-contents').offsetHeight
            document.querySelector('.website-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.website-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.website-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // website

          // profession
          if(document.getElementById('profession') ){

            const idMainContentHeight = document.querySelector('#profession').offsetHeight
            document.querySelector('.profession-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.profession-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.profession-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // profession

          // education
          if(document.getElementById('institution-one') || document.getElementById('institution-two') || document.getElementById('institution-three') || document.getElementById('institution-four') || document.getElementById('institution-five') ){

            const idMainContentHeight = document.querySelector('.all-education-contents').offsetHeight
            document.querySelector('.education-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.education-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.education-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // education

          // company
          if(document.getElementById('organization-one') || document.getElementById('organization-two') || document.getElementById('organization-three') || document.getElementById('organization-four') || document.getElementById('organization-five') ){

            const idMainContentHeight = document.querySelector('.all-company-contents').offsetHeight
            document.querySelector('.company-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.company-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.company-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // company

          // business
          if(document.getElementById('business-one') || document.getElementById('business-two') || document.getElementById('business-three') ){

            const idMainContentHeight = document.querySelector('.all-business-contents').offsetHeight
            document.querySelector('.business-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.business-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.business-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // business

          // passion
          if(document.getElementById('passion')  ){

            const idMainContentHeight = document.querySelector('.passion-maincontent').offsetHeight
            document.querySelector('.passion-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.passion-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.passion-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // passion

          // religion
          if(document.getElementById('religion')  ){

            const idMainContentHeight = document.querySelector('.religion-maincontent').offsetHeight
            document.querySelector('.religion-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.religion-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.religion-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // religion

          // politics
          if(document.getElementById('politics')  ){

            const idMainContentHeight = document.querySelector('.politics-maincontent').offsetHeight
            document.querySelector('.politics-holder-profile').style.height = idMainContentHeight + 5 + 'px'

            // title span
              const getTitleHeight = document.querySelector('.politics-title').offsetHeight
              const getTitleHeightHalf = getTitleHeight / 2

              document.querySelector('.politics-title span').style.marginTop = getTitleHeightHalf - 20 + 'px'

            // title span
          }
          // politics
        }


        let changeInFullWidth = true     
        let changeInReducedWidth = true

        setInterval(()=>{
          const subBodyRightSideMainContent = document.getElementById('subBodyRightSide-maincontent').offsetWidth
          if(subBodyRightSideMainContent == 1000 && changeInFullWidth == true){
            fullWidth()
            correctSingleProfileContentHolder()
          } else if (subBodyRightSideMainContent == 765 && changeInReducedWidth == true){
            reducedWidth()
            correctSingleProfileContentHolder()
          }
        },1000)

        function fullWidth(){
          changeInFullWidth = false
          changeInReducedWidth = true
          
          if(document.querySelector('.name-maincontent')){
          document.querySelector('.name-maincontent').style.width = '888px'
          }
          if(document.querySelector('.id-maincontent')){
          document.querySelector('.id-maincontent').style.width = '918px'
          }
          if(document.querySelector('.shortAutobiograph-maincontent') ){
            document.querySelector('.shortAutobiograph-maincontent').style.width = '838px'
          }
          if(document.querySelector('.livingPlace-maincontent') ){
            document.querySelector('.livingPlace-maincontent').style.width = '838px'
          }
          if(document.querySelector('.birthPlace-maincontent') ){
            document.querySelector('.birthPlace-maincontent').style.width = '848px'
          }
          if(document.querySelector('.birthDate-maincontent') ){
            document.querySelector('.birthDate-maincontent').style.width = '858px'
          }
          if(document.querySelector('.phoneNumber-maincontent') ){
            document.querySelector('.phoneNumber-maincontent').style.width = '823px'
          }
          if(document.querySelector('.email-maincontent') ){
            document.querySelector('.email-maincontent').style.width = '888px'
          }
          if(document.querySelector('.all-website-contents') ){
            document.querySelector('.all-website-contents').style.width = '868px'
          }
          if(document.querySelector('.profession-maincontent') ){
            document.querySelector('.profession-maincontent').style.width = '858px'
          }
          if(document.querySelector('.all-education-contents') ){
            document.querySelector('.all-education-contents').style.width = '858px'
          }
          if(document.querySelector('.all-company-contents') ){
            document.querySelector('.all-company-contents').style.width = '858px'
          }
          if(document.querySelector('.all-business-contents') ){
            document.querySelector('.all-business-contents').style.width = '858px'
          }
          if(document.querySelector('.passion-maincontent') ){
            document.querySelector('.passion-maincontent').style.width = '868px'
          }
          if(document.querySelector('.religion-maincontent') ){
            document.querySelector('.religion-maincontent').style.width = '873px'
          }
          if(document.querySelector('.politics-maincontent') ){
            document.querySelector('.politics-maincontent').style.width = '878px'
          }
        }
        function reducedWidth(){
          changeInFullWidth = true
          changeInReducedWidth = false

          if(document.querySelector('.name-maincontent')){
          document.querySelector('.name-maincontent').style.width = '658px'
          }
          if(document.querySelector('.id-maincontent')){
          document.querySelector('.id-maincontent').style.width = '688px'
          }
          if(document.querySelector('.shortAutobiograph-maincontent') ){
            document.querySelector('.shortAutobiograph-maincontent').style.width = '608px'
          }
          if(document.querySelector('.livingPlace-maincontent') ){
            document.querySelector('.livingPlace-maincontent').style.width = '608px'
          }
          if(document.querySelector('.birthPlace-maincontent') ){
            document.querySelector('.birthPlace-maincontent').style.width = '618px'
          }
          if(document.querySelector('.birthDate-maincontent') ){
            document.querySelector('.birthDate-maincontent').style.width = '628px'
          }
          if(document.querySelector('.phoneNumber-maincontent') ){
            document.querySelector('.phoneNumber-maincontent').style.width = '593px'
          }
          if(document.querySelector('.email-maincontent') ){
            document.querySelector('.email-maincontent').style.width = '658px'
          }
          if(document.querySelector('.all-website-contents') ){
            document.querySelector('.all-website-contents').style.width = '638px'
          }
          if(document.querySelector('.profession-maincontent') ){
            document.querySelector('.profession-maincontent').style.width = '628px'
          }
          if(document.querySelector('.all-education-contents') ){
            document.querySelector('.all-education-contents').style.width = '628px'
          }
          if(document.querySelector('.all-company-contents') ){
            document.querySelector('.all-company-contents').style.width = '628px'
          }
          if(document.querySelector('.all-business-contents') ){
            document.querySelector('.all-business-contents').style.width = '628px'
          }
          if(document.querySelector('.passion-maincontent') ){
            document.querySelector('.passion-maincontent').style.width = '638px'
          }
          if(document.querySelector('.religion-maincontent') ){
            document.querySelector('.religion-maincontent').style.width = '643px'
          }
          if(document.querySelector('.politics-maincontent') ){
            document.querySelector('.politics-maincontent').style.width = '648px'
          }
        }
      }
    // lookup for change in subdody width and adjust css  in pc only






    // friend and follow button
      function restFriendAndCancelButton(){
        freindButton.innerText = 'Send friend request'
        freindButton.onclick = sendRequest
        freindButton.style.display = 'inline-block'

        cancelButton.innerText = 'Cancel friend request'
        cancelButton.onclick = cancelRequest
        cancelButton.style.display = 'none'
      }
      restFriendAndCancelButton()

      function resetFollowerButton(){
        followButton.innerText = 'Follow'
        followButton.onclick = follow
        followButton.style.display = 'inline-block'
      }
      resetFollowerButton()


      //send friend request to a new person
      async function sendRequest(){
        await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'send'), {
          sendList: arrayUnion( uiD )
        },
        {
          merge: true
        })


        await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'receive'), {
          receiveList: arrayUnion( myId )
        },
        {
          merge: true
        })


        await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), {
          followingList: arrayUnion ( uiD )
        },
        {merge: true })

        await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'follower'), {
          followerList: arrayUnion ( myId )
        },
        {merge: true })
      }
      //send friend request to a new person


      //Check current profile isn't your profile
        if( uiD == myId){
          freindButton.style.display = 'none'
        } else {
          freindButton.style.display = 'inline-block'
        }
      // Check current profile isn't your profile   



      // Check you send any friend request to this person   
      const listenSendRequestChange = onSnapshot(doc(db, "Moments", myId, 'friendsAndFollowers', 'send'), async (docu) => {
        // refresh on change
        restFriendAndCancelButton()
        
        const checkUidInSendRequest = query( collection(db, "Moments", myId, 'friendsAndFollowers'), where('sendList', "array-contains", uiD));
        onSnapshot(checkUidInSendRequest, (querySnapshot) => {
          querySnapshot.forEach((doc2) => {
            freindButton.innerHTML = 'Request Sent!'
          
            cancelButton.style.display = 'inline-block'
            cancelButton.innerHTML = 'Cancel friend request'
            cancelButton.onclick = cancelRequest
          })
        })

      })
      // Check you send any friend request to this person 

      async function cancelRequest(){
        const cancelRequestRef = doc(db, "Moments", myId, 'friendsAndFollowers', 'send');              
        setDoc(cancelRequestRef, 
        {
          sendList: arrayRemove( uiD )
        },
        {merge:true})
        .then(() => {
          console.log("Document successfully updated!");
        })


        const withdrawRequestRef = doc(db, "Moments", uiD, 'friendsAndFollowers', 'receive');              
        setDoc(withdrawRequestRef, 
        {
          receiveList: arrayRemove( myId )
        },
        {merge:true})
        .then(() => {
          console.log("Document successfully updated!");
        })
        
        
        await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), {
          followingList: arrayRemove( uiD )
        },
        {merge: true })

        await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'follower'), {
          followerList: arrayRemove( myId )
        },
        {merge: true })
      }


      // Check have you receive any request from this person
      const listenReceivedRequestChange = onSnapshot(doc(db, "Moments", myId, 'friendsAndFollowers', 'receive'), async (docu) => {
        // refresh on change
        restFriendAndCancelButton()

        const catchReceiveRequest = query( collection(db, "Moments", myId, 'friendsAndFollowers'), where('receiveList', "array-contains", uiD) );

        onSnapshot(catchReceiveRequest, (querySnapshot) => {
          querySnapshot.forEach((doc2) => {
            freindButton.innerHTML = 'Accept Request'
            freindButton.onclick = accept

            cancelButton.style.display = 'inline-block'
            cancelButton.innerHTML = 'Discard'
            cancelButton.onclick = rejectRequest
          })
        })

      })
      // Check have you receive any request from this person

      async function accept(){
        // hide friend and follower button
          freindButton.style.display = 'none'
          followButton.style.display = 'none'
        // hide friend and follower button

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


        // add in messenger room
          let messageRoomExists = false
          
          const getMessengerRoom = await getDocs( query(collection(db, "Messenger"), where(`membersList`, "array-contains", myId) ) );
          getMessengerRoom.forEach(async (doc1) => {

            const getMessengerRoom_peerId = await getDocs( query(collection(db, "Messenger"), where(`membersList`, "array-contains", uiD) ) );
            getMessengerRoom_peerId.forEach(async (doc2) => {
              if( doc1.id == doc2.id ){
                messageRoomExists = true

                // update last activity only
                await setDoc(doc(db, "Messenger", doc2.id), {
                  lastActivity: serverTimestamp()
                },
                {merge: true })
                // update last activity only
              }
            })

          })

          
          const createNewMessageRoom = setTimeout(async ()=> {
            if( messageRoomExists == false ){
              const messengerRoomURL = await addDoc(collection(db, "Messenger"), {
                group: false,
                lastActivity: serverTimestamp(),
                membersList: arrayUnion(myId, uiD)
              })

              

              // create dedicated meeting room for these two people
                // check already in meeting room or not
                  let alreadyInMeetings = false
                  let meetingId = 0
                  // myid
                    const checkInMeetings_myId = query(collection(db, "Meetings"), where("participents.personal", "array-contains", myId) );

                    const getCheckResultInMeetings_myId = await getDocs( checkInMeetings_myId );
                    getCheckResultInMeetings_myId.forEach(async (doc1) => {
                      // peerid
                      const checkInMeetings_peerId = query(collection(db, "Meetings"), where("participents.personal", "array-contains", uiD));

                      const getCheckResultInMeetings_peerId = await getDocs( checkInMeetings_peerId );
                      getCheckResultInMeetings_peerId.forEach((doc2) => {
                        if( doc1.id == doc2.id ){ 
                          alreadyInMeetings = true
                      
                          // clearTimeout( delayInCreateInNewMeeting )
                        }
                      })
                      // peerid
                    })
                  // myid
                // check already in meeting room or not

                // create a new meeting room
                  const delayInCreateInNewMeeting = setTimeout( async ()=>{
                    if( alreadyInMeetings == false ){
                      // last meeting id
                        let lastMessageId = 0
                        const checkLastMessageId = query(collection(db, "Meetings"), orderBy("credential.meetingId", "desc"), limit(1));

                        const querySnapshot = await getDocs( checkLastMessageId );
                        querySnapshot.forEach((doc1) => { 
                          lastMessageId = doc1.data().credential.meetingId + 1
                        })
                      // last meeting id

                      // add in db
                        const getMeetingURL = await addDoc(collection(db, "Meetings"), {
                          credential:{
                            meetingId: lastMessageId,
                          },
                
                          participents:{
                            personal:[
                              myId,
                              uiD,
                            ]
                          }
                        })
                      // add in db
                      
                      
                      await setDoc(doc(db, "Messenger", messengerRoomURL.id), {
                        meetingRoomURL: getMeetingURL.id
                      },
                      {merge: true })

                    }
                  }, 5000)
                // create a new meeting room
              // create dedicated meeting room for these two people

            }
          }, 5000)

          
        // add in messenger room


        
      }

      async function rejectRequest(){
        const cancelRequestRef = doc(db, "Moments", myId, 'friendsAndFollowers', 'receive');              
        setDoc(cancelRequestRef, 
        {
          receiveList: arrayRemove( uiD )
        },
        {merge:true})
        .then(() => {
          console.log("Document successfully updated!");
        })
  
  
        const withdrawRequestRef = doc(db, "Moments", uiD, 'friendsAndFollowers', 'send');              
        setDoc(withdrawRequestRef, 
        {
          sendList: arrayRemove( myId )
        },
        {merge:true})
        .then(() => {
          console.log("Document successfully updated!");
        })             
      }


      // Check you are friend or not
      const listenFriendListChange = onSnapshot(doc(db, "Moments", myId, 'friendsAndFollowers', 'friend'), async (docu) => {
        // refresh on change
        restFriendAndCancelButton()

        const checkFriendship = query( collection(db, "Moments", myId, 'friendsAndFollowers'), where('friendList', "array-contains", uiD) );
        onSnapshot(checkFriendship, (querySnapshot) => {
          querySnapshot.forEach((doc2) => {
            freindButton.style.display = 'none'

            cancelButton.innerHTML = 'Unfriend'
            cancelButton.style.display = 'inline-block'
            cancelButton.onclick = unfriend

            audioCallButton.style.display = 'inline-block'
            videoCallButton.style.display = 'inline-block'
            messageButton.style.display = 'inline-block'
          });
        })
      })
      // Check you are friend or not

      async function unfriend(){
        // hide friend and follower button
          freindButton.style.display = 'none'
          followButton.style.display = 'none'
        // hide friend and follower button

        await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'friend'), {
          friendList: arrayRemove ( uiD )
        },
        { merge: true })

        await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'friend'), {
          friendList: arrayRemove ( myId )
        },
        { merge: true })
      


        await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), {
          followingList: arrayRemove ( uiD )
        },
        { merge: true })

        await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'follower'), {
          followerList: arrayRemove ( myId )
        },
        { merge: true })
      
      } 
    // friend and follow button
    

    // check you are following or not
      const listenFollowerListChange = onSnapshot(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), async (docu) => {
        // refresh on change
        resetFollowerButton()

        const checkFollower = query( collection(db, "Moments", myId, 'friendsAndFollowers'), where('followingList', "array-contains", uiD) );
        onSnapshot(checkFollower, (querySnapshot) => {
          querySnapshot.forEach((doc2) => {

            followButton.innerText = 'Unfollow'
            followButton.onclick = unfollow
            followButton.style.display = 'inline-block'

          });
        })
      })
    // check you are following or not

    async function follow(){
      await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), {
        followingList: arrayUnion( uiD )
      },
      {merge: true })

      await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'follower'), {
        followerList: arrayUnion( myId )
      },
      {merge: true })
    }

    async function unfollow(){
      await setDoc(doc(db, "Moments", myId, 'friendsAndFollowers', 'following'), {
        followingList: arrayRemove ( uiD )
      },
      { merge: true })

      await setDoc(doc(db, "Moments", uiD, 'friendsAndFollowers', 'follower'), {
        followerList: arrayRemove ( myId )
      },
      { merge: true })
    }
    
  })
}













//messaging
async function messaging(){

  // show message box
    document.getElementById('messaging').addEventListener('click', ()=>{
      document.getElementById('messaging-box').style.bottom = '5px'
    })
  // show message box  

  // hide message box
  document.getElementById('close').addEventListener('click', ()=>{
    document.getElementById('messaging-box').style.bottom = '-600px'
  })
  // hide message box

  

  // inbox header
    // profile pic and name
      // pic
        const getProfilePicName = query(collection(db, "Moments", uiD, "profilePictures"), where('active', '==', true));
      
        const showProfilePicName = await getDocs(getProfilePicName);
        showProfilePicName.forEach((doc) => {

          const storesRef = ref(storage, doc.data().title )
          getDownloadURL(storesRef)
          .then((url) => {
            // Insert url into an <img> tag to "download"          
            document.querySelector('#messaging-box-profileNameImageHolder #imgHolder img').src = url
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
        })        
      // pic

      // name
        const getProfileData = await getDoc( doc(db, "Moments", uiD, "profileInfo", "credentials" ) )    
        if (getProfileData.exists()) {
          document.querySelector('#messaging-box-profileNameImageHolder #profile-name div').innerText = getProfileData.data().name.fullName
        }
      // name
    // profile pic and name

    // check friend
      const checkInFriendList = query(collection(db, "Moments", myId, "friendsAndFollowers" ), where("friendList", "array-contains", uiD));

      unsubCheckFriendList = onSnapshot(checkInFriendList, (querySnapshot) => {
        querySnapshot.forEach( async (doc1) => { 
          // get meeting room id
            const getMeetingId = await getDoc( doc(db, "Messenger", messengerRoomURL ) )
          // get meeting room id
        
          //make a call
            function callFunction() {
   
              //call
                async function audioCall(){

                  const getEngedInCall = await getDoc(doc(db, 'Moments', uiD, 'call', 'management'))
                  if(getEngedInCall.data().call.status != 'calling' 
                  || getEngedInCall.data().call.status != 'talking' || getEngedInCall.call.data().status != 'ringing'){

                    await setDoc(doc(db, 'Moments', myId, 'call', 'management'), {
                      'device': {
                        'media': {
                          'video': false,
                          'audio': true
                        }
                      },
                      'call': {
                        'type': 'private',
                        'receiver': false
                      },
                      'meetingRoomURL': getMeetingId.data().meetingRoomURL
                    }, {merge:true});

                    localStorage.setItem("caleeId", uiD)


                    window.open( location.origin + "/chat5", '_blank', "left=5,top=5,width=1000,height=600") //window.location.protocol+'//'+window.location.hostname+':'+window.location.port

                  } else {
                    const getCaleeName = await getDoc( doc(db, 'Moments', uiD, 'profileInfo', 'credentials') );
                    if (getCaleeName.exists()) {
                      alert(`${getCaleeName.data().name.fullName} is engaged in another call.`)
                    }
                  }
                }

                async function videoCall(){

                  const getEngedInCall = await getDoc(doc(db, 'Moments', uiD, 'call', 'management'))
                  if(getEngedInCall.data().call.status != 'calling' 
                  || getEngedInCall.data().call.status != 'talking' || getEngedInCall.call.data().status != 'ringing'){

                    await setDoc(doc(db, 'Moments', myId, 'call', 'management'), {
                      'device': {
                        'media': {
                          'video': true,
                          'audio': false
                        }
                      },
                      'call': {
                        'type': 'private',
                        'receiver': false
                      },
                      'meetingRoomURL': getMeetingId.data().meetingRoomURL
                    }, {merge:true});

                    localStorage.setItem("caleeId", uiD)

                    window.open( location.origin + "/chat5", '_blank', "left=5,top=5,width=1000,height=600") //window.location.protocol+'//'+window.location.hostname+':'+window.location.port

                  } else {
                    const getCaleeName = await getDoc( doc(db, 'Moments', uiD, 'profileInfo', 'credentials') );
                    if (getCaleeName.exists()) {
                      alert(`${getCaleeName.data().name.fullName} is engaged in another call.`)
                    }
              
                  }
                }

          
                audioCallButton.onclick = audioCall
                document.getElementById('audioCallButton_profileInbonx').onclick = audioCall
                videoCallButton.onclick = videoCall
                document.getElementById('videoCallButton_profileInbonx').onclick = videoCall
              //call
  
            }

            callFunction()
          //end of make a call
        })
      })
    // check friend    
    
  // inbox header

  // middle part 
    // background
      const storesRef = ref( storage, 'messengerBackground/dark_1.jpg')
      getDownloadURL(storesRef)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        document.getElementById('messaging-box-middle-section').style.background = `blueviolet url(${url}) center no-repeat`;
        document.getElementById('messaging-box-middle-section').style.backgroundSize =  '100% 100%'
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
    // background



    // sub setcion scroll to bottom
      function personalMessageInboxScrollToBottom(){
        document.getElementById('messaging-box-middle-section').scrollTo(0, document.getElementById('messaging-box-middle-subSection').scrollHeight)
      }
      personalMessageInboxScrollToBottom()
    // sub setcion scroll to bottom


    
    // message view update
      // message update
        const getMessages_profileInbox = query( collection(db, "Messenger", messengerRoomURL, 'sms' ) )

        let changeInMessageView_profileInbox = false

        const unsubMessageView = onSnapshot( getMessages_profileInbox, (doc1) => {
          if( changeInMessageView_profileInbox == false ){
            changeInMessageView_profileInbox = true

            setTimeout(()=>{
              changeInMessageView_profileInbox = false
              showEveryMessages()
            }, 2000)
          }
        })
      // message update

      // loop 
        async function showEveryMessages(){
          document.getElementById('messaging-box-middle-subSection').innerHTML = '' // clear middle part sub section

          const getMessages = query(collection(db, "Messenger", messengerRoomURL, "sms" ), orderBy("send.time", "asc"));

          const querySnapshot = await getDocs( getMessages );
            querySnapshot.forEach( async ( doc1 ) => {
        
              // my message
                if( doc1.data().send.id == myId ){
                  const createRightSideMessageView_myMessage = document.createElement('div')
                  createRightSideMessageView_myMessage.setAttribute('class', 'messengerRightSideMessageView_myMessage')
                  document.getElementById('messaging-box-middle-subSection').appendChild( createRightSideMessageView_myMessage )

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
                    let messengerObjectIndex = 0 // substitute of x variable
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
                    createSendAtHolder.setAttribute('class', 'messageSendAt messageSendAtProfileInbox')

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
                document.getElementById('messaging-box-middle-subSection').appendChild( createLeftSideMessageView )

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
                  createSendAtHolder.setAttribute('class', 'messageSendAt messageSendAtProfileInbox')

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
          
          // sub setcion scroll to bottom
            personalMessageInboxScrollToBottom()
          // sub setcion scroll to bottom
        }
      // loop
    // message view update
    

    // upload sms to db    
      document.querySelector('#messaging-box #footerSection .messengerRightSideFooter_sendMessage').onclick = async ()=>{

          const seenBy = {}
          const getMembersList = await getDoc( doc(db, "Messenger", messengerRoomURL) )
          for (let i = 0; i < getMembersList.data().membersList.length; i++) {
            if( getMembersList.data().membersList[i] != myId){
              // remove special charecters form email
                const escapeAtTheRate = getMembersList.data().membersList[i].replaceAll('@',"_")
                const escapedDotEmail = escapeAtTheRate.replaceAll('.',"_")
              // remove special charecters from email

              seenBy[escapedDotEmail] =  false                          
            }
          }


          // last activity
            await setDoc(doc(db, "Messenger", messengerRoomURL), {
              lastActivity: serverTimestamp()
            },
            {merge: true })
          // last activity


          // put in db
            await addDoc(collection(db, "Messenger", messengerRoomURL, 'sms' ), 
            {
              messengerData:{
                [0]: {
                  text: document.getElementById('profilePersonalInboxTextarea').value,
                  bold: false,
                  italic: false,
                  fontFamily: 'default',
                  align: 'default'
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
        

        // all done (clear everything)
          document.getElementById('profilePersonalInboxTextarea').value = '' // clean textarea
        // all done (clear everything)
      }
    // upload sms to db
}
//messaging




async function postManagement(){
//write a new post
const newPostForm = document.querySelector('#newPostForm')
newPostForm.addEventListener('submit', async(e) => {
 	e.preventDefault()

  const getPostNumber = query(collection(db, "Moments", myId, "posts"), orderBy("time", "desc"), limit(1));
  let postNumber = 1
  const extractPostNumber = await getDocs(getPostNumber);
  extractPostNumber.forEach((doc) => {
    postNumber = doc.id
    postNumber++
  })

	await setDoc(doc(db, "Moments", myId, "posts", `${postNumber}`), {
	  'time': serverTimestamp(),
		'postText': newPostForm.postText.value
			
	}, {merge:true})

  document.getElementById('postText').value = ''
})
//end of write a new post

//display your posts 
const getYourPosts = query(collection(db, "Moments", myId, 'posts'), where('uid', '==', myId), orderBy('time', 'desc'));

onSnapshot(getYourPosts, (querySnapshot) => {  
  querySnapshot.forEach((docs) => {
    console.log(docs.data().postText)
    console.log(docs.id)
  })
})
//end display your posts
}








