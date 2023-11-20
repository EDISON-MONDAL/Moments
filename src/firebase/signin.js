import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, setDoc, doc, serverTimestamp,
  arrayUnion
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword
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


//signing upsers up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
 	e.preventDefault()

 	const email = signupForm.email.value
  const password = signupForm.password.value
  const firstname = signupForm.firstname.value
  const lastname = signupForm.lastname.value

  createUserWithEmailAndPassword(auth, email, password)
 	.then(async (cred) => {
  	await setDoc(doc(db, 'Moments', email, 'profileInfo', 'credentials'), {
      autobiograph: '',
      birthDate: '',
      birthPlace: {
        village: '',
        postOffice: '',
        subDistrict: '',
        district: '',
        country: ''
      },
      business: {
        one: {
          from: '',
          location: '',
          name: '',
          to: ''
        },
        two: {
          from: '',
          location: '',
          name: '',
          to: ''
        },
        three: {
          from: '',
          location: '',
          name: '',
          to: ''
        }
      },
      company: {
        one: {
          from: '',
          location: '',
          organization: '',
          to: ''
        },
        two: {
          from: '',
          location: '',
          organization: '',
          to: ''
        },
        three: {
          from: '',
          location: '',
          organization: '',
          to: ''
        }
      },
      education: {
        postGraduate: {
          from: '',
          location: '',
          institution: '',
          to: ''
        },
        graduate: {
          from: '',
          location: '',
          institution: '',
          to: ''
        },
        higherSecondary: {
          from: '',
          location: '',
          institution: '',
          to: ''
        },
        secondary: {
          from: '',
          location: '',
          institution: '',
          to: ''
        },
        elementary: {
          from: '',
          location: '',
          institution: '',
          to: ''
        }
      },
      email: {
        business: '',
        personal: ''
      },
      key: {
        id: email,
        password: password,
      },
      livingPlace: {
        village: '',
        postOffice: '',
        subDistrict: '',
        district: '',
        country: ''
      },
      name: {
        firstName: firstname,
        lastName: lastname,
        fullName: firstname + ' ' + lastname,              
      },
      passion: '',
      phoneNumber: {
        home: '',
        office: '',
        personal: '',
        personal2: ''
      },
      politics: '',
      profession: '',
      religion: '',
      website: {
        oneTitle: '',
        one: '',
        twoTitle: '',
        two: '',
        threeTitle: '',
        three: '',
        fourTitle: '',
        four: '',
        fiveTitle: '',
        five: ''
      }
      
    },
    {merge: true})

    await setDoc(doc(db, 'Moments', email, 'friendAndFollowers', 'closePersons', 'sendRequests', 'send'), {
      sendList: arrayUnion('')
    },
    {merge: true})

    await setDoc(doc(db, 'Moments', email, 'call', 'management'), {
      status: '',
      to: arrayUnion(''),
      from: arrayUnion(''),
      increased: {
        video: 0,
        audio: 0,
        shareScreen: 0
      },
      preNextNav: 1
    },
    {merge: true})
    console.log('Account created successfully!')
  })
 	.catch((error) => {
    console.log(error.code)
    console.log(error.message)
 	})
})



  















  