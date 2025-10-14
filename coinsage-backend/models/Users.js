const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [4, 'Username must be at least 4 characters'],
        maxlength: [30, 'Username must not exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password_hash: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(v);
            },
            message: 'Password must contain at least one uppercase letter, a lowercase letter, one number and one special character'
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

userSchema.pre('save', async function(next) {
    if(!this.isModified('password_hash')) return next();
    try {
        this.password_hash = await bcrypt.hash(this.password_hash, 12);
        next();
    } catch(error) {
        next(error);
    }
});

userSchema.methods.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
};

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password_hash;
    return user;
}

module.exports = mongoose.model('Users', userSchema);