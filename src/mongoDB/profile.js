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
      status = {
        key: {
            id: users.key.id,
            password: users.key.password
        },
        name : {
            fullName: users.profileInfo.name.fullName,
            firstName: users.profileInfo.name.firstName,
            middleName: users.profileInfo.name.middleName,
            lastName: users.profileInfo.name.lastName,
            nickName: users.profileInfo.name.nickName,
        },
        profilePic : users.profileInfo.profilePics.active,
        autobiograph : users.profileInfo.autobiograph,
        livingPlace : {
            country: users.profileInfo.livingPlace.country,
            district: users.profileInfo.livingPlace.district,
            postOffice: users.profileInfo.livingPlace.postOffice,
            subDistrict: users.profileInfo.livingPlace.subDistrict,
            village: users.profileInfo.livingPlace.village,
        },
        birthPlace : {
            country: users.profileInfo.birthPlace.country,
            district: users.profileInfo.birthPlace.district,
            postOffice: users.profileInfo.birthPlace.postOffice,
            subDistrict: users.profileInfo.birthPlace.subDistrict,
            village: users.profileInfo.birthPlace.village,
        },
        birthDate: users.profileInfo.birthDate,
        phoneNumber : {
            home : users.profileInfo.phoneNumber.home,
            office : users.profileInfo.phoneNumber.office,
            personal : users.profileInfo.phoneNumber.personal,
            personal2 : users.profileInfo.phoneNumber.personal_2,
        },
        email : {
            business : users.profileInfo.email.business,
            personal : users.profileInfo.email.personal,
        },
        website : {
            one : {
                url: users.profileInfo.website.one.url,
                title : users.profileInfo.website.one.title,
            },
            two : {
                url: users.profileInfo.website.two.url,
                title : users.profileInfo.website.two.title,
            },
            three : {
                url: users.profileInfo.website.three.url,
                title : users.profileInfo.website.three.title,
            },
            four : {
                url: users.profileInfo.website.four.url,
                title : users.profileInfo.website.four.title,
            },
            five : {
                url: users.profileInfo.website.five.url,
                title : users.profileInfo.website.five.title,
            }
        },
        profession: users.profileInfo.profession,
        education: {
            elementary: {
                from: users.profileInfo.education.elementary.from,
                location: users.profileInfo.education.elementary.location,
                institution: users.profileInfo.education.elementary.institution,
                to: users.profileInfo.education.elementary.to
            },
            secondary: {
                from: users.profileInfo.education.secondary.from,
                location: users.profileInfo.education.secondary.location,
                institution: users.profileInfo.education.secondary.institution,
                to: users.profileInfo.education.secondary.to
            },
            higherSecondary: {
                from: users.profileInfo.education.higherSecondary.from,
                location: users.profileInfo.education.higherSecondary.location,
                institution: users.profileInfo.education.higherSecondary.institution,
                to: users.profileInfo.education.higherSecondary.to
            },
            graduate: {
                from: users.profileInfo.education.graduate.from,
                location: users.profileInfo.education.graduate.location,
                institution: users.profileInfo.education.graduate.institution,
                to: users.profileInfo.education.graduate.to
            },
            postGraduate: {
                from: users.profileInfo.education.postGraduate.from,
                location: users.profileInfo.education.postGraduate.location,
                institution: users.profileInfo.education.postGraduate.institution,
                to: users.profileInfo.education.postGraduate.to
            }
        },
        company : {
            one : {
                from: users.profileInfo.company.one.from,
                location: users.profileInfo.company.one.location,
                organization: users.profileInfo.company.one.organization,
                to: users.profileInfo.company.one.to,
            },
            two : {
                from: users.profileInfo.company.two.from,
                location: users.profileInfo.company.two.location,
                organization: users.profileInfo.company.two.organization,
                to: users.profileInfo.company.two.to,
            },
            three : {
                from: users.profileInfo.company.three.from,
                location: users.profileInfo.company.three.location,
                organization: users.profileInfo.company.three.organization,
                to: users.profileInfo.company.three.to,
            }
        },
        business : {
            one : {
                from: users.profileInfo.company.one.from,
                location: users.profileInfo.company.one.location,
                name: users.profileInfo.company.one.name,
                to: users.profileInfo.company.one.to,
            },
            two : {
                from: users.profileInfo.company.two.from,
                location: users.profileInfo.company.two.location,
                name: users.profileInfo.company.two.name,
                to: users.profileInfo.company.two.to,
            },
            three : {
                from: users.profileInfo.company.three.from,
                location: users.profileInfo.company.three.location,
                name: users.profileInfo.company.three.name,
                to: users.profileInfo.company.three.to,
            }
        },
        passion : users.profileInfo.passion,
        religion: users.profileInfo.religion,
        politics : users.profileInfo.politics,
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





/* check you
 ** sent request
 ** receive request
 ** friends
 */
router.post('/requestStatus', async(req, res)=>{    
    let status = null

        
    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.my_id,
        // 'friendsAndFollowers.send' : { $in: [req.body.peer_id]}
    }, 'friendsAndFollowers')
    .then(users => { 
        // Process the found users
        
        
        if(users.friendsAndFollowers.send.includes( req.body.peer_id ) == true ){
            status = 'sent request'
        } else if(users.friendsAndFollowers.receive.includes( req.body.peer_id ) == true){
            status = 'receive request'
        } else if (users.friendsAndFollowers.friend.includes( req.body.peer_id ) == true){
            status = 'friend'
        } else {
            status = 'no relation'
        }
        

    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("Err in checking request status ! "+ error)  
    })


    
    res.send( status )
})
/* check you
 ** sent request
 ** receive request
 ** friends
 */



