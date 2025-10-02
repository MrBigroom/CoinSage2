const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const protect = async(req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorised to access this route'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorised, user not found'
            });
        }
        req.user = user;
        next();
    } catch(error) {
        console.error('Auth middleware error: ', error);
        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired, please log in again'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Not authorised, token failed'
        });
    }
};

module.exports = { protect };