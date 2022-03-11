const express = require("express")
const router = express.Router()

const fireStore = require("../Firestore")

const auth = require("../../auth/auth.json")
const jwt = require("jsonwebtoken")

const axios = require("axios").default





router.get("/download", authenticateToken, (req, res) => {
    res.render("download")
})
router.get("/file", authenticateToken, (req, res) => {
    res.download(__dirname + "/test.txt")
})

function authenticateToken(req, res, next) {
    const authHeader = req.cookies
	const token = authHeader.authorizationToken
	if (token == null) return res.sendStatus(401)
	jwt.verify(token, auth.signing, (err, user) => {
		if (err) return res.sendStatus(403)
		req.user = user
		next()
	})
}
module.exports = router
