const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        addNewPeer: './src/addNewPeer.js',

        firebaseNewLogin: './src/firebase_new/login',
        firebaseNewMain: './src/firebase_new/main',
        firebaseNewUpdateProfile: './src/firebase_new/updateAllProfile',
        firebaseNewProfile: './src/firebase_new/profile',


        chat5: './src/firebase/chat5.js',                
        signin: './src/firebase/signin.js',
        login: './src/firebase/login.js',
        leftNav: './src/firebase/leftNav.js',
        profile: './src/firebase/profile.js',        
        main: './src/firebase/main.js',
        updateAllProfile: './src/firebase/updateAllProfile.js',



        faceDetection: './src/test/faceDetect.js',
        demo: './src/test/demo.js',
        demo2: './src/test/demo2.js',
        sharescreen: './src/test/sharescreen.js',
        chat: './src/test/chat.js',
        chat3: './src/test/chat3.js',
        profilePersonal: './src/test/profilePersonal.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    watch: true
}
