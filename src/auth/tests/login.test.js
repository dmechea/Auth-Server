/**
 * @jest-environment node
 */

// Testing Login
const axios = require("axios");
const { port } = require("../../../config");
const uuidv4 = require("uuid/v4");

describe("Login", () => {
  it("should reject an empty submission with status 422", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";
    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email: `${uuidv4()}@testing.com` }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject an empty password submission with status 422", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";
    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email: `${uuidv4()}@testing.com` }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject an empty email submission with status 422", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";
    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { password: uuidv4() }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject an email of an incorrect type with status 422", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email: { object: uuidv4() }, password: uuidv4() }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject a password of an incorrect type with status 422", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email: "543", password: [uuidv4()] }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject an incorrect email or password with status 401", async () => {
    const expectedResponseCode = 401;
    const expectedResponseText = "Unauthorized";

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email: uuidv4(), password: uuidv4() }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject a correct email with an incorrect password with status 401", () => {
    const expectedResponseCode = 401;
    const expectedResponseText = "Unauthorized";

    const email = `${uuidv4()}@testing.com`;
    const password = uuidv4();
    // create account.
    axios({
      url: `http://localhost:${port}/auth/register`,
      method: "POST",
      data: { email, password, confirmPassword: password }
    }).then(() => {
      //
      // Login
      axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email, password: uuidv4() }
      })
        .then(() => {
          throw Error;
        })
        .catch(error => {
          expect(error.response.status).toEqual(expectedResponseCode);
          expect(error.response.statusText).toEqual(expectedResponseText);
        });
    });
  });

  it("should accept a correct email and password, responding with a 201", () => {
    const expectedResponseCode = 201;
    const expectedResponseProperties = ["success", "token"];

    const email = `${uuidv4()}@testing.com`;
    const password = uuidv4();

    // create account.
    axios({
      url: `http://localhost:${port}/auth/register`,
      method: "POST",
      data: { email, password, confirmPassword: password }
    }).then(() => {
      //
      // Login
      axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email, password }
      }).then(loginResponse => {
        const responseProperties = Object.keys(loginResponse.data);
        expect(loginResponse.status).toEqual(expectedResponseCode);
        expect(responseProperties).toEqual(
          expect.arrayContaining(expectedResponseProperties)
        );
      });
    });
  });
});
