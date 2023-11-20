const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


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
      status = { profileInfo: JSON.stringify(users.profileInfo), key: JSON.stringify(users.profileInfo) }
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








/* get left hand side navigation */
  router.post('/leftNav', async(req, res)=>{ 

    let status = null
    
    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').find({ 
        
     }, 'key profileInfo')
    .then(users => {
      // Process the found users
      status = users

      //console.warn('left nav success '+ users[0].key.id )
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'   

      console.warn('left nav err '+ error)
    });

    
    res.send( status )
  })
/* get left hand side navigation */






/* get Moments background pic reference */
  router.post('/backgroundPic', async(req, res)=>{ 

    let status = null
    
    const findAccountInMongoDB = await require('../../moduls/mongoDB/background_schema').findOne({ 
        
     }, 'light-background')
    .then(users => {
      // Process the found users
      status = users
      // console.warn('pic '+ users['light-background'] )
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
      console.warn('pic err '+ error)
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
/* get Moments background pic reference */





/* friends and follower panel */ 
  router.post('/getFriends', async(req, res)=>{    
    let status = null

    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
      'key.id' : req.body.my_id

    }, 'friendsAndFollowers')
    .then(users => {
      // Process the found users
      status = users
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
    });
      
  
    res.send( status )
  })


  /* get single profile */
    router.post('/getSingleProfileFriendFollowers', async(req, res)=>{    
      let status = null
      //console.warn('strac'+ req.body.peer_id)
      const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id

      }, ) // 'profileInfo' leving an empty option will select all fields
      .then(users => {
        // Process the found users
        status = users
        
      })
      .catch(error => {
        // Handle any errors that occurred during the query
        status = 'error'      
      });
      
  
      res.send( status )
    })
  /* get single profile */


  router.post('/getReceiveRequests', async(req, res)=>{    
    let status = null

    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
      'key.id' : req.body.my_id

    }, 'friendsAndFollowers')
    .then(users => {
      // Process the found users
      status = users
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
    });
      
  
    res.send( status )
  })


  router.post('/getSendRequests', async(req, res)=>{    
    let status = null

    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
      'key.id' : req.body.my_id

    }, 'friendsAndFollowers')
    .then(users => {
      // Process the found users
      status = users
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
    });
      
  
    res.send( status )
  })



  router.post('/getFollowers', async(req, res)=>{    
    let status = null

    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
      'key.id' : req.body.my_id

    }, 'friendsAndFollowers')
    .then(users => {
      // Process the found users
      status = users
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
    });
      
  
    res.send( status )
  })



  router.post('/getfollowingSpecificPeer', async(req, res)=>{    
    let status = null

    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
      'key.id' : req.body.my_id,
      'friendsAndFollowers.following' : { $in: [req.body.peer_id]}
    }, 'friendsAndFollowers')
    .then(users => {
      // Process the found users
      if( users != null){
        status = 'following'
      } else status = 'not following'
      
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
    });
      
  
    res.send( status )
  })



  router.post('/getFollowing', async(req, res)=>{    
    let status = null

    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
      'key.id' : req.body.my_id,

    }, 'friendsAndFollowers')
    .then(users => {
      // Process the found users
      
      status = users      
      
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
    });
      
  
    res.send( status )
  })


  
  
  router.post('/getFriend', async(req, res)=>{    
    let status = null

    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
      'key.id' : req.body.my_id,
      'friendsAndFollowers.friend' : req.body.peer_id
    }, 'friendsAndFollowers')
    .then(users => {
      // Process the found users
      
      if( users != null){
        status = 'friend'  
      } else status = 'not friend'  
          
      
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
    });
      
  
    res.send( status )
  })


  /* close persons section */
    router.post('/getAmongFriends', async(req, res)=>{    
      let status = null

    
      const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').find({ 
        'profileInfo.name.fullName' : { $regex: eval(`/${req.body.form_input}/i`) },
        'friendsAndFollowers.friend' : req.body.my_id
      }, 'profileInfo key')
      .then(users => {
        // Process the found users      
      
        if( users[0] != null){
          status = users  
        } else status = 'not friend'            
      
      })
      .catch(error => {
        // Handle any errors that occurred during the query
        status = 'error'      
        console.warn('error in getting among friends '+ error)
      });
      
  
      res.send( status )
    })



    router.post('/requestStatus', async(req, res)=>{    
      let status = null
      let data = null

      
      // object friendly email
        function objectFriendlyEmail(email_Id){
          const escapeAtTheRate = email_Id.replaceAll('@',"_")
          const escapedDot = escapeAtTheRate.replaceAll('.',"_")
          return escapedDot
        } 
      // object friendly email
    
    
      await require('../../moduls/mongoDB/profile_schema').findOne({ 
          'key.id' : req.body.my_id,
          // 'friendsAndFollowers.send' : { $in: [req.body.peer_id]}
      }, 'friendsAndFollowers')
      .then(users => { 
          // Process the found users
                    
          if(users.friendsAndFollowers.closePersons.send.list.includes( req.body.peer_id ) == true ){
              status = 'sent request'
              data = users.friendsAndFollowers.closePersons.send.details.get(objectFriendlyEmail(req.body.peer_id))
              
              console.log('sent request')
          } else if(users.friendsAndFollowers.closePersons.receive.list.includes( req.body.peer_id ) == true){
              status = 'receive request'
              data = users.friendsAndFollowers.closePersons.receive.details.get(objectFriendlyEmail(req.body.peer_id))
              console.log('receive request')
          } else if (users.friendsAndFollowers.closePersons.familiar.list.includes( req.body.peer_id ) == true){
              status = 'familiar'
              data = users.friendsAndFollowers.closePersons.familiar.details.get(objectFriendlyEmail(req.body.peer_id))
          } else {
              status = 'not familiar'
          }
          
  
      })
      .catch(error => {
        // Handle any errors that occurred during the query
        status = 'error'    
        console.warn("Err in checking request status ! "+ error)  
      })
  
  
      
      res.send( {status: status, data: data} )
    })





    router.put('/closePersonSendRequest', async(req, res)=>{    
      let status = null
  
      // object friendly email
        function objectFriendlyEmail(email_Id){
          const escapeAtTheRate = email_Id.replaceAll('@',"_")
          const escapedDot = escapeAtTheRate.replaceAll('.',"_")
          return escapedDot
        } 
      // object friendly email
    
    
      await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id
  
      }, 'friendsAndFollowers')
      .then(users => { 
          // Process the found users
  
          users.friendsAndFollowers.closePersons.receive.list.push(req.body.my_id)
          users.friendsAndFollowers.closePersons.receive.details = new Map([[objectFriendlyEmail(req.body.my_id), req.body.relation]])
  
        
          try{
            users.save()
            
            saveInMySendList()
          } catch (err) {
            console.warn('send request peer id error '+err)
            status = 'error'
          }
      })
      .catch(error => {
        // Handle any errors that occurred during the query
        status = 'error'    
        console.warn("send request peer id error err "+ error)  
      })
  
  
      /* save in my send list */
        async function saveInMySendList() {
          await require('../../moduls/mongoDB/profile_schema').findOne({ 
              'key.id' : req.body.my_id
      
          }, 'friendsAndFollowers')
          .then(users => { 
              // Process the found users
      
              users.friendsAndFollowers.closePersons.send.list.push(req.body.peer_id)
              users.friendsAndFollowers.closePersons.send.details = new Map([[objectFriendlyEmail(req.body.peer_id), req.body.relation]])
      
            
              try{
                users.save()
      
                status = 'success'
              } catch (err) {
                console.warn('send request my id error ' + err)
                status = 'error'
              }
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("send request my id err "+ error)  
          })
        }
      /* save in my send list */
  
  
      
      
      res.send( status )
    })




    router.put('/closePersonAcceptRequest', async(req, res)=>{    
      let status = null
  
      // object friendly email
        function objectFriendlyEmail(email_Id){
          const escapeAtTheRate = email_Id.replaceAll('@',"_")
          const escapedDot = escapeAtTheRate.replaceAll('.',"_")
          return escapedDot
        } 
      // object friendly email
    
    
      await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id
  
      }, 'friendsAndFollowers')
      .then(users => { 
          // Process the found users
  
          users.friendsAndFollowers.closePersons.familiar.list.push(req.body.my_id)
          users.friendsAndFollowers.closePersons.send.list.splice( users.friendsAndFollowers.closePersons.send.list.indexOf( req.body.my_id ), 1)
          
          users.friendsAndFollowers.closePersons.familiar.details = new Map([
            [
              objectFriendlyEmail(req.body.my_id), users.friendsAndFollowers.closePersons.send.details.get(objectFriendlyEmail(req.body.my_id)) 
            ]
          ])
          users.friendsAndFollowers.closePersons.send.details.delete(objectFriendlyEmail(req.body.my_id))
  
        
          try{
            users.save()
            
            saveInMyFamiliarList()
          } catch (err) {
            console.warn('accept request peer id error '+err)
            status = 'error'
          }
      })
      .catch(error => {
        // Handle any errors that occurred during the query
        status = 'error'    
        console.warn("accept request peer id error err "+ error)  
      })
  
  
      /* save in my send list */
        async function saveInMyFamiliarList() {
          await require('../../moduls/mongoDB/profile_schema').findOne({ 
              'key.id' : req.body.my_id
      
          }, 'friendsAndFollowers')
          .then(users => { 
              // Process the found users
      
              
              users.friendsAndFollowers.closePersons.familiar.list.push(req.body.peer_id)
              users.friendsAndFollowers.closePersons.receive.list.splice( users.friendsAndFollowers.closePersons.receive.list.indexOf( req.body.peer_id ), 1)
          
              users.friendsAndFollowers.closePersons.familiar.details = new Map([
                [
                  objectFriendlyEmail(req.body.peer_id), users.friendsAndFollowers.closePersons.receive.details.get(objectFriendlyEmail(req.body.peer_id))
                ]
              ])
              users.friendsAndFollowers.closePersons.receive.details.delete(objectFriendlyEmail(req.body.peer_id))
      
            
              try{
                users.save()
      
                status = 'success'
              } catch (err) {
                console.warn('accept request my id error ' + err)
                status = 'error'
              }
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("accept request my id err "+ error)  
          })
        }
      /* save in my send list */
  
  
      
      
      res.send( status )
    })


    router.put('/closePersonDeleteRequest', async(req, res)=>{    
      let status = null
  
      // object friendly email
        function objectFriendlyEmail(email_Id){
          const escapeAtTheRate = email_Id.replaceAll('@',"_")
          const escapedDot = escapeAtTheRate.replaceAll('.',"_")
          return escapedDot
        } 
      // object friendly email
    
    
      await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id
  
      }, 'friendsAndFollowers')
      .then(users => { 
          // Process the found users
  
          users.friendsAndFollowers.closePersons.familiar.list.splice( users.friendsAndFollowers.closePersons.familiar.list.indexOf( req.body.my_id ), 1)
          
          
          users.friendsAndFollowers.closePersons.familiar.details.delete(objectFriendlyEmail(req.body.my_id))
  
        
          try{
            users.save()
            
            deleteFromMyFamiliarList()
          } catch (err) {
            console.warn('delete request peer id error '+err)
            status = 'error'
          }
      })
      .catch(error => {
        // Handle any errors that occurred during the query
        status = 'error'    
        console.warn("delete request peer id error err "+ error)  
      })
  
  
      /* delete from my familiar list */
        async function deleteFromMyFamiliarList() {
          await require('../../moduls/mongoDB/profile_schema').findOne({ 
              'key.id' : req.body.my_id
      
          }, 'friendsAndFollowers')
          .then(users => { 
              // Process the found users
      
              
              users.friendsAndFollowers.closePersons.familiar.list.splice( users.friendsAndFollowers.closePersons.familiar.list.indexOf( req.body.peer_id ), 1)
          
              
              users.friendsAndFollowers.closePersons.familiar.details.delete(objectFriendlyEmail(req.body.peer_id))
      
            
              try{
                users.save()
      
                status = 'success'
              } catch (err) {
                console.warn('delete request my id error ' + err)
                status = 'error'
              }
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("delete request my id err "+ error)  
          })
        }
      /* delete from my familiar list */
  
  
      
      
      res.send( status )
    })


    router.put('/closePersonCancelRequest', async(req, res)=>{    
      let status = null
  
      // object friendly email
        function objectFriendlyEmail(email_Id){
          const escapeAtTheRate = email_Id.replaceAll('@',"_")
          const escapedDot = escapeAtTheRate.replaceAll('.',"_")
          return escapedDot
        } 
      // object friendly email
    
    
      await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id
  
      }, 'friendsAndFollowers')
      .then(users => { 
          // Process the found users
  
          users.friendsAndFollowers.closePersons.receive.list.splice( users.friendsAndFollowers.closePersons.receive.list.indexOf( req.body.my_id ), 1)
          
          
          users.friendsAndFollowers.closePersons.receive.details.delete(objectFriendlyEmail(req.body.my_id))
  
        
          try{
            users.save()
            
            deleteFromMySendList()
          } catch (err) {
            console.warn('withdraw request peer id error '+err)
            status = 'error'
          }
      })
      .catch(error => {
        // Handle any errors that occurred during the query
        status = 'error'    
        console.warn("withdraw request peer id error err "+ error)  
      })


  
  
      /* withdraw from my send list */
        async function deleteFromMySendList() {
          await require('../../moduls/mongoDB/profile_schema').findOne({ 
              'key.id' : req.body.my_id
      
          }, 'friendsAndFollowers')
          .then(users => { 
              // Process the found users
      
              
              users.friendsAndFollowers.closePersons.send.list.splice( users.friendsAndFollowers.closePersons.send.list.indexOf( req.body.peer_id ), 1)
          
              
              users.friendsAndFollowers.closePersons.send.details.delete(objectFriendlyEmail(req.body.peer_id))
      
            
              try{
                users.save()
      
                status = 'success'
              } catch (err) {
                console.warn('withdraw request my id error ' + err)
                status = 'error'
              }
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("withdraw request my id err "+ error)  
          })
        }
      /* withdraw from my send list */
  
  
      
      
      res.send( status )
    })



    router.put('/closePersonRejectRequest', async(req, res)=>{    
      let status = null
  
      // object friendly email
        function objectFriendlyEmail(email_Id){
          const escapeAtTheRate = email_Id.replaceAll('@',"_")
          const escapedDot = escapeAtTheRate.replaceAll('.',"_")
          return escapedDot
        } 
      // object friendly email
    
    
      await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id
  
      }, 'friendsAndFollowers')
      .then(users => { 
          // Process the found users
  
          users.friendsAndFollowers.closePersons.send.list.splice( users.friendsAndFollowers.closePersons.send.list.indexOf( req.body.my_id ), 1)
          
          
          users.friendsAndFollowers.closePersons.send.details.delete(objectFriendlyEmail(req.body.my_id))
  
        
          try{
            users.save()
            
            deleteFromMyReceiveList()
          } catch (err) {
            console.warn('cancel send request peer id error '+err)
            status = 'error'
          }
      })
      .catch(error => {
        // Handle any errors that occurred during the query
        status = 'error'    
        console.warn("cancel send request peer id error err "+ error)  
      })


  
  
      /* withdraw from my send list */
        async function deleteFromMyReceiveList() {
          await require('../../moduls/mongoDB/profile_schema').findOne({ 
              'key.id' : req.body.my_id
      
          }, 'friendsAndFollowers')
          .then(users => { 
              // Process the found users
      
              
              users.friendsAndFollowers.closePersons.receive.list.splice( users.friendsAndFollowers.closePersons.receive.list.indexOf( req.body.peer_id ), 1)
          
              
              users.friendsAndFollowers.closePersons.receive.details.delete(objectFriendlyEmail(req.body.peer_id))
      
            
              try{
                users.save()
      
                status = 'success'
              } catch (err) {
                console.warn('cancel receive request my id error ' + err)
                status = 'error'
              }
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("cancel receive request my id err "+ error)  
          })
        }
      /* withdraw from my send list */
  
  
      
      
      res.send( status )
    })
  /* close persons section */
