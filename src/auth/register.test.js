/**
 * @jest-environment node
 */

// Testing Registration
const axios = require("axios");
const { port } = require("../../config");
const uuidv4 = require("uuid/v4");

describe("Registration", () => {
  it("should reject an empty submission with status 422", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/register`,
        method: "POST",
        data: null
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
        url: `http://localhost:${port}/auth/register`,
        method: "POST",
        data: { email: `${uuidv4()}@testing.com`, confirmPassword: uuidv4() }
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

    const password = uuidv4();

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/register`,
        method: "POST",
        data: { password, confirmPassword: password }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject an empty confirmPassword submission with status 422", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/register`,
        method: "POST",
        data: { email: `${uuidv4()}@test.com`, password: uuidv4() }
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
    const password = uuidv4();

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/register`,
        method: "POST",
        data: {
          email: { object: uuidv4() },
          password,
          confirmPassword: password
        }
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
    const password = [uuidv4()];

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/register`,
        method: "POST",
        data: { email: "543", password, confirmPassword: password }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject an invalid email address with status 422", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";
    const password = uuidv4();

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/register`,
        method: "POST",
        data: { email: uuidv4(), password, confirmPassword: password }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });
  it("should reject if password and confirmPassword are not equal", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";
    const email = `${uuidv4()}@testing.com`;
    const password = uuidv4();
    const confirmPassword = uuidv4();

    try {
      const response = await axios({
        url: `http://localhost:${port}/auth/register`,
        method: "POST",
        data: { email, password, confirmPassword }
      });
      if (response) throw new Error();
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should accept a valid email address with status 201", async () => {
    const expectedResponseCode = 201;
    const password = uuidv4();

    const response = await axios({
      url: `http://localhost:${port}/auth/register`,
      method: "POST",
      data: {
        email: `${uuidv4()}@testing.com`,
        password,
        confirmPassword: password
      }
    });
    expect(response.status).toEqual(expectedResponseCode);
  });
  it("should reject if the email address has already been taken", () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    const email = `${uuidv4()}@testing.com`;
    const password = uuidv4();

    axios({
      url: `http://localhost:${port}/auth/register`,
      method: "POST",
      data: { email, password, confirmPassword: password }
    }).then(() => {
      axios({
        url: `http://localhost:${port}/auth/register`,
        method: "POST",
        data: { email, password, confirmPassword: password }
      })
        .then(response => {
          if (response) throw new Error();
        })
        .catch(error => {
          expect(error.response.status).toEqual(expectedResponseCode);
          expect(error.response.statusText).toEqual(expectedResponseText);
        });
    });
  });
});
