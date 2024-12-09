const JWT = require('jsonwebtoken');

const secret ="d4e8f759a6c8460aa231bf82f4a53f9207e12c5b3d92eea7a35a4b2e69f24f81";


function createUserToken(user) {
    const payload = {
        _id: user._id,
        email: user.email
    };
    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createUserToken,
    validateToken
}
