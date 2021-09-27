import { RelayConsumer } from "@signalwire/node";

const getPin = ({ client, from, to }) => {
  return new Promise(async (resolve, reject) => {
    client
      .on("signalwire.ready", async (client) => {
        try {
          const call = await client.calling.newCall({
            type: "phone",
            from,
            to,
          });

          const connectResult = await call.dial();

          if (connectResult.successful) {
            //   const { call } = dialResult;
            const params = {
              type: "digits",
              digits_max: 4,
              digits_terminators: "#",
              media: [
                {
                  type: "tts",
                  text: "Welcome at SignalWire. Please, enter your PIN and then # to proceed",
                },
              ],
            };
            const promptResult = await call.prompt(params);
            if (promptResult.successful) {
              const type = promptResult.type; // digit
              const pin = promptResult.result; // pin entered by the user
              resolve({
                type,
                pin,
              });
            } else {
              reject(promptResult);
            }
            // Your call has been answered..
          } else {
            __logger.error("No number found!");
            reject(new Error("No number found!"));
          }
        } catch (error) {
          __logger.error(error);
          reject(error);
        }
      })
      .on("signalwire.error", (error) => {
        __logger.error(error);
        reject(error);
      });
  });
};
const getPinSet = ({ project, token, from, to }) => {
  return new Promise((resolve, reject) => {
    try {
      const consumer = new RelayConsumer({
        project,
        token,
        contexts: ["home", "office"],
        ready: async (consumer) => {
          const dialResult = await consumer.client.calling.dial({
            type: "phone",
            from, // Must be a number in your SignalWire Space
            to,
          });
          const { successful, call } = dialResult;
          if (!successful) {
            reject(new Error("Dial error.."));
            return;
          }

          const prompt = await call.promptTTS({
            type: "digits",
            digits_max: 3,
            text: "Welcome to SignalWire! Enter your 3 digits PIN",
          });

          if (prompt.successful) {
            __logger.info(`User digits: ${prompt.result}`);
            resolve(prompt);
          } else {
            resolve(new Error("No input found"));
          }
        },
      });

      consumer.run();
    } catch (error) {
      __logger.error(error);
      reject(error);
    }
  });
};
export const Outbound = {
  getPin,
  getPinSet,
};
