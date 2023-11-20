const mongoose = require('mongoose')

const backgroundSchema = new mongoose.Schema(
    {   
        'light-background': {
            type: Array
        }
    },
    /*
    {
        timestamps: true
    }
    */
)

const mementsStorage = mongoose.createConnection('mongodb+srv://edison_mondal:admin@moments-database.b78ofus.mongodb.net/moments-storage?retryWrites=true&w=majority')

module.exports = mementsStorage.model('background-images', backgroundSchema)