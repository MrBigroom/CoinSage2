const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password_hash: {
        type: String,
        required: true,
        minlength: 8,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password_hash')) return next();
    this.password_hash = await bcrypt.hash(this.password_hash, 12);
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model('Users', userSchema);