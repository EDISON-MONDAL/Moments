const mongoose = require('mongoose')




const messengerSchema = new mongoose.Schema(
    {   
        group: {type: Boolean, default: false},
        lastActivity : Map,
        meetingRoomUrl: {type: Number, index: true, unique: true},
        membersList : [],
        groupProfile: {
            name: {type: String, default: 'Unnamed Group'},
            admins: []
        },
        sms: [
            {
                messengerData: [
                    {
                      text: {type: String, default: null},
                      bold: {type: Boolean, default: false},
                      italic: {type: Boolean, default: false},
                      fontFamily: {type: String, default: 'default'},
                      align: {type: String, default: 'default'},
                      link: {type: Boolean, default: false },
                      fontSize: {type: Number, default: 12 },
                      media: {
                        image: {type: String, default: null}
                      }
                    }
                ],                
                sendStatus: {type: String, default: null },
                forwarded: {type: Boolean, default: false },
                send: {
                    id: {type: String, default: null},
                    time: {type: Date, default: null}
                },
                seenBy: Map,
                deletedBy: [],
                replyOf: {type: String, default: null}
            }
        ]
    },
    /*
    {
        timestamps: true
    }
    */
)

const messengerDatabase = mongoose.createConnection('mongodb+srv://edison_mondal:admin@moments-database.b78ofus.mongodb.net/messenger?retryWrites=true&w=majority')

module.exports = messengerDatabase.model('all-messages', messengerSchema)