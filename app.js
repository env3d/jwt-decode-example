/*
  A very basic app to demonstrate JSON Web Token being used in OpenIDConnect using Google as an account provider

  This is a command line app, run with "node app.js <id token>"

*/


// The keys are from https://accounts.google.com/.well-known/openid-configuration under the jwks_uri keys
// You will want to referesh this once in a while as google may change keys

jwks = {
  "keys": [
    {
      "kid": "9cef5340642b157fa8a4f0d874fe7900362d82db",
      "e": "AQAB",
      "kty": "RSA",
      "alg": "RS256",
      "n": "tUXNIN6LZJX5ra23GAWzPQ2zJfjwQxztau6bKDQH_ehhJ5CCBDpBcIyHebG5WCOIN_N_vqZUoeYvqXKVfpmUIW4O_rFnKgP7K-Mal4VBqOtmDs0z9HKz712wU6GmWqQnJBIDzToTgK5EORSMZHtZvZr6jvryZYzZly8Bit2bMauQt3OYlGlYArDK2Gy6E6orqIzY2O_mRQE0uENwuxtZHBIo8joOwEFfFjN6kURNjT0KqFeO28z-0FosiiyTrq2NrjhXdiRxus0t1fq_xJ14AHNaPzLjzYb6UJ0EJE5x_wuUvBDMbjvS1Zlr8EV8pCBzeqMnHxvvw9lkWCK0zKOukw",
      "use": "sig"
    },
    {
      "kid": "a06824b79e3982394d5ce7ac75bf92cba30a2e25",
      "e": "AQAB",
      "kty": "RSA",
      "alg": "RS256",
      "n": "tMrCJilHFRNB7Op6bhBSTpEEFCT4CM7zIOPT-HhjBhJ2bYahinC8FblyxE9rw889cS4eIAed9_614cQHUzv1lAgd3f-c0bonuMo_gGFJIOp5M4HlBz7yqimDDwYcSznSwtUziKM1pSCQr9IE-M-oNHd6ocXRhwKijzCIXIPvD4lPIjU5vR9rNziIume0AxfL8kAOIl2Rjcae8UmX24ydlLG1VGTiHuTcOzBZkGe5cAGHf4p4807PCihaSExWRQTbVrIfCIgBMehe1B99yf7ApKsHXVFN3pMsBso53jpL4XslJkOFI7SR0-gAvn89ieY5rGJ479srPDUBsZlSNtEiaw",
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

