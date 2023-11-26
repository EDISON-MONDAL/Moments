const mongoose = require('mongoose')


const meetingsSchema = new mongoose.Schema(
    {   
        credentials: {
            meetingId: {type: Number, index: true, unique: true}
        },
        perticipents: {
            personal: [],
            group: [],
            public: []
        }
    },
    /*
    {
        timestamps: true
    }
    */
)

const meetingsDatabase = mongoose.createConnection('mongodb+srv://edison_mondal:admin@moments-database.b78ofus.mongodb.net/meetings?retryWrites=true&w=majority') // , {socketTimeoutMS: 0000}

module.exports = meetingsDatabase.model('all-rooms', meetingsSchema)