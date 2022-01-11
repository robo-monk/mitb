const functions = require('firebase-functions');
const captcha = require('./lib/captcha.js');
// const env = require('./lib/env.js');
let requestHandler = null;

const fastify = require('fastify')({
	logger: true,
	serverFactory: (handler) => {
		requestHandler = handler;
		return require('http').createServer();
	},
});

fastify.addContentTypeParser('application/json', {}, (req, body, done) => {
	done(null, body.body);
});


const existingTokens = new Set();
fastify.post('/request', async ({ body }) => {
	let token = body.token;

	let pass =
		!existingTokens.has(token) && (await captcha.validateToken(token));

	const res = pass ? body : { error: 'Invalid' };

	if (existingTokens.size > 1000) existingTokens = new Set();
	existingTokens.add(token)

	return res;
});

exports.api = functions.region('europe-west1').https.onRequest((req, res) => {
	fastify.ready((err) => {
		if (err) throw err;
		requestHandler(req, res);
	});
});
