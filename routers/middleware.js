const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        let token = req.header('x-token');
        if (!token) {
            next();
        }
        else {
            let decode = jwt.verify(token, 'newsecreate');
            req.user = decode.user
            next();
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send('Invalid token')
    }
}