const express = require("express")
const router = express.Router()

const fireStore = require("../Firestore")

const auth = require("../../auth/auth.json")
const jwt = require("jsonwebtoken")

const axios = require("axios").default

router.get("/login", async function (req, res) {
	res.render("loginForm", { err: "" })
})

router.get("/test", async (req, res) => {
	res.send(req.cookies)
})

router.post("/auth", async function (req, res) {
	var doc = await fireStore.userLogin(req.body.username, req.body.password)
	if (doc == null) {
		res.render("loginForm", {
			err: "Username or password incorrect",
		})
	} else {
		var jwtData = (
			await axios.post("http://localhost:4000/login", { username: req.body.username }, {})
        ).data
        
        //store jwt token for 6 hours
		res.cookie("authorizationToken", jwtData.accessToken, {
			maxAge: 1000 * 60 * 60 * 6,
			httpOnly: true,
		})
		res.cookie("refreshToken", jwtData.refreshToken, {
			maxAge: 1000 * 60 * 60 * 6,
			httpOnly: true,
		})
		res.render("loggedIn", { access: 1, doc: JSON.stringify({ a: "b" }) })
	}
})



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
