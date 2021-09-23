import { RestClient } from "@signalwire/node";
import Output from "../config/database/mongoose/models/Output";
const BASE_URL = `https://7951-103-88-82-236.ngrok.io`;

const {
  SIGNALWIRE_PROJECT_ID,
  SIGNALWIRE_PROJECT_TOKEN,
  SIGNALWIRE_SPACE_URL,
} = process.env;

const saveResponse = ({ query, response }) => {
  const output = new Output({ query, response });
  await output.save();
};

export const MainMenu = (req, res, next) => {
  const response = new RestClient.LaML.VoiceResponse();
  const gather = response.gather({
    action: `${BASE_URL}/mmv-response`,
    method: "GET",
    input: "dtmf speech",
    hints: "help, conference",
  });
  gather.say("Hello and welcome to Oculus.");
  gather.say("do you wants to enroll in AWV? If Yes Press 1 or Say sure");
  gather.say(
    "If you have been invited to a conference, press 2, or say conference."
  );
  gather.say(
    "If you know your party’s extension, you may dial it at any time."
  );
  gather.pause({ length: 10 });
  gather.say(
    "Are you still there? Please make a selection or press star to hear the options again."
  );
  response.say("We did not receive an option. Goodbye.");

  saveResponse({
    query: req.query,
    response: response.toString(),
  });
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
  console.log(
    "main-menu Request Params from server  --->" + JSON.stringify(req.query)
  );
};

export const Transcription = (req, res, next) => {
  const response = new RestClient.LaML.MessagingResponse();

  function sendSms(to, from) {
    const project = SIGNALWIRE_PROJECT_ID;
    const token = SIGNALWIRE_PROJECT_TOKEN;
    const client = new RestClient(project, token, {
      signalwireSpaceUrl: SIGNALWIRE_SPACE_URL,
    });

    return client.messages
      .create({
        body:
          "Missed call from: " +
          req.body.From +
          ". Here is the message: " +
          req.body.TranscriptionText,
        from: from,
        to: to,
      })
      .then()
      .catch(function (error) {
        if (error.code === 21614) {
          console.log(
            "Uh oh, looks like this caller can't receive SMS messages."
          );
        }
      })
      .done();
  }

  const to = "+16045628647";
  const from = "+13103560879";
  sendSms(to, from);

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
  console.log(
    "transcription Request Params from server  --->" + JSON.stringify(req.body)
  );
};

export const MMVResponse = (req, res, next) => {
  const response = new RestClient.LaML.VoiceResponse();
  const digits = req.query.Digits;
  const speech = req.query.SpeechResult;

  if (digits == "1" || speech == "sure") {
    const dial = response.dial({ timeout: 10 });
    dial.number("650-382-0000");
    response.say(
      "Sorry, the person you are trying to reach is not available. Please leave a message after the beep. Press the pound key and hang up when you are finished."
    );
    response.record({
      maxLength: 20,
      action: `${BASE_URL}/recording`,
      method: "GET",
      finishOnKey: "#",
      transcribe: true,
      transcribeCallback: `${BASE_URL}/transcription`,
    });
  } else if (digits == "2" || speech == "conference") {
    dial.conference("support");
  } else if (digits == "*") {
    const gather = response.gather({
      action: `${BASE_URL}/mmv-response`,
      method: "GET",
      input: "dtmf speech",
      hints: "help, conference",
    });
    gather.say("Hello and welcome to SignalWire.");
    gather.say(
      "If you're a customer in need of some assistance, press 1, or say help."
    );
    gather.say(
      "If you have been invited to a conference, press 2, or say conference."
    );
    gather.say(
      "If you know your party’s extension, you may dial it at any time."
    );
    response.say("We did not receive an option. Goodbye.");
  } else if (digits == "2002") {
    response.say("Please hold, connecting you to Ryan McGivern.");
    const dial = response.dial();
    dial.number("650-434-8018");
  } else if (digits == "2003") {
    response.say("Please hold, connecting you to Brent McNamara.");
    const dial = response.dial();
    dial.number("650-434-8019");
  } else if (digits == "2004") {
    response.say("Please hold, connecting you to Patrick Semple.");
    const dial = response.dial();
    dial.number("650-434-8020");
  } else if (digits == "2009") {
    response.say("Please hold, connecting you to Erik Lagerway.");
    const dial = response.dial();
    dial.number("650-434-8025");
  } else {
    response.say("We received an incorrect option. Goodbye.");
  }
  saveResponse({
    query: req.query,
    response: response.toString(),
  });
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
  console.log(
    "mmv-response Request Params from server  --->" + JSON.stringify(req.query)
  );
};

export const Recording = (req, res) => {
  res.set("Content-Type", "text/xml");
};

export const Message = (req, res) => {
  const response = new RestClient.LaML.MessagingResponse();
  const body = req.query.Body;

  switch (body) {
    case "blog":
      response.message(
        "Check out our blogs here: https://signalwire.com/blogs!"
      );
      break;
    case "docs":
      response.message(
        "Here is our developer documentation: https://docs.signalwire.com."
      );
      break;
    case "story":
      response.message(
        "What SignalWire is all about: https://signalwire.com/about."
      );
      break;
    default:
      response.message("Hello, and welcome to SignalWire!");
      response.message("For SignalWire blog posts, reply with blog.");
      response.message(
        "For SignalWire developer documentation, reply with docs."
      );
      response.message("For our company story, reply with story.");
      break;
  }
  saveResponse({
    query: req.query,
    response: response.toString(),
  });
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
  console.log(
    "message Request Params from server  --->" + JSON.stringify(req.query)
  );
};
