const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


/* ----- firebase init ------- */
  const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
  const db = getFirestore();
/* ----- firebase init ------- */


/*
router.get('/', (req, res) => { //after / the word will be added to localhost:port/routes/<word>    
    //display the predefind text
    res.send('Router page')
})
*/


/* find my id */
router.post('/', async(req, res)=>{    
    let status = null

    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.id

     }, 'key profileInfo')
    .then(users => {
      // Process the found users
      status = {
        key: {
            id: users.key.id,
            password: users.key.password
        },
        name : {
            fullName: users.profileInfo.name.fullName,
        } 
      }
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error' 
    });


    

    // firebase
    /*
    const cityRef = db.collection('Moments').doc('david@allfreemail.net');
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data().profileInfo.firstName);
    }
    */
    
    res.send( status )
}) 
/* find my id */

module.exports = router
