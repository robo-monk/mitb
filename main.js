const functions = require('firebase-functions');
const captcha = require('./lib/captcha.js');
const { encrypt, hmac, decrypt } = require('./lib/encryption.js');
// const env = require('./lib/env.js');
let requestHandler = null;

const fastify = require('fastify')({
	logger: true,
	trustProxy: true,
	serverFactory: (handler) => {
		requestHandler = handler;
		return require('http').createServer();
	},
});

// add a rate limiter
fastify.register(require('fastify-rate-limit'), {
	max: 25,
	timeWindow: '1 minute',
});

// cors
fastify.register(require('fastify-cors'), {
	// put your options here
	origin: '*',
});

fastify.addContentTypeParser('application/json', {}, (req, body, done) => {
	done(null, body.body);
});

// fastify.get("/ip", ({ ip, ips, headers }) => {
// 	return { ip, ips, headers }
// })

const existingTokens = new Set();

fastify.post('/request', async ({ body }) => {
	if (!body) return null;
	let token = body.token;

	let score = existingTokens.has(token)
		? false
		: await captcha.scoreToken(token);

	let pass = score >= 0.7;
	// const success = pass ? body : { error: 'Invalid' };

	if (existingTokens.size > 1000) existingTokens = new Set();
	existingTokens.add(token);

	const payload = {
		token,
		pass,
		score,
	};

	return {
		payload,
		hmac: hmac(payload),
	};
});

exports.api = functions.region('europe-west1').https.onRequest((req, res) => {
	fastify.ready((err) => {
		if (err) throw err;
		requestHandler(req, res);
	});
});
