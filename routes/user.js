const { Router } = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = Router();

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render('signup', { error: '* All fields are required.' });
    }

    try {

        // Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return  res.render('signup', { error: '* Email already in use.' });
        }

        await User.create({
            username,
            email,
            password
        });
        return res.redirect('/user/signin');
    } catch (error) {
        return res.render('signup', {
            error: error,
        });
    }

});

router.post('/signin', async (req, res) => {
    const { email, password } = await req.body;

    try {
        const token = await User.matchPassGenToken(email, password);

        return res.cookie("token", token).redirect('/');
    } catch (error) {
        return res.render('signin', {
            error: "Incorrect Email or Password",
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect('/');
});


module.exports = router;