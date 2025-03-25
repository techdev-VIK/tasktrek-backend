const mongoose = require('mongoose');


const tasktrekUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const TaskTrek = mongoose.model('TaskTrek', tasktrekUserSchema);

module.exports = TaskTrek;