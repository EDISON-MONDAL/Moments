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



router.post('/', async(req, res)=>{
  let status = '' 

  const DATA = JSON.parse(req.body.signinFormObjectNode)
 
  
  
  const putInMongo = new require('../../moduls/mongoDB/profile_schema')({
    profileInfo:{
      name: {
        firstName: DATA.firstname,
        middleName: DATA.middlename,
        lastName: DATA.lastname,
        nickName: DATA.nickname,
        fullName: DATA.firstname + ' ' + DATA.middlename + ' ' + DATA.lastname + ' ' + DATA.nickname
      }
    },
    key: {
      id: DATA.email,
      password: DATA.password
    }
  })

  try {
    
    /*
    const createAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').create({
      profileInfo:{
        name: {
          firstName: req.body.firstname,
          middleName: req.body.middlename,
          lastName: req.body.lastname,
          nickName: req.body.nickname,
          fullName: req.body.firstname + ' ' + req.body.middlename + ' ' + req.body.lastname + ' ' + req.body.nickname
        }
      },
      key: {
        identity: req.body.email,
        password: req.body.password
      }       
    })
    */
    
    const objectId = await putInMongo.save()
    // console.log(objectId.id)

    status = 'success'
    
    // res.status(200).json( dbObject )
  } catch(err) {

    status = err.message
    
    // res.status(500).json({message: err.message})
  }
    

    // firestore
    /*
    const cityRef = db.collection('Moments').doc('david@allfreemail.net');
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data().profileInfo.firstName);
    }
    */

    res.send(status)
    
}) 

module.exports = router
