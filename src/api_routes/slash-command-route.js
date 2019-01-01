if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv"); //Configure environmental variables
    const result = dotenv.config();
   
    if (result.error) {
      throw result.error;
    }
   }
   const express = require("express");
   const SlashCommandRouter = express.Router();
   const debug = require("debug")("onaautostandup:slash-command-route");
   const signature = require("../verify-signature");
   const moment = require("moment");
   const token = process.env.SLACK_ACCESS_TOKEN;
   const { RTMClient, WebClient, ErrorCode } = require("@slack/client");
   const web = new WebClient(token);
   
   /**
   * Express route to handle post request when the slash command is invoked by the
   * users of the app
   */
   SlashCommandRouter.post("/slashcmd/new", function (req, res) {
    let {user_id, trigger_id } = req.body;
    if (signature.isVerified(req)) {
      const dialog = {
        title: "Submit standup update",
        callback_id: "submit-standup",
        submit_label: "Submit",
        state: moment().format("YYYY-MM-DD"),
        elements: [
          {
            label: "Post as",
            type: "select",
            name: "team",
            options: [
              { label: "Team A", value: "Team A" },
              { label: "Team B", value: "Team B" },
              { label: "Team C", value: "Team C" },
              { label: "Team D", value: "Team D" },         ],
            hint:
              "You can post individual standup or as team. Team standups will be group together"
          },
          {
            label: "Today's update",
            type: "textarea",
            name: "standup_today",
            optional: false,
            placeholder: "e.g - Add unit tests to Kaznet's playbook"
          },
          {
            label: "Previously/Yesterday",
            type: "textarea",
            name: "standup_previous",
            optional: true,
            placeholder: "e.g - Deployed OpenMRS and OpenSRP servers"
          }
        ]
      };
   
          openDialog(trigger_id, dialog).then(result => {
            if (result.ok === true) {
              res.status(200).send("");
            } else {
              res.status(500).end();
            }
          });
    } else {
      debug("Verification token mismatch");
      res.status(404).end();
    }
   });
   
   function openDialog(triggerId, dialog) {
    return web.dialog
        .open({ trigger_id: triggerId, dialog: JSON.stringify(dialog) })
        .then(res => {
            console.log("Open dialog res: %o ", res);
            return Promise.resolve(res);
        })
        .catch(error => {
            if (error.code === ErrorCode.PlatformError) {
                console.log(error.message);
                console.log(error.data);
            } else {
                console.error;
            }
            return Promise.reject(error);
        });
   }
   
   module.exports = SlashCommandRouter;