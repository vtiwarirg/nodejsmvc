const { expressjwt: jwt } = require('express-jwt');
module.exports.auth = jwt({
    secret: 'Welcome2019',
    userProperty: 'payload',
    algorithms: ["HS256"]
});