/* friends and follower panel */










/* messenger */
  router.post('/getAmongMessengerFriends', async(req, res)=>{    
    let status = null


    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').find({ 
      'profileInfo.name.fullName' : { $regex: eval(`/${req.body.form_input}/i`) },
      'friendsAndFollowers.messengerFriend' : req.body.my_id
    }, 'profileInfo key')
    .then(users => {
      // Process the found users      
  
      if( users[0] != null){
        status = users  
      } else status = 'not friend'            
  
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
      console.warn('error in getting among messenger friends '+ error)
    });
  

    res.send( status )
  })

  router.put('/updateMessengerActivity', async(req, res)=>{
    let status = null


    // object friendly email
      function objectFriendlyEmail(email_Id){
        const escapeAtTheRate = email_Id.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        return escapedDot
      } 
    // object friendly email



    await require('../../moduls/mongoDB/messenger_schema').findOne({ 
      'membersList' : { $all: [req.body.peer_id, req.body.my_id]},
      'group' : false
    }, 'lastActivity')
    .then(async users => { 
      // Process the found users
     
      if( users != null){
          console.warn('room found')

          users.lastActivity.get(objectFriendlyEmail(req.body.my_id)).time = new Date()

          const key = `lastActivity.${objectFriendlyEmail(req.body.my_id)}`
          const value = users.lastActivity.get(objectFriendlyEmail(req.body.my_id))  // to save update need to reassign the whole object
          const dataObject = {}
          dataObject[key] = value

          await require('../../moduls/mongoDB/messenger_schema').findOneAndUpdate({ 
            '_id' : users.id
          }, dataObject)
          .then(()=>{
            status = 'success'
            console.log('message room activity successfully updated')
          })
          .catch((err)=>{
            status = 'error'
          
            console.warn('error in updating message room activity'+ err)
          })          
          
      } else {
        console.warn('no message room exists ')        
        status = 'error'
      }          
      
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("find message room err "+ error)  
    })


    res.send( status )
  })


  router.post('/getMessengerBackground', async(req, res)=>{ 

    let status = null
    
    const findMessengerBackground = await require('../../moduls/mongoDB/messenger_background_schema').findOne({ 
        
     }, 'dark-background')
    .then(users => {
      // Process the found users
      status = users['dark-background'][0]
      
      // console.warn('pic '+ users['light-background'] )
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
      console.warn('pic err '+ error)
    });


    

    
    
    res.send( status )
  })


  // in profile message box
  router.put('/sendPersonalSMS', async(req, res)=>{
    let status = null


    // object friendly email
      function objectFriendlyEmail(email_Id){
        const escapeAtTheRate = email_Id.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        return escapedDot
      } 
    // object friendly email

      

    await require('../../moduls/mongoDB/messenger_schema').findOne({ 
      'membersList' : { $all: [req.body.peer_id, req.body.my_id]},
      'group' : false
    }, ) // 'lastActivity sms' - get all fields
    .then(async users => { 
      // Process the found users
     
      if( users != null){          

          users.lastActivity.set( objectFriendlyEmail(req.body.my_id), {time: new Date(), new: false} )
          users.lastActivity.set( objectFriendlyEmail(req.body.peer_id), {time: new Date(), new: true} )

          users.sms.push( 
            { 
              messengerData: JSON.parse( req.body.textArray ),
              sendStatus: 'sending',
              send: {
                id: req.body.my_id,
                time: new Date()
              },
              seenBy: {
                [ objectFriendlyEmail(req.body.peer_id) ] : false
              }
            } 
          ) 
          



          try {                
      
            const objectId = await users.save()

            status = objectId
          
            console.warn('successfully saved sms ')
          
          } catch(err) {
      
            status = 'error'
          
            console.warn('saving in send sms'+ err)
          }
      } else {
        console.warn('sending sms error ')        
        status = 'error'
      }          
      
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("sending sms err "+ error)  
    })


    res.send( status )
  })
  // in profile message box

  
  router.put('/sendSMSMessengerRoom', async(req, res)=>{
    let status = null

    let upload_status = 'uploaded'
    if(req.body.has_MEDIA == true){ 
      upload_status = 'sending'
    }


    // reply of sms id
      const reply_To_sms = JSON.parse( req.body.reply_To_sms )

      let replyOfSMS_id = null

      if(reply_To_sms != null){ 
        replyOfSMS_id = reply_To_sms
      }
    // reply of sms id



    // object friendly email
      function objectFriendlyEmail(email_Id){
        const escapeAtTheRate = email_Id.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        return escapedDot
      } 
    // object friendly email

    
    
    await require('../../moduls/mongoDB/messenger_schema').findOne({ 
      '_id' : req.body.room_id,
    }, 'lastActivity sms group membersList meetingRoomUrl')
    .then(async users => { 
      // Process the found users
     
      if( users != null){          

          users.lastActivity.set( objectFriendlyEmail(req.body.my_id), {time: new Date(), new: false} )

          const seenByMap = new Map()

          for (let i = 0; i < users.membersList.length; i++) {
            if( users.membersList[i] != req.body.my_id ){
              users.lastActivity.set( objectFriendlyEmail( users.membersList[i] ), {time: new Date(), new: true} )

              seenByMap.set( objectFriendlyEmail( users.membersList[i] ), false)
            }            
          }
          

          users.sms.push( 
            { 
              messengerData: JSON.parse( req.body.DATA_array_JSON ),
              sendStatus: upload_status,
              send: {
                id: req.body.my_id,
                time: new Date()
              },
              seenBy: seenByMap,
              replyOf: replyOfSMS_id,
            } 
          ) 
          



          try {                
      
            const objectId = await users.save()
      
            status = objectId
          
            console.warn('successfully saved sms ')
          
          } catch(err) {
      
            status = 'error'
          
            console.warn('saving in send sms'+ err)
          }
      } else {
        console.warn('sending sms error ')        
        status = 'error'
      }          
      
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("sending sms err "+ error)  
    })


    res.send( status )
  })
  



  router.post('/getPersonalMessageUpdateProfile', async(req, res)=>{    
    let status = null


    // object friendly email
      function objectFriendlyEmail(email_Id){
        const escapeAtTheRate = email_Id.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        return escapedDot
      } 
    // object friendly email


      
    const key = `lastActivity.${objectFriendlyEmail(req.body.my_id)}.new`;
    const value = true;

    const query = {};
    query[key] = value;

    const findMessageUpdate = await require('../../moduls/mongoDB/messenger_schema').find(query, 'meetingRoomUrl')
    .then(users => {
      // Process the found users      
      
      if( users[0] != null){
        status = 'new sms'  
      } else status = 'no new sms'            
  
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
      console.warn('error in getting message update '+ error)
    });
  

    res.send( status )
  })


  // in profile message
  router.post('/getMessagesPersonal', async(req, res)=>{    
    let status = null


    // object friendly email
      function objectFriendlyEmail(email_Id){
        const escapeAtTheRate = email_Id.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        return escapedDot
      } 
    // object friendly email


      
    
    const query = {};
    query[`membersList`] = {$all: [req.body.my_id, req.body.peer_id] }; // contains my email and peer email only
    query['group'] = false;

    const findMessage = await require('../../moduls/mongoDB/messenger_schema').findOne(query, ) // 'sms' leaving empty will select all fields
    .then(users => {
      // Process the found users      
      
      if( users != null){
        if( users.sms.length > 0){
          status = users
        } else status = 'no sms'
          
      } else status = 'no sms'            
  
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
      console.warn('error in getting message '+ error)
    });
  

    res.send( status )
  })
  // in profile message


  router.post('/getMessages', async(req, res)=>{    
    let status = null


    // object friendly email
      function objectFriendlyEmail(email_Id){
        const escapeAtTheRate = email_Id.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        return escapedDot
      } 
    // object friendly email


      
    
    const query = {};
    query[`_id`] = req.body.room_id;

    const findMessage = await require('../../moduls/mongoDB/messenger_schema').findOne(query, 'sms')
    .then(users => {
      // Process the found users      
      
      if( users != null){
        if( users.sms.length > 0){
          status = users
        } else status = 'no sms'
          
      } else status = 'no sms'            
  
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
      console.warn('error in getting message '+ error)
    });
  

    res.send( status )
  })


  
  router.post('/getAllSMSamongMessengerFriends', async(req, res)=>{    
    let status = null
    let myMessengerFriendListArray = null


    // object friendly email
      function objectFriendlyEmail(email_Id){
        const escapeAtTheRate = email_Id.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        return escapedDot
      } 
    // object friendly email

    // get my messenger friend list
      const getMyMessengerFriendList = await require('../../moduls/mongoDB/profile_schema').findOne({
        'key.id' : req.body.my_id
      }, 'friendsAndFollowers')
      .then(users => {
        // Process the found users      
        
        if( users != null){
          myMessengerFriendListArray = users.friendsAndFollowers.messengerFriend 
        }             
    
      })
      .catch(error => {
        console.warn('error in getting my messenger friend list '+ error)
      })
    // get my messenger friend list

      
    
    

    const query = {};
    query[`membersList`] = req.body.my_id;

    const findMessageUpdate = await require('../../moduls/mongoDB/messenger_schema').find(query, '_id group groupProfile lastActivity membersList sms meetingRoomUrl')
    .then(users => {
      // Process the found users      
      
      if( users[0] != null){
        status = { 'messengerRoomContents': users, 'myMessengerFriendList': myMessengerFriendListArray }
      } else status = 'no sms'         
  
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
      console.warn('error in getting message update '+ error)
    });
  

    res.send( status )
  })


  /* get messenger room ref with selected id in profile.js */
  router.post('/getMessengerRoomIdWithSelectedPeer', async(req, res)=>{
    const { my_id, peer_id } = req.body
    
    let status = null

    await require('../../moduls/mongoDB/messenger_schema').findOne({ 
      'membersList': { $all: [  my_id, peer_id ] },
      'group': false      
    }, ) // 'lastActivity sms' leaving empty option will select all fields
    .then(async users => { //console.log('----------- --------- --------- ---------- --------- --------->>> '+ users)
      // Process the found users
      
      if( users != null){   
        status = users
      } else {
        console.warn('error in getting messenger room ref in profile personal ')        
        status = 'error'
      }          
      
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("err in getting messenger room ref in profile personal "+ error)  
    })


    res.send( status )
  })
  /* get messenger room ref with selected id in profile.js */


  /* share sms */
    router.post('/searchProfileToShareSMS', async(req, res)=>{
      const { my_id, field_val } = req.body

      let status = null

        let foundFriendId = []

        // get my messenger friend list
          const getMyMessengerFriendList = await require('../../moduls/mongoDB/profile_schema').findOne({
            'key.id' : my_id
          }, 'friendsAndFollowers')
          .then(async users => {
            // Process the found users      
            
            if( users != null){
              for (let i = 0; i < users.friendsAndFollowers.messengerFriend.length; i++) {
                
                const getMyMessengerFriendList = await require('../../moduls/mongoDB/profile_schema').findOne({
                  'key.id' : users.friendsAndFollowers.messengerFriend[i],
                  'profileInfo.name.fullName': { $regex: eval(`/${ field_val }/i`) }
                }, 'key')
                .then(users2 => {
                  if( users2 != null){                    
                    foundFriendId.push(users2.key.id)
                  }
                })
                .catch(error => {
                  console.warn('cant find friend with the name in share sms '+ error)
                })

              }
            }  else{ status = 'error'}           
        
          })
          .catch(error => {
            status = 'error'
            console.warn('error in getting my messenger friend list '+ error)
          })
        // get my messenger friend list



        let messengerRooms = []

        // messenger room reference
          await require('../../moduls/mongoDB/messenger_schema').find({ 
            'membersList': { $all: [  my_id ] },
            'groupProfile.name': { $regex: eval(`/${ field_val }/i`) },
            'group': true            
          }, ) // 'lastActivity sms' leaving empty option will select all fields
          .then(async users => { 
            // Process the found users
            
            if( users != null){   
              messengerRooms = users
            } else {
              console.warn('error in getting messenger room ref in share sms ')        
              status = 'error'
            }          
            
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("err in getting messenger room ref in share sms "+ error)  
          })
        // messenger room reference


      
      if(status != 'error'){
        status = {'foundFriendId': foundFriendId, 'messengerRooms': messengerRooms }
      }
      
      res.send( status )
    })


    router.post('/shareSMS', async(req, res)=>{
      const { my_id, sms_data, sms_id, share_members_list, rooms_list } = req.body

      const sms_DATA = JSON.parse( sms_data )  
      const sms_index = Number(sms_id)
      const members_2_share = JSON.parse( share_members_list )      


      // object friendly email
        function objectFriendlyEmail(email_Id){
          const escapeAtTheRate = email_Id.replaceAll('@',"_")
          const escapedDot = escapeAtTheRate.replaceAll('.',"_")
          return escapedDot
        } 
      // object friendly email


      let upload_status = 'uploaded'
      const extractSMS = sms_DATA.sms[sms_index].messengerData
      for(let i= 0; i< extractSMS.length; i++){
        if( extractSMS[i].media.image != null){
          upload_status = 'sending'
          break
        }
      }


      let status = null
      const messengerRoomRef = JSON.parse( rooms_list )



      for(let x=0; x < members_2_share.length; x++) {
        // get messenger room id
          await require('../../moduls/mongoDB/messenger_schema').findOne({ 
            'membersList': { $all: [  my_id, members_2_share[x] ] },
            'group': false
            
          }, ) // 'lastActivity sms' leaving empty option will select all fields
          .then(async users => { 
            // Process the found users
            
            if( users != null){   
              if( messengerRoomRef.includes( users._id ) == false){
                messengerRoomRef.push( users._id )
              }
            } else {
              console.warn('error in getting messenger room ref in share sms ')        
              status = 'error'
            }          
            
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("err in getting messenger room ref in share sms "+ error)  
          })
        // get messenger room id
      }


      const seen_BY = {}


      for(let x=0; x < messengerRoomRef.length; x++){
        await up2DB( messengerRoomRef[x] )
      }


      async function up2DB( ID ){
        await require('../../moduls/mongoDB/messenger_schema').findOne({ 
          '_id' : ID
        }, ) // 'lastActivity sms' - get all fields
        .then(async users => { 
          // Process the found users
         
          if( users != null){          
              /*
              users.lastActivity.set( objectFriendlyEmail(req.body.my_id), {time: new Date(), new: false} )
              users.lastActivity.set( objectFriendlyEmail(req.body.peer_id), {time: new Date(), new: true} )
              */

              users.lastActivity.forEach ( (value, key)=> {
                if(key ==  objectFriendlyEmail(req.body.my_id) ){
                  users.lastActivity.set( objectFriendlyEmail(req.body.my_id), {time: new Date(), new: false} )
                } else {
                  users.lastActivity.set( key, {time: new Date(), new: true} )
                }
              })

              
              for(let i=0; i< users.membersList.length; i++){
                if(users.membersList[i] != my_id){
                  seen_BY[ objectFriendlyEmail( users.membersList[i] ) ] = false
                }
              }

              
              users.sms.push( 
                { 
                  messengerData: extractSMS,
                  sendStatus: upload_status,
                  forwarded: true,
                  send: {
                    id: my_id,
                    time: new Date()
                  },
                  // seenBy: {
                  //   [ objectFriendlyEmail(req.body.peer_id) ] : false
                  // }
                  seenBy: seen_BY
                } 
              ) 
              
                  
              try {                
          
                const objectId = await users.save()
    
                status = objectId

                console.warn('successfully saved shared sms ')
              
              } catch(err) {          
                status = 'error'
              
                console.warn('saving in shared sms'+ err)
              }
              
          } else {
            console.warn('sharing sms error ')        
            status = 'error'
          }          
          
        })
        .catch(error => {
          // Handle any errors that occurred during the query
          status = 'error'    
          console.warn("sharing sms err "+ error)  
        })
      }

      
      res.send(status)
    })
  /* share sms */


  router.put('/makeUnseenSMSseen', async(req, res)=>{
    let status = null


    // object friendly email
      function objectFriendlyEmail(email_Id){
        const escapeAtTheRate = email_Id.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        return escapedDot
      } 
    // object friendly email

      

    await require('../../moduls/mongoDB/messenger_schema').findOne({ 
      '_id' : req.body.room_id
      
    }, 'lastActivity sms')
    .then(async users => { 
      // Process the found users
     
      if( users != null){   
        // set my lastactivity new to false
          users.lastActivity.get(objectFriendlyEmail(req.body.my_id)).new = false

          const key = `lastActivity.${objectFriendlyEmail(req.body.my_id)}`
          const value = users.lastActivity.get(objectFriendlyEmail(req.body.my_id))  // to save update need to reassign the whole object with updated value
          const dataObject = {}
          dataObject[key] = value

          await require('../../moduls/mongoDB/messenger_schema').findOneAndUpdate({ 
            '_id' : users.id
          }, dataObject)
          .then(()=>{
            console.log('last activity updated')
          })
          .catch((err)=>{
            console.log('can\'t update last activity ' + err)
          })
        // set my lastactivity new to false



          
          for (let i = 0; i < users.sms.length; i++) { 
            
            if( users.sms[i].send.id != req.body.my_id && users.sms[i].seenBy.get(objectFriendlyEmail(req.body.my_id)) == false && users.sms[i].sendStatus == 'uploaded' ) { console.log('worked ' + users.sms[i].seenBy.get(objectFriendlyEmail(req.body.my_id)) )
              users.sms[i].seenBy.set( objectFriendlyEmail(req.body.my_id), true)

                             

              const key = `sms.${i}`
              const value = users.sms[i] // to save update need to reassign the whole object
              const dataObject = {}
              dataObject[key] = value

              await require('../../moduls/mongoDB/messenger_schema').findOneAndUpdate({ 
                '_id' : users.id
              }, dataObject)
              .then(()=>{
                console.log('success to update sms seenBy loop')
              })
              .catch((err)=>{
                console.log(err)
              })
              
              
            } 



            if( i+1 == users.sms.length){
              status = 'success'
          
              console.warn('successfully updated seen sms ')
            }            
          }          
          
      } else {
        console.warn('err updated seen sms ')        
        status = 'error'
      }          
      
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("err updated seen sms "+ error)  
    })




    res.send( status )
  })

  /* delete sms */
  router.delete('/deleteSMS', async(req, res)=>{
    const { my_email_Id, messenger_room_id, sms_id, delete_from } = req.body

    let status = null


    // object friendly email
      function objectFriendlyEmail(email_Id){
        const escapeAtTheRate = email_Id.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        return escapedDot
      } 
    // object friendly email

      

    await require('../../moduls/mongoDB/messenger_schema').findOne({ 
      '_id' : messenger_room_id
      
    }, ) // 'sms' - blank will select all fields
    .then(async users => { 
      // Process the found users
     
      if( users != null){ 
        
        let updateData = users
                  
        for (let i = 0; i < updateData.sms.length; i++) { 
          if( updateData.sms[i]._id == sms_id){
            // console.log('--------- -------- ---------- '+ updateData.sms[i])
            if(delete_from == 'delete from everyone' ) { // console.log('=================  '+updateData.membersList)
              updateData.sms[i].messengerData = []

              updateData.sms[i].deletedBy = updateData.membersList
            } else if( delete_from == 'delete only from me' ){
              updateData.sms[i].deletedBy.push( my_email_Id )
            }
          }
          
                   
        }    
        
        await updateData.save()
        .then((data)=>{
          status = data
        
          //console.warn('successfully updated seen sms '+ data)
        })
        .catch((err)=>{
          status = 'error'
          console.warn('error in saving deleted sms fields ' + err)
        })
          
      } else {
        console.warn('error deleting sms in messenger panel ')        
        status = 'error'
      }          
      
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("err deleting sms in messenger panel "+ error)  
    })




    res.send( status )
  })
  /* delete sms */

  /* get updated sms in messenger */
  router.post('/getUpdateSMSinMessengerPanel', async(req, res)=>{
    let status = null

    const query = {};
    query[`_id`] = req.body.messenger_room_id;

    const findUpdatedMessage = await require('../../moduls/mongoDB/messenger_schema').findOne(query, ) // 'sms' putting empty will select all
    .then(users => {
      // Process the found users      
      
      if( users != null){        //console.log('>>>>>>>> >>>>>>>>>>> >>>>>>>>>>>> >>>>>>>>>>>>>>>>>') 
        status = users         
      } else status = 'error'            
  
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
      console.warn('error in getting updated message in messenger panel '+ error)
    });


    res.send( status )
  })
  /* get updated sms in messenger */


  /* in profile personal message box */
    router.put('/sendFirestoreImageUrlPersonalMessageBox', async(req, res)=>{
      let status = null

      const imgUrlArray = JSON.parse(req.body.imageUrl_Array)
      const customArray = []
      for (let i = 0; i < imgUrlArray.length; i++) {
        customArray.push(
          {
            'media.image': imgUrlArray[i]
          }
        )
      }

      const update = { 
        $push: { [`sms.${req.body.sms_id}.messengerData`] : { $each: customArray } },
        $set: { [`sms.${req.body.sms_id}.sendStatus`]: 'uploaded' }
      };


      await require('../../moduls/mongoDB/messenger_schema').findOneAndUpdate({ 
        '_id' : req.body.messageRoom_Id
        
      }, update)
      .then(()=>{
        status = 'success'
      })
      .catch((err)=>{
        console.log('error in uploding image link to db '+ err)
        status = 'error'
      })
      

      res.send( status )
    })
  /* in profile personal message box */
  /* in messenger */
  router.put('/sendFirestoreImageUrlMessenger', async(req, res)=>{
    let status = null

    const messageDataIndex = JSON.parse(req.body.messageDataIndex)
    const imgUrlArray = JSON.parse(req.body.imageUrl_Array)

        
    for (let i = 0; i < imgUrlArray.length; i++) {
      
      let update

      if(i+1 == imgUrlArray.length){
        update = { 
          $set: { 
            [`sms.${req.body.sms_id}.messengerData.${messageDataIndex[i]}.media.image`]: imgUrlArray[i],
            [`sms.${req.body.sms_id}.sendStatus`]: 'uploaded'
          }     
        };
      } else {
        update = { 
          $set: { 
            [`sms.${req.body.sms_id}.messengerData.${messageDataIndex[i]}.media.image`]: imgUrlArray[i]
          }        
        };
      }


      await require('../../moduls/mongoDB/messenger_schema').findOneAndUpdate({ 
        '_id' : req.body.messageRoom_Id
        
      }, update)
      .then(()=>{
        status = 'success'
      })
      .catch((err)=>{
        console.log('error in uploding image link ' + imgUrlArray[i] +' to db '+ err)
        status = 'error'
      })


      // end of loop
        if(i+1 == imgUrlArray.length){
          res.send( status )
        }
      // end of loop
    } 
    

  })
  /* in messenger */


  /* group */
    // create messenger group and meeting room
      router.put('/createGroupMessengerAndMeetingRoom', async (req, res)=>{
        let status = null
    
        // object friendly email
        function objectFriendlyEmail(email_Id){
          const escapeAtTheRate = email_Id.replaceAll('@',"_")
          const escapedDot = escapeAtTheRate.replaceAll('.',"_")
          return escapedDot
        } 
        // object friendly email
    
    
    
        // find out last meeting id
          await require('../../moduls/mongoDB/meetingRoom_schema').find({ 
                        
          }, 'credentials')
          .sort('-credentials.meetingId')
          .then(async data => {
              if( data[0] != null){
                createNewMeetingRoom( data[0].credentials.meetingId )
              } else createNewMeetingRoom( 0 )
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("find meeting id err "+ error)  
          })
        // find out last meeting id
    
    
    
        
        // create a new meeting room
          async function createNewMeetingRoom( meetingID ){
            let putInMeetingRoom = new require('../../moduls/mongoDB/meetingRoom_schema')({
              'perticipents.group' : [req.body.my_id],
              'credentials.meetingId' : meetingID + 1
            })
    
          
    
            try {                
    
              const objectId = await putInMeetingRoom.save()
    
              
          
              console.warn('meeting room successfully created ')
              addInMessengerRoom( objectId.credentials.meetingId )
          
            } catch(err) {
    
              status = 'error'
          
              console.warn('error in creating meeting room '+ err)
            }
          }
        // create a new meeting room
    
    
        // add in messenger room
        async function addInMessengerRoom( meetingRoomURL ){
          // create a new messenger room
            let putInMessengerRoom = new require('../../moduls/mongoDB/messenger_schema')({
              membersList: [req.body.my_id],
              meetingRoomUrl: meetingRoomURL,
              group: true,
              groupProfile: {
                name: req.body.group_name,
                admins: [req.body.my_id]
              },
              lastActivity: new Map([
                [
                  objectFriendlyEmail(req.body.my_id), null
                ]
              ])
            })
    
            
    
            try {                
    
              const objectId = await putInMessengerRoom.save()
    
              status = 'success'
            
              console.warn('message room successfully created ')
            
            } catch(err) {
    
              status = 'error'
            
              console.warn('error in creating message room '+ err)
            }
          // create a new messenger room
        }
        // add in messenger room
    
    
    
        res.send( status )
      })
    // create messenger group and meeting room

    // search to add in group
      router.post('/searchAmongFriendsToAddInGroup', async(req, res)=>{
        let status = null

          let foundFriendId = []

          // get my messenger friend list
            const getMyMessengerFriendList = await require('../../moduls/mongoDB/profile_schema').findOne({
              'key.id' : req.body.my_id
            }, 'friendsAndFollowers')
            .then(async users => {
              // Process the found users      
              
              if( users != null){
                for (let i = 0; i < users.friendsAndFollowers.messengerFriend.length; i++) {

                  const getMyMessengerFriendList = await require('../../moduls/mongoDB/profile_schema').findOne({
                    'key.id' : users.friendsAndFollowers.messengerFriend[i],
                    'profileInfo.name.fullName': { $regex: eval(`/${req.body.field_val}/i`) }
                  }, 'key')
                  .then(users2 => {
                    if( users2 != null){
                      // console.log("found "+users2.key.id)
                      foundFriendId.push(users2.key.id)
                    }
                  })
                  .catch(error => {
                    console.warn('cant find friend with the name in group member add form '+ error)
                  })


                  // loop end
                    if(i+1 == users.friendsAndFollowers.messengerFriend.length){
                      status = foundFriendId
                    }
                  // loop end
                }
              }  else{ status = 'error'}           
          
            })
            .catch(error => {
              status = 'error'
              console.warn('error in getting my messenger friend list '+ error)
            })
          // get my messenger friend list
        
        res.send( status )
      })
    // search to add in group

    // add member in group
      router.put('/addMessengerGroupMember', async(req, res)=>{
        let status = null
        
          const filter = { 
            _id: req.body.group_id
          };
          
          let update = {}
          
          
          await require('../../moduls/mongoDB/messenger_schema').findOne(filter, 'group lastActivity meetingRoomUrl membersList groupProfile sms')
          .then(async (doc1)=>{

            if(req.body.Admin == 'false' && doc1.membersList.includes( req.body.peer_id ) == false){
              update = { $push: { membersList: req.body.peer_id } }           
            } else if( req.body.Admin == 'true' && doc1.membersList.includes( req.body.peer_id ) == true ) {
              update = { 
                $push: { 'groupProfile.admins': req.body.peer_id }
                
              }              
            } else if(req.body.Admin == 'true' && doc1.membersList.includes( req.body.peer_id ) == false){
              update = { 
                $push: { membersList: req.body.peer_id, 'groupProfile.admins': req.body.peer_id }
                
              }
            }

            try {
              await require('../../moduls/mongoDB/messenger_schema').findOneAndUpdate(filter, update, { new: true })
              status = 'success'
            }
            catch (err){
              status = 'error'
            }
          })
          .catch((err)=>{
            status = 'error'
            console.log('error in finding messenger room with id '+ err)
          })

          

        res.send( status )
      })
    // add member in group

    // add admin in group
      router.put('/addMessengerGroupAdmin', async(req, res)=>{
        
      })
    // add admin in group

    // get messenger group updated data
      router.post('/getMessengerGroupMembersAndAdmins', async(req, res)=>{
        let status = null
            const getMessengerGroupMembersAndAdmins = await require('../../moduls/mongoDB/messenger_schema').findOne({
              '_id' : req.body.group_id
            }, 'membersList groupProfile')
            .then(async users => {
              status = users
            })
            .catch(error => {
              status = 'error'
              console.warn('error in getting messenger group memberslist and admins list '+ error)
            })
        res.send( status )
      })
    // get messenger group updated data

    // remove member from messenger group
      router.put('/removeMemberFromMessengerGroup', async(req, res)=>{
        let status = null

          const filter = { 
            _id: req.body.group_id
          };
          const update = { 
            $pull: { membersList: req.body.peer_id, 'groupProfile.admins': req.body.peer_id }, 
            
          };

          
          await require('../../moduls/mongoDB/messenger_schema').findOneAndUpdate(filter, update, { new: true })
          .then(async (doc)=>{       

            if( doc.groupProfile.admins.length == 0){ 
              
              // delete messenger room
                await require('../../moduls/mongoDB/messenger_schema').findOneAndDelete({
                  _id: req.body.group_id
                })
                .then(()=>{
                  status = 'success'
                })
                .catch((err)=>{
                  status = 'error'
                  console.log('error in deleting empty messenger room '+err)
                })
              // delete messenger room

              // delete meeting room
                await require('../../moduls/mongoDB/meetingRoom_schema').findOneAndDelete({
                  'credentials.meetingId': req.body.meetingRoom_id
                  
                })
                .then((doc)=>{
                  status = 'success'
                  
                })
                .catch((err)=>{
                  status = 'error'
                  console.log('error in deleting empty meeting room '+err)
                })
              // delete meeting room
              
            }

          })
          .catch((err)=>{
            status = 'error'
            console.log('messenger group member removing operation error '+err)
          })

            
          

        res.send( status )
      })
    // remove member from messenger group

    // remove admin from messenger group
      router.put('/removeAdminFromMessengerGroup', async(req, res)=>{
        let status = null

          const filter = { 
            _id: req.body.group_id
          };
          const update = { 
            $pull: { 'groupProfile.admins': req.body.peer_id }, 
            
          };

          
          await require('../../moduls/mongoDB/messenger_schema').findOneAndUpdate(filter, update, { new: true })
          .then(async (doc)=>{       

            status = 'success'

          })
          .catch((err)=>{
            status = 'error'
            console.log('messenger group member removing operation error '+err)
          })

            
          

        res.send( status )
      })
    // remove admin from messenger group
  /* group */
