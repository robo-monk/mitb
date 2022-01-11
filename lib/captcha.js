const axios = require('axios');
const env = require("./env.js")

const api = `https://www.google.com/recaptcha/api/siteverify?secret=${env.CAPTCHA_SECRET_KEY}`
async function scoreToken(token) {
    const { data } = await axios.post(`${api}&response=${token}`)
    return data.success ? data.score : 0;
}

module.exports = {
    scoreToken
}
