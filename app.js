/*
  A very basic app to demonstrate JSON Web Token being used in OpenIDConnect using Google as an account provider

  This is a command line app, run with "node app.js <id token>"

*/


// The keys are from https://accounts.google.com/.well-known/openid-configuration under the jwks_uri keys
// You will want to referesh this once in a while as google may change keys

jwks = {
  "keys": [
    {
      "kid": "17d55ff4e10991d6b0efd392b91a33e54c0e218b",
      "e": "AQAB",
      "kty": "RSA",
      "alg": "RS256",
      "n": "o-N21NegwWXPCXubI-QLHoEXfx_SQb6vwGt7_JSUvXqgMB5zDADwyv05luxY-owafLq5Zon0yuv_qsub-fLeVHL4KVj_rvmu0CZyYh9DP2J3QUpUT-m7i1ag_z4SC_-LEQz8Z2bkP0vbt0U8XUpF3QVc0SwJkShvTmHF-SLDAFWBgPFzRNQaXfm5dX3NTw4jAw8x0MdWdZg1yrFwlzSKQVQi2jbV2U0KwsYYkiL5arc-WG_m7lqdNGEoWvfmEHwrICHEDJq9mlF-PjYor8sgypCdmj5FryPVMzVBHME6c67wOFr3-wIEl_JI8_SsCVLreHHL-pLstdJFgq-y7bqVww",
      "use": "sig"
    },
    {
      "kid": "cb404383844b46312769bb929ecec57d0ad8e3bb",
      "e": "AQAB",
      "kty": "RSA",
      "alg": "RS256",
      "n": "uqDFOtHWFjG-G8cHq4O8zZvOXzbXFBRaM05IGxigCJj6sSe5K0YG30ygPTDoQXaa1uzSWqt2vS4Cs13Uta_5Qr3une0wqkFmIVw6Xeb60JnsV10bR7ZzOC_gnQFvLyTH8zHwb-oCVUrI8ExWhI1YT_txq3w9ROvAylSGcsadZOEobb1HPsRoelRTOKqyCVhJEJL6sxDq1vFYtASMoB2qzk7AR-Uf2Smbg8al-9ljgwYmi7V7z16AQ8c713E9QPfrJzoPYPIofzAulf5LvZxaa-tTLDJstPpoJbLesgI8rNF9fVRzUJ4J6ivo3tJp9PUVWPoW0e5VK8fPWSfOrF6ENw",
      "use": "sig"
    }
  ]
}


// Retrieve token from the command line.  In a webapp, this will be provided in the Authorization: Bearer header
if (process.argv.length < 3) {
  console.log("Please provide google id token as command line argument");  
  return;
} 
var token = process.argv[2];


var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');

// First need to find out which key id is being used, we can get this from the header
var d = jwt.decode(token,{complete:true});

// Need to convert the key to PEM format
var pem;
if (d.header.kid) {  
  jwks.keys.forEach( k => {
    if (k.kid == d.header.kid)
      pem = jwkToPem(k);
  });
}
console.log(pem);

// We use the PEM cert to verify the token is signed by google
// Basically, we try to decrypt the 3rd part of the token using the public key
var result = jwt.verify(token, pem);

// jwt.verify will return the body of the token
console.log(result);