/* check you
 ** following
 */
router.post('/followStatus', async(req, res)=>{    
    let status = null

        
    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.my_id,
        // 'friendsAndFollowers.send' : { $in: [req.body.peer_id]}
    }, 'friendsAndFollowers')
    .then(users => { 
        // Process the found users
        
        
        if(users.friendsAndFollowers.following.includes( req.body.peer_id ) == true ){
            status = 'following'
        } else {
            status = 'not following'
        }
        

    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("Err in checking request status ! "+ error)  
    })


    
    res.send( status )
})
/* check you
 ** following
 */




/* send friend request */
router.put('/sendFreindRequest', async(req, res)=>{    
    let status = null

        
    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id

    }, 'friendsAndFollowers')
    .then(users => { 
        // Process the found users

        users.friendsAndFollowers.receive.push(req.body.my_id)
        if( users.friendsAndFollowers.follower.includes(req.body.my_id) == false){
          users.friendsAndFollowers.follower.push(req.body.my_id)
        }

      
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
    
            users.friendsAndFollowers.send.push(req.body.peer_id)
            if( users.friendsAndFollowers.following.includes(req.body.peer_id) == false){
              users.friendsAndFollowers.following.push(req.body.peer_id)
            }
    
          
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
/* send friend request */




/* cancel friend request */
router.put('/cancelFreindRequest', async(req, res)=>{    
    let status = null

        
    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id

    }, 'friendsAndFollowers')
    .then(users => { 
        // Process the found users

        users.friendsAndFollowers.receive.splice( users.friendsAndFollowers.receive.indexOf( req.body.my_id ), 1)
        users.friendsAndFollowers.follower.splice( users.friendsAndFollowers.follower.indexOf( req.body.my_id ), 1)
        

      
        try{
          users.save()

          cancelFromMySendList()
        } catch (err) {
          console.warn('delete send request peer id error '+err)
          status = 'error'
        }
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("delete send request peer id err "+ error)  
    })


    /* save in my send list */
      async function cancelFromMySendList() {
        await require('../../moduls/mongoDB/profile_schema').findOne({ 
            'key.id' : req.body.my_id
    
        }, 'friendsAndFollowers')
        .then(users => { 
            // Process the found users
    
            
            users.friendsAndFollowers.send.splice( users.friendsAndFollowers.send.indexOf( req.body.peer_id ), 1)
            users.friendsAndFollowers.following.splice( users.friendsAndFollowers.following.indexOf( req.body.peer_id ), 1)
    
          
            try{
              users.save()
    
              status = 'success'
            } catch (err) {
              console.warn('delete send request my id error ' + err)
              status = 'error'
            }
        })
        .catch(error => {
          // Handle any errors that occurred during the query
          status = 'error'    
          console.warn("delete send request my id err "+ error)  
        })
      }
    /* save in my send list */


    
    
    res.send( status )
}) 
/* cancel friend request */




