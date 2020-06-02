const jwt = require('jsonwebtoken');

/***************************************************
 * Before responding to the request, this middleware 
 * will check if the user is authenticated or not by
 * checking the tokens validity
 */

function checkAuth(req, res, next) {
    //jwt verify() verifies and returns the decoded value
    //we are passing in the client token sent back to us 
    //if not validated, it throws the error, so handling it 
    try{
        // token should be passed from client through 
        //the header in as authorization name(key)
        const token = req.headers.authorization;
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        //if successful, add a new field to request by any name 
        // and assign it the returned decoded value
        req.userData = decoded;
        //passing decoded value to the routers which 
        //can be accessed using req.userData
        next(); 
    } catch(err) {
        return res.status(401).json({
            error: "Auth failed"
        })
    }
}

module.exports = checkAuth;