const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelSecret: '4aaae9c98638131e2b3b78e546239bb4',
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: 'mVjItQ6zRfU0k7AtC4s9BH6ICzPYH6QW1+f7AqzoIUMzh5mXt1f7xuMiGbu29zcUvEVIYnDMeHFQN5lkbCHtaq+RKftZa5YgY2hRTCqj69DV5uKYrTjcaqP+e6iY4eOBLrCzbQbSrSnhbdgmNiFE5QdB04t89/1O/w1cDnyilFU='
});

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/bot', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create an echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

// listen on port
const port = 6000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});