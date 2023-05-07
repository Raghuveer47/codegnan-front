const middleware = require('./middleware');
const router = require('express').Router();
const { Post } = require('../models/Schema');

router.post('/', middleware, async (req, res) => {
    if (req.user) {
        const currentuser = req.user;
        const newpost = new Post({
            userid: currentuser,
            content: req.body.content,
            photo: req.body.photo
        });
        await newpost.save();
        return res.status(200).json("post sucessfully");
    }
    else {
        const currentuser = req.body.userid;
        const newpost = new Post({
            userid: currentuser,
            content: req.body.content,
            photo: req.body.photo
        });
        await newpost.save();
        return res.status(200).json("post sucessfully");
    }
});

router.get('/', middleware, async (req, res) => {
    const allposts = await Post.find().populate('userid');
    return res.status(200).json(allposts);
});

module.exports = router;