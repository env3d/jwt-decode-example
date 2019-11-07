The OpenID Connect protocol uses JSON Web Token to provide authentication information.

For any openid connect identity provider (such as google), in the OAuth 2.0 authorization setp,
we can request openid scope.  Which will return, in addition to an access token, an id token.

Unlike the access token, which requires a call to /userinfo to decode, the id token can be
decoded without contacting the server.  This repo demonstrate how this decoding can be done
in node.