var logging = true
function log(message) {
	if (logging) console.log(message)
}

const { initializeApp, applicationDefault, cert } = require("firebase-admin/app")
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore")

const crypto = require("crypto")
const cryptoConfig = require("./configs/crypto.json")

const serviceAccount = require("../auth/thinking-pillar-325220-fafa96ebec78.json")

initializeApp({
	credential: cert(serviceAccount),
})

const db = getFirestore()

db.collection("Users").doc("user1").set({
	Username: "user1",
	Password: "password1",
	Other: "",
})

async function userCreate(username, password) {
	await db
		.collection("Users")
		.doc(username)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return {err: "User already exists"}
            } else {
                if (validatePassword(password)) {
                    db.collection("Users")
                        .doc(username)
                        .set({
                            Username: username,
                            Password: crypto.createHash(cryptoConfig.hash).update(password).digest("hex"),
                            Other: "",
                        })
                    log("User created")
                    return {err: undefined}
                } else {
                    return {err: "Password must be at least 10 characters long and must include at least one number and special character"}
                }
			}
		})
}

async function userLogin(username, password) {
	return db
		.collection("Users")
		.doc(username)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				log("User does not exist")
				return null
			} else { 
				if (doc.data().Password == crypto.createHash(cryptoConfig.hash).update(password).digest("hex")) {
					return doc.data()
				} else {
					log("Wrong password")
					return null
				}
			}
		})
		.catch((err) => {
			log("Error getting document", err)
			return null
		})
}

function validatePassword(password) {
	//check if the password has 10 characters or more and is not just spaces, must include at least one number and special character
	var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,}$/
	return regex.test(password)
}

function hashPassword(password) {
	return crypto.createHash(cryptoConfig.hash).update(password).digest("hex")
}

module.exports = { userCreate, userLogin, hashPassword }
