
var logging = true
function log(message) {
	if (logging) console.log(message)
}


const cookieParser = require('cookie-parser')


const express = require("express")
const app = express()
const authRouter = require("./routers/authRouter")
const pageRouter = require("./routers/pageRouter")

app.set("view engine", "ejs")

app.use(cookieParser())

app.use("/auth", authRouter)

app.use("/", pageRouter)

app.use(express.json)
app.use(express.static(__dirname + "/public"))

app.listen(5000, () => console.log("Listening on port 5000"))
