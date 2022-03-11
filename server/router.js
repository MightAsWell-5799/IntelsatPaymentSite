const express = require('express')
const router = express.Router()

const fireStore = require('./Firestore')

const auth = require('./auth/auth.json')
const jwt = require('jsonwebtoken')






router.get("/login", async function (req, res) {
    res.render('loginForm', {err:""})
})

router.get("/test", async (req, res) => { 
    console.log(req.cookies)
    res.send("test")
})

router.post("/auth", async function (req, res) {
    var doc = await fireStore.userLogin(req.body.username, req.body.password)
    if (doc == null) {
        res.render('loginForm', {
            err: "Username or password incorrect"
        })
    } else {
        var access = jwt.sign(doc.username + ":" + doc.password, auth.signing)
        res.header("authorization", access)
        res.render("loggedIn",{access, doc: JSON.stringify(doc)} )
    }
})


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, auth.signing, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
        
    })
    
}
module.exports = router