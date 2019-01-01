if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv')//Configure environmental variables 
    const result = dotenv.config()

    if (result.error) {
        throw result.error
    }
}
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const SlashCommandRouter = require("./api_routes/slash-command-route.js")
const DialogRouter = require("./api_routes/dialog-route.js")
const AppBootstrap = require("./main.js")                                                                                       
const debug = require("debug")("onaautostandup:index")

// Initialize app and attach middleware
console.log('app-bootstrap', AppBootstrap);
const app = express()

const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};

app.use(cors())
app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }))
app.use(bodyParser.json({ verify: rawBodyBuffer }))

// Error handling middleware
app.use(function (err, req, res, next) {
    console.log(err.stack)
    res.status(500).send({ error: err.message })
    debug("App Error description: " + err)
})

app.use("/api/v1", SlashCommandRouter)
app.use("/api/v1", DialogRouter)
app.get('/', (req, res) => {
    res.send('<h2>AutoStandup app is up and running</h2> <p>Login to your' +
        ' slack account and start submitting standups.</p>');
});

AppBootstrap.main()

// const autoStandup = new AutoStandup()

app.listen(process.env.PORT || 7777, function () {
    console.log("[+] app listening for requests")
    
})
