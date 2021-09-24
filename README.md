## Steps

- Login in the signal wire
- Generate App Id, token and domain
- Purchase mobile
- Add mobile setting
- Add API to listen to changes
- Add API to listen to messages
- Add a verified number(if you have trial account)
- Call to the number
- Pass the responses
- Saved inside the database

## Development setup

- Clone the repo
- update .env folder
- run `yarn`
- run `ngrok`
- run `ngrok http 4000`
- update the ngrok url from file `Signalwire.js`
- run `yarn run dev`
- update the callback url in the selected mobile number on signalwire dashboard
- replace with <ngrok-url>/main-menu
- call on the same number
- Fill the details
- Input might be fussy based on the accent of the person