/* messenger */








/* find people */
  router.post('/findPeople', async(req, res)=>{
    let status = null
    const my_profileInfo = JSON.parse(req.body.my_profileInfo)
    const showingId = JSON.parse(req.body.showingId)
    const newIdToShow = []
    const queryOn = JSON.parse(req.body.queryOn)
    let filter = {'key.id': { $ne: req.body.myId } };
    
    async function loop(){

      const length = queryOn.length - 1
      const queryOnCategory = queryOn[Math.floor(Math.random() * length )]

      console.log(queryOnCategory)

      if( queryOnCategory == 'public' ){
        filter = {'key.id': { $ne: req.body.myId } }
      } 
      else if( queryOnCategory == 'birthPlace_postOffice' ){
        filter = {
          'profileInfo.birthPlace.postOffice' : my_profileInfo.birthPlace.postOffice,
          'key.id': { $ne: req.body.myId } 
        }
      } 
      else if( queryOnCategory == 'birthPlace_subDistrict'  ){
        filter = {
          'profileInfo.birthPlace.subDistrict' : my_profileInfo.birthPlace.subDistrict,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'birthPlace_village'  ){
        filter = {
          'profileInfo.birthPlace.village' : my_profileInfo.birthPlace.village,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'livingPlace_postOffice'  ){
        filter = {
          'profileInfo.livingPlace.postOffice' : my_profileInfo.livingPlace.postOffice,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'livingPlace_subDistrict'  ){
        filter = {
          'profileInfo.livingPlace.subDistrict' : my_profileInfo.livingPlace.subDistrict,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'livingPlace_village'  ){
        filter = {
          'profileInfo.livingPlace.village' : my_profileInfo.livingPlace.village,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'profession'  ){
        filter = {
          'profileInfo.profession' : my_profileInfo.profession,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'education_elementary'  ){
        filter = {
          'profileInfo.education.elementary.institution' : my_profileInfo.education.elementary.institution,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'education_secondary'  ){
        filter = {
          'profileInfo.education.secondary.institution' : my_profileInfo.education.secondary.institution,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'education_higherSecondary'  ){
        filter = {
          'profileInfo.education.higherSecondary.institution' : my_profileInfo.education.higherSecondary.institution,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'education_graduate'  ){
        filter = {
          'profileInfo.education.graduate.institution' : my_profileInfo.education.graduate.institution,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'education_postGraduate'  ){
        filter = {
          'profileInfo.education.postGraduate.institution' : my_profileInfo.education.postGraduate.institution,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'business_one'  ){
        filter = {
          'profileInfo.business.one.name' : my_profileInfo.business.one.name,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'business_two'  ){
        filter = {
          'profileInfo.business.two.name' : my_profileInfo.business.two.name,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'business_three'  ){
        filter = {
          'profileInfo.business.three.name' : my_profileInfo.business.three.name,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'company_one'  ){
        filter = {
          'profileInfo.company.one.organization' : my_profileInfo.company.one.organization,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'company_two'  ){
        filter = {
          'profileInfo.company.two.organization' : my_profileInfo.company.two.organization,
          'key.id': { $ne: req.body.myId } 
        }
      }
      else if( queryOnCategory == 'company_three'  ){
        filter = {
          'profileInfo.company.three.organization' : my_profileInfo.company.three.organization,
          'key.id': { $ne: req.body.myId } 
        }
      }



      
      
        await require('../../moduls/mongoDB/profile_schema').find(filter, 'profileInfo key friendsAndFollowers')
        .then(async (doc1)=>{     
          
          if(doc1.length > 0){
            for (let i = 0; i < doc1.length; i++) {
              
              if(showingId.includes( doc1[i].key.id ) == false){
                newIdToShow.push( doc1[i].key.id )
              }
              
              // end of loop
                if(i + 1 == doc1.length ){
                  status = { queryOn: JSON.stringify( queryOn ), newIdToShow: JSON.stringify( newIdToShow )}
                  returnResponse()
                }
              // end of loop
            }            
          } else {
            status = 'error' 
            queryOn.splice(queryOn.indexOf(queryOnCategory), 1) // exclude category
            console.log(queryOn)
            
            loop()                               
          }          

        })
        .catch((err)=>{
          status = 'error'
          console.log('Error in finding people '+err)
          returnResponse()
        })
      

    }
    loop() // deffault execute



        
    function returnResponse(){ 
      res.send( status )
    } 
    
  })
/* find people */









module.exports = router
