import { initializeApp } from 'firebase/app'


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
const storage = getStorage(app)

//end database section




/*
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
*/














freindButton_profile =  document.getElementById('freindButton') 
followButton_profile = document.getElementById('followButton')
cancelButton_profile = document.getElementById('cancelButton')

messageButton_profile = document.getElementById('messaging')

audioCallButton_profile = document.getElementById('audioCallButton')
videoCallButton_profile =  document.getElementById('videoCallButton')


allProfileArea_profile = document.getElementById('allProfileArea')
profileEditButton_profile = document.querySelector('.profileEditButton')








/* check im admin or not to go to update profile page */
    if( admin_profile == 'true'){
        allProfileArea_profile.onmouseover = ()=>{
          profileEditButton_profile.style.width = 'auto'
          profileEditButton_profile.style.height = 'auto'
          profileEditButton_profile.style.fontSize = '30px'
          profileEditButton_profile.style.padding = '5px'
        }

        allProfileArea_profile.onmouseout = ()=>{
          profileEditButton_profile.style.width = 0
          profileEditButton_profile.style.height = 0
          profileEditButton_profile.style.fontSize = 0
          profileEditButton_profile.style.padding = 0
        }

        profileEditButton_profile.onclick = ()=>{
        
          $("#subBodyRightSide-maincontent").load("updateProfile", {uid : uiD_profile, admin: '<%= Admin %>'}, function(responseTxt, statusTxt, xhr){
            if(statusTxt == "success")
              console.warn("Profile updating page loaded successfully!");
            if(statusTxt == "error")
              alert("Profile updating page loading Error: " + xhr.status + ": " + xhr.statusText);
          })
        }
    }   
/* check im admin or not to go to update profile page */







/* get profile data from mongo */
    // Send AJAX request to Node.js server
    $(document).ready(function(){
      $.ajax({
        url: '/mongoJs/profile', // Replace with your server endpoint
        type: 'POST',
        data: {id: uiD_profile},
        success: async function(response) {
          if(response != 'error' && response != null ){
              console.warn("Profile page loaded successfully in inner AJAX!")
             
              updateProfileContent(response)
              
          } else{
              console.warn("Can't load profile page in inner AJAX!" + response)
          }
        },
        error: function(error) {
          if(error == 'error' && error != null ){
              console.warn("Can't load profile page in inner AJAX!" + error) 
          }
        }
      })
    })




