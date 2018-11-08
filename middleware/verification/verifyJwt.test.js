/**
 * @jest-environment node
 */

const axios = require("axios");
const { port } = require("../../config");

const uuidv4 = require("uuid/v4");

describe("Verify Jwt Middleware", () => {
  it("should reject an attempt to access verified route with no token", async () => {
    const expectedResponseCode = 401;
    const expectedResponseText = "Unauthorized";

    try {
      const response = await axios({
        url: `http://localhost:${port}/test/verify_jwt`
      });
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject an incorrect authorization header", async () => {
    const expectedResponseCode = 401;
    const expectedResponseText = "Unauthorized";

    try {
      const response = await axios({
        url: `http://localhost:${port}/test/verify_jwt`,
        headers: { authorization: `Bearer${uuidv4()}` }
      });
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should accept a correct authorization header", () => {
    const expectedResponseCode = 200;
    const expectedResponseText = "OK";

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
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/test/verify_jwt`,
          headers: { authorization: `Bearer ${token}` }
        }).then(response => {
          expect(response.status).toEqual(expectedResponseCode);
          expect(response.statusText).toEqual(expectedResponseText);
        });
      });
    });
  });
});
