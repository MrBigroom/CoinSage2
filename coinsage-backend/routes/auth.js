const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { protect } = require('../middlewares/auth');
const { validateRegistration, validateLogin } = require('../middlewares/validation');

const router = express.Router();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password_hash = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        data: { user }
    });
};

router.post('/register', validateRegistration, async(req, res) => {
    try {
        const { username, email, password } = req.body;

        const exsitingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if(exsitingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }

        const newUser = await User.create({
            username,
            email,
            password_hash: password, 
        });

        createSendToken(newUser, 201, res);
    } catch(error) {
        console.error('Registration error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

router.post('/login', validateLogin, async(req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide correct username and password'
            });
        }

        const user = await User.findOne({ username }).select('+password_hash');

        if(!user || !(await user.correctPassword(password, user.password_hash))) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password'
            });
        }

        createSendToken(user, 200, res);
    } catch(error) {
        console.error('Login error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

router.get('./me', protect, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch(error) {
        console.error('Error getting user: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.put('./updatepassword', protect, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password_hash');
        if(!(await user.correctPassword(req.body.currentPassword, user.password_hash))) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        user.password_hash = req.body.newPassword;
        await user.save();

        createSendToken(user, 200, res);
    } catch(error) {
        console.error('Error updating password: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;