async function updateProfileContent(DATA) {
  
    //show my picture
      const profilePicContainerOnProfilePage = document.querySelector('#profilePicContainerOnProfilePage')
      const profilePicOnProfilePage = document.getElementById('profilePicOnProfilePage')

      

      if( DATA.profilePic == null){
        profilePicContainerOnProfilePage.style.height = '200px'
        profilePicOnProfilePage.style.objectFit = 'contain'
      } else {

        const storesRef = ref(storage, DATA.profilePic)
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
      
    if(DATA.name.nickName != null ){ 
      nickName = '( ' + DATA.name.nickName.trim() + ' )' // add bracket in nickname
    }

    if( document.getElementById('name') ){
      const nameString = DATA.name.firstName +' '+  DATA.name.middleName +' '+ DATA.name.lastName +' '+ nickName
      
      if( admin_profile == 'true' ){
        document.getElementById('name').innerText = nameString +' [you]'
      } else{
        document.getElementById('name').innerText = nameString
      }
    }
    // name

        
    // id
    if( document.getElementById('id') ){
      document.getElementById('id').innerText = DATA.key.id
    }
    // id

    
    // short autobiograph
    if( document.getElementById('shortAutobiograph') && DATA.autobiograph != null ){ 
      document.querySelector('.shortAutobiograph-holder-profile').style.display = 'inline-block'
      document.getElementById('shortAutobiograph').innerText = DATA.autobiograph
    }
    // short autobiograph
    
    // living place
    if( document.getElementById('livingPlace') && DATA.livingPlace.village != null || DATA.livingPlace.postOffice != null || DATA.livingPlace.subDistrict != null || DATA.livingPlace.district != null || DATA.livingPlace.country != null ){

      document.querySelector('.livingPlace-holder-profile').style.display = 'inline-block'

      let village
      if (DATA.livingPlace.village != null){
        village = 'Village/ City: ' + DATA.livingPlace.village + '; '
      } else {
        village = ''
      }
      let postOffice
      if (DATA.livingPlace.postOffice != null ){
        postOffice = 'Post Office: ' + DATA.livingPlace.postOffice + '; '
      } else {
        postOffice = ''
      }
      let subDistrict
      if (DATA.livingPlace.subDistrict != null ){
        subDistrict = 'Sub District: ' + DATA.livingPlace.subDistrict + '; '
      } else {
        subDistrict = ''
      }
      let district
      if (DATA.livingPlace.district != null){
        district = 'District/ State: ' + DATA.livingPlace.district + '; '
      } else {
        district = ''
      }
      let country
      if (DATA.livingPlace.country != null ){
        country = 'Country: ' + DATA.livingPlace.country + '; '
      } else {
        country = ''
      }

      document.getElementById('livingPlace').innerHTML = village + '<br>' + postOffice + '<br>' + subDistrict + '<br>' + district + '<br>' + country
    }
    // living place
    
    // birth place
    if( document.getElementById('birthPlace') && DATA.birthPlace.village != null || DATA.birthPlace.postOffice != null || DATA.birthPlace.subDistrict != null || DATA.birthPlace.district != null || DATA.birthPlace.country != null ){

      document.querySelector('.birthPlace-holder-profile').style.display = 'inline-block'

      let village
      if (DATA.birthPlace.village != null){
        village = 'Village/ City: ' + DATA.birthPlace.village + '; '
      } else {
        village = ''
      }
      let postOffice
      if (DATA.birthPlace.postOffice != null){
        postOffice = 'Post Office: ' + DATA.birthPlace.postOffice + '; '
      } else {
        postOffice = ''
      }
      let subDistrict
      if (DATA.birthPlace.subDistrict != null){
        subDistrict = 'Sub District: ' + DATA.birthPlace.subDistrict + '; '
      } else {
        subDistrict = ''
      }
      let district
      if (DATA.birthPlace.district != null){
        district = 'District/ State: ' + DATA.birthPlace.district + '; '
      } else {
        district = ''
      }
      let country
      if (DATA.birthPlace.country != null){
        country = 'Country: ' + DATA.birthPlace.country + '; '
      } else {
        country = ''
      }
      
      document.getElementById('birthPlace').innerHTML = village + '<br>' + postOffice + '<br>' + subDistrict + '<br>' + district + '<br>' + country
    }
    // birth place
    
    // birth date
    if( document.getElementById('birthDate') && DATA.birthDate != null ){
      document.querySelector('.birthDate-holder-profile').style.display = 'inline-block'

      document.getElementById('birthDate').innerText = new Date(DATA.birthDate).toISOString().split('T')[0]
    }
    // birth date
    
    // phone
    if( document.getElementById('phoneNumber') && DATA.phoneNumber.personal != null || DATA.phoneNumber.personal2 != null || DATA.phoneNumber.home != null || DATA.phoneNumber.office != null  ){

      document.querySelector('.phoneNumber-holder-profile').style.display = 'inline-block'

      let personal1
      if (DATA.phoneNumber.personal != null){
        personal1 = 'Pesonal : ' + DATA.phoneNumber.personal + ' ; <br>'
      } else {
        personal1 = ''
      }
      let personal2
      if (DATA.phoneNumber.personal2 != null){
        personal2 = 'Pesonal second : ' + DATA.phoneNumber.personal2 + ' ; <br>'
      } else {
        personal2 = ''
      }
      let home
      if (DATA.phoneNumber.home != null){
        home = 'Home : ' + DATA.phoneNumber.home + ' ; <br>'
      } else {
        home = ''
      }
      let office
      if (DATA.phoneNumber.office != null){
        office = 'Office : ' + DATA.phoneNumber.office + ' ;'
      } else {
        office = ''
      }
      
      document.getElementById('phoneNumber').innerHTML = personal1 + personal2 + home + office
    }
    // phone
    
    // email
    if( document.getElementById('email') && DATA.email.personal != null || DATA.email.business != null ){

      document.querySelector('.email-holder-profile').style.display = 'inline-block'

      let personal
      if (DATA.email.personal != null){
        personal = 'Pesonal : ' + DATA.email.personal + ' ; <br>'
      } else {
        personal = ''
      }
      let business
      if (DATA.email.business != null){
        business = 'Business : ' + DATA.email.business + ' ;'
      } else {
        business = ''
      }
      
      document.getElementById('email').innerHTML = personal + business
    }
    // email
    
    // website
      // one
      if( document.getElementById('website-one') && DATA.website.one.title != null ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-one').style.display = 'block'
        document.querySelector('#title-one span').innerHTML = DATA.website.one.title

        document.querySelector('#website-one').style.display = 'block'
        document.getElementById('website-one').innerHTML = DATA.website.one.url
      }
      // one
      // two
      if( document.getElementById('website-two') && DATA.website.two.title != null ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-two').style.display = 'block'
        document.querySelector('#title-two span').innerHTML = DATA.website.two.title

        document.querySelector('#website-two').style.display = 'block'
        document.getElementById('website-two').innerHTML = DATA.website.two.url
      }
      // two
      // three
      if( document.getElementById('website-three') && DATA.website.three.title != null ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-three').style.display = 'block'
        document.querySelector('#title-three span').innerHTML = DATA.website.three.title

        document.querySelector('#website-three').style.display = 'block'
        document.getElementById('website-three').innerHTML = DATA.website.three.url
      }
      // three
      // four
      if( document.getElementById('website-four') && DATA.website.four.title != null ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-four').style.display = 'block'
        document.querySelector('#title-four span').innerHTML = DATA.website.four.title

        document.querySelector('#website-four').style.display = 'block'
        document.getElementById('website-four').innerHTML = DATA.website.four.url
      }
      // four
      // five
      if( document.getElementById('website-five') && DATA.website.five.title != null ){
        document.querySelector('.website-holder-profile').style.display = 'inline-block'

        document.querySelector('#title-five').style.display = 'block'
        document.querySelector('#title-five span').innerHTML = DATA.website.five.title

        document.querySelector('#website-five').style.display = 'block'
        document.getElementById('website-five').innerHTML = DATA.website.five.url
      }
      // five
    // website
      
    // profession
    if( document.getElementById('profession') && DATA.profession != null ){
      document.querySelector('.profession-holder-profile').style.display = 'inline-block'

      document.getElementById('profession').innerText = DATA.profession
    }
    // profession
    
    // education
      // post graduate
      if( document.getElementById('institution-one') && DATA.education.postGraduate.institution != null ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#postGraduate-title').style.display = 'block'

        document.getElementById('postGraduate-institution').style.display = 'block'
        document.getElementById('institution-one').style.display = 'block'
        document.getElementById('institution-one').innerText = DATA.education.postGraduate.institution

        document.getElementById('postGraduate-duration').style.display = 'block'
        document.getElementById('postGraduate-from').style.display = 'block'
        document.getElementById('postgraduate-duration-from').style.display = 'block'
        document.getElementById('postgraduate-duration-from').innerText = new Date(DATA.education.postGraduate.from).toISOString().split('T')[0]

        document.getElementById('postGraduate-to').style.display = 'block'
        document.getElementById('postgraduate-duration-to').style.display = 'block'
        document.getElementById('postgraduate-duration-to').innerText = new Date(DATA.education.postGraduate.to).toISOString().split('T')[0]

        document.getElementById('postGraduate-location').style.display = 'block'
        document.getElementById('institution-location-one').style.display = 'block'
        document.getElementById('institution-location-one').innerText = DATA.education.postGraduate.location
      }
      // post graduate
      // graduate
      if( document.getElementById('institution-two') && DATA.education.graduate.institution != null ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#graduate-title').style.display = 'block'

        document.getElementById('graduate-institution').style.display = 'block'
        document.getElementById('institution-two').style.display = 'block'
        document.getElementById('institution-two').innerText = DATA.education.graduate.institution

        document.getElementById('graduate-duration').style.display = 'block'
        document.getElementById('graduate-from').style.display = 'block'
        document.getElementById('graduate-duration-from').style.display = 'block'
        document.getElementById('graduate-duration-from').innerText = new Date(DATA.education.graduate.from).toISOString().split('T')[0]

        document.getElementById('graduate-to').style.display = 'block'
        document.getElementById('graduate-duration-to').style.display = 'block'
        document.getElementById('graduate-duration-to').innerText = new Date(DATA.education.graduate.to).toISOString().split('T')[0]

        document.getElementById('graduate-location').style.display = 'block'
        document.getElementById('institution-location-two').style.display = 'block'
        document.getElementById('institution-location-two').innerText = DATA.education.graduate.location
      }
      // graduate
      // higher secondary
      if( document.getElementById('institution-three') && DATA.education.higherSecondary.institution != null ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#higherSecondary-title').style.display = 'block'

        document.getElementById('higherSecondary-institution').style.display = 'block'
        document.getElementById('institution-three').style.display = 'block'
        document.getElementById('institution-three').innerText = DATA.education.higherSecondary.institution

        document.getElementById('higherSecondary-duration').style.display = 'block'
        document.getElementById('higherSecondary-from').style.display = 'block'
        document.getElementById('higherSecondary-duration-from').style.display = 'block'
        document.getElementById('higherSecondary-duration-from').innerText = new Date(DATA.education.higherSecondary.from).toISOString().split('T')[0]

        document.getElementById('higherSecondary-to').style.display = 'block'
        document.getElementById('higherSecondary-duration-to').style.display = 'block'
        document.getElementById('higherSecondary-duration-to').innerText = new Date(DATA.education.higherSecondary.to).toISOString().split('T')[0]

        document.getElementById('higherSecondary-location').style.display = 'block'
        document.getElementById('institution-location-three').style.display = 'block'
        document.getElementById('institution-location-three').innerText = DATA.education.higherSecondary.location
      }
      // higher secondary
      // secondary
      if( document.getElementById('institution-four') && DATA.education.secondary.institution != null ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#secondary-title').style.display = 'block'

        document.getElementById('secondary-institution').style.display = 'block'
        document.getElementById('institution-four').style.display = 'block'
        document.getElementById('institution-four').innerText = DATA.education.secondary.institution

        document.getElementById('secondary-duration').style.display = 'block'
        document.getElementById('secondary-from').style.display = 'block'
        document.getElementById('secondary-duration-from').style.display = 'block'
        document.getElementById('secondary-duration-from').innerText = new Date(DATA.education.secondary.from).toISOString().split('T')[0]

        document.getElementById('secondary-to').style.display = 'block'
        document.getElementById('secondary-duration-to').style.display = 'block'
        document.getElementById('secondary-duration-to').innerText = new Date(DATA.education.secondary.to).toISOString().split('T')[0]


        document.getElementById('secondary-location').style.display = 'block'
        document.getElementById('institution-location-four').style.display = 'block'
        document.getElementById('institution-location-four').innerText = DATA.education.secondary.location
      }
      // secondary
      // elementary
      if( document.getElementById('institution-five') && DATA.education.elementary.institution != null ){
        document.querySelector('.education-holder-profile').style.display = 'inline-block'
        document.querySelector('#elementary-title').style.display = 'block'

        document.getElementById('elementary-institution').style.display = 'block'
        document.getElementById('institution-five').style.display = 'block'
        document.getElementById('institution-five').innerText = DATA.education.elementary.institution


        document.getElementById('elementary-duration').style.display = 'block'
        document.getElementById('elementary-from').style.display = 'block'
        document.getElementById('elementary-duration-from').style.display = 'block'
        document.getElementById('elementary-duration-from').innerText = new Date(DATA.education.elementary.from).toISOString().split('T')[0]

        document.getElementById('elementary-to').style.display = 'block'
        document.getElementById('elementary-duration-to').style.display = 'block'
        document.getElementById('elementary-duration-to').innerText = new Date(DATA.education.elementary.to).toISOString().split('T')[0]


        document.getElementById('elementary-location').style.display = 'block'
        document.getElementById('institution-location-five').style.display = 'block'
        document.getElementById('institution-location-five').innerText = DATA.education.elementary.location
      }
      // elementary
    // education
      
    // company
      // one
      if( document.getElementById('organization-one') && DATA.company.one.organization != null ){
        document.querySelector('.company-holder-profile').style.display = 'inline-block'
        document.querySelector('#company-title-one').style.display = 'block'

        document.getElementById('company-name-one').style.display = 'block'
        document.getElementById('organization-one').style.display = 'block'
        document.getElementById('organization-one').innerText = DATA.company.one.organization

        document.getElementById('company-duration-one').style.display = 'block'        
        document.getElementById('company-from-one').style.display = 'block'
        document.getElementById('organization-one-from').style.display = 'block'
        document.getElementById('organization-one-from').innerText = new Date(DATA.company.one.from).toISOString().split('T')[0]

        document.getElementById('company-to-one').style.display = 'block'
        document.getElementById('organization-one-to').style.display = 'block'
        document.getElementById('organization-one-to').innerText = new Date(DATA.company.one.to).toISOString().split('T')[0]

        document.getElementById('company-location-one').style.display = 'block'
        document.getElementById('organization-one-location').style.display = 'block'
        document.getElementById('organization-one-location').innerText = DATA.company.one.location
      }
      // one
      // two
      if( document.getElementById('organization-two') && DATA.company.two.organization != null ){
        document.querySelector('.company-holder-profile').style.display = 'inline-block'
        document.querySelector('#company-title-two').style.display = 'block'

        document.getElementById('company-name-two').style.display = 'block'
        document.getElementById('organization-two').style.display = 'block'
        document.getElementById('organization-two').innerText = DATA.company.two.organization

        document.getElementById('company-duration-two').style.display = 'block'        
        document.getElementById('company-from-two').style.display = 'block'
        document.getElementById('organization-two-from').style.display = 'block'
        document.getElementById('organization-two-from').innerText = new Date(DATA.company.two.from).toISOString().split('T')[0]

        document.getElementById('company-to-two').style.display = 'block'
        document.getElementById('organization-two-to').style.display = 'block'
        document.getElementById('organization-two-to').innerText = new Date(DATA.company.two.to).toISOString().split('T')[0]

        document.getElementById('company-location-two').style.display = 'block'
        document.getElementById('organization-two-location').style.display = 'block'
        document.getElementById('organization-two-location').innerText = DATA.company.two.location
      }
      // two
      // three
      if( document.getElementById('organization-three') && DATA.company.three.organization != null ){
        document.querySelector('.company-holder-profile').style.display = 'inline-block'
        document.querySelector('#company-title-three').style.display = 'block'

        document.getElementById('company-name-three').style.display = 'block'
        document.getElementById('organization-three').style.display = 'block'
        document.getElementById('organization-three').innerText = DATA.company.three.organization

        document.getElementById('company-duration-three').style.display = 'block'        
        document.getElementById('company-from-three').style.display = 'block'
        document.getElementById('organization-three-from').style.display = 'block'
        document.getElementById('organization-three-from').innerText = new Date(DATA.company.three.from).toISOString().split('T')[0]

        document.getElementById('company-to-three').style.display = 'block'
        document.getElementById('organization-three-to').style.display = 'block'
        document.getElementById('organization-three-to').innerText = new Date(DATA.company.three.to).toISOString().split('T')[0]

        document.getElementById('company-location-three').style.display = 'block'
        document.getElementById('organization-three-location').style.display = 'block'
        document.getElementById('organization-three-location').innerText = DATA.company.three.location
      }
      // three
    // company
      
    // business
      // one
      if( document.getElementById('business-one') && DATA.business.one.name != null ){
        document.querySelector('.business-holder-profile').style.display = 'inline-block'
        document.querySelector('#business-title-one').style.display = 'block'

        document.getElementById('business-name-one').style.display = 'block'
        document.getElementById('business-one').style.display = 'block'
        document.getElementById('business-one').innerText = DATA.business.one.name

        document.getElementById('business-duration-one').style.display = 'block'        
        document.getElementById('business-from-one').style.display = 'block'
        document.getElementById('business-profile-one-from').style.display = 'block'
        document.getElementById('business-profile-one-from').innerText = new Date(DATA.business.one.from).toISOString().split('T')[0]

        document.getElementById('business-to-one').style.display = 'block'
        document.getElementById('business-profile-one-to').style.display = 'block'
        document.getElementById('business-profile-one-to').innerText = new Date(DATA.business.one.to).toISOString().split('T')[0]

        document.getElementById('business-location-one').style.display = 'block'
        document.getElementById('business-one-location').style.display = 'block'
        document.getElementById('business-one-location').innerText = DATA.business.one.location
      }
      // one
      // two
      if( document.getElementById('business-two') && DATA.business.two.name != null ){
        document.querySelector('.business-holder-profile').style.display = 'inline-block'
        document.querySelector('#business-title-two').style.display = 'block'

        document.getElementById('business-name-two').style.display = 'block'
        document.getElementById('business-two').style.display = 'block'
        document.getElementById('business-two').innerText = DATA.business.two.name

        document.getElementById('business-duration-two').style.display = 'block'        
        document.getElementById('business-from-two').style.display = 'block'
        document.getElementById('business-profile-two-from').style.display = 'block'
        document.getElementById('business-profile-two-from').innerText = new Date(DATA.business.two.from).toISOString().split('T')[0]

        document.getElementById('business-to-two').style.display = 'block'
        document.getElementById('business-profile-two-to').style.display = 'block'
        document.getElementById('business-profile-two-to').innerText = new Date(DATA.business.two.to).toISOString().split('T')[0]

        document.getElementById('business-location-two').style.display = 'block'
        document.getElementById('business-two-location').style.display = 'block'
        document.getElementById('business-two-location').innerText = DATA.business.two.location
      }
      // two
      // three
      if( document.getElementById('business-three') && DATA.business.three.name != null ){
        document.querySelector('.business-holder-profile').style.display = 'inline-block'
        document.querySelector('#business-title-three').style.display = 'block'

        document.getElementById('business-name-three').style.display = 'block'
        document.getElementById('business-three').style.display = 'block'
        document.getElementById('business-three').innerText = DATA.business.three.name

        document.getElementById('business-duration-three').style.display = 'block'        
        document.getElementById('business-from-three').style.display = 'block'
        document.getElementById('business-profile-three-from').style.display = 'block'
        document.getElementById('business-profile-three-from').innerText = new Date(DATA.business.three.from).toISOString().split('T')[0]

        document.getElementById('business-to-three').style.display = 'block'
        document.getElementById('business-profile-three-to').style.display = 'block'
        document.getElementById('business-profile-three-to').innerText = new Date(DATA.business.three.to).toISOString().split('T')[0]

        document.getElementById('business-location-three').style.display = 'block'
        document.getElementById('business-three-location').style.display = 'block'
        document.getElementById('business-three-location').innerText = DATA.business.three.location
      }
      // three
    // business
      
    // passion
    if( document.getElementById('passion') && DATA.passion != null ){
      document.querySelector('.passion-holder-profile').style.display = 'inline-block'
      document.getElementById('passion').innerText = DATA.passion
    }
    // passion
    
    // religion
    if( document.getElementById('religion') && DATA.religion != null ){
      document.querySelector('.religion-holder-profile').style.display = 'inline-block'
      document.getElementById('religion').innerText = DATA.religion
    }
    // religion
    
    // politics
    if( document.getElementById('politics') && DATA.politics != null ){
      document.querySelector('.politics-holder-profile').style.display = 'inline-block'
      document.getElementById('politics').innerText = DATA.politics
    }
    // politics


    
    // lookup for change in subdody width and adjust css  in pc only
      if( window.innerWidth >= 1000){

        // profile page inner content adjustment
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
        // profile page inner content adjustment


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

        // page adjustment
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
        // page adjustment
      }
    // lookup for change in subdody width and adjust css  in pc only

 
  
}
/* get profile data from mongo */







// friend and follower section
function freindAndFollowerSection() {
  
    
    
    

    



    /* Check you 
    ** send any request 
    ** receive any request
    ** friends
    */
      function checkRelation() { 

        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/profile/requestStatus', // Replace with your server endpoint
            type: 'POST',
            data: {
              peer_id: uiD_profile, 
              my_id: myId,
            },
            success: async function(response) {
              if(response == 'sent request' && response != null ){
                console.warn("sent request!")

                

                
                  // change button states
                    freindButton_profile.innerText = 'Cancel friend request!'
                    freindButton_profile.onclick = cancelRequest
                    freindButton_profile.style.display = 'inline-block'  
                    
                    cancelButton_profile.style.display = 'none'
                  // change button states
                
            
              } else if(response == 'receive request' && response != null){
                console.warn("receive request!")

                
                  freindButton_profile.innerHTML = 'Accept Request'
                  freindButton_profile.onclick = accept
                  freindButton_profile.style.display = 'inline-block'

                  cancelButton_profile.style.display = 'inline-block'
                  cancelButton_profile.onclick = rejectRequest
                
              } else if( response == 'friend' && response != null){
                console.warn("friend!")

                
                
                  freindButton_profile.innerText = 'Unfriend'
                  freindButton_profile.onclick = unfriend
                  freindButton_profile.style.display = 'inline-block'

                  cancelButton_profile.style.display = 'none'
                  

                  //audioCallButton_profile.style.display = 'inline-block'
                  //videoCallButton_profile.style.display = 'inline-block'
                  //messageButton_profile.style.display = 'inline-block'
                

              } else if(response == 'no relation' && response != null){
                console.log('no relation')

                freindButton_profile.innerText = 'Send friend request'      
                freindButton_profile.onclick = sendRequest
                freindButton_profile.style.display = 'inline-block'

                cancelButton_profile.style.display = 'none'

              } else{
                console.warn("Error in checking sent request!" + response)
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Error in checking sent request!" + error) 
              }
            }
          })
        })



        // check following
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/profile/followStatus', // Replace with your server endpoint
            type: 'POST',
            data: {
              peer_id: uiD_profile, 
              my_id: myId,
            },
            success: async function(response) {
              if(response == 'following' && response != null ){
                console.warn("following!")                

                
                  // change button states
                    followButton_profile.innerText = 'Unfollow'
                    followButton_profile.onclick = unfollow
                    followButton_profile.style.display = 'inline-block'
                  // change button states
                
            
              }  else if(response == 'not following' && response != null){
                console.log('not following')

                followButton_profile.innerText = 'Follow'
                followButton_profile.onclick = follow
                followButton_profile.style.display = 'inline-block'

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
        })
        // check following


      }      
    /* Check you 
    ** send any request 
    ** receive any request
    ** friends
    */
    

    // updates of friends of follower button
      function updateFriendAndFollowerButton(){
        updatesOfFriendAndFollowerButton_profile = setInterval(()=>{    

          checkRelation()      

        }, 8000)
      }      
    // updates of friends of follower button

    //Check current profile isn't your profile
      if( admin_profile == 'true'){
        freindButton_profile.style.display = 'none'
        followButton_profile.style.display = 'none'
        document.getElementById('callButtonsHolderProfile').style.display = 'none'
      } else {

        checkRelation() // instant run on load
        updateFriendAndFollowerButton()

        
        //document.getElementById('callButtonsHolderProfile').style.display = 'inline-block'
      }
    // Check current profile isn't your profile



    //send friend request to a new person
      function sendRequest(){

        clearInterval(updatesOfFriendAndFollowerButton_profile)
        freindButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
        followButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'


        
        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/profile/sendFreindRequest', // Replace with your server endpoint
            type: 'PUT',
            data: {
              peer_id: uiD_profile, 
              my_id: myId,
            },
            success: async function(response) {
              if(response != 'error' && response != null ){
                console.warn("Friend request successfully sent!")       

                updateFriendAndFollowerButton()
              } else{
                console.warn("Can't sent friend request!" + response)

                updateFriendAndFollowerButton()
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Can't sent friend request!" + error) 

                updateFriendAndFollowerButton()
              }
            }
          })
        })        
  
      }
    //send friend request to a new person
       


  
    function cancelRequest(){

      clearTimeout(updatesOfFriendAndFollowerButton_profile)
      freindButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
      followButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'



      // Send AJAX request to Node.js server
      $(document).ready(function(){
        $.ajax({
          url: '/mongoJs/profile/cancelFreindRequest', // Replace with your server endpoint
          type: 'PUT',
          data: {
            peer_id: uiD_profile, 
            my_id: myId,
          },
          success: async function(response) {
            if(response != 'error' && response != null ){
              console.warn("successfully friend request cancled!")

              updateFriendAndFollowerButton()
            
            } else{
              console.warn("Can't cancel friend request!" + response)

              updateFriendAndFollowerButton()
            }
          },
          error: function(error) {
            if(error == 'error' && error != null ){
              console.warn("Can't cancel friend request!" + error) 

              updateFriendAndFollowerButton()
            }
          }
        })
      })
      
    }



    function accept(){

      clearInterval(updatesOfFriendAndFollowerButton_profile)
      freindButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
      followButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
      cancelButton_profile.style.display = 'none'



      
      // Send AJAX request to Node.js server
      $(document).ready(function(){
        $.ajax({
          url: '/mongoJs/profile/acceptFreindRequest', // Replace with your server endpoint
          type: 'PUT',
          data: {
            peer_id: uiD_profile, 
            my_id: myId,
          },
          success: function(response) {
            if(response != 'error' && response != null ){
              console.warn("successfully accept request!")
              
              updateFriendAndFollowerButton()
              
            } else{
              console.warn("Error in acceptin friend request!" + response)
              
              updateFriendAndFollowerButton()
            }
          },
          error: function(error) {
            if(error == 'error' && error != null ){
              console.warn("Err in acceptin friend request!" + error) 
              
              updateFriendAndFollowerButton()
            }
          }
        })
      })  
      
    }



    function rejectRequest(){

      clearTimeout(updatesOfFriendAndFollowerButton_profile)
      freindButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
      cancelButton_profile.style.display = 'none'



      // Send AJAX request to Node.js server
      $(document).ready(function(){
        $.ajax({
          url: '/mongoJs/profile/rejectFreindRequest', // Replace with your server endpoint
          type: 'PUT',
          data: {
            peer_id: uiD_profile, 
            my_id: myId,
          },
          success: async function(response) {
            if(response != 'error' && response != null ){
              console.warn("successfully rejected friend request!")

              updateFriendAndFollowerButton()
        
            } else{
              console.warn("Error in rejected friend request!" + response)

              updateFriendAndFollowerButton()
            }
          },
          error: function(error) {
            if(error == 'error' && error != null ){
              console.warn("Err in rejected friend request!" + error) 

              updateFriendAndFollowerButton()
            }
          }
        })
      })  
    }




    function unfriend(){


      clearTimeout(updatesOfFriendAndFollowerButton_profile)
      freindButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'
      followButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'



      // Send AJAX request to Node.js server
      $(document).ready(function(){
        $.ajax({
          url: '/mongoJs/profile/unfriend', // Replace with your server endpoint
          type: 'PUT',
          data: {
            peer_id: uiD_profile, 
            my_id: myId,
          },
          success: async function(response) {
            if(response != 'error' && response != null ){
              console.warn("successfully unfriend!")

              updateFriendAndFollowerButton()
        
            } else{
              console.warn("Error in unfriending!" + response)

              updateFriendAndFollowerButton()
            }
          },
          error: function(error) {
            if(error == 'error' && error != null ){
              console.warn("Err in unfriending!" + error) 

              updateFriendAndFollowerButton()
            }
          }
        })
      })  

    } 



    function follow(){
      
      clearInterval(updatesOfFriendAndFollowerButton_profile)
      followButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'


        
        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/profile/follow', // Replace with your server endpoint
            type: 'PUT',
            data: {
              peer_id: uiD_profile, 
              my_id: myId,
            },
            success: async function(response) {
              if(response != 'error' && response != null ){
                console.warn("successfully follow!")       

                updateFriendAndFollowerButton()
              } else{
                console.warn("Can't set follow!" + response)

                updateFriendAndFollowerButton()
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Can't set follow!" + error) 

                updateFriendAndFollowerButton()
              }
            }
          })
        })        
  
      
    }

    function unfollow(){

      clearInterval(updatesOfFriendAndFollowerButton_profile)
      followButton_profile.innerHTML = '<img src="./progress.gif" style="width: 10px; height: 10px;">'


        
        // Send AJAX request to Node.js server
        $(document).ready(function(){
          $.ajax({
            url: '/mongoJs/profile/unfollow', // Replace with your server endpoint
            type: 'PUT',
            data: {
              peer_id: uiD_profile, 
              my_id: myId,
            },
            success: async function(response) {
              if(response != 'error' && response != null ){
                console.warn("successfully unfollow!")       

                updateFriendAndFollowerButton()
              } else{
                console.warn("Can't set unfollow!" + response)

                updateFriendAndFollowerButton()
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Can't set unfollow!" + error) 

                updateFriendAndFollowerButton()
              }
            }
          })
        }) 
    }

}
freindAndFollowerSection()
// friend and follower section










