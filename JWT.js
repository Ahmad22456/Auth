const {sign, verify} = require('jsonwebtoken')

function createToken(user, res) {                                                                //=======>
    const accessToken = sign({name: user.username, id: user._id}, 'thesupersecretword')
    res.cookie('accessToken', accessToken, {httpOnly: true})
    return accessToken
}

function verifyToken(req, res, next) {
    console.log('before cookie')
    const accessToken = req.cookies['accessToken']                                                //=======>
    console.log('after cookie')
    if(!accessToken) {
        return res.status(400).json({error: 'User not Authenticated'})
    }
    try {                                                                                         //=======>
        const verification = verify(accessToken, 'thesupersecretword')
        req.authentication = true                                                                 //=======>
        return next()
    } catch (error) {
        res.status(400).json({error: error})
    }
}

module.exports = {createToken, verifyToken}