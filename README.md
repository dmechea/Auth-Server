# Auth-Server

A Node.js Authorization and Authentication API running on express.

Uses JWT based authentication, using a combination of MongoDB and Redis.

MongoDB is used to store registered user information.
Redis is used to create a whitelist of authorized tokens (and subsequently revoke access when desired).

Only routes are: 
 - Register `/auth/register`, Method `POST`
 - Login `/auth/login`, Method: `POST`
 - Logout `/auth/logout`, Method: `DELETE`

With an authorization test / dev route:
  - verify_jwt `/test/verify_jwt`
Running NODE_ENV=`production` will disable this test route.

**Running**

run `npm install` to install dependencies.

`$ node index.js` to start up the server.

**Accessing Authenticated Routes**

Attaching `verifyJwt` verification middleware to any route will convert that route into an authenticated route.

To gain access to an authenticated route, attach
```
{ Authorization: `Bearer ${token}` }
```
To your request headers, with `token` being the jwt you receive by a successful request to the `login` route.

**Schema**

The `schema.yaml` file located in root folder contains the schema for the routes. Format is in accordance with OpenAPI 3.0 Specs.

**Testing:**

Testing uses jest package, where test files are located next to the files they are testing.
Test files can be distinguished by having `.test.js` filename extension. 

To run tests, ensure you have Redis and MongoDB running default settings and run:

`$ npm test`
