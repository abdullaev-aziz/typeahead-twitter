const Twitter = require('twitter');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN_KEY,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

// CORS support
app.use(cors());

app.get('/', (req, res) => {
	res.status(200).send({
		data: 'Successful request',
	});
});

app.get('/twitter/user/search', (req, res) => {
	const username = req.query.username;

	client.get('/users/search', { q: username }, (error, users, response) => {
		if (error) {
			res.status(error.code).send({ error });
		} else {
			res.status(200).send({ users, response });
		}
	});
});

app.listen(PORT, () => {
	/* eslint-disable no-console */
	console.log('listening on port ' + PORT + '...');
	/* eslint-enable no-console */
});
