/**
 * @jest-environment node
 */

const {
  addToken,
  removeToken,
  lookUpToken,
  flushTokens,
  client
} = require("./index");

const axios = require("axios");
const { port } = require("../../config");
const uuidv4 = require("uuid/v4");

// There will be 3 important methods to check for:

// If login is successful, token should be added to whitelist,
// If logout occurs, token should be removed from whitelist,
// If verification fails and its an authentication error, token should be removed from whitelist

describe("Whitelist", () => {
  beforeEach(() => {
    flushTokens();
  });

  it("should correctly add an entry to redis", async () => {
    const status = await addToken("token", "value");
    expect(status).toEqual("OK");

    const entry = await lookUpToken("token");
    expect(entry).toEqual(expect.anything());
    expect(entry).toEqual("value");
  });

  it("should throw null for a random entry", async () => {
    const entry = await lookUpToken(uuidv4());
    expect(entry).not.toEqual(expect.anything());
  });

  it("should add and remove an entry", async () => {
    const status = await addToken("token", "value");
    expect(status).toEqual("OK");

    const entry = await lookUpToken("token");
    expect(entry).toEqual(expect.anything());
    expect(entry).toEqual("value");

    const removed = await removeToken("token");

    const check = await lookUpToken("token");
    expect(check).not.toEqual(expect.anything());
  });

  it("should add a token to the whitelist on login", () => {
    const email = `${uuidv4()}@testing.com`;
    const password = uuidv4();

    // create account.
    ////////////////////////////////////
    axios({
      url: `http://localhost:${port}/auth/register`,
      method: "POST",
      data: { email, password, confirmPassword: password }
    }).then(() => {
      axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email, password }
      }).then(loginResponse => {
        expect(loginResponse.status).toEqual(201);
        const token = loginResponse.data.token;

        lookUpToken(token).then(redisCheck => {
          expect(redisCheck).toEqual(expect.anything());
        });
      });
    });
  });

  it("should remove token from the whitelist on logout", () => {
    const email = `${uuidv4()}@testing.com`;
    const password = uuidv4();

    // create account.
    ////////////////////////////////////
    axios({
      url: `http://localhost:${port}/auth/register`,
      method: "POST",
      data: { email, password, confirmPassword: password }
    }).then(() => {
      axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email, password }
      }).then(loginResponse => {
        expect(loginResponse.status).toEqual(201);
        const token = loginResponse.data.token;

        lookUpToken(token).then(redisCheck => {
          expect(redisCheck).toEqual(expect.anything());

          axios({
            url: `http://localhost:${port}/auth/logout`,
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          }).then(() => {
            //
            lookUpToken(token).then(redisCheck2 => {
              expect(redisCheck2).not.toEqual(expect.anything());
            });
          });
        });
      });
    });
  });

  it("should remove token from the whitelist on authentication failure", () => {
    // add a fake token
    const token = "THIS_IS_A_FAKE_TOKEN";

    addToken(token, "value").then(status => {
      expect(status).toEqual("OK");

      lookUpToken(token).then(entry => {
        expect(entry).toEqual(expect.anything());

        axios({
          url: `http://localhost:${port}/test/verify_jwt`,
          headers: { authorization: `Bearer ${token}` }
        })
          .then(() => {
            // Shouldn't Pass
            throw Error;
          })
          .catch(error => {
            expect(error.response.status).toEqual(401);

            lookUpToken(token).then(entry2 => {
              expect(entry2).not.toEqual(expect.anything());
            });
          });
      });
    });

    // Whitelist remove garbage token
  });
});
