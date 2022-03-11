
var logging = true
function log(message) {
	if (logging) console.log(message)
}


const cookieParser = require('cookie-parser')


const express = require("express")
const app = express()
const loginRouter = require("./router")


app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use("/a", loginRouter)
app.use(express.json)
app.use(express.static(__dirname + "/public"))
app.listen(5000, () => console.log("Listening on port 5000"))
