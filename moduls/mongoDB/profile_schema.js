const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
    {   
        profileInfo:{
            autobiograph: { type: String, default: null },
            birthDate:{ type: Date, default: null },
            birthPlace: {
                country: { type: String, default: null },
                district: { type: String, default: null },
                postOffice: { type: String, default: null },
                subDistrict: { type: String, default: null },
                village: { type: String, default: null }
            },
            business: {
                one: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    name: { type: String, default: null },
                    to: { type: Date, default: null }
                },
                two: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    name: { type: String, default: null },
                    to: { type: Date, default: null }
                },
                three: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    name: { type: String, default: null },
                    to: { type: Date, default: null }
                }
            },
            company: {
                one: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    organization: { type: String, default: null },
                    to: { type: Date, default: null }
                },
                two: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    organization: { type: String, default: null },
                    to: { type: Date, default: null }
                },
                three: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    organization: { type: String, default: null },
                    to: { type: Date, default: null }
                }
            },
            education: {
                elementary: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    institution: { type: String, default: null },
                    to: { type: Date, default: null }
                },
                secondary: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    institution: { type: String, default: null },
                    to: { type: Date, default: null }
                },
                higherSecondary: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    institution: { type: String, default: null },
                    to: { type: Date, default: null }
                },
                graduate: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    institution: { type: String, default: null },
                    to: { type: Date, default: null }
                },
                postGraduate: {
                    from: { type: Date, default: null },
                    location: { type: String, default: null },
                    institution: { type: String, default: null },
                    to: { type: Date, default: null }
                },
            },
            email: {
                business: { type: String, default: null },
                personal: { type: String, default: null }
            },
            livingPlace: {
                country: { type: String, default: null },
                district: { type: String, default: null },
                postOffice: { type: String, default: null },
                subDistrict: { type: String, default: null },
                village: { type: String, default: null }
            },
            name: {
                firstName: { type: String, default: null },
                middleName: { type: String, default: null },
                lastName: { type: String, default: null },
                nickName: { type: String, default: null },
                fullName: { type: String, default: null }
            },
            passion: { type: String, default: null },
            phoneNumber: {
                home: { type: String, default: null },
                office: { type: String, default: null },
                personal: { type: String, default: null },
                personal_2: { type: String, default: null }
            },
            politics: { type: String, default: null },
            profession: { type: String, default: null },
            religion: { type: String, default: null },
            website: {
                one: {
                    url: { type: String, default: null },
                    title: { type: String, default: null }
                },
                two: {
                    url: { type: String, default: null },
                    title: { type: String, default: null }
                },
                three: {
                    url: { type: String, default: null },
                    title: { type: String, default: null }
                },
                four: {
                    url: { type: String, default: null },
                    title: { type: String, default: null }
                },
                five: {
                    url: { type: String, default: null },
                    title: { type: String, default: null }
                }
            },
            profilePics: {
              list: [                
                {                    
                    url: String,
                    time: { type: Date }
                }
              ],
              active: { type: String, default: null }
            }
        },
        key: {            
            id: { 
              type: String,
              index: true,
              unique: true
            },
            password: Number
        },
        friendsAndFollowers : {
            messengerFriend: [],
            friend : [],
            send : [],
            receive : [],
            follower : [],
            following : [],
            closePersons : {
                send : {
                    list: [],
                    details: Map
                },
                receive: {
                    list: [],
                    details: Map
                },
                familiar: {
                    list: [],
                    details: Map
                }
            }
        }
    },
    /*
    {
        timestamps: true
    }
    */
)

const mementsAllUsers = mongoose.createConnection('mongodb+srv://edison_mondal:admin@moments-database.b78ofus.mongodb.net/moments-all-users?retryWrites=true&w=majority')

module.exports = mementsAllUsers.model('profiles', profileSchema)