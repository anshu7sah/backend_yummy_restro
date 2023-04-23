const { auth } = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUERBASEURL,
  tokenSigningAlg: "RS256",
});

module.exports = { jwtCheck };
