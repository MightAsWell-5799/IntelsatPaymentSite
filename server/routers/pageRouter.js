const express = require("express")
const router = express.Router()

const fireStore = require("../Firestore")

const auth = require("../../auth/auth.json")
const jwt = require("jsonwebtoken")

const axios = require("axios").default








function authenticateToken(req, res, next) {
	const authHeader = req.cookies
	const token = authHeader && authHeader.split(" ")[1]
	if (token == null) return res.sendStatus(401)
	jwt.verify(token, auth.signing, (err, user) => {
		if (err) return res.sendStatus(403)
		req.user = user
		next()
	})
}
module.exports = router
