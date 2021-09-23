import { RestClient } from "@signalwire/node";
import Output from "../config/database/mongoose/models/Output.js";
const BASE_URL = `https://c20b-103-88-82-236.ngrok.io`;

const {
  SIGNALWIRE_PROJECT_ID,
  SIGNALWIRE_PROJECT_TOKEN,
  SIGNALWIRE_SPACE_URL,
} = process.env;

const saveResponse = async ({ query, response }) => {
  try {
    const output = new Output({ query, response });
    await output.save();
  } catch (error) {
    console.error(error);
    _logger.error(error);
  }
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

  gather.pause({ length: 10 });
  gather.say(
    "Are you still there? Please make a selection or press star to hear the options again."
  );
  gather.pause({ length: 10 });
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

export const CommonResponse = (req, res) => {
  try {
    const { question } = req.params;
    const response = new RestClient.LaML.VoiceResponse();
    if (question === "name") {
      const gather = response.gather({
        action: `${BASE_URL}/response/dob`,
        method: "GET",
        input: "speech",
        hints: "help, conference",
      });
      gather.say(`Please provide your dob`);
      gather.pause({ length: 10 });
      gather.say(
        "Are you still there? Please make a selection or press star to hear the options again."
      );
      gather.pause({ length: 10 });
      response.say("We did not receive an option. Goodbye.");
    } else if (question === "dob") {
      const gather = response.gather({
        action: `${BASE_URL}/response/number`,
        method: "GET",
        input: "speech",
        hints: "help, conference",
      });
      gather.say(`Please provide your number`);
      gather.pause({ length: 10 });
      gather.say(
        "Are you still there? Please make a selection or press star to hear the options again."
      );
      gather.pause({ length: 10 });
      response.say("We did not receive an option. Goodbye.");
    } else if (question === "number") {
      response.say(`Thank you for registration!`);
    }
    saveResponse({
      query: req.query,
      response: response.toString(),
    });
    res.set("Content-Type", "text/xml");
    res.send(response.toString());
    console.log(
      "mmv-common-response Request Params from server  --->" +
        JSON.stringify(req.query)
    );
  } catch (error) {
    _logger.error(`Error occurred ${err.message}`);
    res.status(500).send({
      error: JSON.stringify(error),
    });
  }
};

export const MMVResponse = (req, res, next) => {
  const response = new RestClient.LaML.VoiceResponse();
  const digits = req.query.Digits;
  const speech = req.query.SpeechResult;

  if (digits == "1" || speech == "sure") {
    const gather = response.gather({
      action: `${BASE_URL}/response/name`,
      method: "GET",
      input: "speech",
      hints: "help, conference",
    });
    gather.say("Please provide your name");
    gather.pause({ length: 5 });
    gather.say(
      "Are you still there? Please make a selection or press star to hear the options again."
    );
    gather.pause({ length: 5 });
    response.say("We did not receive an option. Goodbye.");
    // response.record({
    //   maxLength: 20,
    //   action: `${BASE_URL}/recording`,
    //   method: "GET",
    //   finishOnKey: "#",
    //   transcribe: true,
    //   transcribeCallback: `${BASE_URL}/transcription`,
    // });
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
