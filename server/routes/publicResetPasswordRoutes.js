const express = require('express');
const publicResetPasswordRoutes = express.Router();
const requestPasswordResetController = require('../controllers/requestPasswordResetController');
const resetPasswordController = require('../controllers/resetPasswordController');

publicResetPasswordRoutes.post('/reset', function(req, res) {
    return resetPasswordController.updatePassword(req, res);
});

publicResetPasswordRoutes.post('/user', function(req, res) {
    return requestPasswordResetController.requestPasswordReset(req, res);
});

publicResetPasswordRoutes.post('/getUser', function(req, res) {
    return requestPasswordResetController.getUser(req, res);
});

module.exports = publicResetPasswordRoutes;
