const functions = require('firebase-functions');
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

fastify.get('/', async (req) => {
	console.log('yo');
	return "What's up bitch";
});

fastify.post('/postToMeWithJSON', async (req) => {
	return req.body;
});

exports.api = functions.https.onRequest((req, res) => {
	fastify.ready((err) => {
		if (err) throw err;
		requestHandler(req, res);
	});
});
