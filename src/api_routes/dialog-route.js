if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv"); //Configure environmental variables
    const result = dotenv.config();

    if (result.error) {
        throw result.error;
    }
}
 
const express = require("express")
const DialogRouter = express.Router()
const signature = require("../verify-signature")
const AppBootstrap = require("../main");
const token = process.env.SLACK_ACCESS_TOKEN;

const { RTMClient, WebClient, ErrorCode } = require("@slack/client");
const rtm = new RTMClient(token);
const web = new WebClient(token);
rtm.start();

const botResponse = new Array("Got it! Thanks", "Awesome!",
   "Cool. Will get it posted.", "Great!", "Thank you!", "Thanks!", "You are awesome", "Yes!",
   "Just doing my job", "Okay!", "Alright!","Nice, thanks")

function pickRandomResponse() {
   var pos = Math.floor(Math.random() * (botResponse.length - 0) + 0)
   return botResponse[pos]
}

function sendConfirmation(userId) {
    console.log(userId)
   sendMessageToUser(userId, pickRandomResponse())
}



//Handle post request from slack
DialogRouter.post('/dialog/new', function (req, res, next) {
    console.log('reaches here');
   const body = JSON.parse(req.body.payload)
   console.log('body', body)

   if (signature.isVerified(req)) {
       console.log('passes signature')
       let standupDetails = {
           username: body.user.id,
           standup_today: body.submission.standup_today,
           team: body.submission.team,
           standup_previous: body.submission.standup_previous,
           date_posted: body.state
       }
    //    console.log("standup details", standupDetails);
    //    console.log("Form submission id : " + body.callback_id);
    //    console.log('response', res.status(200).json({}))
          
           saveStandup(standupDetails)
           sendConfirmation(body.user.id)
   } else {
       console.log("Token Mismatch!")
       res.status(404).end()
   }

})

function sendMessageToUser(userId, message) {
    console.log('message', message)
   web.conversations
       .list({ exclude_archived: true, types: "im" })
       .then(res => {
           const foundUser = res.channels.find(u => u.user === userId);
           if (foundUser) {
               rtm
                   .sendMessage(message, foundUser.id)
                   .then(msg =>
                       console.log(
                           `Message sent to user ${foundUser.user} with ts:${msg.ts}`
                       )
                   )
                   .catch(console.error);
           } else {
               console.log("User doesnt exist or is the bot user!");
           }
       });
}

function saveStandup(standupDetails) {
    console.log('======================')
    console.log('standupDetails', standupDetails)
   AppBootstrap.userStandupRepo.add(standupDetails);
}


module.exports = DialogRouter
