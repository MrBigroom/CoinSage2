const { body, validationResult } = require('express-validator');
const Users = require('../models/Users');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

const validateRegistration = [
    body('username')
        .isLength({ min: 4, max: 30 })
        .withMessage('Username must be between 4 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers and underscores (no spacing within username)')
        .custom(async(value) => {
            const user = await Users.findOne({ username: value });
            if(user) {
                throw new Error('Username is already taken');
            }
            return true;
        }),

    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail()
        .custom(async(value) => {
            const user = await Users.findOne({ email: value });
            if(user) {
                throw new Error('Email is already taken');
            }
            return true;
        }),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .withMessage('Password must contain one uppercase letter, one lowercase letter, one number and one special character'),
    
    handleValidationErrors
];

const validateLogin = [
    body('username')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Please enter your registered username'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

module.exports = { validateRegistration, validateLogin, handleValidationErrors }