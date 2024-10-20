const mongoose = require('mongoose');

// Define the message schema
const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required'],
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required'],
    },
    text: {
        type: String,
        required: [true, 'Message text is required'],
    },
    file: {
        type: String,
        default: null,  // File is optional, so default is null
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Export the Message model
module.exports = mongoose.model('Message', messageSchema);
