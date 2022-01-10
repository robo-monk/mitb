// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
// const functions = require('firebase-functions')
// const cors = require('cors');
// import fastify from 'https://esm.sh/fastify@3.25.3';
// import fastify from 'https://cdn.skypack.dev/fastify';

// Declare a route
fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

// Run the server!
const start = async () => {
	try {
		await fastify.listen(3000);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
