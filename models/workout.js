
const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    day: {
        type: Date,
        default: Date.now,
      },
    exercises: {
        type: Array,
    }  
})

       
module.exports = mongoose.model('Workout', workoutSchema)