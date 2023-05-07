const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/Schema');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const authClient = new OAuth2Client("109092872940-4tltrf0b6b91qi2vovsi9qrv7jddtebp.apps.googleusercontent.com");

router.post("/register", async (req, res) => {
    let { username, email, password, confirmpassword } = req.body;
    //check the user already exist with this username
    const takenUsername = await User.findOne({ username: username });
    if (takenUsername) {
        return res.status(405).json({ message: "username already exists" });
    } else {
        if (password === confirmpassword) {
            password = await bcrypt.hash(req.body.password, 10);
            const dbUser = new User({
                username: username.toLowerCase(),
                email,
                password
            });
            await dbUser.save();
        }
        else {
            return res.status(408).status('Password and confirm passwords are mismatched');
        }
        return res.json({ message: "user account created sucessfully" });
    }
});

//login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userexist = await User.findOne({ email: email });
        if (!userexist) {
            return res.status(404).json('user not found');
        }
        bcrypt.compare(password, userexist.password).then((isCorrect) => {
            if (isCorrect) {
                let payload = {
                    user: {
                        id: userexist.id
                    }
                }
                jwt.sign(payload, 'newsecreate', { expiresIn: 36000000 }, (err, token) => {
                    if (err) throw err;
                    return res.status(200).json({ token: token });
                });
            }
            else {
                return res.status(405).json('password is incorrect');
            }
        }
        );
    } catch (error) {
        return res.status(500).json("server error")
    }
});

router.post('/token', async (req, res) => {
    const { idToken } = req.body;
    if (idToken) {
        const data = await authClient.verifyIdToken({ idToken, audience: "109092872940-4tltrf0b6b91qi2vovsi9qrv7jddtebp.apps.googleusercontent.com" });
        const { email, name, picture } = data.payload;
        const userexist = await User.findOne({ email: email });
        if (userexist) {
            return res.status(200).json(userexist);
        }
        const newuser = new User({
            email: email,
            username: name,
            picture: picture
        });
        await newuser.save();
        return res.json(newuser.id);
    }
});

module.exports = router;