/* accept friend request */
router.put('/acceptFreindRequest', async(req, res)=>{    
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

        users.friendsAndFollowers.send.splice( users.friendsAndFollowers.send.indexOf( req.body.my_id ), 1)
        users.friendsAndFollowers.friend.push(req.body.my_id)
        if( users.friendsAndFollowers.messengerFriend.includes(req.body.my_id) == false ){
          users.friendsAndFollowers.messengerFriend.push(req.body.my_id)
        }
        if( users.friendsAndFollowers.follower.includes(req.body.my_id) == false ){
          users.friendsAndFollowers.follower.push(req.body.my_id)
        }

      
        try{
          users.save()

          acceptFriendRequest()
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


    /* save in my friend list */
      async function acceptFriendRequest() {
        await require('../../moduls/mongoDB/profile_schema').findOne({ 
            'key.id' : req.body.my_id
    
        }, 'friendsAndFollowers')
        .then(users => { 
            // Process the found users
    
            users.friendsAndFollowers.receive.splice( users.friendsAndFollowers.receive.indexOf( req.body.peer_id ), 1)
            users.friendsAndFollowers.friend.push(req.body.peer_id)
            if( users.friendsAndFollowers.messengerFriend.includes(req.body.peer_id) == false ){
              users.friendsAndFollowers.messengerFriend.push(req.body.peer_id)
            }
            if( users.friendsAndFollowers.following.push(req.body.peer_id) == false ){
              users.friendsAndFollowers.following.push(req.body.peer_id)
            }
    
          
            try{
              users.save()
    
              
              addMessengerAndMeetingRoom()
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
    /* save in my friend list */

    
    
    async function addMessengerAndMeetingRoom(){

        // add in meeting room
          await require('../../moduls/mongoDB/meetingRoom_schema').findOne({ 
            'perticipents.personal' : { $all: [req.body.peer_id, req.body.my_id]},
          }, 'credentials')
          .maxTimeMS(600000) // 6,00,000 10 minutes
          .then(async users => { 
            // Process the found users
    
           
            if( users != null){
                
                console.warn('meeting room found')

                addInMessengerRoom( users.credentials.meetingId )
            } else {
              console.warn('no meeting room exists ')



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
                    'perticipents.personal' : [req.body.peer_id, req.body.my_id],
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
              
            }          
            
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("find meeting room err "+ error)  
          })
        // add in meeting room





        // add in messenger room
        async function addInMessengerRoom( meetingRoomURL ){
          await require('../../moduls/mongoDB/messenger_schema').findOne({ 
            'membersList' : { $all: [req.body.peer_id, req.body.my_id]},
            'group' : false
          }, 'membersList')
          .then(async users => { 
            // Process the found users
    
           
            if( users != null){
                status = 'success'
                console.warn('room found')
            } else {
              console.warn('no message room exists ')
              
              // create a new messenger room
                let putInMessengerRoom = new require('../../moduls/mongoDB/messenger_schema')({
                    membersList: [req.body.peer_id, req.body.my_id],
                    meetingRoomUrl: meetingRoomURL,
                    lastActivity: new Map([
                      [
                        objectFriendlyEmail(req.body.my_id), null
                      ],
                      [
                        objectFriendlyEmail(req.body.peer_id), null
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
            
          })
          .catch(error => {
            // Handle any errors that occurred during the query
            status = 'error'    
            console.warn("find message room err "+ error)  
          })
        }
        // add in messenger room
    }
    
    
    
    res.send( status )
}) 
/* accept friend request */



/* reject friend request */
router.put('/rejectFreindRequest', async(req, res)=>{    
    let status = null

        
    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id

    }, 'friendsAndFollowers')
    .then(users => { 
        // Process the found users

        users.friendsAndFollowers.send.splice( users.friendsAndFollowers.send.indexOf( req.body.my_id ), 1)
        

      
        try{
          users.save()

          cancelFromMyReceiveList()
        } catch (err) {
          console.warn('delete send request peer id error '+err)
          status = 'error'
        }
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("delete send request peer id err "+ error)  
    })



    /* delete receive request from my id */
      async function cancelFromMyReceiveList() {
        await require('../../moduls/mongoDB/profile_schema').findOne({ 
            'key.id' : req.body.my_id
    
        }, 'friendsAndFollowers')
        .then(users => { 
            // Process the found users
    
            
            users.friendsAndFollowers.receive.splice( users.friendsAndFollowers.receive.indexOf( req.body.peer_id ), 1)
    
          
            try{
              users.save()
    
              status = 'success'
            } catch (err) {
              console.warn('delete receive request my id error ' + err)
              status = 'error'
            }
        })
        .catch(error => {
          // Handle any errors that occurred during the query
          status = 'error'    
          console.warn("delete receive request my id err "+ error)  
        })
      }
    /* delete receive request from my id */


    
    
    res.send( status )
})
/* reject friend request */





/* unfriend */
router.put('/unfriend', async(req, res)=>{    
    let status = null

        
    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id

    }, 'friendsAndFollowers')
    .then(users => { 
        // Process the found users

        users.friendsAndFollowers.friend.splice( users.friendsAndFollowers.friend.indexOf( req.body.my_id ), 1)
        users.friendsAndFollowers.follower.splice( users.friendsAndFollowers.follower.indexOf( req.body.my_id ), 1)
        

      
        try{
          users.save()

          unfriendFromMyid()
        } catch (err) {
          console.warn('unfriend from peer id error '+err)
          status = 'error'
        }
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("unfriend from peer id err "+ error)  
    })



    /* unfriend from my id */
      async function unfriendFromMyid() {
        await require('../../moduls/mongoDB/profile_schema').findOne({ 
            'key.id' : req.body.my_id
    
        }, 'friendsAndFollowers')
        .then(users => { 
            // Process the found users
    
            
            users.friendsAndFollowers.friend.splice( users.friendsAndFollowers.friend.indexOf( req.body.peer_id ), 1)
            users.friendsAndFollowers.following.splice( users.friendsAndFollowers.following.indexOf( req.body.peer_id ), 1)
    
          
            try{
              users.save()
    
              status = 'success'
            } catch (err) {
              console.warn('unfriend from my id error ' + err)
              status = 'error'
            }
        })
        .catch(error => {
          // Handle any errors that occurred during the query
          status = 'error'    
          console.warn("unfriend from my id err "+ error)  
        })
      }
    /* unfriend from my id */


    
    
    res.send( status )
})
/* unfriend */



/* follow */
router.put('/follow', async(req, res)=>{    
    let status = null

        
    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id

    }, 'friendsAndFollowers')
    .then(users => { 
        // Process the found users

        users.friendsAndFollowers.follower.push(req.body.my_id)
        

      
        try{
          users.save()

          setFollowerInMyid()
        } catch (err) {
          console.warn('follower of peer id error '+err)
          status = 'error'
        }
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("follower of peer id err "+ error)  
    })
    



    /* set following my id */
      async function setFollowerInMyid() {
        await require('../../moduls/mongoDB/profile_schema').findOne({ 
            'key.id' : req.body.my_id
    
        }, 'friendsAndFollowers')
        .then(users => { 
            // Process the found users
    
            
            users.friendsAndFollowers.following.push(req.body.peer_id)
    
          
            try{
              users.save()
    
              status = 'success'
            } catch (err) {
              console.warn('following in my id error ' + err)
              status = 'error'
            }
        })
        .catch(error => {
          // Handle any errors that occurred during the query
          status = 'error'    
          console.warn("following in my id err "+ error)  
        })
      }
    /* set following my id */


    
    
    res.send( status )
})
/* follow */


/* unfollow */
router.put('/unfollow', async(req, res)=>{    
    let status = null

        
    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.peer_id

    }, 'friendsAndFollowers')
    .then(users => { 
        // Process the found users

        users.friendsAndFollowers.follower.splice( users.friendsAndFollowers.follower.indexOf( req.body.my_id ), 1)

      
        try{
          users.save()

          setUnfollowerInMyid()
        } catch (err) {
          console.warn('unfollower of peer id error '+err)
          status = 'error'
        }
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("unfollower of peer id err "+ error)  
    })




    /* set unfollow my id */
      async function setUnfollowerInMyid() {
        await require('../../moduls/mongoDB/profile_schema').findOne({ 
            'key.id' : req.body.my_id
    
        }, 'friendsAndFollowers')
        .then(users => { 
            // Process the found users
    
            
            users.friendsAndFollowers.following.splice( users.friendsAndFollowers.following.indexOf( req.body.peer_id ), 1)
    
          
            try{
              users.save()
              status = 'success'
            } catch (err) {
              console.warn('unfollowing in my id error ' + err)
              status = 'error'
            }
        })
        .catch(error => {
          // Handle any errors that occurred during the query
          status = 'error'    
          console.warn("unfollowing in my id err "+ error)  
        })
      }
    /* set unfollow my id */


    
    
    res.send( status )
})
/* unfollow */





module.exports = router
