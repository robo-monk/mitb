const {
	createHmac,
	scryptSync,
	createCipheriv,
	createDecipheriv,
} = require('crypto');

const { Buffer } = require('buffer');
const env = require('./env');

function hmac(data) {
	const hmac = createHmac('sha256', env.SUPER_SECRET);
	hmac.update(JSON.stringify(data));
	return hmac.digest('base64');
}

function verifyHmac(signature, data) {
	return signature && data && signature == hmac(data);
}

function encrypt(data, algorithm = 'aes-192-cbc', password = env.SUPER_SECRET) {
	const key = scryptSync(password, 'salt', 24); // really slow!!!
	const iv = Buffer.alloc(16, 0); // Initialization vector.
	const cipher = createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
}

function decrypt(data, algorithm = 'aes-192-cbc', password = env.SUPER_SECRET) {
	const key = scryptSync(password, 'salt', 24);
	const iv = Buffer.alloc(16, 0); // Initialization vector.
	const decipher = createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(data, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return JSON.parse(decrypted);
}

module.exports = {
	hmac,
	verifyHmac,
	encrypt,
	decrypt,
};