//messaging
async function messaging(){
  let getMessengerRoomIdWithSelectedPeer

  // get messenger room ref with selected peer
    $.ajax({
      url: '/mongoJs/main/getMessengerRoomIdWithSelectedPeer', // Replace with your server endpoint
      type: 'POST',
      data: {
        my_id: myId,
        peer_id: uiD_profile
      },
      success: function(response) {
        if(response == 'error' && response != null ){
          console.warn("Error in getting messenger room ref with selected peer!" + response) 

        }  else {    
          console.warn("successfully get messenger room ref with selected peer!")
          
          getMessengerRoomIdWithSelectedPeer = response._id
        }
      },
      error: function(error) {
        if(error == 'error' && error != null ){
          console.warn("Err in getting messenger room ref with selected peer!" + error)               
        }
      }
    })
  // get messenger room ref with selected peer

  // show message box
    document.getElementById('messaging').addEventListener('click', ()=>{
      document.getElementById('messaging-box').style.bottom = '5px'

      makeUnseenSMSseen()

      $('#messaging-box-middle-subSection').on("click", function(){
        makeUnseenSMSseen()
      })
    })
  // show message box  

  // hide message box
  document.getElementById('close').addEventListener('click', ()=>{
    document.getElementById('messaging-box').style.bottom = '-600px'
  })
  // hide message box


  // make unseen sms seen
    function makeUnseenSMSseen(){
      $.ajax({
        url: '/mongoJs/main/makeUnseenSMSseen', // Replace with your server endpoint
        type: 'PUT',
        data: {
          my_id: myId,
          room_id: getMessengerRoomIdWithSelectedPeer
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
  // make unseen sms seen

  

  // inbox header
        
    // profile pic and name
      // Send AJAX request to Node.js server              
      $.ajax({
        url: '/mongoJs/main/getSingleProfileFriendFollowers', // Replace with your server endpoint
        type: 'POST',
        data: {
          peer_id: uiD_profile,
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
        document.querySelector('#messaging-box-profileNameImageHolder #profile-name div div').innerText = singleDATA.profileInfo.name.fullName
        
        // pic   
          if ( singleDATA.profileInfo.profilePics.active != null) {        
            document.querySelector('#messaging-box-profileNameImageHolder #imgHolder img').src = singleDATA.profileInfo.profilePics.active  
          }      
        // pic
      
        // controls

        // controls
      }
    // profile pic and name

    
    // check friend
    /*
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

          
                audioCallButton_profile.onclick = audioCall
                document.getElementById('audioCallButton_profileInbonx').onclick = audioCall
                videoCallButton_profile.onclick = videoCall
                document.getElementById('videoCallButton_profileInbonx').onclick = videoCall
              //call
  
            }

            callFunction()
          //end of make a call
        })
      })
      */
    // check friend 
       
    
  // inbox header

  
  // middle part 
    // background
      $.ajax({
        url: '/mongoJs/main/getMessengerBackground', // Replace with your server endpoint
        type: 'POST',
        data: {
          my_id: myId,
        },
        success: function(response) {
          if(response != 'error' && response != null ){
            console.warn("successfully get messenger background!")
        
            showBackground(response)
          } else{
            console.warn("Error in getting messenger background!" + response)              
          }
        },
        error: function(error) {
          if(error == 'error' && error != null ){
            console.warn("Err in getting messenger background!" + error)               
          }
        }
      })

      function showBackground(url){
        document.getElementById('messaging-box-middle-section').style.background = `blueviolet url(${url}) center no-repeat`;
        document.getElementById('messaging-box-middle-section').style.backgroundSize =  '100% 100%'
      }      
    // background


    
    // sub setcion scroll to bottom
      function personalMessageInboxScrollToBottom(){
        setTimeout(()=>{
          document.getElementById('messaging-box-middle-section').scrollTo(0, document.getElementById('messaging-box-middle-subSection').scrollHeight)
        }, 2000)
      }      
      personalMessageInboxScrollToBottom()            
    // sub setcion scroll to bottom





    
    // message view update

      // confirm delatation mood (delete sms)
      const confirmDelatationMood = document.createElement('div')
      confirmDelatationMood.setAttribute('class', 'confirmDelatationMood')
      document.getElementById('messaging-box').appendChild( confirmDelatationMood )

        // center position
          function centerConfirmDelatationMood() {
            const containerWidth = document.getElementById('messaging-box').offsetWidth
            const containerHeight = document.getElementById('messaging-box').offsetHeight

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

        
        function sendDeleteRequest2DB(messngerRoomId, membersList, sms, smsIndex, areYouSender, myOwnId) {
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
                  const areEqual = arraysAreEqual(membersList, response.sms[smsIndex].deletedBy);

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
                            showEveryMessages() // show updated sms after delation. the function is below
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
            
          }
        }
      // confirm delatation mood (delete sms)





      let isMessageShowOn = false

      // message update only for this peer
        const getPersonalMessageUpdate = setInterval(()=>{

          $.ajax({
            url: '/mongoJs/main/getPersonalMessageUpdateProfile', // Replace with your server endpoint
            type: 'POST',
            data: {
              my_id: myId,
              peer_id: uiD_profile
            },
            success: function(response) {
              if(response == 'error' && response != null ){
                console.warn("Error in getting sms update of this peer!" + response) 

              } else if( response == 'no new sms' && response != null ){

                console.warn("No new sms of this peer!")

                isMessageShowOn = false

              } else if(response == 'new sms' && response != null) {    
                console.warn("successfully get sms update of this peer!")
                
                if( isMessageShowOn == false ) {
                  isMessageShowOn = true
                  showEveryMessages()  // only show when have any unseen sms  
                }
                
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Err in getting sms update of this peer!" + error)               
              }
            }
          })

        }, 5000)        
      // message update only for this peer

      
      
     
      // loop 
        async function showEveryMessages(){ 
          document.getElementById('messaging-box-middle-subSection').innerHTML = '' // clear middle part sub section
          

          // retrive sms with this peer message room
          $.ajax({
            url: '/mongoJs/main/getMessagesPersonal', // Replace with your server endpoint
            type: 'POST',
            data: {
              my_id: myId,
              peer_id: uiD_profile
            },
            success: function(response) {
              if(response == 'error' && response != null ){
                console.warn("Error in getting sms!" + response) 

              } else if( response == 'no sms' && response != null ){

                console.warn("No sms yet!")

              } else {    
                console.warn("successfully get sms!")

                showSMSoneByOne(response)                       
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Err in getting sms!" + error)               
              }
            }
          })
          // retrive sms with this peer message room


          function showSMSoneByOne(DATA){ 
            for (let i = 0; i < DATA.sms.length; i++) {
              if( DATA.sms[i].sendStatus == 'uploaded'){
                // my message
                  if( DATA.sms[i].send.id == myId ){
                    // my message holder
                      const createRightSideMessageView_Holder_myMessage = document.createElement('div')
                      createRightSideMessageView_Holder_myMessage.setAttribute('class', 'createRightSideMessageView_Holder_myMessage')
                      document.getElementById('messaging-box-middle-subSection').appendChild( createRightSideMessageView_Holder_myMessage )
                    // my message holder

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

                    // retive messages pices from object
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
                      createSendAtHolder.setAttribute('class', 'messageSendAt messageSendAtProfileInbox')

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
                        senderProfilePicContainer.setAttribute('id', 'senderProfilePicContainer_' + i )

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
                              peer_id: myId,
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

                        hoverControls.innerHTML = `<span class="material-icons-outlined delete_sms">delete_forever</span>`;    
                        hoverControls.querySelector('.delete_sms').onclick = ()=>{ sendDeleteRequest2DB(  DATA._id, DATA.membersList, DATA.sms[i], i, true, myId ) } 

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
                  }
                // my message
            
                // peer message
                  else {
                    // receiver message holder
                      const createRightSideMessageView_Holder_receiver = document.createElement('div')
                      createRightSideMessageView_Holder_receiver.setAttribute('class', 'createRightSideMessageView_Holder_receiver')
                      document.getElementById('messaging-box-middle-subSection').appendChild( createRightSideMessageView_Holder_receiver )
                    // receiver message holder 


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
                      createSendAtHolder.setAttribute('class', 'messageSendAt messageSendAtLeft messageSendAtProfileInbox')

                      createRightSideMessageView_Holder_receiver.appendChild( createSendAtHolder )

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

                        const createImgElement = document.createElement('img')
                        createImgElement.src = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
                        senderProfilePicContainer.appendChild( createImgElement ) 

                        
                      // sender name
                        const senderNameContainer = document.createElement('div')
                        senderNameContainer.setAttribute('class', 'senderNameContainer senderNameContainer_leftSide')
                        senderNameContainer.setAttribute('id', 'senderNameContainer_leftSide' + DATA.sms[i].send.id )
                        senderDescription.appendChild( senderNameContainer )

              
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

                        hoverControls.innerHTML = `<span class="material-icons-outlined delete_sms">delete_forever</span>`;    
                        hoverControls.querySelector('.delete_sms').onclick = ()=>{ sendDeleteRequest2DB(  DATA._id, DATA.membersList, DATA.sms[i], i, true, myId ) } 

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
                // peer message
              }
            }
          }
          
          

          // sub setcion scroll to bottom
            personalMessageInboxScrollToBottom()
          // sub setcion scroll to bottom
          
        }
        showEveryMessages() // default tigger for first time even when have no new sms
      // loop
    // message view update
  // middle part

    
    
  // inbox footer 
    // add media button
      const addMediaButton = document.querySelector('#messaging-box #addMediaButton')
      const mediaNavBar = document.querySelector('#messaging-box #footerSection #mediaNavBar')

      // show/hide media nav bar
        addMediaButton.onclick = showNavbar

        function showNavbar(){
          addMediaButton.onclick = hideNavBar
          mediaNavBar.style.left = '5px'
        }

        function hideNavBar(){
          addMediaButton.onclick = showNavbar
          mediaNavBar.style.left = '-50px'
        }
      // show/hide media nav bar

      // select image
        const selectedImage = document.querySelector('#messaging-box #footerSection #mediaNavBar #personalImages')
        const previewBar = document.querySelector('#messaging-box #footerSection #imagePreview')
        const previewBarSubSection = document.querySelector('#messaging-box #footerSection #imagePreview #imagePreviewSubSection')
        const previewBarSubSection2 = document.querySelector('#messaging-box #footerSection #imagePreview #imagePreviewSubSection #imagePreviewSubSection2')
        const closePreviewBar = document.querySelector('#messaging-box #footerSection #imagePreview .closeMessageBoxImgPreview')

        // hide preview bar
          closePreviewBar.onclick = ()=>{
            previewBar.style.left = '400px'
          }
        // hide preview bar

        // file name
          let file_name = []
        // file name

        // compressed img url to store in firestore
          let compressed_image_url = []
        // compressed img url to store in firestore



        selectedImage.onchange = (e)=>{ 
          hideNavBar()

          // clear compressed img url array
            compressed_image_url = []
          // clear compressed img url array
          

          // preview bar sub section 2
            previewBarSubSection2.innerHTML = '' // clear old data
          // preview bar sub section 2



          
          if( selectedImage.files.length <= 10){            

            // select form
              const form = document.querySelector('#messaging-box #footerSection #mediaNavBar form')
            // slecet form

            
            const heightArray = []

            for (let i = 0; i < selectedImage.files.length; i++) {
              // store file names
                file_name.push( selectedImage.files[i].name )
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
                if( i+1 == selectedImage.files.length){
                  setTimeout(()=>{
                    sendAjaxRequest()
                  }, 2000)                  
                }
              // end of loop
            }
            
            

              function sendAjaxRequest(){           
                const formData = new FormData(form); // create a FormData object from the form data
                formData.append("width", 2000)
                formData.append("height", JSON.stringify( heightArray ) )

                $.ajax({
                  url: '/resizeNewProfilePicM', // your server-side endpoint for handling file uploads
                  type: 'POST',
                  data: formData,
                  processData: false,
                  contentType: false,
                  success: function(data) {
                    // clear form data
                      form.querySelector('input[type="file"]').value = ''
                    // clear form data

                    // preview bar show
                      previewBar.style.left = 0
                    // preview bar show

                    const base64imagesFromArr = JSON.parse(data.base64imageArray)

                    for (let i = 0; i < base64imagesFromArr.length; i++) {
                      // preview bar sub section 2
                        // create img tag
                          const createImgTag = document.createElement('img')
                          createImgTag.setAttribute('class', 'personalMessageInbox')
                          createImgTag.setAttribute('src', "data:image/jpeg;base64," + base64imagesFromArr[i] )
                          previewBarSubSection2.appendChild(createImgTag)
                        // create img tag
                      // preview bar sub section 2

                                        
                      // creat context ( only for convert base64 to image url to upload into firestore )             
                        createImgTag.onload = (e) => {  
                          const canvas = document.createElement("canvas")
                          canvas.width = 2000
                          canvas.height = heightArray[i]
                        

                          const context = canvas.getContext("2d")
                          context.drawImage(createImgTag, 0, 0, canvas.width, canvas.height)
                          canvas.toBlob((blob) => {
                            
                            compressed_image_url.push( blob )

                          }, 'image/jpeg')
                        }
                      // creat context ( only for convert base64 to image url to upload into firestore )  

                      // end of loop
                        if( i+1 == base64imagesFromArr.length){
                          setTimeout(()=>{
                            console.log(compressed_image_url)
                          }, 1000)
                        }
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
      // select image
    // add media button


    // upload sms to db    
      document.querySelector('#messaging-box #footerSection .messengerRightSideFooter_sendMessage').onclick = async ()=>{
        let text = document.getElementById('profilePersonalInboxTextarea').value

        let starterOfIndex = 0
        let index = 0

        let timer = 0
        let theSetTimeout = null
        const arrayOftext = []



        function activateTimer(){
          clearTimeout(theSetTimeout)

          theSetTimeout = setTimeout(()=>{
            send()
            console.log(arrayOftext)
          }, timer)
        }

        

          
        if(text.indexOf("http", starterOfIndex) != -1){   
              
          function slice(){
            timer += 1000
            activateTimer()

              if(text.indexOf("http", starterOfIndex) != -1){

                index = text.indexOf("http", starterOfIndex)
                if( text.slice(starterOfIndex, index).trim() != ''){
                  arrayOftext.push( {align: 'default', bold: false, fontFamily: 'default', italic: false, text: text.slice(starterOfIndex, index).trim(), link: false } )
                           
                }
                starterOfIndex = index 

                
                if( text.indexOf(" ", starterOfIndex) != -1){

                  index = text.indexOf(" ", starterOfIndex)
                  if(text.slice(starterOfIndex, index).trim() != ''){
                    arrayOftext.push( {align: 'default', bold: false, fontFamily: 'default', italic: false, text: text.slice(starterOfIndex, index).trim(), link: true } )
                    
                  }
                  starterOfIndex = index            
            
            
              

                  if( text.indexOf("http", starterOfIndex) != -1 || starterOfIndex < text.length ){  
                    slice() // repeat till last count
                  }
                } else{
                  if(text.slice(starterOfIndex).trim() != ''){
                    arrayOftext.push( {align: 'default', bold: false, fontFamily: 'default', italic: false, text: text.slice(starterOfIndex).trim(), link: false } )
                    
                  }
              
                }
              } else {
                if(text.slice(starterOfIndex).trim() != ''){
                  arrayOftext.push( {align: 'default', bold: false, fontFamily: 'default', italic: false, text: text.slice(starterOfIndex).trim(), link: false } )
                  
                }
              }
          }
          slice()

          
            
        } else {
          if(text.trim() != '') {
            arrayOftext.push( {align: 'default', bold: false, fontFamily: 'default', italic: false, text: text.trim(), link: false } )
          }
          
          send()
        }
        

        
        // send to mongo db
        function send(){

          $.ajax({
            url: '/mongoJs/main/sendPersonalSMS', // Replace with your server endpoint
            type: 'PUT',
            data: {
              my_id: myId,
              peer_id: uiD_profile,
              textArray: JSON.stringify(arrayOftext)
            },
            success: function(response) {
              if(response != 'error' && response != null ){
                console.warn("successfully send personal sms!")
              
                // all done (clear everything)
                  document.getElementById('profilePersonalInboxTextarea').value = '' // clean textarea
                // all done (clear everything)

                

                // check there is any image or not
                  if(compressed_image_url.length > 0){
                    uploadImgToFirestore(response)
                  } else {
                    // show send sms
                      showEveryMessages()
                    // show send sms
                  }
                // check there is any image or not
              
              } else{
                console.warn("Error in sending personal sms!" + response)              
              }
            },
            error: function(error) {
              if(error == 'error' && error != null ){
                console.warn("Err in sending personal sms!" + error)               
              }
            }
          }) 
        } 
        // send to mongo db
        
        // upload in fire store
          // image
            let firestoreImageUrl = []

            const metadata = {
              contentType: 'image/jpeg'
            }

            function uploadImgToFirestore(messengerRoomInfo){
                // clear old urls
                  firestoreImageUrl = []
                // clear old urls

                let i = 0
                const lastSmsIndex = messengerRoomInfo.sms.length - 1


                function uploadOneByOne(){
                  const storageReference = ref(storage, 'message/id' + messengerRoomInfo._id + '/sms' + lastSmsIndex + '/' + new Date() + file_name[i]  ); //assign the path of pic

                  const uploadTask = uploadBytesResumable(storageReference, compressed_image_url[i], metadata);
        
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
                          console.warn('compressed image available: ', downloadURLMini);
                            
                          firestoreImageUrl.push( downloadURLMini )

                          setTimeout(()=>{
                            if(compressed_image_url.length > i+1){
                              i++
                              uploadOneByOne()
                            } else {
                              uploadImageUrlIntoMongodbMessageRoom( messengerRoomInfo._id, lastSmsIndex)
                            }
                          }, 1000)

                        });
                    }
                  )
                }
                uploadOneByOne()               
            }
          // image
        // upload in fire store


        // upload image urls into mongodb message room
          function uploadImageUrlIntoMongodbMessageRoom(roomId, smsIndex){
            $.ajax({
              url: '/mongoJs/main/sendFirestoreImageUrlPersonalMessageBox', // Replace with your server endpoint
              type: 'PUT',
              data: {
                messageRoom_Id: roomId,
                sms_id: smsIndex,
                imageUrl_Array: JSON.stringify( firestoreImageUrl )
              },
              success: function(response) {
                if(response != 'error' && response != null ){
                  console.warn("successfully send image url in mongodb!")
                
                  // show send sms
                    showEveryMessages()
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
        // upload image urls into mongodb message room        
        
      }
    // upload sms to db
  // inbox footer
    
}
messaging()
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








