/**
 * @jest-environment node
 */

const axios = require("axios");
const { port } = require("../../../config");
const uuidv4 = require("uuid/v4");

describe("Change Password", async () => {
  beforeEach(() => {
    email = `${uuidv4()}@testing.com`;

    password = uuidv4();
    currentPassword = password;

    newPassword = uuidv4();
    confirmNewPassword = newPassword;
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

  it("should reject empty current password field", () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    // Get an authentication token
    axios({
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
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/auth/password`,
          method: "PUT",
          data: { newPassword, confirmNewPassword },
          headers
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
  });

  it("should reject empty new password field", () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    // Get an authentication token
    axios({
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
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/auth/password`,
          method: "PUT",
          data: { currentPassword, confirmNewPassword },
          headers
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
  });

  it("should reject empty confirm new password field", () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    // Get an authentication token
    axios({
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
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/auth/password`,
          method: "PUT",
          data: { currentPassword, newPassword },
          headers
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
  });

  it("should reject improper type", () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    // Get an authentication token
    axios({
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
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/auth/password`,
          method: "PUT",
          data: {
            currentPassword,
            newPassword: { newPassword },
            confirmNewPassword
          },
          headers
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
  });

  it("should reject incorrect current password", () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    // Get an authentication token
    axios({
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
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/auth/password`,
          method: "PUT",
          data: {
            currentPassword: uuidv4(),
            newPassword,
            confirmNewPassword
          },
          headers
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
  });

  it("should reject unmatching password confirmation", () => {
    const expectedResponseCode = 422;
    const expectedResponseText = "Unprocessable Entity";

    // Get an authentication token
    axios({
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
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/auth/password`,
          method: "PUT",
          data: { currentPassword, newPassword, confirmNewPassword: uuidv4() },
          headers
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
  });

  it("should accept a valid current password and matching new passwords", () => {
    const expectedResponseCode = 200;
    const expectedResponseText = "OK";

    // Get an authentication token
    axios({
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
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/auth/password`,
          method: "PUT",
          data: {
            currentPassword,
            newPassword,
            confirmNewPassword
          },
          headers
        })
          .then(passwordResponse => {
            expect(passwordResponse.status).toEqual(expectedResponseCode);
            expect(passwordResponse.statusText).toEqual(expectedResponseText);
          })
          .catch(error => {
            throw error;
          });
      });
    });
  });

  it("should accept a sign-in with new password", async () => {
    const expectedResponseCode = 201;
    const expectedResponseProperties = ["success", "token"];

    // Get an authentication token
    axios({
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
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        axios({
          url: `http://localhost:${port}/auth/password`,
          method: "PUT",
          data: {
            currentPassword,
            newPassword,
            confirmNewPassword
          },
          headers
        })
          .then(() => {
            axios({
              url: `http://localhost:${port}/auth/login`,
              method: "POST",
              data: { email, password: newPassword }
            }).then(loginResponse => {
              const responseProperties = Object.keys(loginResponse.data);
              expect(loginResponse.status).toEqual(expectedResponseCode);
              expect(responseProperties).toEqual(
                expect.arrayContaining(expectedResponseProperties)
              );
            });
          })
          .catch(error => {
            throw error;
          });
      });
    });
  });
});
