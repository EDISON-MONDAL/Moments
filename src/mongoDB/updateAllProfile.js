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




/* get profile data */
  router.post('/getProfile', async(req, res)=>{    
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
        autobiograph: users.profileInfo.autobiograph,
        livingPlace: {
            village: users.profileInfo.livingPlace.village,
            postOffice: users.profileInfo.livingPlace.postOffice,
            subDistrict: users.profileInfo.livingPlace.subDistrict,
            district: users.profileInfo.livingPlace.district,
            country: users.profileInfo.livingPlace.country,
        },
        birthPlace: {
            village: users.profileInfo.birthPlace.village,
            postOffice: users.profileInfo.birthPlace.postOffice,
            subDistrict: users.profileInfo.birthPlace.subDistrict,
            district: users.profileInfo.birthPlace.district,
            country: users.profileInfo.birthPlace.country,
        },
        birthDate: users.profileInfo.birthDate,
        phoneNumber: {
            personal: users.profileInfo.phoneNumber.personal,
            personal2: users.profileInfo.phoneNumber.personal_2,
            home: users.profileInfo.phoneNumber.home,
            office: users.profileInfo.phoneNumber.office,
        },
        email: {
            business: users.profileInfo.email.business,
            personal: users.profileInfo.email.personal,
        },
        website: {
            one: {
                title: users.profileInfo.website.one.title,
                url: users.profileInfo.website.one.url,
            },
            two: {
                title: users.profileInfo.website.two.title,
                url: users.profileInfo.website.two.url,
            },
            three: {
                title: users.profileInfo.website.three.title,
                url: users.profileInfo.website.three.url,
            },
            four: {
                title: users.profileInfo.website.four.title,
                url: users.profileInfo.website.four.url,
            },
            five: {
                title: users.profileInfo.website.five.title,
                url: users.profileInfo.website.five.url,
            },
        },
        profession: users.profileInfo.profession,
        education: {
            elementary: {
                institution: users.profileInfo.education.elementary.institution,
                from: users.profileInfo.education.elementary.from,
                to: users.profileInfo.education.elementary.to,
                location: users.profileInfo.education.elementary.location,
            },
            secondary: {
                institution: users.profileInfo.education.secondary.institution,
                from: users.profileInfo.education.secondary.from,
                to: users.profileInfo.education.secondary.to,
                location: users.profileInfo.education.secondary.location,
            },
            higherSecondary: {
                institution: users.profileInfo.education.higherSecondary.institution,
                from: users.profileInfo.education.higherSecondary.from,
                to: users.profileInfo.education.higherSecondary.to,
                location: users.profileInfo.education.higherSecondary.location,
            },
            graduate: {
                institution: users.profileInfo.education.graduate.institution,
                from: users.profileInfo.education.graduate.from,
                to: users.profileInfo.education.graduate.to,
                location: users.profileInfo.education.graduate.location,
            },
            postGraduate: {
                institution: users.profileInfo.education.postGraduate.institution,
                from: users.profileInfo.education.postGraduate.from,
                to: users.profileInfo.education.postGraduate.to,
                location: users.profileInfo.education.postGraduate.location,
            }
        },
        company: {
            one:{
                organization: users.profileInfo.company.one.organization,
                from: users.profileInfo.company.one.from,
                to: users.profileInfo.company.one.to,
                location: users.profileInfo.company.one.location,
            },
            two:{
                organization: users.profileInfo.company.two.organization,
                from: users.profileInfo.company.two.from,
                to: users.profileInfo.company.two.to,
                location: users.profileInfo.company.two.location,
            },
            three:{
                organization: users.profileInfo.company.three.organization,
                from: users.profileInfo.company.three.from,
                to: users.profileInfo.company.three.to,
                location: users.profileInfo.company.three.location,
            }
        },
        business: {
            one:{
                name: users.profileInfo.business.one.name,
                from: users.profileInfo.business.one.from,
                to: users.profileInfo.business.one.to,
                location: users.profileInfo.business.one.location,
            },
            two:{
                name: users.profileInfo.business.two.name,
                from: users.profileInfo.business.two.from,
                to: users.profileInfo.business.two.to,
                location: users.profileInfo.business.two.location,
            },
            three:{
                name: users.profileInfo.business.three.name,
                from: users.profileInfo.business.three.from,
                to: users.profileInfo.business.three.to,
                location: users.profileInfo.business.three.location,
            }
        },
        passion: users.profileInfo.passion,
        religion: users.profileInfo.religion,
        politics: users.profileInfo.politics,
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
/* get profile data */








/* post profile data */
  router.put('/postProfile', async(req, res)=>{    
    let status = null

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
       
    /*
    try {
        
        



        await require('../../moduls/mongoDB/profile_schema').findOneAndUpdate(
          { 
            key: {
              id: req.body.id
            }
          }, // criteria update)
          {
              profileInfo:{
                name: {
                  firstName: 'kkk',
                  middleName: req.body.middlename,
                lastName: req.body.lastname,
                nickName: req.body.nickname,
                fullName: req.body.firstname + ' ' + req.body.middlename + ' ' + req.body.lastname + ' ' + req.body.nickname
                }
              }
          } // update fields       
        )

          
                
                
        
    
        status = 'success'
        
        console.warn('success in update ')
    } catch(err) {
    
        status = err.message
        console.warn('err in update '+ err)

    }
    */
      
    
    
    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.id

    }, 'key profileInfo')
    .then(users => { 
        // Process the found users

        // name
          users.profileInfo.name.firstName = req.body.firstName
          users.profileInfo.name.middleName = req.body.middleName
          users.profileInfo.name.lastName = req.body.lastName
          users.profileInfo.name.nickName = req.body.nickName

          users.profileInfo.name.fullName = users.profileInfo.name.firstName + ' ' + users.profileInfo.name.middleName + ' ' + users.profileInfo.name.lastName + ' ' + users.profileInfo.name.nickName
        // name

        // autobiograph
          users.profileInfo.autobiograph = req.body.autobiograph
        // autobiograph
        
        // living place
          users.profileInfo.livingPlace.village = req.body.livingPlace_village
          users.profileInfo.livingPlace.postOffice = req.body.livingPlace_postOffice
          users.profileInfo.livingPlace.subDistrict = req.body.livingPlace_subDistrict
          users.profileInfo.livingPlace.district = req.body.livingPlace_district
          users.profileInfo.livingPlace.country = req.body.livingPlace_country
        // living place

        // birth place
          users.profileInfo.birthPlace.village = req.body.birthPlace_village
          users.profileInfo.birthPlace.postOffice = req.body.birthPlace_postOffice
          users.profileInfo.birthPlace.subDistrict = req.body.birthPlace_subDistrict
          users.profileInfo.birthPlace.district = req.body.birthPlace_district
          users.profileInfo.birthPlace.country = req.body.birthPlace_country
        // birth place

        // birth date
          users.profileInfo.birthDate = req.body.birthDate
        // birth date

        // phone number
          users.profileInfo.phoneNumber.personal = req.body.phoneNumber_personal
          users.profileInfo.phoneNumber.personal_2 = req.body.phoneNumber_personal2
          users.profileInfo.phoneNumber.home = req.body.phoneNumber_home
          users.profileInfo.phoneNumber.office = req.body.phoneNumber_office
        // phone number

        // email
          users.profileInfo.email.personal = req.body.email_personal
          users.profileInfo.email.business = req.body.email_business
        // email

        // website
          users.profileInfo.website.one.title = req.body.website_one_title
          users.profileInfo.website.one.url = req.body.website_one_url

          users.profileInfo.website.two.title = req.body.website_two_title
          users.profileInfo.website.two.url = req.body.website_two_url

          users.profileInfo.website.three.title = req.body.website_three_title
          users.profileInfo.website.three.url = req.body.website_three_url

          users.profileInfo.website.four.title = req.body.website_four_title
          users.profileInfo.website.four.url = req.body.website_four_url

          users.profileInfo.website.five.title = req.body.website_five_title
          users.profileInfo.website.five.url = req.body.website_five_url
        // website

        // profession
          users.profileInfo.profession = req.body.profession
        // profession

        // education
           // post graduate
            users.profileInfo.education.postGraduate.institution = req.body.education_postGraduate_institution
            users.profileInfo.education.postGraduate.from = req.body.education_postGraduate_from
            users.profileInfo.education.postGraduate.to = req.body.education_postGraduate_to
            users.profileInfo.education.postGraduate.location = req.body.education_postGraduate_location
          // post graduate
          // graduate
            users.profileInfo.education.graduate.institution = req.body.education_graduate_institution
            users.profileInfo.education.graduate.from = req.body.education_graduate_from
            users.profileInfo.education.graduate.to = req.body.education_graduate_to
            users.profileInfo.education.graduate.location = req.body.education_graduate_location
          // graduate
          // higher secondary
            users.profileInfo.education.higherSecondary.institution = req.body.education_higherSecondary_institution
            users.profileInfo.education.higherSecondary.from = req.body.education_higherSecondary_from
            users.profileInfo.education.higherSecondary.to = req.body.education_higherSecondary_to
            users.profileInfo.education.higherSecondary.location = req.body.education_higherSecondary_location
          // higher secondary
          // secondary
            users.profileInfo.education.secondary.institution = req.body.education_secondary_institution
            users.profileInfo.education.secondary.from = req.body.education_secondary_from
            users.profileInfo.education.secondary.to = req.body.education_secondary_to
            users.profileInfo.education.secondary.location = req.body.education_secondary_location
          // secondary
          // elementary
            users.profileInfo.education.elementary.institution = req.body.education_elementary_institution
            users.profileInfo.education.elementary.from = req.body.education_elementary_from
            users.profileInfo.education.elementary.to = req.body.education_elementary_to
            users.profileInfo.education.elementary.location = req.body.education_elementary_location
          // elementary
        // education
      
        // company
          // one
            users.profileInfo.company.one.organization = req.body.company_one_organization
            users.profileInfo.company.one.from = req.body.company_one_from
            users.profileInfo.company.one.to = req.body.company_one_to
            users.profileInfo.company.one.location = req.body.company_one_location
          // one
          // two
            users.profileInfo.company.two.organization = req.body.company_two_organization
            users.profileInfo.company.two.from = req.body.company_two_from
            users.profileInfo.company.two.to = req.body.company_two_to
            users.profileInfo.company.two.location = req.body.company_two_location
          // two
          // three
            users.profileInfo.company.three.organization = req.body.company_three_organization
            users.profileInfo.company.three.from = req.body.company_three_from
            users.profileInfo.company.three.to = req.body.company_three_to
            users.profileInfo.company.three.location = req.body.company_three_location
          // three
        // company

        // business
          // one
            users.profileInfo.business.one.name = req.body.business_one_name
            users.profileInfo.business.one.from = req.body.business_one_from
            users.profileInfo.business.one.to = req.body.business_one_to
            users.profileInfo.business.one.location = req.body.business_one_location
          // one
          // two
            users.profileInfo.business.two.name = req.body.business_two_name
            users.profileInfo.business.two.from = req.body.business_two_from
            users.profileInfo.business.two.to = req.body.business_two_to
            users.profileInfo.business.two.location = req.body.business_two_location
          // two
          // three
            users.profileInfo.business.three.name = req.body.business_three_name
            users.profileInfo.business.three.from = req.body.business_three_from
            users.profileInfo.business.three.to = req.body.business_three_to
            users.profileInfo.business.three.location = req.body.business_three_location
          // three
        // business

        // passion
          users.profileInfo.passion = req.body.passion
        // passion

        // religion
          users.profileInfo.religion = req.body.religion
        // religion

        // politics
          users.profileInfo.politics = req.body.politics
        // politics


        

      
        try{
          users.save()

          status = 'success'
        } catch (err) {
          console.warn('putting error '+err)
          status = 'error'
        }
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("find err "+ error)  
    })


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
/* post profile data */




/* profile image */

  router.put('/postProfilePic', async(req, res)=>{
    let status = null

    await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.id

    }, 'profileInfo')
    .then(users => {
        //users.profileInfo.
        
        //console.warn(req.body.title)

        users.profileInfo.profilePics.list.push({ url: req.body.title, time: new Date })
        users.profileInfo.profilePics.active = req.body.title

        try{
            users.save()
  
            status = 'success'
        } catch (err) {
            console.warn('putting error '+err)
            status = 'error'
        }
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'    
      console.warn("find err profile pic "+ error)  
    })

    res.send(status)
  })



  router.post('/getProfilePic', async(req, res)=>{    
    let status = null

    const findAccountInMongoDB = await require('../../moduls/mongoDB/profile_schema').findOne({ 
        'key.id' : req.body.id

    }, 'profileInfo')
    .then(users => {
      // Process the found users
      
      status = users.profileInfo.profilePics.active 
    })
    .catch(error => {
      // Handle any errors that occurred during the query
      status = 'error'      
    })


    res.send( status )
  }) 
  
/* profile image */







module.exports = router
