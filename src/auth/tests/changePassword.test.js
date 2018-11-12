/**
 * @jest-environment node
 */

const axios = require("axios");
const { port } = require("../../../config");
const uuidv4 = require("uuid/v4");

describe("Change Password", () => {
  beforeAll(async () => {
    email = `${uuidv4()}@testing.com`;

    password = uuidv4();
    currentPassword = password;

    newPassword = uuidv4();
    confirmNewPassword = newPassword;

    // Get an authentication token
    token = await axios({
      url: `http://localhost:${port}/auth/register`,
      method: "POST",
      data: { email, password, confirmPassword: password }
    }).then(() => {
      // Then login
      return axios({
        url: `http://localhost:${port}/auth/login`,
        method: "POST",
        data: { email, password }
      }).then(loginResponse => {
        return loginResponse.data.token;
      });
    });
  });

  it("should reject a change password attempt from unverified user", async () => {
    const expectedResponseCode = 401;
    const expectedResponseText = "Unauthorized";

    try {
      const passwordResponse = await axios({
        url: `http://localhost:${port}/auth/password`,
        method: "PUT",
        data: { currentPassword, newPassword, confirmNewPassword }
      });
      if (passwordResponse) throw Error;
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject empty current password field", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const passwordResponse = await axios({
        url: `http://localhost:${port}/auth/password`,
        method: "PUT",
        data: { newPassword, confirmNewPassword },
        headers
      });
      if (passwordResponse) throw Error;
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject empty new password field", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const passwordResponse = await axios({
        url: `http://localhost:${port}/auth/password`,
        method: "PUT",
        data: { currentPassword, confirmNewPassword },
        headers
      });
      if (passwordResponse) throw Error;
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject empty confirm new password field", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const passwordResponse = await axios({
        url: `http://localhost:${port}/auth/password`,
        method: "PUT",
        data: { currentPassword, newPassword },
        headers
      });
      if (passwordResponse) throw Error;
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject empty request body", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const passwordResponse = await axios({
        url: `http://localhost:${port}/auth/password`,
        method: "PUT",
        headers
      });
      if (passwordResponse) throw Error;
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject improper type", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const passwordResponse = await axios({
        url: `http://localhost:${port}/auth/password`,
        method: "PUT",
        data: {
          currentPassword,
          newPassword: { newPassword },
          confirmNewPassword
        },
        headers
      });
      if (passwordResponse) throw Error;
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject incorrect current password", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const passwordResponse = await axios({
        url: `http://localhost:${port}/auth/password`,
        method: "PUT",
        data: {
          currentPassword: uuidv4(),
          newPassword,
          confirmNewPassword
        },
        headers
      });
      if (passwordResponse) throw Error;
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should reject unmatching password confirmation", async () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const passwordResponse = await axios({
        url: `http://localhost:${port}/auth/password`,
        method: "PUT",
        data: {
          currentPassword,
          newPassword,
          confirmNewPassword: uuidv4()
        },
        headers
      });
      if (passwordResponse) throw Error;
    } catch (error) {
      expect(error.response.status).toEqual(expectedResponseCode);
      expect(error.response.statusText).toEqual(expectedResponseText);
    }
  });

  it("should accept a valid current password and matching new passwords", async () => {
    const expectedResponseCode = 200;
    const expectedResponseText = "OK";
    const headers = { Authorization: `Bearer ${token}` };

    const passwordResponse = await axios({
      url: `http://localhost:${port}/auth/password`,
      method: "PUT",
      data: {
        currentPassword,
        newPassword: newPassword,
        confirmNewPassword
      },
      headers
    });
    expect(passwordResponse.status).toEqual(expectedResponseCode);
    expect(passwordResponse.statusText).toEqual(expectedResponseText);
  });

  it("should accept a sign-in with new password", async () => {
    const expectedResponseCode = 201;
    const expectedResponseProperties = ["success", "token"];

    // Try to log in with correct password
    const loginResponse = await axios({
      url: `http://localhost:${port}/auth/login`,
      method: "POST",
      data: { email, newPassword }
    });

    const responseProperties = Object.keys(loginResponse.data);
    expect(loginResponse.status).toEqual(expectedResponseCode);
    expect(responseProperties).toEqual(
      expect.arrayContaining(expectedResponseProperties)
    );
  });
});
