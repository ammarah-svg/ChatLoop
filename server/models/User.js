const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
       
    },
    
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Password must be at least 8 characters long'],
       
    }, 
  
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);