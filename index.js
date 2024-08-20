const express = require('express');
// const { Client, Middleware } = require('@line/bot-sdk');
const line = require('@line/bot-sdk');
const app = express();

const config = {
  channelAccessToken: 'mVjItQ6zRfU0k7AtC4s9BH6ICzPYH6QW1+f7AqzoIUMzh5mXt1f7xuMiGbu29zcUvEVIYnDMeHFQN5lkbCHtaq+RKftZa5YgY2hRTCqj69DV5uKYrTjcaqP+e6iY4eOBLrCzbQbSrSnhbdgmNiFE5QdB04t89/1O/w1cDnyilFU=',
  channelSecret: '4aaae9c98638131e2b3b78e546239bb4'
};

const client = new line.messagingApi.MessagingApiClient({ channelAccessToken: config.channelAccessToken });

app.use(line.middleware(config));

app.post('/bot', (req, res) => {
  const events = req.body.events;
  Promise.all(events.map(handleEvent))
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    const echo = { type: 'text', text: event.message.text };
    return client.replyMessage(event.replyToken, echo);
  } else {
    return Promise.resolve(null);
  }
}

app.listen(6000, () => {
  console.log('Server is running on port 6000');
});
