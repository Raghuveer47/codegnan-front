const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    picture: { type: String, default: "" }
}, {
    timestamps: true,
});

const postSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    photo: { type: String, default: '' },
    content: { type: String, required: true },
    isdeletebtn: { type: String, default: false },
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

module.exports = { User, Post };